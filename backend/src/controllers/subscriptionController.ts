import { Request, Response } from "express";
import chalk from "chalk";
import prisma from "src/core/utils/db.ts";
import { CACHE_TTL } from "src/config/config.constants.ts";
import {
  getDaysUntilExpiry,
  formatExpiryDate,
  isExpired,
} from "src/hooks/useExpire.ts";
import {
  AuthRequest,
  ItemModels,
  ItemData,
  CreateSubscriptionBody,
  UpdateStatusBody,
  TriggerNotificationBody,
} from "src/types/index.ts";
import { getIO } from "src/services/sockets/socketServer.ts";
import cacheManager from "src/services/redis/cacheManager.ts";

export const getSubscriptionStats = async (req: Request, res: Response) => {
  try {
    const stats = await cacheManager.withCache(
      CACHE_KEYS.STATS,
      async () => {
        const [byCategory, total, active, paid] = await Promise.all([
          prisma.subscription.groupBy({
            by: ["category"],
            _count: { _all: true },
          }),
          prisma.subscription.count(),
          prisma.subscription.count({ where: { isActive: true } }),
          prisma.subscription.count({ where: { isPaid: true } }),
        ]);
        return { byCategory, total, active, paid };
      },
      CACHE_TTL.STATS,
    );
    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ error: "Stats failed" });
  }
};

export const getTotalSubscriptions = async (req: Request, res: Response) => {
  try {
    const total = await cacheManager.withCache(
      CACHE_KEYS.TOTAL,
      async () => await prisma.subscription.count(),
      CACHE_TTL.STATS,
    );
    res.json({ success: true, total });
  } catch (err) {
    res.status(500).json({ error: "Count failed" });
  }
};
const getUserId = (req: AuthRequest): string | undefined =>
  req.user?.id || req.user?._id || req.user?.sub;

const includeUser = {
  user: { select: { id: true, username: true, email: true, phone: true } },
};

const CACHE_KEYS = {
  USER_SUBSCRIPTIONS: (userId: string) => `subscriptions:user:${userId}:all`,
  MY_SUBSCRIPTIONS: (userId: string) => `subscriptions:my:${userId}`,
  ADMIN_ALL: (page: number, limit: number) =>
    `subscriptions:admin:page:${page}:limit:${limit}`,
  TOTAL: "subscriptions:total",
  STATS: "subscriptions:stats",
  PAID_ALL: (page: number, limit: number) =>
    `subscriptions:paid:page:${page}:limit:${limit}`,
  SUBSCRIPTION: (id: string) => `subscriptions:${id}`,
};

const getPaginationParams = (page?: string, limit?: string) => {
  const pageNum = Math.max(1, parseInt(page || "1"));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit || "20")));
  const skip = (pageNum - 1) * limitNum;
  return { page: pageNum, limit: limitNum, skip };
};

const CATEGORY_GROUPS: string[][] = [
  ["car", "cars", "vehicle", "vehicles", "baabuur", "baaskeelada"],
  ["boat", "boats", "doon", "doons"],
  ["motorcycle", "motorcycles", "motor"],
  ["farmequipment", "farm equipment", "tractor", "tractors", "farm"],
  ["marketplace", "alaabooyin", "market", "alaab"],
  ["realestate", "real estate", "realestate", "guryo", "property"],
  ["job", "jobs", "shaqo"],
];

function getCategoryVariants(category: string): string[] {
  const lower = (category ?? "").toLowerCase().trim();
  for (const group of CATEGORY_GROUPS) {
    if (group.some((v) => lower.includes(v) || v.includes(lower))) return group;
  }
  return [lower];
}

export const notifyMatchingSubscribers = async (
  itemType: ItemModels,
  itemId: string,
  itemData: ItemData,
): Promise<number> => {
  try {
    const { title, price, mainCategory, region, city, posterId } = itemData;

    const categoryVariants = getCategoryVariants(mainCategory ?? itemType);
    const itemTitleLower = (title ?? "").toLowerCase();

    const matchingSubscriptions = await prisma.subscription.findMany({
      where: {
        isActive: true,
        ...(posterId ? { userId: { not: posterId } } : {}),
        AND: [
          {
            OR: categoryVariants.map((v) => ({
              category: { equals: v, mode: "insensitive" },
            })),
          },
          region ? { region: { equals: region, mode: "insensitive" } } : {},
          { OR: [{ priceMin: null }, { priceMin: { lte: price } }] },
          { OR: [{ priceMax: null }, { priceMax: { gte: price } }] },
        ],
      },
      select: { id: true, userId: true, title: true, cities: true },
      take: 1000,
    });

    // Post-filter: city match + keyword match
    const filtered = matchingSubscriptions.filter((sub) => {
      // If subscription has city filters and item has a city, city must be in the list
      if (city && sub.cities?.length) {
        const citiesLower = sub.cities.map((c) => c.toLowerCase());
        if (!citiesLower.includes(city.toLowerCase())) return false;
      }
      // If subscription has keyword(s), at least one must appear in the item title
      const keywords = (sub.title ?? "")
        .toLowerCase()
        .split(/\s+/)
        .filter((k) => k.length > 2);
      if (
        keywords.length &&
        !keywords.some((kw) => itemTitleLower.includes(kw))
      )
        return false;
      return true;
    });

    console.log(
      `[notify] ${itemType} "${title}" cat=${mainCategory} region=${region} city=${city} price=${price} → ${filtered.length}/${matchingSubscriptions.length} subscriptions matched`,
    );

    if (!filtered.length) return 0;

    const notificationsData = filtered.map((sub) => ({
      userId: sub.userId,
      senderId: posterId ?? null,
      subscriptionId: sub.id,
      title: `New ${mainCategory} matches your subscription: ${sub.title}`,
      message: `"${title}" in ${region}${city ? `, ${city}` : ""}${price ? ` — $${price}` : ""}`,
      category: "subscription_alert",
      subCategory: mainCategory,
      itemId,
      itemType,
      region,
      city,
      metadata: {
        itemTitle: title,
        itemPrice: price,
        itemCity: city,
        subscriptionTitle: sub.title,
      },
    }));

    await prisma.notification.createMany({
      data: notificationsData,
      skipDuplicates: true,
    });

    await prisma.subscription.updateMany({
      where: { id: { in: filtered.map((s) => s.id) } },
      data: { notificationCount: { increment: 1 }, lastNotified: new Date() },
    });

    const io = getIO();
    if (io) {
      const createdNotifications = await prisma.notification.findMany({
        where: {
          itemId,
          subscriptionId: { in: filtered.map((s) => s.id) },
          createdAt: { gte: new Date(Date.now() - 5000) },
        },
        include: {
          sender: { select: { id: true, username: true, profileImage: true } },
          subscription: {
            select: {
              id: true,
              title: true,
              category: true,
              subCategory: true,
            },
          },
        },
      });

      const notificationsByUser = createdNotifications.reduce(
        (acc, notification) => {
          if (!acc[notification.userId]) acc[notification.userId] = [];
          acc[notification.userId].push(notification);
          return acc;
        },
        {} as Record<string, typeof createdNotifications>,
      );

      Object.entries(notificationsByUser).forEach(([uid, notifications]) => {
        io.to(`user_${uid}`).emit("newNotifications", notifications);
      });
    }

    return filtered.length;
  } catch (error) {
    console.error("[notify] Error in notifyMatchingSubscribers:", error);
    return 0;
  }
};
const ITEM_MODEL_MAP: Record<string, { model: any; type: ItemModels }> = {
  car: { model: () => prisma.car, type: "car" },
  cars: { model: () => prisma.car, type: "car" },
  vehicle: { model: () => prisma.car, type: "car" },
  vehicles: { model: () => prisma.car, type: "car" },
  baabuur: { model: () => prisma.car, type: "car" },
  boat: { model: () => prisma.boat, type: "boat" },
  boats: { model: () => prisma.boat, type: "boat" },
  doon: { model: () => prisma.boat, type: "boat" },
  motorcycle: { model: () => prisma.motorcycle, type: "motorcycle" },
  motorcycles: { model: () => prisma.motorcycle, type: "motorcycle" },
  motor: { model: () => prisma.motorcycle, type: "motorcycle" },
  realestate: { model: () => prisma.realEstate, type: "realestate" },
  "real estate": { model: () => prisma.realEstate, type: "realestate" },
  guryo: { model: () => prisma.realEstate, type: "realestate" },
  property: { model: () => prisma.realEstate, type: "realestate" },
  marketplace: { model: () => prisma.marketplace, type: "marketplace" },
  alaabooyin: { model: () => prisma.marketplace, type: "marketplace" },
  market: { model: () => prisma.marketplace, type: "marketplace" },
  farmequipment: { model: () => prisma.farmequipment, type: "farmequipment" },
  "farm equipment": {
    model: () => prisma.farmequipment,
    type: "farmequipment",
  },
  tractor: { model: () => prisma.farmequipment, type: "farmequipment" },
  job: { model: () => prisma.job, type: "job" },
  jobs: { model: () => prisma.job, type: "job" },
  shaqo: { model: () => prisma.job, type: "job" },
};

const notifyNewSubscriberWithExistingItems = async (subscription: {
  id: string;
  userId: string;
  title: string;
  category: string;
  region: string;
  cities: string[];
  priceMin: number | null;
  priceMax: number | null;
}): Promise<void> => {
  try {
    const {
      id: subscriptionId,
      userId,
      title,
      category,
      region,
      cities,
      priceMin,
      priceMax,
    } = subscription;

    const variants = getCategoryVariants(category);
    const seen = new Set<string>();
    const configs = Object.entries(ITEM_MODEL_MAP)
      .filter(([key]) =>
        variants.some(
          (v) => key === v || key.startsWith(v) || v.startsWith(key),
        ),
      )
      .map(([, cfg]) => cfg)
      .filter((cfg) => {
        if (seen.has(cfg.type)) return false;
        seen.add(cfg.type);
        return true;
      });

    if (!configs.length) {
      console.log(
        `[notify-existing] No model for category="${category}" variants=[${variants}]`,
      );
      return;
    }

    // Use the first meaningful word as the primary DB keyword filter
    const keywords = title
      .trim()
      .split(/\s+/)
      .filter((k) => k.length > 1);
    const primaryKeyword = keywords[0] ?? "";

    const allItems: any[] = [];

    for (const cfg of configs) {
      const isJob = cfg.type === "job";

      const where: any = {
        isPaid: true,
        userId: { not: userId },
      };

      // Title keyword search
      if (primaryKeyword) {
        where.title = { contains: primaryKeyword, mode: "insensitive" };
      }

      // Region + city filters — Job model has neither field
      if (!isJob) {
        if (region) where.region = { equals: region, mode: "insensitive" };
        if (cities?.length) where.city = { in: cities };
        if (priceMin !== null)
          where.price = { ...(where.price ?? {}), gte: priceMin };
        if (priceMax !== null)
          where.price = { ...(where.price ?? {}), lte: priceMax };
      } else {
        if (priceMin !== null)
          where.salary = { ...(where.salary ?? {}), gte: priceMin };
        if (priceMax !== null)
          where.salary = { ...(where.salary ?? {}), lte: priceMax };
      }

      const select = isJob
        ? { id: true, title: true, salary: true, userId: true }
        : {
            id: true,
            title: true,
            price: true,
            region: true,
            city: true,
            userId: true,
          };

      const rows = await (cfg.model() as any)
        .findMany({ where, select, take: 10, orderBy: { createdAt: "desc" } })
        .catch(() => []);

      rows.forEach((r: any) =>
        allItems.push({
          ...r,
          itemType: cfg.type,
          price: r.price ?? r.salary ?? null,
          region: r.region ?? region ?? null,
          city: r.city ?? null,
        }),
      );
    }

    console.log(
      `[notify-existing] sub="${subscriptionId}" cat="${category}" region="${region}" cities=[${cities}] keyword="${primaryKeyword}" → ${allItems.length} existing items`,
    );

    if (!allItems.length) return;

    await prisma.notification.createMany({
      data: allItems.map((item) => ({
        userId,
        senderId: item.userId ?? null,
        subscriptionId,
        title: `${item.itemType} matches your subscription: ${subscription.title}`,
        message: `"${item.title}"${item.region ? ` in ${item.region}` : ""}${item.city ? `, ${item.city}` : ""}${item.price ? ` — $${item.price}` : ""}`,
        category: "subscription_alert",
        subCategory: category,
        itemId: item.id,
        itemType: item.itemType,
        region: item.region ?? null,
        city: item.city ?? null,
        metadata: {
          itemTitle: item.title,
          itemPrice: item.price,
          itemCity: item.city,
          subscriptionTitle: subscription.title,
        },
      })),
      skipDuplicates: true,
    });

    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        notificationCount: { increment: allItems.length },
        lastNotified: new Date(),
      },
    });

    const io = getIO();
    if (io) {
      const created = await prisma.notification.findMany({
        where: {
          subscriptionId,
          userId,
          createdAt: { gte: new Date(Date.now() - 5000) },
        },
        include: {
          sender: { select: { id: true, username: true, profileImage: true } },
          subscription: { select: { id: true, title: true, category: true } },
        },
      });
      if (created.length)
        io.to(`user_${userId}`).emit("newNotifications", created);
    }
  } catch (err) {
    console.error("[notify-existing] Error:", err);
  }
};

export const createSubscription = async (
  req: Request<{}, {}, CreateSubscriptionBody>,
  res: Response,
) => {
  try {
    const {
      userId,
      title,
      category,
      subCategory,
      region,
      cities,
      priceMin,
      priceMax,
      brand,
      model,
      totalFee,
      condition,
      specificFeatures,
    } = req.body;

    if (!userId || !title || !category || !region || !cities?.length) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const subscription = await prisma.subscription.create({
      data: {
        userId,
        title,
        category: Array.isArray(category) ? category[0] : category,
        subCategory: subCategory || null,
        region,
        cities: Array.isArray(cities) ? cities : [cities],
        priceMin: priceMin ? parseInt(priceMin) : null,
        priceMax: priceMax ? parseInt(priceMax) : null,
        brand: brand || null,
        model: model || null,
        condition: condition || null,
        specificFeatures: specificFeatures || null,
        isActive: true,
        status: "active",
        notificationCount: 0,
        totalFee: totalFee || null,
        isPaid: !!totalFee,
        expiryDate: null,
      },
      include: includeUser,
    });

    const cachePatterns = [
      `subscriptions:user:${userId}:*`,
      `subscriptions:my:${userId}`,
      `subscriptions:admin:*`,
      `subscriptions:paid:*`,
      CACHE_KEYS.TOTAL,
      CACHE_KEYS.STATS,
    ].filter(Boolean);

    if (cachePatterns.length > 0) {
      await Promise.all(
        cachePatterns.map((pattern) => {
          if (pattern.includes("*")) {
            return cacheManager.deletePattern(pattern).catch((err) => {
              console.log(`Failed to delete pattern ${pattern}:`, err.message);
            });
          } else {
            return cacheManager.delete(pattern).catch((err) => {
              console.log(`Failed to delete key ${pattern}:`, err.message);
            });
          }
        }),
      );
    }

    const io = getIO();
    if (io) {
      io.to(`user_${userId}`).emit("subscriptionCreated", {
        subscriptionId: subscription.id,
        title: subscription.title,
        message: `Your subscription "${subscription.title}" has been created successfully`,
      });
    }

    res.status(201).json({ success: true, subscription });

    notifyNewSubscriberWithExistingItems({
      id: subscription.id,
      userId,
      title: subscription.title,
      category: subscription.category,
      region: subscription.region,
      cities: subscription.cities,
      priceMin: subscription.priceMin,
      priceMax: subscription.priceMax,
    }).catch(console.error);
  } catch (err) {
    const error = err as Error;
    console.error(chalk.red("PRISMA ERROR:"), error.message);
    res.status(500).json({ error: "Failed to create subscription" });
  }
};

export const getUserSubscriptions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = Array.isArray(req.params.userId)
      ? req.params.userId[0]
      : req.params.userId;

    if (!userId) return res.status(400).json({ error: "User ID required" });

    const cacheKey = CACHE_KEYS.USER_SUBSCRIPTIONS(userId);
    const subscriptions = await cacheManager.withCache(
      cacheKey,
      async () => {
        const subs = await prisma.subscription.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          include: includeUser,
          take: 100,
        });

        return subs.map((sub) => ({
          ...sub,
          isExpired: isExpired(sub.expiryDate),
          daysUntilExpiry: getDaysUntilExpiry(sub.expiryDate),
          formattedExpiry: formatExpiryDate(sub.expiryDate),
        }));
      },
      CACHE_TTL.LIST,
    );

    res.json({ success: true, subscriptions });
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
};

export const getMySubscriptions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const cacheKey = CACHE_KEYS.MY_SUBSCRIPTIONS(userId);
    const subscriptions = await cacheManager.withCache(
      cacheKey,
      async () => {
        const subs = await prisma.subscription.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            category: true,
            subCategory: true,
            region: true,
            cities: true,
            priceMin: true,
            priceMax: true,
            isActive: true,
            status: true,
            notificationCount: true,
            lastNotified: true,
            createdAt: true,
          },
          take: 100,
        });

        return subs;
      },
      CACHE_TTL.USER,
    );

    res.json({ success: true, subscriptions });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch subscriptions" });
  }
};

export const updateSubscriptionStatus = async (
  req: Request<{ id: string }, {}, UpdateStatusBody>,
  res: Response,
) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { status, isActive } = req.body;

    const updated = await prisma.subscription.update({
      where: { id },
      data: {
        status,
        isActive: isActive !== undefined ? isActive : status === "active",
        updatedAt: new Date(),
      },
    });

    const cachePatterns = [
      `subscriptions:user:${updated.userId}:*`,
      `subscriptions:my:${updated.userId}`,
      `subscriptions:admin:*`,
      `subscriptions:paid:*`,
      CACHE_KEYS.STATS,
    ];

    await Promise.all(
      cachePatterns.map((pattern) =>
        pattern.includes("*")
          ? cacheManager.deletePattern(pattern)
          : cacheManager.delete(pattern),
      ),
    );

    res.json({ success: true, subscription: updated });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
};

export const deleteSubscriptionAdmin = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const subscription = await prisma.subscription.findUnique({
      where: { id },
      select: { userId: true },
    });
    if (!subscription) return res.status(404).json({ error: "Not found" });
    await prisma.subscription.delete({ where: { id } });
    const cachePatterns = [
      `subscriptions:user:${subscription.userId}:*`,
      `subscriptions:my:${subscription.userId}`,
      `subscriptions:admin:*`,
      `subscriptions:paid:*`,
      CACHE_KEYS.TOTAL,
      CACHE_KEYS.STATS,
    ];
    await Promise.all(
      cachePatterns.map((pattern) =>
        pattern.includes("*")
          ? cacheManager.deletePattern(pattern)
          : cacheManager.delete(pattern),
      ),
    );
    res.json({ success: true, message: "Deleted" });
  } catch {
    res.status(500).json({ error: "Delete failed" });
  }
};

export const deleteMySubscription = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const subscription = await prisma.subscription.findUnique({
      where: { id },
      select: { userId: true },
    });
    if (!subscription) return res.status(404).json({ error: "Not found" });
    if (subscription.userId !== userId)
      return res.status(403).json({ error: "Forbidden" });
    await prisma.subscription.delete({ where: { id } });
    const cachePatterns = [
      `subscriptions:user:${userId}:*`,
      `subscriptions:my:${userId}`,
      `subscriptions:admin:*`,
      `subscriptions:paid:*`,
      CACHE_KEYS.TOTAL,
      CACHE_KEYS.STATS,
    ];
    await Promise.all(
      cachePatterns.map((pattern) =>
        pattern.includes("*")
          ? cacheManager.deletePattern(pattern)
          : cacheManager.delete(pattern),
      ),
    );
    res.json({ success: true, message: "Deleted" });
  } catch {
    res.status(500).json({ error: "Delete failed" });
  }
};

export const getAllSubscriptionsAdmin = async (req: Request, res: Response) => {
  try {
    const cacheKey = "subscriptions:admin:all";
    const subscriptions = await cacheManager.withCache(
      cacheKey,
      async () => {
        const subs = await prisma.subscription.findMany({
          include: includeUser,
          orderBy: { createdAt: "desc" },
        });
        return subs.map((sub) => ({
          ...sub,
          isExpired: isExpired(sub.expiryDate),
          daysUntilExpiry: getDaysUntilExpiry(sub.expiryDate),
          formattedExpiry: formatExpiryDate(sub.expiryDate),
        }));
      },
      CACHE_TTL.LIST,
    );
    res.json({
      success: true,
      subscriptions,
    });
  } catch (err) {
    res.status(500).json({ error: "Fetch all failed" });
  }
};

export const searchSubscriptions = async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;
    if (!q) return res.json({ success: true, data: [] });

    const results = await prisma.subscription.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { category: { contains: q, mode: "insensitive" } },
        ],
        isActive: true,
      },
      include: includeUser,
      take: 50,
    });
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
};

export const triggerNotification = async (
  req: Request<{}, {}, TriggerNotificationBody>,
  res: Response,
) => {
  try {
    const {
      itemType,
      itemId,
      title,
      price,
      mainCategory,
      subCategory,
      region,
      city,
      brand,
      model,
      condition,
      posterId,
    } = req.body;

    const notificationData: ItemData = {
      title,
      price,
      mainCategory,
      subCategory,
      region,
      city,
      brand,
      model,
      condition,
      posterId,
    };

    const count = await notifyMatchingSubscribers(
      itemType,
      itemId,
      notificationData,
    );
    res.json({
      success: true,
      message: `Notification engine triggered, ${count} subscribers notified`,
    });
  } catch (err) {
    res.status(500).json({ error: "Trigger failed" });
  }
};

export const getAllSubscriptionPaid = async (req: Request, res: Response) => {
  try {
    const { page, limit, skip } = getPaginationParams(
      req.query.page as string,
      req.query.limit as string,
    );

    const cacheKey = CACHE_KEYS.PAID_ALL(page, limit);
    const subscriptions = await cacheManager.withCache(
      cacheKey,
      async () => {
        const subs = await prisma.subscription.findMany({
          where: { isActive: true, isPaid: true },
          include: includeUser,
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        });

        return subs.map((sub) => ({
          ...sub,
          isExpired: isExpired(sub.expiryDate),
          daysUntilExpiry: getDaysUntilExpiry(sub.expiryDate),
          formattedExpiry: formatExpiryDate(sub.expiryDate),
        }));
      },
      CACHE_TTL.LIST,
    );

    const total = await prisma.subscription.count({
      where: { isActive: true, isPaid: true },
    });

    res.json({
      success: true,
      subscriptions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
};

export const getSubscriptionNotifications = async (
  req: Request,
  res: Response,
) => {
  try {
    const { subscriptionId } = req.params;
    const id = Array.isArray(subscriptionId)
      ? subscriptionId[0]
      : subscriptionId;

    const limit = Number(req.query.limit) || 20;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { subscriptionId: id },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
        include: {
          sender: {
            select: { id: true, username: true, profileImage: true },
          },
        },
      }),
      prisma.notification.count({ where: { subscriptionId: id } }),
    ]);

    res.json({
      success: true,
      notifications,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ error: "Fetch failed" });
  }
};

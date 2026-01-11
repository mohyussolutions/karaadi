import { Request, Response } from "express";
import chalk from "chalk";
import prisma from "core/utils/db.ts";
import { getIO } from "services/sockets/socketServer.ts";

const includeUser = {
  user: {
    select: {
      id: true,
      username: true,
      email: true,
      phone: true,
    },
  },
};

type ItemModels =
  | "marketplace"
  | "car"
  | "realestate"
  | "boat"
  | "motorcycle"
  | "traktor"
  | "advertisement";

export const notifyMatchingSubscribers = async (
  itemType: ItemModels,
  itemId: string,
  itemData: {
    title: string;
    description?: string;
    price: number;
    mainCategory: string;
    category: string[];
    subcategory: string[];
    region: string;
    city: string;
    district?: string;
    subDistrict?: string;
    brand?: string;
    model?: string;
    condition?: string;
    posterId: string;
  }
): Promise<void> => {
  try {
    const {
      title,
      price,
      mainCategory,
      subcategory,
      region,
      city,
      brand,
      model,
      condition,
      posterId,
    } = itemData;

    const whereCondition: any = {
      isActive: true,
      userId: { not: posterId },
      category: mainCategory,
      region,
      city,
    };

    if (subcategory && subcategory.length > 0) {
      whereCondition.OR = [
        { subCategory: { in: subcategory } },
        { subCategory: null },
      ];
    }

    if (brand) {
      whereCondition.OR = [
        ...(whereCondition.OR || []),
        { brand },
        { brand: null },
      ];
    }

    if (model) {
      whereCondition.OR = [
        ...(whereCondition.OR || []),
        { model },
        { model: null },
      ];
    }

    if (condition) {
      whereCondition.OR = [
        ...(whereCondition.OR || []),
        { condition },
        { condition: null },
      ];
    }

    whereCondition.AND = [
      { OR: [{ priceMin: null }, { priceMin: { lte: price } }] },
      { OR: [{ priceMax: null }, { priceMax: { gte: price } }] },
    ];

    const matchingSubscriptions = await prisma.subscription.findMany({
      where: whereCondition,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    if (matchingSubscriptions.length === 0) return;

    const notificationsToCreate = matchingSubscriptions.map((subscription) => {
      let message = `A new ${itemType} "${title}" was posted in ${city}`;
      if (price) {
        message += ` Price: $${price}`;
      }

      return {
        userId: subscription.userId,
        senderId: posterId,
        title: `New Match for Your "${subscription.title}" Subscription`,
        message: message,
        category: "subscription_alert",
        subCategory: mainCategory,
        itemId: itemId,
        itemType: itemType,
        region: region,
        city: city,
        isRead: false,
        metadata: {
          subscriptionId: subscription.id,
          subscriptionTitle: subscription.title,
          itemTitle: title,
          itemPrice: price,
          matchedCriteria: {
            category: mainCategory,
            region,
            city,
            brand,
            model,
            condition,
          },
        },
      };
    });

    await prisma.notification.createMany({
      data: notificationsToCreate,
    });

    const io = getIO();
    if (io) {
      notificationsToCreate.forEach((notification) => {
        io.to(`user_${notification.userId}`).emit("newSubscriptionMatch", {
          id: notification.itemId,
          title: notification.title,
          message: notification.message,
          category: notification.category,
          itemId: notification.itemId,
          itemType: notification.itemType,
          metadata: notification.metadata,
          createdAt: new Date().toISOString(),
        });
      });
    }

    const subscriptionIds = matchingSubscriptions.map((s) => s.id);
    await prisma.subscription.updateMany({
      where: {
        id: { in: subscriptionIds },
      },
      data: {
        lastNotified: new Date(),
        notificationCount: {
          increment: 1,
        },
      },
    });
  } catch (error) {
    console.error("Subscription Watch Error:", error);
    throw error;
  }
};

export const triggerSubscriptionWatch = async (
  itemType: ItemModels,
  itemId: string
) => {
  try {
    let item: any;

    switch (itemType) {
      case "marketplace":
        item = await prisma.marketplace.findUnique({ where: { id: itemId } });
        break;
      case "car":
        item = await prisma.car.findUnique({ where: { id: itemId } });
        break;
      case "realestate":
        item = await prisma.realEstate.findUnique({ where: { id: itemId } });
        break;
      case "boat":
        item = await prisma.boat.findUnique({ where: { id: itemId } });
        break;
      case "motorcycle":
        item = await prisma.motorcycle.findUnique({ where: { id: itemId } });
        break;
      case "traktor":
        item = await prisma.traktor.findUnique({ where: { id: itemId } });
        break;
      default:
        return;
    }

    if (!item) {
      return;
    }

    const itemData = {
      title: item.title,
      description: item.description,
      price: item.price,
      mainCategory: item.mainCategory,
      category: item.category,
      subcategory: item.subcategory,
      region: item.region,
      city: item.city,
      district: item.district || item.subDistrict,
      brand: item.brand || item.make || item.vehicleModel?.split(" ")[0],
      model:
        item.model || item.vehicleModel || item.boatModel || item.traktortModel,
      condition: item.condition,
      posterId: item.userId,
    };

    await notifyMatchingSubscribers(itemType, itemId, itemData);
  } catch (error) {
    console.error("Trigger Subscription Watch Error:", error);
  }
};

export const createSubscription = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      title,
      category,
      subCategory,
      region,
      city,
      priceMin,
      priceMax,
      description,
      condition,
      brand,
      model,
      specificFeatures,
    } = req.body;

    if (!userId || !title || !category || !region || !city) {
      return res.status(400).json({
        error: "Missing required fields: userId, title, category, region, city",
      });
    }

    // Ensure category is a string, not an array
    const categoryString = Array.isArray(category) ? category[0] : category;

    if (!categoryString) {
      return res.status(400).json({
        error: "Category must be a valid string",
      });
    }

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId,
        category: categoryString, // Use the string version
        subCategory: subCategory || null,
        region,
        city,
        isActive: true,
      },
    });

    if (existingSubscription) {
      return res.status(409).json({
        error: "You already have an active subscription with similar criteria",
        existingSubscription,
      });
    }

    const subscription = await prisma.subscription.create({
      data: {
        userId,
        title,
        category: categoryString, // Use the string version
        subCategory: subCategory || null,
        region,
        city,
        priceMin: priceMin ? parseInt(priceMin) : null,
        priceMax: priceMax ? parseInt(priceMax) : null,
        description: description || null,
        condition: condition || null,
        brand: brand || null,
        model: model || null,
        specificFeatures: specificFeatures || null,
        isActive: true,
        status: "active",
        notificationCount: 0,
      },
      include: includeUser,
    });

    const io = getIO();
    if (io) {
      const room = `subscription_${categoryString}_${region}_${city}`
        .toLowerCase()
        .replace(/\s+/g, "_");

      const userSockets = await io.in(`user_${userId}`).fetchSockets();
      userSockets.forEach((socket) => {
        socket.join(room);
      });
    }

    res.status(201).json({
      success: true,
      message: "Subscription created successfully",
      subscription,
    });
  } catch (err: any) {
    console.error("Create Subscription Error:", err);
    res.status(500).json({
      error: "Failed to create subscription",
      details: err.message,
    });
  }
};

export const getUserSubscriptions = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { activeOnly = "true", page = 1, limit = 20 } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const whereClause: any = { userId };
    if (activeOnly === "true") {
      whereClause.isActive = true;
    }

    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        include: includeUser,
        skip,
        take: limitNum,
      }),
      prisma.subscription.count({ where: whereClause }),
    ]);

    res.json({
      success: true,
      count: subscriptions.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      subscriptions,
    });
  } catch (err: any) {
    console.error("Get User Subscriptions Error:", err);
    res.status(500).json({ error: "Failed to fetch subscriptions" });
  }
};

export const getAllSubscriptionsAdmin = async (req: Request, res: Response) => {
  try {
    const {
      search = "",
      category,
      region,
      status,
      page = 1,
      limit = 50,
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { user: { email: { contains: search, mode: "insensitive" } } },
        { user: { username: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (category) whereClause.category = category;
    if (region) whereClause.region = region;
    if (status) whereClause.status = status;

    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        include: includeUser,
        skip,
        take: limitNum,
      }),
      prisma.subscription.count({ where: whereClause }),
    ]);

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      subscriptions,
    });
  } catch (error) {
    console.error("Get All Subscriptions Admin Error:", error);
    res.status(500).json({ error: "Failed to fetch subscriptions" });
  }
};

export const updateSubscriptionStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, isActive } = req.body;

    if (!status || !["active", "inactive", "paused"].includes(status)) {
      return res.status(400).json({
        error: "Valid status required: 'active', 'inactive', or 'paused'",
      });
    }

    const updated = await prisma.subscription.update({
      where: { id },
      data: {
        status,
        isActive: isActive !== undefined ? isActive : status === "active",
        updatedAt: new Date(),
      },
      include: includeUser,
    });

    const io = getIO();
    if (io && updated.userId) {
      const room =
        `subscription_${updated.category}_${updated.region}_${updated.city}`
          .toLowerCase()
          .replace(/\s+/g, "_");

      const userSockets = await io.in(`user_${updated.userId}`).fetchSockets();

      if (updated.isActive) {
        userSockets.forEach((socket) => socket.join(room));
      } else {
        userSockets.forEach((socket) => socket.leave(room));
      }
    }

    res.json({
      success: true,
      message: `Subscription ${
        status === "active" ? "activated" : "deactivated"
      }`,
      subscription: updated,
    });
  } catch (err: any) {
    console.error("Update Subscription Status Error:", err);

    if (err.code === "P2025") {
      return res.status(404).json({ error: "Subscription not found" });
    }

    res.status(500).json({ error: "Failed to update subscription status" });
  }
};

export const deleteSubscriptionAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const subscription = await prisma.subscription.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    await prisma.subscription.delete({ where: { id } });

    const io = getIO();
    if (io) {
      const room =
        `subscription_${subscription.category}_${subscription.region}_${subscription.city}`
          .toLowerCase()
          .replace(/\s+/g, "_");

      const userSockets = await io
        .in(`user_${subscription.userId}`)
        .fetchSockets();
      userSockets.forEach((socket) => socket.leave(room));
    }

    res.json({
      success: true,
      message: "Subscription deleted successfully",
      deletedSubscription: subscription,
    });
  } catch (err: any) {
    console.error("Delete Subscription Error:", err);

    if (err.code === "P2025") {
      return res.status(404).json({ error: "Subscription not found" });
    }

    res.status(500).json({ error: "Failed to delete subscription" });
  }
};

export const triggerNotification = async (req: Request, res: Response) => {
  try {
    const {
      itemType,
      itemId,
      mainCategory,
      category,
      subcategory,
      region,
      city,
      title,
      price,
      posterId,
    } = req.body;

    if (
      !itemType ||
      !itemId ||
      !mainCategory ||
      !region ||
      !city ||
      !posterId
    ) {
      return res.status(400).json({
        error:
          "Missing required fields: itemType, itemId, mainCategory, region, city, posterId",
      });
    }

    const itemData = {
      title: title || "Test Item",
      price: price || 0,
      mainCategory,
      category: category || [mainCategory],
      subcategory: subcategory || [],
      region,
      city,
      posterId,
    };

    await notifyMatchingSubscribers(itemType as ItemModels, itemId, itemData);

    res.json({
      success: true,
      message: "Subscription notifications triggered manually",
    });
  } catch (error: any) {
    console.error("Trigger Notification Error:", error);
    res.status(500).json({
      error: "Failed to trigger notifications",
      details: error.message,
    });
  }
};

export const getSubscriptionStats = async (req: Request, res: Response) => {
  try {
    const { period = "all" } = req.query;

    const now = new Date();
    let dateFilter: any = undefined;

    if (period !== "all") {
      dateFilter = {};
      switch (period) {
        case "day":
          dateFilter.gte = new Date(now.setHours(0, 0, 0, 0));
          break;
        case "week":
          const weekAgo = new Date(now);
          weekAgo.setDate(weekAgo.getDate() - 7);
          dateFilter.gte = weekAgo;
          break;
        case "month":
          const monthAgo = new Date(now);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          dateFilter.gte = monthAgo;
          break;
      }
    }

    const [total, active, inactive, byCategory, recentActivity] =
      await Promise.all([
        prisma.subscription.count(
          dateFilter ? { where: { createdAt: dateFilter } } : undefined
        ),
        prisma.subscription.count({
          where: {
            isActive: true,
            ...(dateFilter && { createdAt: dateFilter }),
          },
        }),
        prisma.subscription.count({
          where: {
            isActive: false,
            ...(dateFilter && { createdAt: dateFilter }),
          },
        }),
        prisma.subscription.groupBy({
          by: ["category"],
          _count: { id: true },
          where: dateFilter ? { createdAt: dateFilter } : undefined,
        }),
        prisma.subscription.aggregate({
          _sum: { notificationCount: true },
          where: dateFilter ? { createdAt: dateFilter } : undefined,
        }),
      ]);

    res.json({
      success: true,
      period,
      stats: {
        total,
        active,
        inactive,
        byCategory: byCategory.map((item) => ({
          category: item.category,
          count: item._count.id,
        })),
        totalNotificationsSent: recentActivity._sum.notificationCount || 0,
        activePercentage: total > 0 ? Math.round((active / total) * 100) : 0,
      },
    });
  } catch (err: any) {
    console.error("Get Subscription Stats Error:", err);
    res.status(500).json({ error: "Failed to fetch subscription statistics" });
  }
};

export const getTotalSubscriptions = async (req: Request, res: Response) => {
  try {
    const total = await prisma.subscription.count();
    const active = await prisma.subscription.count({
      where: { isActive: true },
    });

    res.json({
      success: true,
      total,
      active,
      inactive: total - active,
    });
  } catch (err: any) {
    console.error("Get Total Subscriptions Error:", err);
    res.status(500).json({ error: "Failed to fetch total subscriptions" });
  }
};

export const searchSubscriptions = async (req: Request, res: Response) => {
  try {
    const {
      category,
      subCategory,
      region,
      city,
      minPrice,
      maxPrice,
      brand,
      model,
      condition,
      page = 1,
      limit = 20,
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const whereClause: any = { isActive: true };

    if (category) whereClause.category = category;
    if (subCategory) whereClause.subCategory = subCategory;
    if (region) whereClause.region = region;
    if (city) whereClause.city = city;
    if (brand) whereClause.brand = brand;
    if (model) whereClause.model = model;
    if (condition) whereClause.condition = condition;

    if (minPrice || maxPrice) {
      whereClause.AND = [];

      if (minPrice) {
        whereClause.AND.push({
          OR: [
            { priceMin: { gte: parseInt(minPrice as string) } },
            { priceMin: null },
          ],
        });
      }

      if (maxPrice) {
        whereClause.AND.push({
          OR: [
            { priceMax: { lte: parseInt(maxPrice as string) } },
            { priceMax: null },
          ],
        });
      }
    }

    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        include: includeUser,
        skip,
        take: limitNum,
      }),
      prisma.subscription.count({ where: whereClause }),
    ]);

    res.json({
      success: true,
      count: subscriptions.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      filters: {
        category,
        subCategory,
        region,
        city,
        minPrice,
        maxPrice,
        brand,
        model,
        condition,
      },
      subscriptions,
    });
  } catch (err: any) {
    console.error("Search Subscriptions Error:", err);
    res.status(500).json({ error: "Failed to search subscriptions" });
  }
};

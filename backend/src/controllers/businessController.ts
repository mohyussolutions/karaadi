import { Request, Response } from "express";
import prisma from "src/core/utils/db.ts";

function sanitizeWebsite(raw: string | undefined): string | null {
  if (!raw) return null;
  const domain = raw
    .replace(/^https?:\/\/(www\.)?/i, "")
    .replace(/^www\./i, "")
    .toLowerCase()
    .replace(/[^a-z0-9.\-]/g, "")
    .trim();
  if (!domain) return null;
  return `https://www.${domain}`;
}
import { CACHE_TTL } from "src/config/config.constants.ts";
import {
  AuthRequest,
  CreateBusinessBody,
  UpdateBusinessStatusBody,
  SelectBusinessPlanBody,
  ExtendBusinessPlanBody,
} from "src/types/index.ts";
import cacheManager from "src/services/redis/cacheManager.ts";

const getUserId = (req: AuthRequest): string | undefined => {
  const u = req.user as any;
  return u?.id || u?._id || u?.sub;
};

async function propagatePlanFlags(
  businessUserId: string,
  durationDays: number,
  expiryDate: Date,
) {
  const flags = {
    isPaid: true,
    expiryDate,
    isPremium90: durationDays >= 90,
    isStandard60: durationDays >= 60 && durationDays < 90,
    isBasic30: durationDays >= 30 && durationDays < 60,
  };
  await Promise.all([
    (prisma as any).marketplace.updateMany({
      where: { userId: businessUserId },
      data: flags,
    }),
    (prisma as any).car.updateMany({
      where: { userId: businessUserId },
      data: flags,
    }),
    (prisma as any).realEstate.updateMany({
      where: { userId: businessUserId },
      data: flags,
    }),
  ]);
}

const normalizeId = (id: string | string[]): string =>
  Array.isArray(id) ? id[0] : id;

const CACHE_KEYS = {
  MY_BUSINESSES: (userId: string) => `businesses:my:${userId}`,
  ALL_ADMIN: (page: number, limit: number) =>
    `businesses:admin:page:${page}:limit:${limit}`,
  ALL_PUBLIC: (page: number, limit: number) =>
    `businesses:public:page:${page}:limit:${limit}`,
  STATS: "businesses:stats",
  TOTAL: "businesses:total",
  DETAIL: (id: string) => `businesses:${id}`,
};

const getPaginationParams = (page?: string, limit?: string) => {
  const pageNum = Math.max(1, parseInt(page || "1"));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit || "20")));
  return { page: pageNum, limit: limitNum, skip: (pageNum - 1) * limitNum };
};

const includeRelations = {
  owner: {
    select: {
      id: true,
      username: true,
      email: true,
      phone: true,
      profileImage: true,
    },
  },
  members: {
    select: {
      id: true,
      username: true,
      email: true,
      phone: true,
      profileImage: true,
    },
  },
  plan: {
    select: {
      id: true,
      name: true,
      price: true,
      durationDays: true,
      features: true,
      maxListings: true,
    },
  },
};

async function countActiveListingsForUser(userId: string): Promise<number> {
  const now = new Date();
  const counts = await Promise.all([
    (prisma as any).car.count({ where: { userId, expiryDate: { gt: now } } }),
    (prisma as any).motorcycle.count({
      where: { userId, expiryDate: { gt: now } },
    }),
    (prisma as any).realEstate.count({
      where: { userId, expiryDate: { gt: now } },
    }),
    (prisma as any).marketplace.count({
      where: { userId, expiryDate: { gt: now } },
    }),
    (prisma as any).boat.count({ where: { userId, expiryDate: { gt: now } } }),
    (prisma as any).job.count({ where: { userId, expiryDate: { gt: now } } }),
    (prisma as any).farmequipment.count({
      where: { userId, expiryDate: { gt: now } },
    }),
  ]);
  return counts.reduce((a, b) => a + b, 0);
}

async function countActiveListingsBatch(
  userIds: string[],
): Promise<Map<string, number>> {
  if (userIds.length === 0) return new Map();
  const now = new Date();
  const models = [
    "car",
    "motorcycle",
    "realEstate",
    "marketplace",
    "boat",
    "job",
    "farmequipment",
  ] as const;
  const results = await Promise.all(
    models.map((model) =>
      (prisma as any)[model]
        .groupBy({
          by: ["userId"],
          where: { userId: { in: userIds }, expiryDate: { gt: now } },
          _count: { _all: true },
        })
        .catch(() => [] as any[]),
    ),
  );
  const totals = new Map<string, number>();
  for (const rows of results) {
    for (const row of rows) {
      totals.set(
        row.userId,
        (totals.get(row.userId) ?? 0) + (row._count?._all ?? 0),
      );
    }
  }
  return totals;
}

export const createBusiness = async (
  req: Request<{}, {}, CreateBusinessBody>,
  res: Response,
) => {
  try {
    const userId = getUserId(req as AuthRequest);

    const {
      name,
      email,
      phone,
      orgNumber,
      address,
      website,
      logo,
      images,
      description,
      categories,
      contactName,
      planType,
      planId,
    } = req.body;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!name || !email || !phone || !categories?.length) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let planActivation: Record<string, unknown> = {};
    if (planId) {
      const plan = await (prisma as any).businessPlan.findUnique({
        where: { id: planId },
        select: { durationDays: true },
      });
      if (plan) {
        const now = new Date();
        planActivation = {
          planStartDate: now,
          expiryDate: new Date(now.getTime() + plan.durationDays * 86_400_000),
        };
      }
    }

    const business = await (prisma as any).business.create({
      data: {
        userId,
        name,
        email,
        phone,
        orgNumber: orgNumber || null,
        address: address || null,
        website: sanitizeWebsite(website),
        logo: logo || null,
        images: images ?? [],
        description: description || null,
        categories,
        contactName: contactName || null,
        planType: planType || null,
        planId: planId || null,
        status: "pending",
        isVerified: false,
        isPaid: false,
        isAdminEnabled: true,
        ...planActivation,
      },
    });

    Promise.all([
      cacheManager.deletePattern(`businesses:my:${userId}*`),
      cacheManager.delete(CACHE_KEYS.TOTAL),
      cacheManager.delete(CACHE_KEYS.STATS),
    ]).catch(() => {});

    res.status(201).json({ success: true, business });
  } catch {
    res.status(500).json({ error: "Failed to create business" });
  }
};

export const getMyBusinesses = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const cacheKey = CACHE_KEYS.MY_BUSINESSES(userId);
    const enriched = await cacheManager.withCache(
      cacheKey,
      async () => {
        const businesses = await (prisma as any).business.findMany({
          where: { OR: [{ userId }, { members: { some: { id: userId } } }] },
          include: includeRelations,
          orderBy: { createdAt: "desc" },
        });
        if (businesses.length === 0) return [];
        const userIds = [
          ...new Set(businesses.map((b: any) => String(b.userId))),
        ] as string[];
        const listingCounts = await countActiveListingsBatch(userIds);
        return businesses.map((b: any) => ({
          ...b,
          currentListings: listingCounts.get(b.userId) ?? 0,
        }));
      },
      CACHE_TTL.LIST,
    );

    res.json({ success: true, businesses: enriched });
  } catch {
    res.status(500).json({ error: "Fetch failed" });
  }
};

export const getBusinessById = async (req: Request, res: Response) => {
  try {
    const id = normalizeId(req.params.id);
    const business = await cacheManager.withCache(
      CACHE_KEYS.DETAIL(id),
      async () =>
        (prisma as any).business.findUnique({
          where: { id },
          include: includeRelations,
        }),
      CACHE_TTL.DETAIL,
    );
    if (!business) return res.status(404).json({ error: "Not found" });
    res.json({ success: true, business });
  } catch {
    res.status(500).json({ error: "Fetch failed" });
  }
};

export const updateBusiness = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const id = normalizeId(req.params.id);
    const existing = await (prisma as any).business.findUnique({
      where: { id },
      select: { userId: true },
    });
    if (!existing) return res.status(404).json({ error: "Not found" });
    if (existing.userId !== userId)
      return res.status(403).json({ error: "Forbidden" });

    const {
      name,
      email,
      phone,
      orgNumber,
      address,
      website,
      logo,
      images,
      description,
      categories,
      contactName,
      isVerified: _iv,
      status: _s,
      isPaid: _ip,
      isAdminEnabled: _iae,
      planId: _pi,
      planStartDate: _ps,
      expiryDate: _ed,
      ...rest
    } = req.body;
    void [_iv, _s, _ip, _iae, _pi, _ps, _ed, rest];

    const updated = await (prisma as any).business.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(orgNumber !== undefined && { orgNumber }),
        ...(address !== undefined && { address }),
        ...(website !== undefined && { website: sanitizeWebsite(website) }),
        ...(logo !== undefined && { logo }),
        ...(images !== undefined && { images }),
        ...(description !== undefined && { description }),
        ...(categories && { categories }),
        ...(contactName !== undefined && { contactName }),
      },
      include: includeRelations,
    });

    Promise.all([
      cacheManager.deletePattern(`businesses:my:${userId}*`),
      cacheManager.delete(CACHE_KEYS.DETAIL(id)),
    ]).catch(() => {});

    res.json({ success: true, business: updated });
  } catch {
    res.status(500).json({ error: "Update failed" });
  }
};

export const deleteBusiness = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const id = normalizeId(req.params.id);
    const isAdminOrManager = req.user?.isAdmin || req.user?.isManager;

    const where = isAdminOrManager ? { id } : { id, userId };

    const { count } = await (prisma as any).business.deleteMany({ where });

    if (count === 0) {
      const exists = await (prisma as any).business.findUnique({
        where: { id },
        select: { id: true },
      });
      return res
        .status(exists ? 403 : 404)
        .json({ error: exists ? "Forbidden" : "Not found" });
    }

    res.json({ success: true });

    Promise.all([
      cacheManager.delete(CACHE_KEYS.DETAIL(id)),
      cacheManager.delete(CACHE_KEYS.TOTAL),
      cacheManager.delete(CACHE_KEYS.STATS),
      cacheManager.deletePattern(`businesses:my:${userId}*`),
    ]).catch(() => {});
  } catch {
    res.status(500).json({ error: "Delete failed" });
  }
};

export const addMember = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const id = normalizeId(req.params.id);
    const { memberId } = req.body;
    if (!memberId) return res.status(400).json({ error: "memberId required" });

    const existing = await (prisma as any).business.findUnique({
      where: { id },
      select: { userId: true },
    });
    if (!existing) return res.status(404).json({ error: "Not found" });
    if (existing.userId !== userId)
      return res.status(403).json({ error: "Forbidden" });

    const updated = await (prisma as any).business.update({
      where: { id },
      data: { members: { connect: { id: memberId } } },
      include: includeRelations,
    });

    await cacheManager
      .deletePattern(`businesses:my:${memberId}*`)
      .catch(() => {});

    res.json({ success: true, business: updated });
  } catch {
    res.status(500).json({ error: "Add member failed" });
  }
};

export const removeMember = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const id = normalizeId(req.params.id);
    const memberId = normalizeId(req.params.memberId);

    const existing = await (prisma as any).business.findUnique({
      where: { id },
      select: { userId: true },
    });
    if (!existing) return res.status(404).json({ error: "Not found" });
    if (existing.userId !== userId)
      return res.status(403).json({ error: "Forbidden" });

    const updated = await (prisma as any).business.update({
      where: { id },
      data: { members: { disconnect: { id: memberId } } },
      include: includeRelations,
    });

    await cacheManager
      .deletePattern(`businesses:my:${memberId}*`)
      .catch(() => {});

    res.json({ success: true, business: updated });
  } catch {
    res.status(500).json({ error: "Remove member failed" });
  }
};

export const getAllBusinessesAdmin = async (req: Request, res: Response) => {
  try {
    const { page, limit, skip } = getPaginationParams(
      req.query.page as string,
      req.query.limit as string,
    );
    const cacheKey = CACHE_KEYS.ALL_ADMIN(page, limit);

    const businesses = await cacheManager.withCache(
      cacheKey,
      async () =>
        (prisma as any).business.findMany({
          include: includeRelations,
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
      CACHE_TTL.LIST,
    );

    const [total, listingCounts] = await Promise.all([
      (prisma as any).business.count(),
      countActiveListingsBatch(businesses.map((b: any) => b.userId)),
    ]);

    const enriched = businesses.map((b: any) => ({
      ...b,
      currentListings: listingCounts.get(b.userId) ?? 0,
    }));

    res.json({
      success: true,
      businesses: enriched,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch {
    res.status(500).json({ error: "Fetch failed" });
  }
};

export const adminAssignPlan = async (req: Request, res: Response) => {
  try {
    const id = normalizeId(req.params.id);
    const { planId } = req.body as { planId: string };
    if (!planId) return res.status(400).json({ error: "planId required" });

    const plan = await (prisma as any).businessPlan.findUnique({
      where: { id: planId },
      select: { id: true, durationDays: true, isActive: true },
    });
    if (!plan || !plan.isActive)
      return res.status(404).json({ error: "Plan not found or inactive" });

    const now = new Date();
    const expiryDate = new Date(now.getTime() + plan.durationDays * 86_400_000);

    const updated = await (prisma as any).business.update({
      where: { id },
      data: { planId, planStartDate: now, expiryDate, isPaid: true },
      include: includeRelations,
    });

    propagatePlanFlags(updated.userId, plan.durationDays, expiryDate).catch(
      () => {},
    );

    Promise.all([
      cacheManager.delete(CACHE_KEYS.DETAIL(id)),
      cacheManager.deletePattern(`businesses:my:${updated.userId}*`),
      cacheManager.deletePattern("businesses:admin:*"),
    ]).catch(() => {});

    res.json({ success: true, business: updated });
  } catch {
    res.status(500).json({ error: "Assign plan failed" });
  }
};

export const adminSetPostLimit = async (req: Request, res: Response) => {
  try {
    const id = normalizeId(req.params.id);
    const { maxListingsOverride } = req.body as {
      maxListingsOverride: number | null;
    };

    if (
      maxListingsOverride !== null &&
      (typeof maxListingsOverride !== "number" ||
        maxListingsOverride < 0 ||
        !Number.isInteger(maxListingsOverride))
    ) {
      return res.status(400).json({
        error: "maxListingsOverride must be a positive integer or null",
      });
    }

    const updated = await (prisma as any).business.update({
      where: { id },
      data: { maxListingsOverride: maxListingsOverride ?? null },
      include: includeRelations,
    });

    Promise.all([
      cacheManager.delete(CACHE_KEYS.DETAIL(id)),
      cacheManager.deletePattern(`businesses:my:${updated.userId}*`),
      cacheManager.deletePattern("businesses:admin:*"),
    ]).catch(() => {});

    res.json({ success: true, business: updated });
  } catch {
    res.status(500).json({ error: "Set post limit failed" });
  }
};

export const updateBusinessStatus = async (
  req: Request<{ id: string }, {}, UpdateBusinessStatusBody>,
  res: Response,
) => {
  try {
    const id = normalizeId(req.params.id);
    const { status, isVerified } = req.body;

    const resolvedVerified =
      status === "active"
        ? true
        : status === "inactive" || status === "suspended"
          ? false
          : isVerified;

    let planActivation: Record<string, unknown> = {};
    if (status === "active") {
      const existing = await (prisma as any).business.findUnique({
        where: { id },
        select: { planId: true },
      });
      if (existing?.planId) {
        const plan = await (prisma as any).businessPlan.findUnique({
          where: { id: existing.planId },
          select: { durationDays: true },
        });
        if (plan) {
          const now = new Date();
          planActivation = {
            planStartDate: now,
            expiryDate: new Date(
              now.getTime() + plan.durationDays * 86_400_000,
            ),
          };
        }
      }
    }

    const updated = await (prisma as any).business.update({
      where: { id },
      data: {
        status,
        ...(resolvedVerified !== undefined && { isVerified: resolvedVerified }),
        ...(status === "active" && { isPaid: true }),
        ...planActivation,
      },
      select: {
        id: true,
        userId: true,
        status: true,
        isVerified: true,
        isPaid: true,
        expiryDate: true,
      },
    });

    res.json({ success: true, business: updated });

    Promise.all([
      cacheManager.delete(CACHE_KEYS.DETAIL(id)),
      cacheManager.delete(CACHE_KEYS.STATS),
      cacheManager.deletePattern(`businesses:my:${updated.userId}*`),
      cacheManager.deletePattern("businesses:admin:*"),
    ]).catch(() => {});
  } catch {
    res.status(500).json({ error: "Update failed" });
  }
};

export const selectPlan = async (
  req: Request<{ id: string }, {}, SelectBusinessPlanBody>,
  res: Response,
) => {
  try {
    const userId = getUserId(req as AuthRequest);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const id = normalizeId(req.params.id);
    const { planId } = req.body;
    if (!planId) return res.status(400).json({ error: "planId required" });

    const business = await (prisma as any).business.findUnique({
      where: { id },
      select: { userId: true, status: true, isVerified: true },
    });
    if (!business) return res.status(404).json({ error: "Business not found" });
    if (business.userId !== userId)
      return res.status(403).json({ error: "Forbidden" });
    if (!business.isVerified || business.status !== "active")
      return res.status(403).json({
        error: "Business must be verified and active before selecting a plan",
      });

    const plan = await (prisma as any).businessPlan.findUnique({
      where: { id: planId },
      select: { id: true, durationDays: true, price: true, isActive: true },
    });
    if (!plan || !plan.isActive)
      return res.status(404).json({ error: "Plan not found or inactive" });

    const now = new Date();
    const expiryDate = new Date(
      now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000,
    );

    const updated = await (prisma as any).business.update({
      where: { id },
      data: {
        planId,
        planStartDate: now,
        expiryDate,
        isPaid: true,
      },
      include: includeRelations,
    });

    propagatePlanFlags(
      business.userId ?? userId,
      plan.durationDays,
      expiryDate,
    ).catch(() => {});

    Promise.all([
      cacheManager.deletePattern(`businesses:my:${userId}*`),
      cacheManager.delete(CACHE_KEYS.DETAIL(id)),
      cacheManager.deletePattern("cars:all:*"),
      cacheManager.deletePattern("realestate:*"),
      cacheManager.deletePattern("marketplace:*"),
    ]).catch(() => {});

    res.json({ success: true, business: updated });
  } catch {
    res.status(500).json({ error: "Plan selection failed" });
  }
};

export const canPostAsBusiness = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const business = await (prisma as any).business.findFirst({
      where: {
        AND: [
          { OR: [{ userId }, { members: { some: { id: userId } } }] },
          { OR: [{ expiryDate: null }, { expiryDate: { gt: new Date() } }] },
        ],
        status: "active",
        isVerified: true,
        isAdminEnabled: true,
      },
      select: {
        id: true,
        name: true,
        categories: true,
        logo: true,
        expiryDate: true,
      },
    });

    res.json({
      success: true,
      canPost: !!business,
      business: business ?? null,
    });
  } catch {
    res.status(500).json({ error: "Check failed" });
  }
};

export const extendPlan = async (
  req: Request<{ id: string }, {}, ExtendBusinessPlanBody>,
  res: Response,
) => {
  try {
    const userId = getUserId(req as AuthRequest);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const id = normalizeId(req.params.id);
    const { planId } = req.body;
    if (!planId) return res.status(400).json({ error: "planId required" });

    const business = await (prisma as any).business.findUnique({
      where: { id },
      select: { userId: true, isVerified: true, expiryDate: true },
    });
    if (!business) return res.status(404).json({ error: "Business not found" });
    if (business.userId !== userId)
      return res.status(403).json({ error: "Forbidden" });
    if (!business.isVerified)
      return res.status(403).json({ error: "Business must be verified" });

    const plan = await (prisma as any).businessPlan.findUnique({
      where: { id: planId },
      select: { id: true, durationDays: true, isActive: true },
    });
    if (!plan || !plan.isActive)
      return res.status(404).json({ error: "Plan not found or inactive" });

    const base =
      !business.expiryDate || business.expiryDate < new Date()
        ? new Date()
        : new Date(business.expiryDate);
    const newExpiry = new Date(base.getTime() + plan.durationDays * 86_400_000);

    const updated = await (prisma as any).business.update({
      where: { id },
      data: {
        planId,
        planStartDate: new Date(),
        expiryDate: newExpiry,
        isPaid: true,
        status: "active",
      },
      include: includeRelations,
    });

    propagatePlanFlags(
      business.userId ?? userId,
      plan.durationDays,
      newExpiry,
    ).catch(() => {});

    Promise.all([
      cacheManager.deletePattern(`businesses:my:${userId}*`),
      cacheManager.delete(CACHE_KEYS.DETAIL(id)),
      cacheManager.deletePattern("cars:all:*"),
      cacheManager.deletePattern("realestate:*"),
      cacheManager.deletePattern("marketplace:*"),
    ]).catch(() => {});

    res.json({ success: true, business: updated });
  } catch {
    res.status(500).json({ error: "Extend plan failed" });
  }
};

export const toggleAdminEnabled = async (req: Request, res: Response) => {
  try {
    const id = normalizeId(req.params.id);
    const { isAdminEnabled } = req.body as { isAdminEnabled: boolean };

    if (typeof isAdminEnabled !== "boolean")
      return res
        .status(400)
        .json({ error: "isAdminEnabled (boolean) required" });

    const updated = await (prisma as any).business.update({
      where: { id },
      data: { isAdminEnabled },
      select: { id: true, userId: true, name: true, isAdminEnabled: true },
    });

    res.json({ success: true, business: updated });

    Promise.all([
      cacheManager.delete(CACHE_KEYS.DETAIL(id)),
      cacheManager.deletePattern(`businesses:my:${updated.userId}*`),
      cacheManager.deletePattern("businesses:admin:*"),
    ]).catch(() => {});
  } catch {
    res.status(500).json({ error: "Toggle failed" });
  }
};

export const getBusinessStats = async (_req: Request, res: Response) => {
  try {
    const stats = await cacheManager.withCache(
      CACHE_KEYS.STATS,
      async () => {
        const now = new Date();
        const [total, active, pending, verified, canPost] = await Promise.all([
          (prisma as any).business.count(),
          (prisma as any).business.count({ where: { status: "active" } }),
          (prisma as any).business.count({ where: { status: "pending" } }),
          (prisma as any).business.count({ where: { isVerified: true } }),
          (prisma as any).business.count({
            where: {
              status: "active",
              isVerified: true,
              isAdminEnabled: true,
              planId: { not: null },
              expiryDate: { gt: now },
            },
          }),
        ]);
        return { total, active, pending, verified, canPost };
      },
      CACHE_TTL.STATS,
    );
    res.json({ success: true, stats });
  } catch {
    res.status(500).json({ error: "Stats failed" });
  }
};

export const getAllBusinesses = async (req: Request, res: Response) => {
  try {
    const { page, limit, skip } = getPaginationParams(
      req.query.page as string,
      req.query.limit as string,
    );
    const businesses = await cacheManager.withCache(
      CACHE_KEYS.ALL_PUBLIC(page, limit),
      async () =>
        (prisma as any).business.findMany({
          where: { status: "active", isAdminEnabled: true },
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: includeRelations,
        }),
      CACHE_TTL.LIST,
    );
    res.json({ success: true, businesses });
  } catch {
    res.status(500).json({ error: "Failed to fetch businesses" });
  }
};

export const getTotalBusinesses = async (_req: Request, res: Response) => {
  try {
    const total = await cacheManager.withCache(
      CACHE_KEYS.TOTAL,
      async () => (prisma as any).business.count(),
      CACHE_TTL.STATS,
    );
    res.json({ success: true, total });
  } catch {
    res.status(500).json({ error: "Count failed" });
  }
};

export const getBusinessFeed = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const pageSize = Math.min(40, Math.max(1, Number(req.query.pageSize) || 100));
    const skip = (page - 1) * pageSize;
    const filterUserId = req.query.userId as string | undefined;
    const filterBusinessId = req.query.businessId as string | undefined;

    const select = {
      id: true,
      title: true,
      price: true,
      images: true,
      city: true,
      region: true,
      mainCategory: true,
      category: true,
      userId: true,
      businessId: true,
      maGaday: true,
      description: true,
    };
    const order = { createdAt: "desc" as const };

    if (filterBusinessId) {
      const where = { businessId: filterBusinessId };
      const [marketplace, cars, realEstate, boats, motorcycles, farmequipment] = await Promise.all([
        (prisma as any).marketplace.findMany({ where, orderBy: order, select }),
        (prisma as any).car.findMany({ where, orderBy: order, select: { ...select, vehicleModel: true } }),
        (prisma as any).realEstate.findMany({ where, orderBy: order, select }),
        (prisma as any).boat.findMany({ where, orderBy: order, select }),
        (prisma as any).motorcycle.findMany({ where, orderBy: order, select }),
        (prisma as any).farmequipment.findMany({ where, orderBy: order, select }),
      ]);
      return res.json({
        success: true,
        items: [...marketplace, ...cars, ...realEstate, ...boats, ...motorcycles, ...farmequipment],
      });
    }

    const businessWhere: any = filterUserId
      ? { userId: filterUserId }
      : { status: "active", isAdminEnabled: true, expiryDate: { gt: new Date() } };

    const activeBusinesses = await (prisma as any).business.findMany({
      where: businessWhere,
      select: { userId: true, expiryDate: true, plan: { select: { durationDays: true } } },
    });

    if (!activeBusinesses.length) return res.json({ success: true, items: [] });

    const flagMap = new Map<string, { isPremium90: boolean; isStandard60: boolean; isBasic30: boolean; expiryDate: Date }>();
    for (const b of activeBusinesses) {
      const days: number = b.plan?.durationDays ?? 0;
      flagMap.set(b.userId, {
        expiryDate: b.expiryDate,
        isPremium90: days >= 90,
        isStandard60: days >= 60 && days < 90,
        isBasic30: days >= 30 && days < 60,
      });
    }

    const userIds = activeBusinesses.map((b: any) => b.userId);
    const userFilter = { userId: { in: userIds } };

    const [marketplace, cars, realEstate] = await Promise.all([
      (prisma as any).marketplace.findMany({ where: userFilter, orderBy: order, skip, take: pageSize, select }),
      (prisma as any).car.findMany({ where: userFilter, orderBy: order, skip, take: pageSize, select: { ...select, vehicleModel: true } }),
      (prisma as any).realEstate.findMany({ where: userFilter, orderBy: order, skip, take: pageSize, select }),
    ]);

    const applyFlags = (item: any) => {
      const f = flagMap.get(item.userId) ?? { isPremium90: false, isStandard60: false, isBasic30: false, expiryDate: null };
      return { ...item, isPaid: true, ...f };
    };

    res.json({ success: true, items: [...marketplace, ...cars, ...realEstate].map(applyFlags) });
  } catch (e) {
    console.error("getBusinessFeed error:", e);
    res.status(500).json({ error: "Feed failed" });
  }
};

import { Request, Response, NextFunction } from "express";
import { prisma } from "../../core/utils/db.ts";
import { Prisma } from "@prisma/client";
import cacheManager from "src/services/redisserver/cacheManager.ts";
import { notifyMatchingSubscribers } from "./subscriptionController.ts";
import { CACHE_TTL, getPaginationParams } from "src/config/contstanst.ts";
import {
  calculateExpiryDate,
  getDefaultExpiryDate,
  isExpired,
} from "src/hooks/useExpire.ts";

const catchAsync =
  (fn: any) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

interface BoatQuery {
  type?: string;
  listingType?: string;
  region?: string;
  city?: string;
  district?: string;
  subCategory?: string;
  category?: string;
}

interface CreateBoatBody {
  userId: string;
  feeId?: string;
  planId?: string;
  title: string;
  mainCategory: string;
  category: string | string[];
  subcategory: string | string[];
  images: string[];
  price: number;
  feeAmount: number;
  planAmount: number;
  type: string;
  boatModel: string;
  transmission: string;
  color: string;
  region: string;
  city: string;
  so?: string;
  description: string;
  brand?: string;
}

interface PaymentUpdateBody {
  paymentId?: string;
  planId?: string;
}

const CACHE_KEYS = {
  TOTAL: "boats:total",
  UNFILTERED: "boats:all:unfiltered",
  PAID_PREFIX: "boats:all:paid",
  DETAIL_PREFIX: "boat:detail",
};

const selectUserBasic = {
  select: { username: true, phone: true },
};

const selectUserFull = {
  select: {
    username: true,
    email: true,
    phone: true,
    profileImage: true,
  },
};

export const checkAndUpdateExpiredListings = catchAsync(async () => {
  const now = new Date();
  const expiredBoats = await prisma.boat.updateMany({
    where: {
      expiryDate: { lt: now },
      isPaid: true,
      maGaday: false,
    },
    data: { isPaid: false, maGaday: true },
  });
  await cacheManager.deletePattern("boats:all:*");
  return { success: true, count: expiredBoats.count };
});

export const getTotalBoats = catchAsync(
  async (_req: Request, res: Response) => {
    const total = await cacheManager.withCache(
      CACHE_KEYS.TOTAL,
      async () => await prisma.boat.count({}),
      CACHE_TTL.STATS,
    );
    return res.json({ totalBoats: total });
  },
);

export const getAllBoatsIncludingUnpaid = catchAsync(
  async (_req: Request, res: Response) => {
    const boats = await cacheManager.withCache(
      CACHE_KEYS.UNFILTERED,
      async () => {
        return await prisma.boat.findMany({
          include: {
            user: { select: selectUserFull.select },
            fee: true,
            plan: true,
          },
          orderBy: { createdAt: "desc" },
          take: 100,
        });
      },
      CACHE_TTL.LIST,
    );
    return res.json(boats);
  },
);

export const getAllBoats = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPaginationParams(
    req.query.page as string,
    req.query.pageSize as string,
  );

  const { type, region, city, subCategory, category } = req.query as BoatQuery;
  const cacheKey = `${CACHE_KEYS.PAID_PREFIX}:page:${page}:limit:${limit}:${type || "all"}:${region || "all"}:${city || "all"}:${category || "all"}`;

  const boats = await cacheManager.withCache(
    cacheKey,
    async () => {
      const filter: Prisma.BoatWhereInput = {
        isPaid: true,
        OR: [{ expiryDate: null }, { expiryDate: { gt: new Date() } }],
      };

      if (type) filter.type = type;
      if (region) filter.region = region;
      if (city) filter.city = city;
      if (subCategory) filter.subcategory = { has: subCategory };
      if (category) filter.category = { has: category };

      return await prisma.boat.findMany({
        where: filter,
        include: { user: selectUserBasic, fee: true, plan: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      });
    },
    CACHE_TTL.LIST,
  );

  return res.json(boats);
});

export const getBoatById = catchAsync(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const cacheKey = `${CACHE_KEYS.DETAIL_PREFIX}:${id}`;

  const boat = await cacheManager.withCache(
    cacheKey,
    async () => {
      return await prisma.boat.findUnique({
        where: { id },
        include: {
          user: { select: selectUserFull.select },
          fee: true,
          plan: true,
        },
      });
    },
    CACHE_TTL.DETAIL,
  );

  if (!boat) return res.status(404).json({ message: "Boat not found" });

  const expired = isExpired(boat.expiryDate);
  return res.json({
    ...boat,
    isExpired: expired,
    status: expired ? "expired" : boat.isPaid ? "active" : "pending",
  });
});

export const createBoat = catchAsync(
  async (req: Request<{}, {}, CreateBoatBody>, res: Response) => {
    const { userId, feeId, planId, ...boatData } = req.body;
    if (!userId) return res.status(400).json({ message: "User ID required" });

    if (feeId) {
      const fee = await prisma.boatFee.findUnique({ where: { id: feeId } });
      if (!fee) return res.status(400).json({ message: "Invalid fee ID" });
    }

    if (planId) {
      const plan = await prisma.subPlan.findUnique({ where: { id: planId } });
      if (!plan) return res.status(400).json({ message: "Invalid plan ID" });
    }

    const newBoat = await prisma.boat.create({
      data: {
        ...boatData,
        userId,
        feeId,
        planId,
        category: Array.isArray(boatData.category)
          ? boatData.category
          : [boatData.category].filter(Boolean),
        subcategory: Array.isArray(boatData.subcategory)
          ? boatData.subcategory
          : [boatData.subcategory].filter(Boolean),
        images: Array.isArray(boatData.images) ? boatData.images : [],
        price: Number(boatData.price) || 0,
        feeAmount: Number(boatData.feeAmount) || 0,
        planAmount: Number(boatData.planAmount) || 0,
        type: boatData.type || "boat",
        boatModel: boatData.boatModel || "",
        transmission: boatData.transmission || "",
        color: boatData.color || "",
        isPaid: false,
        maGaday: false,
        expiryDate: null,
        description: boatData.description || "",
      },
      include: {
        user: { select: selectUserFull.select },
        fee: true,
        plan: true,
      },
    });

    if (!planId) {
      notifyMatchingSubscribers("boat", newBoat.id, {
        title: newBoat.title,
        price: newBoat.price,
        mainCategory: "Boats",
        subCategory: newBoat.subcategory?.[0],
        region: newBoat.region,
        city: newBoat.city,
        model: newBoat.boatModel,
        posterId: newBoat.userId,
      }).catch((err) => console.error("Background notification error:", err));
    }

    // Safe cache deletion
    try {
      await cacheManager.deletePattern("boats:all:*");
      await cacheManager.delete(CACHE_KEYS.TOTAL);
    } catch (cacheErr) {
      console.error("Cache deletion error:", cacheErr);
    }

    return res.status(201).json(newBoat);
  },
);

export const updateBoatPayment = catchAsync(
  async (
    req: Request<{ id: string }, {}, PaymentUpdateBody>,
    res: Response,
  ) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { paymentId, planId } = req.body;

    const boat = await prisma.boat.findUnique({
      where: { id },
    });

    if (!boat) {
      return res
        .status(404)
        .json({ success: false, message: "Boat not found" });
    }

    const expiryDate = planId
      ? calculateExpiryDate(planId, boat.planAmount)
      : getDefaultExpiryDate();

    const updatedBoat = await prisma.boat.update({
      where: { id },
      data: {
        isPaid: true,
        maGaday: false,
        expiryDate,
        planId: planId || boat.planId,
      },
    });

    if (paymentId) {
      await prisma.payment.updateMany({
        where: { id: paymentId },
        data: { boatId: id, status: "COMPLETED", paidAt: new Date() },
      });
    }

    const notifiedCount = await notifyMatchingSubscribers(
      "boat",
      updatedBoat.id,
      {
        title: updatedBoat.title,
        price: updatedBoat.price,
        mainCategory: "Boats",
        subCategory: boat.subcategory?.[0],
        region: updatedBoat.region,
        city: updatedBoat.city,
        model: updatedBoat.boatModel,
        posterId: updatedBoat.userId,
      },
    );

    await Promise.all([
      cacheManager.delete(`${CACHE_KEYS.DETAIL_PREFIX}:${id}`),
      cacheManager.deletePattern("boats:all:*"),
    ]);

    return res.json({
      success: true,
      data: updatedBoat,
      notificationsSent: notifiedCount,
    });
  },
);

export const triggerExpiryCheck = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await checkAndUpdateExpiredListings(req, res, next);
    return res.json(result);
  },
);

export const updateBoat = catchAsync(
  async (req: Request<{ id: string }>, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updatedBoat = await prisma.boat.update({
      where: { id },
      data: req.body,
      include: {
        user: { select: selectUserFull.select },
        fee: true,
        plan: true,
      },
    });

    await Promise.all([
      cacheManager.delete(`${CACHE_KEYS.DETAIL_PREFIX}:${id}`),
      cacheManager.deletePattern("boats:all:*"),
      cacheManager.delete(CACHE_KEYS.TOTAL),
    ]);

    return res.json(updatedBoat);
  },
);

export const deleteBoat = catchAsync(
  async (req: Request<{ id: string }>, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await prisma.boat.delete({ where: { id } });

    await Promise.all([
      cacheManager.delete(`${CACHE_KEYS.DETAIL_PREFIX}:${id}`),
      cacheManager.deletePattern("boats:all:*"),
      cacheManager.delete(CACHE_KEYS.TOTAL),
    ]);

    return res.json({ message: "Boat deleted successfully" });
  },
);

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
  getDaysUntilExpiry,
} from "src/hooks/useExpire.ts";

const catchAsync =
  (fn: any) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

interface BoatQuery {
  type?: string;
  region?: string;
  city?: string;
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
}

const CACHE_KEYS = {
  TOTAL: "boats:total",
  UNFILTERED: "boats:all:unfiltered",
  PAID_PREFIX: "boats:all:paid",
  DETAIL_PREFIX: "boat:detail",
};

const selectUserFull = {
  select: {
    username: true,
    email: true,
    phone: true,
    profileImage: true,
  },
};

const boatInclude = {
  user: { select: selectUserFull.select },
  fee: true,
  plan: true,
};

const ensureSingleString = (id: any): string => {
  return Array.isArray(id) ? id[0] : id || "";
};

const mapBoatResponse = (boat: any) => {
  if (!boat) return null;
  const expired = isExpired(boat.expiryDate);

  let planName = "Basic 30 Days";
  if (boat.plan) {
    if (boat.planAmount === boat.plan.premium90) planName = "Premium 90 Days";
    else if (boat.planAmount === boat.plan.standard60)
      planName = "Standard 60 Days";
  }

  return {
    ...boat,
    isExpired: expired,
    status: expired ? "expired" : boat.isPaid ? "active" : "pending",
    selectedPlan: boat.plan
      ? {
          name: planName,
          duration: expired ? 0 : getDaysUntilExpiry(boat.expiryDate),
          price: boat.planAmount,
          details: boat.plan,
        }
      : null,
  };
};

export const checkAndUpdateExpiredListings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const now = new Date();
    const expiredBoats = await prisma.boat.updateMany({
      where: {
        expiryDate: { lt: now },
        isPaid: true,
        maGaday: false,
      },
      data: { isPaid: false, maGaday: true },
    });

    if (expiredBoats.count > 0) {
      await cacheManager.deletePattern("boats:all:*");
    }
    return res.json({ success: true, count: expiredBoats.count });
  },
);

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
        const data = await prisma.boat.findMany({
          include: boatInclude,
          orderBy: { createdAt: "desc" },
          take: 100,
        });
        return data.map(mapBoatResponse);
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

  const { type, region, city, subCategory, category } = req.query as any;
  const cacheKey = `${CACHE_KEYS.PAID_PREFIX}:p:${page}:l:${limit}:${type || "all"}:${region || "all"}:${city || "all"}:${category || "all"}`;

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

      const data = await prisma.boat.findMany({
        where: filter,
        include: boatInclude,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      });
      return data.map(mapBoatResponse);
    },
    CACHE_TTL.LIST,
  );

  return res.json(boats);
});

export const getBoatById = catchAsync(async (req: Request, res: Response) => {
  const id = ensureSingleString(req.params.id);
  const cacheKey = `${CACHE_KEYS.DETAIL_PREFIX}:${id}`;

  const boat = await cacheManager.withCache(
    cacheKey,
    async () => {
      const data = await prisma.boat.findUnique({
        where: { id },
        include: boatInclude,
      });
      return mapBoatResponse(data);
    },
    CACHE_TTL.DETAIL,
  );

  if (!boat) return res.status(404).json({ message: "Boat not found" });
  return res.json(boat);
});

export const createBoat = catchAsync(
  async (req: Request<{}, {}, CreateBoatBody>, res: Response) => {
    const {
      userId,
      feeId,
      planId,
      category,
      subcategory,
      images,
      ...boatData
    } = req.body;

    if (!userId) return res.status(400).json({ message: "User ID required" });

    const newBoat = await prisma.boat.create({
      data: {
        ...boatData,
        userId,
        feeId: feeId || null,
        planId: planId || null,
        category: Array.isArray(category)
          ? category
          : ([category].filter(Boolean) as string[]),
        subcategory: Array.isArray(subcategory)
          ? subcategory
          : ([subcategory].filter(Boolean) as string[]),
        images: Array.isArray(images) ? images : [],
        price: Number(boatData.price) || 0,
        feeAmount: Number(boatData.feeAmount) || 0,
        planAmount: Number(boatData.planAmount) || 0,
        isPaid: false,
        maGaday: false,
        expiryDate: null,
      },
      include: boatInclude,
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
      }).catch(console.error);
    }

    await Promise.all([
      cacheManager.deletePattern("boats:all:*"),
      cacheManager.delete(CACHE_KEYS.TOTAL),
    ]);

    return res.status(201).json(mapBoatResponse(newBoat));
  },
);

export const updateBoatPayment = catchAsync(
  async (req: Request, res: Response) => {
    const id = ensureSingleString(req.params.id);
    const { paymentId, planId } = req.body;

    const boat = await prisma.boat.findUnique({ where: { id } });
    if (!boat)
      return res
        .status(404)
        .json({ success: false, message: "Boat not found" });

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
      include: boatInclude,
    });

    if (paymentId) {
      await prisma.payment.updateMany({
        where: { id: paymentId },
        data: { boatId: id, status: "COMPLETED", paidAt: new Date() },
      });
    }

    notifyMatchingSubscribers("boat", updatedBoat.id, {
      title: updatedBoat.title,
      price: updatedBoat.price,
      mainCategory: "Boats",
      subCategory: updatedBoat.subcategory?.[0],
      region: updatedBoat.region,
      city: updatedBoat.city,
      model: updatedBoat.boatModel,
      posterId: updatedBoat.userId,
    }).catch(console.error);

    await Promise.all([
      cacheManager.delete(`${CACHE_KEYS.DETAIL_PREFIX}:${id}`),
      cacheManager.deletePattern("boats:all:*"),
    ]);

    return res.json({ success: true, data: mapBoatResponse(updatedBoat) });
  },
);

export const triggerExpiryCheck = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    return checkAndUpdateExpiredListings(req, res, next);
  },
);

export const updateBoat = catchAsync(async (req: Request, res: Response) => {
  const id = ensureSingleString(req.params.id);
  const updatedBoat = await prisma.boat.update({
    where: { id },
    data: req.body,
    include: boatInclude,
  });

  await Promise.all([
    cacheManager.delete(`${CACHE_KEYS.DETAIL_PREFIX}:${id}`),
    cacheManager.deletePattern("boats:all:*"),
    cacheManager.delete(CACHE_KEYS.TOTAL),
  ]);

  return res.json(mapBoatResponse(updatedBoat));
});

export const deleteBoat = catchAsync(async (req: Request, res: Response) => {
  const id = ensureSingleString(req.params.id);
  await prisma.boat.delete({ where: { id } });

  await Promise.all([
    cacheManager.delete(`${CACHE_KEYS.DETAIL_PREFIX}:${id}`),
    cacheManager.deletePattern("boats:all:*"),
    cacheManager.delete(CACHE_KEYS.TOTAL),
  ]);

  return res.json({ message: "Boat deleted successfully" });
});

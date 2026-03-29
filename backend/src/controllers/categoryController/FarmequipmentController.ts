import { Request, Response } from "express";
import prisma from "../../core/utils/db.ts";
import cacheManager from "src/services/redisserver/cacheManager.ts";
import { notifyMatchingSubscribers } from "./subscriptionController.ts";
import {
  CACHE_TTL,
  getPaginationParams,
} from "src/constants/config.constants.ts";
import {
  calculateExpiryDate,
  getDaysUntilExpiry,
  formatExpiryDate,
  isExpired,
} from "src/hooks/useExpire.ts";
import {
  AuthRequest,
  CreateFarmequipmentBody,
} from "src/types/farmequipment.types.ts";

const selectUserBasic = {
  select: { username: true, email: true, phone: true, profileImage: true },
};

const selectUserMinimal = {
  select: { username: true, phone: true },
};

const CACHE_KEYS = {
  ADMIN_ALL: (page: number, limit: number) =>
    `tractors:admin:all:page:${page}:limit:${limit}`,
  PUBLIC_ALL: (page: number, limit: number) =>
    `tractors:public:all:page:${page}:limit:${limit}`,
  TOTAL: "tractors:total",
  DETAIL: (id: string) => `tractor:detail:${id}`,
};

const prepareTractorData = async (
  body: CreateFarmequipmentBody,
  userId: string,
) => {
  let expiryDate = null;
  if (body.planId && body.planAmount) {
    const plan = await prisma.subPlan.findUnique({
      where: { id: body.planId },
    });
    expiryDate = plan ? calculateExpiryDate(plan, body.planAmount) : null;
  }

  return {
    userId,
    title: body.title,
    description: body.description,
    mainCategory: body.mainCategory || "Farmequipment",
    category: Array.isArray(body.category)
      ? body.category
      : [body.category].filter(Boolean),
    subcategory: Array.isArray(body.subcategory)
      ? body.subcategory
      : [body.subcategory].filter(Boolean),
    region: body.region,
    city: body.city,
    make: body.make,
    farmequipmentModel: body.farmequipmentModel,
    type: body.type,
    condition: body.condition,
    enginePower: body.enginePower,
    fuelType: body.fuelType,
    price: Number(body.price),
    year: Number(body.year),
    hours: body.hours ? Number(body.hours) : 0,
    images: Array.isArray(body.images) ? body.images : [],
    isPaid: body.isPaid !== undefined ? Boolean(body.isPaid) : false,
    planId: body.planId || null,
    planAmount: body.planAmount || 0,
    expiryDate,
  };
};

export const createfarmequipment = async (req: AuthRequest, res: Response) => {
  try {
    const userId =
      req.body.userId || req.user?.id || req.user?._id || req.user?.sub;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User authentication required" });
    }

    const data = await prepareTractorData(req.body, userId);
    const newTractor = await prisma.farmequipment.create({
      data,
      include: { user: selectUserBasic },
    });

    await Promise.all([
      cacheManager.deletePattern("tractors:*:all"),
      cacheManager.delete(CACHE_KEYS.TOTAL),
    ]);

    if (newTractor.isPaid) {
      await notifyMatchingSubscribers("farmequipment", newTractor.id, {
        title: newTractor.title,
        price: newTractor.price,
        mainCategory: newTractor.mainCategory,
        region: newTractor.region,
        city: newTractor.city,
        brand: newTractor.make,
        model: newTractor.farmequipmentModel,
        posterId: newTractor.userId,
      });
    }

    return res.status(201).json({ success: true, data: newTractor });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Failed to create",
      error: error.message,
    });
  }
};

export const updateTractor = async (req: AuthRequest, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const oldTractor = await prisma.farmequipment.findUnique({
      where: { id },
      select: { isPaid: true },
    });

    let updatedTractor;
    if (Object.keys(req.body).length === 1 && req.body.isPaid !== undefined) {
      updatedTractor = await prisma.farmequipment.update({
        where: { id },
        data: { isPaid: req.body.isPaid },
        include: { user: selectUserBasic },
      });
    } else {
      const userId = req.body.userId || req.user?.id || req.user?._id;
      const data = await prepareTractorData(req.body, userId);

      let expiryDateToCheck: Date | null = data.expiryDate ?? null;
      if (expiryDateToCheck === null) {
        const current = await prisma.farmequipment.findUnique({
          where: { id },
          select: { expiryDate: true },
        });
        expiryDateToCheck = current?.expiryDate ?? null;
      }
      if (expiryDateToCheck && isExpired(expiryDateToCheck)) {
        data.isPaid = false;
      }

      updatedTractor = await prisma.farmequipment.update({
        where: { id },
        data,
        include: { user: selectUserBasic },
      });
    }

    if (!oldTractor?.isPaid && updatedTractor.isPaid) {
      await notifyMatchingSubscribers("farmequipment", updatedTractor.id, {
        title: updatedTractor.title,
        price: updatedTractor.price,
        mainCategory: updatedTractor.mainCategory,
        region: updatedTractor.region,
        city: updatedTractor.city,
        brand: updatedTractor.make,
        model: updatedTractor.farmequipmentModel,
        posterId: updatedTractor.userId,
      });
    }

    await Promise.all([
      cacheManager.delete(CACHE_KEYS.DETAIL(id)),
      cacheManager.deletePattern("tractors:*:all"),
    ]);

    return res.json({ success: true, data: updatedTractor });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Update failed",
      error: error.message,
    });
  }
};

export const deleteTractor = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    await prisma.farmequipment.delete({ where: { id } });

    await Promise.all([
      cacheManager.delete(CACHE_KEYS.DETAIL(id)),
      cacheManager.deletePattern("tractors:*:all"),
      cacheManager.delete(CACHE_KEYS.TOTAL),
    ]);

    return res.json({ success: true, message: "Tractor deleted successfully" });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Delete failed",
      error: error.message,
    });
  }
};

export const getAllTractorsIncludingUnpaid = async (
  req: Request,
  res: Response,
) => {
  try {
    const { page, limit, skip } = getPaginationParams(
      req.query.page as string,
      req.query.pageSize as string,
    );

    const cacheKey = CACHE_KEYS.ADMIN_ALL(page, limit);
    const tractors = await cacheManager.withCache(
      cacheKey,
      async () => {
        const items = await prisma.farmequipment.findMany({
          include: { user: selectUserMinimal },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        });

        return items.map((item) => ({
          ...item,
          isExpired: isExpired(item.expiryDate),
          daysUntilExpiry: getDaysUntilExpiry(item.expiryDate),
          formattedExpiry: formatExpiryDate(item.expiryDate),
        }));
      },
      CACHE_TTL.LIST,
    );

    return res.json(tractors);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error fetching all", error: error.message });
  }
};

export const getTotalTractors = async (_req: Request, res: Response) => {
  try {
    const total = await cacheManager.withCache(
      CACHE_KEYS.TOTAL,
      async () => await prisma.farmequipment.count(),
      CACHE_TTL.STATS,
    );
    return res.json({ totalTractors: total });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error getting total", error: error.message });
  }
};

export const getAllTractors = async (req: Request, res: Response) => {
  try {
    const { page, limit, skip } = getPaginationParams(
      req.query.page as string,
      req.query.pageSize as string,
    );

    const cacheKey = CACHE_KEYS.PUBLIC_ALL(page, limit);
    const tractors = await cacheManager.withCache(
      cacheKey,
      async () => {
        const items = await prisma.farmequipment.findMany({
          where: { isPaid: true },
          select: {
            id: true,
            title: true,
            price: true,
            region: true,
            city: true,
            images: true,
            createdAt: true,
            expiryDate: true,
            isPaid: true,
            user: selectUserMinimal,
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        });

        return items.map((item) => ({
          ...item,
          isExpired: isExpired(item.expiryDate),
          status: isExpired(item.expiryDate) ? "expired" : "active",
        }));
      },
      CACHE_TTL.LIST,
    );

    return res.json(tractors);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error fetching public", error: error.message });
  }
};

export const getTractorById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const cacheKey = CACHE_KEYS.DETAIL(id);

    const tractor = await cacheManager.withCache(
      cacheKey,
      async () => {
        const item = await prisma.farmequipment.findUnique({
          where: { id },
          include: { user: selectUserBasic },
        });

        if (!item) return null;

        return {
          ...item,
          isExpired: isExpired(item.expiryDate),
          daysUntilExpiry: getDaysUntilExpiry(item.expiryDate),
          formattedExpiry: formatExpiryDate(item.expiryDate),
          status: isExpired(item.expiryDate)
            ? "expired"
            : item.isPaid
              ? "active"
              : "pending",
        };
      },
      CACHE_TTL.DETAIL,
    );

    if (!tractor) {
      return res.status(404).json({ message: "Tractor not found" });
    }

    return res.json(tractor);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error fetching detail", error: error.message });
  }
};

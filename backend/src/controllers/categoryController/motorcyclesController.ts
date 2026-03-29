import { Request, Response } from "express";
import prisma from "../../core/utils/db.ts";
import { Prisma } from "@prisma/client";
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
import cacheManager from "src/services/redisserver/cacheManager.ts";

const selectUserBasic = {
  select: { username: true, email: true, phone: true, profileImage: true },
};

const selectUserMinimal = {
  select: { username: true },
};

const CACHE_KEYS = {
  TOTAL: "motorcycles:total",
  UNFILTERED: "motorcycles:all:unfiltered",
  ALL_PAID: (page: number, limit: number, type?: string, region?: string) =>
    `motorcycles:paid:${page}:${limit}:${type || "all"}:${region || "all"}`,
  DETAIL: (id: string) => `motorcycle:detail:${id}`,
};

export const getTotalMotorcycles = async (_req: Request, res: Response) => {
  try {
    const total = await cacheManager.withCache(
      CACHE_KEYS.TOTAL,
      async () => await prisma.motorcycle.count({}),
      CACHE_TTL.STATS,
    );
    return res.json({ totalMotorcycles: total });
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

export const getAllMotorcyclesIncludingUnpaid = async (
  _req: Request,
  res: Response,
) => {
  try {
    const motorcycles = await cacheManager.withCache(
      CACHE_KEYS.UNFILTERED,
      async () => {
        return await prisma.motorcycle.findMany({
          include: { user: selectUserBasic },
          orderBy: { createdAt: "desc" },
          take: 100,
        });
      },
      CACHE_TTL.LIST,
    );
    return res.json(motorcycles);
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

export const getAllMotorcycles = async (req: Request, res: Response) => {
  try {
    const { page, limit, skip } = getPaginationParams(
      req.query.page as string,
      req.query.pageSize as string,
    );
    const { type, region, city } = req.query;

    const cacheKey = CACHE_KEYS.ALL_PAID(
      page,
      limit,
      type as string,
      region as string,
    );

    const motorcycles = await cacheManager.withCache(
      cacheKey,
      async () => {
        const filter: Prisma.MotorcycleWhereInput = {
          isPaid: true,
          OR: [{ expiryDate: null }, { expiryDate: { gt: new Date() } }],
        };
        if (type) filter.type = { contains: String(type), mode: "insensitive" };
        if (region) filter.region = String(region);
        if (city) filter.city = String(city);

        return await prisma.motorcycle.findMany({
          where: filter,
          include: { user: selectUserMinimal },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        });
      },
      CACHE_TTL.LIST,
    );

    const motorcyclesWithStatus = motorcycles.map((item) => ({
      ...item,
      isExpired: isExpired(item.expiryDate),
      status: isExpired(item.expiryDate)
        ? "expired"
        : item.isPaid
          ? "active"
          : "pending",
    }));

    return res.json(motorcyclesWithStatus);
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

export const getMotorcycleById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const cacheKey = CACHE_KEYS.DETAIL(id);

    const motorcycle = await cacheManager.withCache(
      cacheKey,
      async () => {
        return await prisma.motorcycle.findUnique({
          where: { id },
          include: { user: selectUserBasic },
        });
      },
      CACHE_TTL.DETAIL,
    );

    if (!motorcycle)
      return res.status(404).json({ message: "Motorcycle not found" });

    const expired = isExpired(motorcycle.expiryDate);
    return res.json({
      ...motorcycle,
      isExpired: expired,
      status: expired ? "expired" : motorcycle.isPaid ? "active" : "pending",
      daysUntilExpiry: getDaysUntilExpiry(motorcycle.expiryDate),
      formattedExpiry: formatExpiryDate(motorcycle.expiryDate),
    });
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

export const createMotorcycle = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      title,
      description,
      price,
      mainCategory,
      category,
      subcategory,
      region,
      city,
      images,
      so,
      planId,
      planAmount,
      ...extra
    } = req.body;

    if (!userId) return res.status(400).json({ message: "userId is required" });

    let expiryDate = null;
    if (planId && planAmount) {
      const plan = await prisma.subPlan.findUnique({ where: { id: planId } });
      expiryDate = plan ? calculateExpiryDate(plan, planAmount) : null;
    }

    const newAd = await prisma.motorcycle.create({
      data: {
        userId,
        title,
        description,
        price: parseFloat(price) || 0,
        mainCategory: mainCategory || "Motorcycles",
        category: Array.isArray(category)
          ? category
          : [category].filter(Boolean),
        subcategory: Array.isArray(subcategory)
          ? subcategory
          : [subcategory].filter(Boolean),
        region,
        city,
        images: Array.isArray(images) ? images : [],
        so,
        isPaid: false,
        maGaday: false,
        planId: planId || null,
        planAmount: planAmount || 0,
        expiryDate,
        type: extra.type || "Other",
        make: extra.make || "N/A",
        modelName: extra.modelName || "N/A",
        year: parseInt(extra.year) || 0,
        mileage: parseInt(extra.mileage) || 0,
        engineSize: extra.engineSize || "N/A",
        fuelType: extra.fuelType || "Petrol",
        color: extra.color || "N/A",
        transmission: extra.transmission || "Manual",
      },
    });

    await Promise.all([
      cacheManager.deletePattern("motorcycles:all:*"),
      cacheManager.delete(CACHE_KEYS.TOTAL),
    ]);

    return res.status(201).json(newAd);
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: "Failed to create", error: err.message });
  }
};

export const updateMotorcyclePayment = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { paymentId, planId } = req.body;

    const motorcycle = await prisma.motorcycle.findUnique({ where: { id } });
    if (!motorcycle) {
      return res
        .status(404)
        .json({ success: false, message: "Motorcycle not found" });
    }

    const subPlan = await prisma.subPlan.findFirst({
      where: { isActive: true },
    });
    const expiryDate =
      planId && subPlan && motorcycle.planAmount
        ? calculateExpiryDate(subPlan, motorcycle.planAmount)
        : null;

    const updatedMotorcycle = await prisma.motorcycle.update({
      where: { id },
      data: {
        isPaid: true,
        expiryDate,
        planId: planId || motorcycle.planId,
      },
    });

    if (paymentId) {
      await prisma.payment.updateMany({
        where: { id: paymentId },
        data: { motorcycleId: id, status: "COMPLETED", paidAt: new Date() },
      });
    }

    await Promise.all([
      cacheManager.delete(CACHE_KEYS.DETAIL(id)),
      cacheManager.deletePattern("motorcycles:all:*"),
    ]);

    return res.json({ success: true, data: updatedMotorcycle });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateMotorcycle = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { planId, planAmount, category, subcategory, extra, ...rest } =
      req.body;

    const updateData: any = { ...rest };

    if (category) {
      updateData.category = Array.isArray(category) ? category[0] : category;
    }
    if (subcategory) {
      updateData.subcategory = Array.isArray(subcategory)
        ? subcategory[0]
        : subcategory;
    }

    if (planId && planAmount) {
      const plan = await prisma.subPlan.findUnique({ where: { id: planId } });
      updateData.expiryDate = plan
        ? calculateExpiryDate(plan, planAmount)
        : null;
      updateData.planId = planId;
      updateData.planAmount = planAmount;
    }

    if (extra) {
      if (extra.year) updateData.year = parseInt(extra.year);
      if (extra.mileage) updateData.mileage = parseInt(extra.mileage);
      if (extra.make) updateData.make = extra.make;
      if (extra.modelName) updateData.modelName = extra.modelName;
      if (extra.type) updateData.type = extra.type;
      if (extra.engineSize) updateData.engineSize = extra.engineSize;
      if (extra.fuelType) updateData.fuelType = extra.fuelType;
      if (extra.color) updateData.color = extra.color;
      if (extra.transmission) updateData.transmission = extra.transmission;
    }

    const updated = await prisma.motorcycle.update({
      where: { id },
      data: updateData,
    });

    await Promise.all([
      cacheManager.delete(CACHE_KEYS.DETAIL(id)),
      cacheManager.deletePattern("motorcycles:all:*"),
    ]);

    return res.json(updated);
  } catch (error) {
    const err = error as Error;
    return res
      .status(400)
      .json({ message: "Update failed", error: err.message });
  }
};

export const deleteMotorcycle = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    await prisma.motorcycle.delete({ where: { id } });

    await Promise.all([
      cacheManager.delete(CACHE_KEYS.DETAIL(id)),
      cacheManager.deletePattern("motorcycles:all:*"),
      cacheManager.delete(CACHE_KEYS.TOTAL),
    ]);

    return res.json({ message: "Motorcycle deleted successfully" });
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

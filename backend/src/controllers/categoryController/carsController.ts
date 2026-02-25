import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import cacheManager from "src/services/redisserver/cacheManager.ts";
import { CACHE_TTL, getPaginationParams } from "src/config/contstanst.ts";
import prisma from "src/core/utils/db.ts";
import {
  calculateExpiryDate,
  formatExpiryDate,
  getDaysUntilExpiry,
  getDefaultExpiryDate,
  isExpired,
} from "src/hooks/useExpire.ts";

interface CarQuery {
  type?: string;
  listingType?: string;
  region?: string;
  city?: string;
  district?: string;
  subcategory?: string;
  category?: string;
}

interface CreateCarBody {
  userId: string;
  title: string;
  description: string;
  price: number;
  mainCategory: string;
  category: string[];
  subcategory: string[];
  brand: string;
  vehicleModel: string;
  year?: number;
  mileage?: number;
  transmission?: string;
  fuelType?: string;
  color: string;
  region: string;
  city: string;
  images: string[];
  so?: string;
  isPaid?: boolean;
  planId?: string;
  planAmount?: number;
  feeId?: string;
  feeAmount?: number;
}

interface PaymentUpdateBody {
  paymentId?: string;
  planId?: string;
}

const CACHE_KEYS = {
  TOTAL: "cars:total",
  UNFILTERED: "cars:all:unfiltered",
  PAID_PREFIX: "cars:all:paid",
  DETAIL_PREFIX: "car:detail",
};

const selectUserBasic = {
  select: { username: true, email: true, phone: true, profileImage: true },
};

const selectUserMinimal = {
  select: { username: true },
};

export const getTotalCars = async (_req: Request, res: Response) => {
  try {
    const total = await cacheManager.withCache(
      CACHE_KEYS.TOTAL,
      async () => await prisma.car.count({}),
      CACHE_TTL.STATS,
    );
    return res.json({ totalCars: total });
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

export const getAllCarsIncludingUnpaid = async (
  _req: Request,
  res: Response,
) => {
  try {
    const cars = await cacheManager.withCache(
      CACHE_KEYS.UNFILTERED,
      async () => {
        return await prisma.car.findMany({
          include: { user: selectUserBasic },
          orderBy: { createdAt: "desc" },
          take: 100,
        });
      },
      CACHE_TTL.LIST,
    );
    return res.json(cars);
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

export const getAllCars = async (req: Request, res: Response) => {
  try {
    const { page, limit, skip } = getPaginationParams(
      req.query.page as string,
      req.query.pageSize as string,
    );

    const { type, listingType, region, city, subcategory, category } =
      req.query as CarQuery;
    const cacheKey = `${CACHE_KEYS.PAID_PREFIX}:page:${page}:limit:${limit}:type:${type || "all"}:listingType:${listingType || "all"}:region:${region || "all"}:city:${city || "all"}:category:${category || "all"}`;

    const cars = await cacheManager.withCache(
      cacheKey,
      async () => {
        const filter: Prisma.CarWhereInput = { isPaid: true };

        if (type) filter.title = { contains: type, mode: "insensitive" };
        if (region) filter.region = region;
        if (city) filter.city = city;
        if (subcategory) filter.subcategory = { has: subcategory };
        if (category) filter.category = { has: category };

        return await prisma.car.findMany({
          where: filter,
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
      },
      CACHE_TTL.LIST,
    );

    const carsWithStatus = cars.map((car) => ({
      ...car,
      isExpired: isExpired(car.expiryDate),
      status: isExpired(car.expiryDate)
        ? "expired"
        : car.isPaid
          ? "active"
          : "pending",
    }));

    return res.json(carsWithStatus);
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

export const getCarById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const cacheKey = `${CACHE_KEYS.DETAIL_PREFIX}:${id}`;

    const car = await cacheManager.withCache(
      cacheKey,
      async () => {
        return await prisma.car.findUnique({
          where: { id },
          include: { user: selectUserBasic },
        });
      },
      CACHE_TTL.DETAIL,
    );

    if (!car) return res.status(404).json({ message: "Car not found" });

    const expired = isExpired(car.expiryDate);
    return res.json({
      ...car,
      isExpired: expired,
      status: expired ? "expired" : car.isPaid ? "active" : "pending",
      daysUntilExpiry: getDaysUntilExpiry(car.expiryDate),
      formattedExpiry: formatExpiryDate(car.expiryDate),
    });
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

export const createCar = async (
  req: Request<{}, {}, CreateCarBody>,
  res: Response,
) => {
  try {
    const {
      userId,
      title,
      description,
      price,
      mainCategory,
      category,
      subcategory,
      brand,
      vehicleModel,
      year,
      mileage,
      transmission,
      fuelType,
      color,
      region,
      city,
      images,
      so,
      isPaid,
      planId,
      planAmount,
      feeId,
      feeAmount,
    } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId in request." });
    }

    const expiryDate =
      planId && planAmount ? calculateExpiryDate(planId, planAmount) : null;

    const newCar = await prisma.car.create({
      data: {
        userId,
        title,
        description,
        price,
        mainCategory,
        category: Array.isArray(category) ? category : [],
        subcategory: Array.isArray(subcategory) ? subcategory : [],
        brand,
        vehicleModel,
        year: year || null,
        mileage: mileage || null,
        transmission: transmission || null,
        fuelType: fuelType || null,
        color,
        region,
        city,
        images: Array.isArray(images) ? images : [],
        so: so || null,
        isPaid: typeof isPaid === "boolean" ? isPaid : false,
        planId: planId || null,
        planAmount: planAmount || 0,
        feeId: feeId || null,
        feeAmount: feeAmount || 0,
        expiryDate,
        maGaday: false,
      },
      include: { user: selectUserBasic },
    });

    await Promise.all([
      cacheManager.deletePattern("cars:all:*"),
      cacheManager.delete(CACHE_KEYS.TOTAL),
    ]);

    return res.status(201).json(newCar);
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: "Failed to create car listing", error: err.message });
  }
};

export const updateCarPayment = async (
  req: Request<{ id: string }, {}, PaymentUpdateBody>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const { paymentId, planId } = req.body;

    const car = await prisma.car.findUnique({ where: { id } });
    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    const expiryDate = planId
      ? calculateExpiryDate(planId, car.planAmount || 0)
      : getDefaultExpiryDate();

    const updatedCar = await prisma.car.update({
      where: { id },
      data: {
        isPaid: true,
        expiryDate,
        planId: planId || car.planId,
      },
    });

    if (paymentId) {
      await prisma.payment.updateMany({
        where: { id: paymentId },
        data: { carId: id, status: "COMPLETED", paidAt: new Date() },
      });
    }

    await Promise.all([
      cacheManager.delete(`${CACHE_KEYS.DETAIL_PREFIX}:${id}`),
      cacheManager.deletePattern("cars:all:*"),
    ]);

    return res.json({ success: true, data: updatedCar });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateCar = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const updateData = { ...req.body } as Prisma.CarUpdateInput;

    const updatedCar = await prisma.car.update({
      where: { id },
      data: updateData,
      include: { user: selectUserBasic },
    });

    await Promise.all([
      cacheManager.delete(`${CACHE_KEYS.DETAIL_PREFIX}:${id}`),
      cacheManager.deletePattern("cars:all:*"),
    ]);

    return res.json(updatedCar);
  } catch (error) {
    const err = error as Prisma.PrismaClientKnownRequestError;
    if (err.code === "P2025")
      return res.status(404).json({ message: "Car not found" });
    return res
      .status(400)
      .json({ message: "Update failed", error: err.message });
  }
};

export const deleteCar = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") {
      return res.status(400).json({ message: "Invalid ID" });
    }

    await prisma.car.delete({ where: { id } });

    await Promise.all([
      cacheManager.delete(`${CACHE_KEYS.DETAIL_PREFIX}:${id}`),
      cacheManager.deletePattern("cars:all:*"),
      cacheManager.delete(CACHE_KEYS.TOTAL),
    ]);

    return res.json({ message: "Car deleted successfully" });
  } catch (error) {
    const err = error as Prisma.PrismaClientKnownRequestError;
    if (err.code === "P2025")
      return res.status(404).json({ message: "Car not found" });
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

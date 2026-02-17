import { Request, Response } from "express";
import prisma from "../../core/utils/db.ts";
import { v4 as uuidv4 } from "uuid";
import { triggerSubscriptionWatch } from "../userController/subscriptionController.ts";
import { Prisma } from "@prisma/client";
import cacheManager from "src/services/redisserver/cacheManager.ts";

interface CarQuery {
  type?: string;
  listingType?: string;
  region?: string;
  city?: string;
  district?: string;
  subcategory?: string;
  category?: string;
}

export const getTotalCars = async (_req: Request, res: Response) => {
  try {
    const total = await cacheManager.withCache(
      "cars:total",
      async () => {
        return await prisma.car.count({});
      },
      600,
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
      "cars:all:unfiltered",
      async () => {
        return await prisma.car.findMany({
          include: {
            user: {
              select: {
                username: true,
                email: true,
                phone: true,
                profileImage: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        });
      },
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
    const { type, listingType, region, city, subcategory, category } =
      req.query as CarQuery;
    const cacheKey = `cars:all:paid:${type || "all"}:${listingType || "all"}:${region || "all"}:${city || "all"}:${category || "all"}`;

    const cars = await cacheManager.withCache(cacheKey, async () => {
      const filter: Prisma.CarWhereInput = { isPaid: true };
      if (type) filter.title = { contains: type, mode: "insensitive" };
      if (region) filter.region = region;
      if (city) filter.city = city;
      if (subcategory) filter.subcategory = { has: subcategory };
      if (category) filter.category = { has: category };

      return await prisma.car.findMany({
        where: filter,
        include: {
          user: {
            select: {
              username: true,
              email: true,
              phone: true,
              profileImage: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    });

    return res.json(cars);
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
    const car = await cacheManager.withCache(`car:detail:${id}`, async () => {
      return await prisma.car.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              username: true,
              email: true,
              phone: true,
              profileImage: true,
            },
          },
        },
      });
    });

    if (!car) return res.status(404).json({ message: "Car not found" });
    return res.json(car);
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

export const createCar = async (req: Request, res: Response) => {
  try {
    const carData = {
      ...req.body,
      category: Array.isArray(req.body.category)
        ? req.body.category
        : [req.body.category].filter(Boolean),
      subcategory: Array.isArray(req.body.subcategory)
        ? req.body.subcategory
        : [req.body.subcategory].filter(Boolean),
      images: Array.isArray(req.body.images) ? req.body.images : [],
    };

    if (!carData.id) carData.id = uuidv4();
    const userId = carData.userId;
    if (!userId)
      return res.status(400).json({ message: "Missing userId in request." });

    const subscription = await prisma.subscription.findFirst({
      where: { userId },
    });
    if (!subscription)
      return res.status(403).json({ message: "Subscription required." });

    const newCar = await prisma.car.create({
      data: { ...carData, isPaid: false },
      include: {
        user: {
          select: {
            username: true,
            email: true,
            phone: true,
            profileImage: true,
          },
        },
      },
    });

    await Promise.all([
      cacheManager.deletePattern("cars:all:*"),
      cacheManager.delete("cars:total"),
    ]);

    await triggerSubscriptionWatch("car", newCar.id);
    return res.status(201).json(newCar);
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: "Failed to create car listing", error: err.message });
  }
};

export const updateCar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedCar = await prisma.car.update({
      where: { id },
      data: req.body,
      include: {
        user: {
          select: {
            username: true,
            email: true,
            phone: true,
            profileImage: true,
          },
        },
      },
    });

    await Promise.all([
      cacheManager.delete(`car:detail:${id}`),
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

export const deleteCar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.car.delete({ where: { id } });

    await Promise.all([
      cacheManager.delete(`car:detail:${id}`),
      cacheManager.deletePattern("cars:all:*"),
      cacheManager.delete("cars:total"),
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

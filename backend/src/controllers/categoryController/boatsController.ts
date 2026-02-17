import { Request, Response } from "express";
import { triggerSubscriptionWatch } from "../userController/subscriptionController.ts";
import { prisma } from "../../core/utils/db.ts";
import { Prisma } from "@prisma/client";
import cacheManager from "src/services/redisserver/cacheManager.ts";

interface BoatQuery {
  type?: string;
  listingType?: string;
  region?: string;
  city?: string;
  district?: string;
  subCategory?: string;
  category?: string;
}

export const getTotalBoats = async (_req: Request, res: Response) => {
  try {
    const total = await cacheManager.withCache(
      "boats:total",
      async () => {
        return await prisma.boat.count({});
      },
      600,
    );
    return res.json({ totalBoats: total });
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

export const getAllBoatsIncludingUnpaid = async (
  _req: Request,
  res: Response,
) => {
  try {
    const boats = await cacheManager.withCache(
      "boats:all:unfiltered",
      async () => {
        return await prisma.boat.findMany({
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
    return res.json(boats);
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

export const getAllBoats = async (req: Request, res: Response) => {
  try {
    const { type, listingType, region, city, subCategory, category } =
      req.query as BoatQuery;
    const cacheKey = `boats:all:paid:${type || "all"}:${listingType || "all"}:${region || "all"}:${city || "all"}:${category || "all"}`;

    const boats = await cacheManager.withCache(cacheKey, async () => {
      const filter: Prisma.BoatWhereInput = { isPaid: true };
      if (type) filter.type = type;
      if (region) filter.region = region;
      if (city) filter.city = city;
      if (subCategory) filter.subcategory = { has: subCategory };
      if (category) filter.category = { has: category };

      return await prisma.boat.findMany({
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

    return res.json(boats);
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

export const getBoatById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const boat = await cacheManager.withCache(`boat:detail:${id}`, async () => {
      return await prisma.boat.findUnique({
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

    if (!boat) return res.status(404).json({ message: "Boat not found" });
    return res.json(boat);
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

export const createBoat = async (req: Request, res: Response) => {
  try {
    const { userId, ...boatData } = req.body;
    if (!userId) return res.status(400).json({ message: "User ID required" });

    const newBoat = await prisma.boat.create({
      data: {
        ...boatData,
        userId,
        category: Array.isArray(boatData.category)
          ? boatData.category
          : [boatData.category].filter(Boolean),
        subcategory: Array.isArray(boatData.subcategory)
          ? boatData.subcategory
          : [boatData.subcategory].filter(Boolean),
        images: Array.isArray(boatData.images) ? boatData.images : [],
        price: Number(boatData.price) || 0,
        type: boatData.type || "boat",
        isPaid: false,
      },
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
      cacheManager.deletePattern("boats:all:*"),
      cacheManager.delete("boats:total"),
    ]);

    triggerSubscriptionWatch("boat", newBoat.id).catch((e) => {
      console.error("Subscription watch error:", e);
    });
    return res.status(201).json(newBoat);
  } catch (error) {
    const err = error as Error;
    return res
      .status(400)
      .json({ message: "Invalid data", error: err.message });
  }
};

export const updateBoat = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedBoat = await prisma.boat.update({
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
      cacheManager.delete(`boat:detail:${id}`),
      cacheManager.deletePattern("boats:all:*"),
      cacheManager.delete("boats:total"),
    ]);

    return res.json(updatedBoat);
  } catch (error) {
    const err = error as Prisma.PrismaClientKnownRequestError;
    if (err.code === "P2025")
      return res.status(404).json({ message: "Boat not found" });
    return res
      .status(400)
      .json({ message: "Update failed", error: err.message });
  }
};

export const deleteBoat = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.boat.delete({ where: { id } });

    await Promise.all([
      cacheManager.delete(`boat:detail:${id}`),
      cacheManager.deletePattern("boats:all:*"),
      cacheManager.delete("boats:total"),
    ]);

    return res.json({ message: "Boat deleted successfully" });
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

import { Request, Response } from "express";
import prisma from "../../core/utils/db.ts";
import { triggerSubscriptionWatch } from "../userController/subscriptionController.ts";
import { Prisma } from "@prisma/client";
import cacheManager from "src/services/redisserver/cacheManager.ts";

export const getAllMotorcyclesIncludingUnpaid = async (
  _req: Request,
  res: Response,
) => {
  try {
    const items = await cacheManager.withCache(
      "motorcycles:all:unfiltered",
      async () => {
        return await prisma.motorcycle.findMany({
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
    return res.json(items);
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

export const getTotalMotorcycles = async (_req: Request, res: Response) => {
  try {
    const total = await cacheManager.withCache(
      "motorcycles:total",
      async () => {
        return await prisma.motorcycle.count();
      },
      600,
    );
    return res.json({ totalMotorcycles: total });
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

export const getAllMotorcycles = async (_req: Request, res: Response) => {
  try {
    const motorcycles = await cacheManager.withCache(
      "motorcycles:all:paid",
      async () => {
        return await prisma.motorcycle.findMany({
          where: { isPaid: true },
          include: {
            user: { select: { username: true, email: true, phone: true } },
          },
        });
      },
    );
    return res.json(motorcycles);
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

export const getMotorcycleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const motorcycle = await cacheManager.withCache(
      `motorcycle:detail:${id}`,
      async () => {
        return await prisma.motorcycle.findUnique({
          where: { id },
          include: {
            user: { select: { username: true, email: true, phone: true } },
          },
        });
      },
    );

    if (!motorcycle)
      return res.status(404).json({ message: "Motorcycle not found" });
    return res.json(motorcycle);
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

export const createMotorcycle = async (req: Request, res: Response) => {
  try {
    const data = {
      ...req.body,
      category: Array.isArray(req.body.category)
        ? req.body.category
        : [req.body.category].filter(Boolean),
      subcategory: Array.isArray(req.body.subcategory)
        ? req.body.subcategory
        : [req.body.subcategory].filter(Boolean),
      images: Array.isArray(req.body.images) ? req.body.images : [],
    };

    const newMotorcycle = await prisma.motorcycle.create({
      data,
      include: {
        user: { select: { username: true, email: true, phone: true } },
      },
    });

    await Promise.all([
      cacheManager.deletePattern("motorcycles:all:*"),
      cacheManager.delete("motorcycles:total"),
    ]);

    await triggerSubscriptionWatch("motorcycle", newMotorcycle.id);

    return res.status(201).json(newMotorcycle);
  } catch (error) {
    const err = error as Error;
    return res
      .status(400)
      .json({ message: "Invalid data", error: err.message });
  }
};

export const updateMotorcycle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedMotorcycle = await prisma.motorcycle.update({
      where: { id },
      data: req.body,
      include: {
        user: { select: { username: true, email: true, phone: true } },
      },
    });

    await Promise.all([
      cacheManager.delete(`motorcycle:detail:${id}`),
      cacheManager.deletePattern("motorcycles:all:*"),
    ]);

    return res.json(updatedMotorcycle);
  } catch (error) {
    const err = error as Prisma.PrismaClientKnownRequestError;
    if (err.code === "P2025")
      return res.status(404).json({ message: "Motorcycle not found" });
    return res
      .status(400)
      .json({ message: "Update failed", error: err.message });
  }
};

export const deleteMotorcycle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.motorcycle.delete({ where: { id } });

    await Promise.all([
      cacheManager.delete(`motorcycle:detail:${id}`),
      cacheManager.deletePattern("motorcycles:all:*"),
      cacheManager.delete("motorcycles:total"),
    ]);

    return res.json({ message: "Motorcycle deleted successfully" });
  } catch (error) {
    const err = error as Prisma.PrismaClientKnownRequestError;
    if (err.code === "P2025")
      return res.status(404).json({ message: "Motorcycle not found" });
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

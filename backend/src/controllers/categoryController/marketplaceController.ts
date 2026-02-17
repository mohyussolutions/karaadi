import { Request, Response } from "express";
import prisma from "../../core/utils/db.ts";
import { triggerSubscriptionWatch } from "../userController/subscriptionController.ts";
import { Prisma } from "@prisma/client";
import cacheManager from "src/services/redisserver/cacheManager.ts";

export const getAllMarketplaceItemsAdmin = async (
  _req: Request,
  res: Response,
) => {
  try {
    const items = await cacheManager.withCache(
      "marketplace:admin:all",
      async () => {
        return await prisma.marketplace.findMany({
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

export const getTotalMarketplaceItems = async (
  _req: Request,
  res: Response,
) => {
  try {
    const total = await cacheManager.withCache(
      "marketplace:total:all",
      async () => {
        return await prisma.marketplace.count({});
      },
      600,
    );
    return res.json({ totalMarketplaceItems: total });
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

export const getPaidTotalMarketplaceItems = async (
  _req: Request,
  res: Response,
) => {
  try {
    const total = await cacheManager.withCache(
      "marketplace:total:paid",
      async () => {
        return await prisma.marketplace.count({ where: { isPaid: true } });
      },
      600,
    );
    return res.json({ paidTotalMarketplaceItems: total });
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

export const getUnpaidTotalMarketplaceItems = async (
  _req: Request,
  res: Response,
) => {
  try {
    const total = await cacheManager.withCache(
      "marketplace:total:unpaid",
      async () => {
        return await prisma.marketplace.count({ where: { isPaid: false } });
      },
      600,
    );
    return res.json({ unpaidTotalMarketplaceItems: total });
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

export const getAllMarketplaceItems = async (_req: Request, res: Response) => {
  try {
    const items = await cacheManager.withCache(
      "marketplace:public:all",
      async () => {
        return await prisma.marketplace.findMany({
          where: { isPaid: true },
          include: {
            user: { select: { username: true, email: true, phone: true } },
          },
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

export const getMarketplaceItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await cacheManager.withCache(
      `marketplace:item:${id}`,
      async () => {
        return await prisma.marketplace.findUnique({
          where: { id },
          include: {
            user: { select: { username: true, email: true, phone: true } },
          },
        });
      },
    );
    if (!item) return res.status(404).json({ message: "Item not found" });
    return res.json(item);
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

export const createMarketplaceItem = async (req: Request, res: Response) => {
  try {
    const { listingType, ...marketplaceData } = req.body;
    const newItem = await prisma.marketplace.create({
      data: { ...marketplaceData, isPaid: false },
      include: {
        user: { select: { username: true, email: true, phone: true } },
      },
    });

    await Promise.all([
      cacheManager.deletePattern("marketplace:total:*"),
      cacheManager.delete("marketplace:admin:all"),
    ]);

    await triggerSubscriptionWatch("marketplace", newItem.id);
    return res.status(201).json(newItem);
  } catch (error) {
    const err = error as Prisma.PrismaClientKnownRequestError;
    if (err.code === "P2003") {
      return res.status(400).json({
        message: "Invalid User ID",
        error: "The provided userId does not exist.",
      });
    }
    return res
      .status(400)
      .json({ message: "Invalid data", error: err.message });
  }
};

export const updateMarketplaceItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedItem = await prisma.marketplace.update({
      where: { id },
      data: req.body,
      include: {
        user: { select: { username: true, email: true, phone: true } },
      },
    });

    await Promise.all([
      cacheManager.delete(`marketplace:item:${id}`),
      cacheManager.delete("marketplace:admin:all"),
      cacheManager.delete("marketplace:public:all"),
      cacheManager.deletePattern("marketplace:total:*"),
    ]);

    return res.json(updatedItem);
  } catch (error) {
    const err = error as Prisma.PrismaClientKnownRequestError;
    if (err.code === "P2025")
      return res.status(404).json({ message: "Item not found" });
    return res
      .status(400)
      .json({ message: "Update failed", error: err.message });
  }
};

export const deleteMarketplaceItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.marketplace.delete({ where: { id } });

    await Promise.all([
      cacheManager.delete(`marketplace:item:${id}`),
      cacheManager.delete("marketplace:admin:all"),
      cacheManager.delete("marketplace:public:all"),
      cacheManager.deletePattern("marketplace:total:*"),
    ]);

    return res.json({ message: "Item deleted successfully" });
  } catch (error) {
    const err = error as Error;
    return res
      .status(404)
      .json({ message: "Item not found", error: err.message });
  }
};

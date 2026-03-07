import { Request, Response } from "express";
import prisma from "../../core/utils/db.ts";
import { Prisma } from "@prisma/client";
import { CACHE_TTL, getPaginationParams } from "src/config/contstanst.ts";
import {
  calculateExpiryDate,
  getDaysUntilExpiry,
  formatExpiryDate,
  isExpired,
} from "src/hooks/useExpire.ts";
import cacheManager from "src/services/redisserver/cacheManager.ts";

const selectUserBasic = {
  select: {
    username: true,
    email: true,
    phone: true,
    profileImage: true,
  },
};

const CACHE_KEYS = {
  ALL_ADMIN: "marketplace:admin:all",
  TOTAL: "marketplace:total",
  PAID_TOTAL: "marketplace:paid:total",
  UNPAID_TOTAL: "marketplace:unpaid:total",
  ALL_PAID: (page: number, limit: number) =>
    `marketplace:paid:page:${page}:limit:${limit}`,
  DETAIL: (id: string) => `marketplace:detail:${id}`,
};

export const getAllMarketplaceItemsAdmin = async (
  _req: Request,
  res: Response,
) => {
  try {
    const items = await cacheManager.withCache(
      CACHE_KEYS.ALL_ADMIN,
      async () => {
        return await prisma.marketplace.findMany({
          include: { user: selectUserBasic, fee: true, plan: true },
          orderBy: { createdAt: "desc" },
          take: 100,
        });
      },
      CACHE_TTL.LIST,
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
      CACHE_KEYS.TOTAL,
      async () => await prisma.marketplace.count(),
      CACHE_TTL.STATS,
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
      CACHE_KEYS.PAID_TOTAL,
      async () => await prisma.marketplace.count({ where: { isPaid: true } }),
      CACHE_TTL.STATS,
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
      CACHE_KEYS.UNPAID_TOTAL,
      async () => await prisma.marketplace.count({ where: { isPaid: false } }),
      CACHE_TTL.STATS,
    );
    return res.json({ unpaidTotalMarketplaceItems: total });
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

export const getAllMarketplaceItems = async (req: Request, res: Response) => {
  try {
    const { page, limit, skip } = getPaginationParams(
      req.query.page as string,
      req.query.pageSize as string,
    );

    const cacheKey = CACHE_KEYS.ALL_PAID(page, limit);
    const items = await cacheManager.withCache(
      cacheKey,
      async () => {
        return await prisma.marketplace.findMany({
          where: { isPaid: true },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
            createdAt: true,
            expiryDate: true,
            isPaid: true,
          },
        });
      },
      CACHE_TTL.LIST,
    );

    const itemsWithStatus = items.map((item) => ({
      ...item,
      isExpired: isExpired(item.expiryDate),
      status: isExpired(item.expiryDate)
        ? "expired"
        : item.isPaid
          ? "active"
          : "pending",
    }));

    return res.json(itemsWithStatus);
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

export const getMarketplaceItemById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const cacheKey = CACHE_KEYS.DETAIL(id);

    const item = await cacheManager.withCache(
      cacheKey,
      async () => {
        return await prisma.marketplace.findUnique({
          where: { id },
          include: { user: selectUserBasic, fee: true, plan: true },
        });
      },
      CACHE_TTL.DETAIL,
    );

    if (!item) return res.status(404).json({ message: "Item not found" });

    const expired = isExpired(item.expiryDate);
    return res.json({
      ...item,
      isExpired: expired,
      status: expired ? "expired" : item.isPaid ? "active" : "pending",
      daysUntilExpiry: getDaysUntilExpiry(item.expiryDate),
      formattedExpiry: formatExpiryDate(item.expiryDate),
    });
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

export const createMarketplaceItem = async (req: Request, res: Response) => {
  try {
    const { planId, planAmount, ...marketplaceData } = req.body;

    const expiryDate =
      planId && planAmount ? calculateExpiryDate(planId, planAmount) : null;

    const newItem = await prisma.marketplace.create({
      data: {
        ...marketplaceData,
        isPaid: false,
        planId,
        planAmount: planAmount || 0,
        expiryDate,
      },
      include: { user: selectUserBasic },
    });

    // Fire-and-forget cache invalidation for speed
    Promise.all([
      cacheManager.deletePattern("marketplace:*"),
      cacheManager.delete(CACHE_KEYS.TOTAL),
      cacheManager.delete(CACHE_KEYS.PAID_TOTAL),
      cacheManager.delete(CACHE_KEYS.UNPAID_TOTAL),
    ]).catch(() => {});

    return res.status(201).json(newItem);
  } catch (error) {
    const err = error as Prisma.PrismaClientKnownRequestError;
    if (err.code === "P2003") {
      return res.status(400).json({
        message: "Invalid Reference ID",
        error: "User, Fee, or Plan ID provided does not exist.",
      });
    }
    return res
      .status(400)
      .json({ message: "Invalid data", error: err.message });
  }
};

export const updateMarketplaceItem = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { planId, planAmount, ...updateData } = req.body;

    if (planId && planAmount) {
      updateData.expiryDate = calculateExpiryDate(planId, planAmount);
    }

    const updatedItem = await prisma.marketplace.update({
      where: { id },
      data: {
        ...updateData,
        planId,
        planAmount: planAmount || 0,
      },
      include: { user: selectUserBasic },
    });

    await Promise.all([
      cacheManager.deletePattern("marketplace:*"),
      cacheManager.delete(CACHE_KEYS.DETAIL(id)),
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
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    await prisma.marketplace.delete({ where: { id } });

    await Promise.all([
      cacheManager.deletePattern("marketplace:*"),
      cacheManager.delete(CACHE_KEYS.DETAIL(id)),
    ]);

    return res.json({ message: "Item deleted successfully" });
  } catch (error) {
    const err = error as Error;
    return res
      .status(404)
      .json({ message: "Item not found", error: err.message });
  }
};

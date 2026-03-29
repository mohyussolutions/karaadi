import { Request, Response } from "express";
import prisma from "../../core/utils/db.ts";
import { Prisma } from "@prisma/client";
import cacheManager from "src/services/redisserver/cacheManager.ts";

import {
  CACHE_TTL,
  getPaginationParams,
} from "src/constants/config.constants.ts";
import { skip } from "@prisma/client/runtime/client";
import { AdQuery } from "src/types/advertisement.types.ts";

const selectUser = {
  select: { id: true, username: true, profileImage: true },
};

const getWhereClause = (position?: string): Prisma.AdvertisementWhereInput => ({
  isActive: true,
  AND: [
    { OR: [{ startDate: null }, { startDate: { lte: new Date() } }] },
    { OR: [{ endDate: null }, { endDate: { gte: new Date() } }] },
  ],
  ...(position && { position }),
});

export const getAllAdvertisements = async (req: Request, res: Response) => {
  try {
    const { position, page = "1", limit } = req.query as AdQuery;
    const {
      page: pageNum,
      limit: pageSize,
      skip,
    } = getPaginationParams(page, limit);
    const cacheKey = `ads:all:${position || "none"}:${pageSize}:${pageNum}`;

    const ads = await cacheManager.withCache(
      cacheKey,
      async () => {
        return await prisma.advertisement.findMany({
          where: getWhereClause(position),
          orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
          skip,
          take: pageSize,
          include: { user: selectUser },
        });
      },
      CACHE_TTL.LIST,
    );

    res.json(ads);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getTodayAdStats = async (_req: Request, res: Response) => {
  try {
    const stats = await cacheManager.withCache(
      "ads:stats:today",
      async () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const result = await prisma.advertisement.aggregate({
          where: { isActive: true, createdAt: { gte: today } },
          _sum: { views: true, clicks: true },
        });

        const views = result._sum.views || 0;
        const clicks = result._sum.clicks || 0;
        const ctr = views ? Number(((clicks / views) * 100).toFixed(2)) : 0;

        return { views, clicks, ctr };
      },
      CACHE_TTL.STATS,
    );

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getAdvertisementById = async (req: Request, res: Response) => {
  try {
    const adId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const cacheKey = `ad:detail:${adId}`;

    const ad = await cacheManager.withCache(
      cacheKey,
      async () => {
        return await prisma.advertisement.findUnique({
          where: { id: adId },
          include: { user: selectUser },
        });
      },
      CACHE_TTL.DETAIL,
    );

    if (!ad) return res.status(404).json({ error: "Advertisement not found" });

    prisma.advertisement
      .update({
        where: { id: adId },
        data: { views: { increment: 1 } },
      })
      .catch(() => {});

    res.json(ad);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const createAdvertisement = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      imageUrl,
      link,
      buttonText,
      position,
      priority,
      startDate,
      endDate,
      userId,
    } = req.body;

    if (!title || !description || !imageUrl || !link || !userId) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!userExists) return res.status(404).json({ error: "User not found" });

    const ad = await prisma.advertisement.create({
      data: {
        title,
        description,
        imageUrl,
        link,
        buttonText: buttonText || "Learn More",
        position: position || "general",
        priority: priority || 1,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        isActive: true,
        userId,
      },
    });

    await cacheManager.deletePattern("ads:all:*");
    res.status(201).json(ad);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateAdvertisement = async (req: Request, res: Response) => {
  try {
    const adId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const data: Prisma.AdvertisementUpdateInput = req.body;

    const ad = await prisma.advertisement.update({
      where: { id: adId },
      data: { ...data, updatedAt: new Date() },
    });

    await Promise.all([
      cacheManager.delete(`ad:detail:${adId}`),
      cacheManager.deletePattern("ads:all:*"),
    ]);

    res.json(ad);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteAdvertisement = async (req: Request, res: Response) => {
  try {
    const adId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    await prisma.advertisement.delete({ where: { id: adId } });

    await Promise.all([
      cacheManager.delete(`ad:detail:${adId}`),
      cacheManager.deletePattern("ads:all:*"),
    ]);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const incrementAdClicks = async (req: Request, res: Response) => {
  try {
    const adId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const ad = await prisma.advertisement.update({
      where: { id: adId },
      data: { clicks: { increment: 1 } },
      select: { clicks: true },
    });

    res.json({ success: true, clicks: ad.clicks });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getAdStats = async (_req: Request, res: Response) => {
  try {
    const [totalAds, activeAds, clicksAgg, viewsAgg] = await Promise.all([
      prisma.advertisement.count(),
      prisma.advertisement.count({ where: { isActive: true } }),
      prisma.advertisement.aggregate({ _sum: { clicks: true } }),
      prisma.advertisement.aggregate({ _sum: { views: true } }),
    ]);

    res.json({
      totalAds,
      activeAds,
      totalClicks: clicksAgg._sum.clicks || 0,
      totalViews: viewsAgg._sum.views || 0,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getUserAdvertisements = async (req: Request, res: Response) => {
  try {
    const userId = Array.isArray(req.params.userId)
      ? req.params.userId[0]
      : req.params.userId;
    const { page, limit, skip } = getPaginationParams(
      req.query.page as string,
      req.query.pageSize as string,
    );
    const cacheKey = `ads:user:${userId}:${page}:${limit}`;

    const ads = await cacheManager.withCache(
      cacheKey,
      async () => {
        return await prisma.advertisement.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
          include: { user: selectUser },
        });
      },
      CACHE_TTL.LIST,
    );

    res.json(ads);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

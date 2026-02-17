import { Request, Response } from "express";
import prisma from "../../core/utils/db.ts";
import { Prisma } from "@prisma/client";
import cacheManager from "src/services/redisserver/cacheManager.ts";

interface AdQuery {
  position?: string;
  limit?: string;
}

export const getAllAdvertisements = async (req: Request, res: Response) => {
  try {
    const { position, limit = "10" } = req.query as AdQuery;
    const cacheKey = `ads:all:${position || "none"}:limit:${limit}`;

    const ads = await cacheManager.withCache(cacheKey, async () => {
      const whereClause: Prisma.AdvertisementWhereInput = {
        isActive: true,
        AND: [
          { OR: [{ startDate: null }, { startDate: { lte: new Date() } }] },
          { OR: [{ endDate: null }, { endDate: { gte: new Date() } }] },
        ],
      };

      if (position) {
        whereClause.position = position;
      }

      return await prisma.advertisement.findMany({
        where: whereClause,
        orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
        take: parseInt(limit),
        include: {
          user: {
            select: { id: true, username: true, profileImage: true },
          },
        },
      });
    });

    res.json(ads);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const getTodayAdStats = async (_req: Request, res: Response) => {
  try {
    const stats = await cacheManager.withCache(
      "ads:stats:today",
      async () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const ads = await prisma.advertisement.findMany({
          where: { isActive: true, createdAt: { gte: today } },
          select: { views: true, clicks: true },
        });

        const totalViews = ads.reduce((sum, ad) => sum + ad.views, 0);
        const totalClicks = ads.reduce((sum, ad) => sum + ad.clicks, 0);
        const ctr = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;

        return {
          views: totalViews,
          clicks: totalClicks,
          ctr: parseFloat(ctr.toFixed(2)),
        };
      },
      300,
    );

    res.json(stats);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const getAdvertisementById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const ad = await cacheManager.withCache(`ad:detail:${id}`, async () => {
      return await prisma.advertisement.findUnique({
        where: { id },
        include: {
          user: {
            select: { id: true, username: true, profileImage: true },
          },
        },
      });
    });

    if (!ad) {
      return res.status(404).json({ error: "Advertisement not found" });
    }

    prisma.advertisement
      .update({
        where: { id },
        data: { views: { increment: 1 } },
      })
      .catch(() => {});

    res.json(ad);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
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

    const userExists = await prisma.user.findUnique({ where: { id: userId } });
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
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const updateAdvertisement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data: Prisma.AdvertisementUpdateInput = req.body;

    const ad = await prisma.advertisement.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });

    await cacheManager.invalidateAdvertisement(id);
    res.json(ad);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const deleteAdvertisement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.advertisement.delete({ where: { id } });
    await cacheManager.invalidateAdvertisement(id);
    res.json({ success: true });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const incrementAdClicks = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ad = await prisma.advertisement.update({
      where: { id },
      data: { clicks: { increment: 1 } },
    });
    res.json({ success: true, clicks: ad.clicks });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
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
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const getUserAdvertisements = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const ads = await prisma.advertisement.findMany({
      where: { userId },
      orderBy: [{ createdAt: "desc" }],
      include: {
        user: { select: { id: true, username: true, profileImage: true } },
      },
    });
    res.json(ads);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

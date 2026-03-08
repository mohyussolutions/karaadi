import { Request, Response } from "express";
import { CACHE_TTL } from "src/constants/config.constants.ts";
import prisma from "src/core/utils/db.ts";
import cacheManager from "src/services/redisserver/cacheManager.ts";

const CACHE_KEYS = {
  RECOMMENDATIONS: (userId: string, limit: number) =>
    userId
      ? `recommendations:user:${userId}:limit:${limit}`
      : `recommendations:global:limit:${limit}`,
  TOP_CATEGORIES: "stats:top:categories",
  CATEGORY_VIEWS: (category: string) => `stats:category:${category}:views`,
  USER_TOP_CATEGORIES: (userId: string) => `user:${userId}:top:categories`,
};

const recommendationService = {
  async getMostViewedCategories(limit: number = 5) {
    const categoryViews = await prisma.userView.groupBy({
      by: ["category"],
      _count: { category: true },
      orderBy: { _count: { category: "desc" } },
      take: limit,
    });

    return categoryViews.map((cv) => ({
      category: cv.category,
      views: cv._count.category,
    }));
  },

  async getUserTopCategories(userId: string, limit: number = 3) {
    const userCategoryViews = await prisma.userView.groupBy({
      by: ["category"],
      where: { userId },
      _count: { category: true },
      orderBy: { _count: { category: "desc" } },
      take: limit,
    });

    return userCategoryViews.map((ucv) => ({
      category: ucv.category,
      views: ucv._count.category,
    }));
  },

  async getMostClickedItems(limit: number = 10) {
    return await prisma.recommendation.findMany({
      where: { views: { gt: 0 } },
      orderBy: { views: "desc" },
      take: limit,
    });
  },

  async getCategoryClickThroughRate(category: string) {
    const totalViews = await prisma.userView.count({ where: { category } });
    const totalClicks = await prisma.recommendation.aggregate({
      where: { category },
      _sum: { views: true },
    });

    return {
      category,
      totalViews,
      totalClicks: totalClicks._sum.views || 0,
      ctr:
        totalViews > 0 ? ((totalClicks._sum.views || 0) / totalViews) * 100 : 0,
    };
  },

  async getTrendingCategories(hours: number = 24) {
    const timeThreshold = new Date(Date.now() - hours * 60 * 60 * 1000);
    const trendingCategories = await prisma.userView.groupBy({
      by: ["category"],
      where: { viewedAt: { gte: timeThreshold } },
      _count: { category: true },
      orderBy: { _count: { category: "desc" } },
      take: 5,
    });

    return trendingCategories.map((tc) => ({
      category: tc.category,
      views: tc._count.category,
      period: `${hours}h`,
    }));
  },

  async getHybridRecommendations(userId: string, limit: number) {
    const userViews = await prisma.userView.findMany({
      where: { userId },
      orderBy: { viewedAt: "desc" },
      take: 50,
      select: { category: true, itemId: true },
    });

    const categories = [...new Set(userViews.map((v) => v.category))];
    const viewedItemIds = userViews.map((v) => v.itemId);

    if (categories.length === 0) {
      return this.getTrending(limit);
    }

    const userTopCategories = await this.getUserTopCategories(userId, 3);
    const weightedCategories = userTopCategories.map((uc) => uc.category);

    const collaborative = await this.getCollaborativeFiltering(
      userId,
      categories,
      viewedItemIds,
      Math.floor(limit * 0.5),
    );

    const contentBased = await this.getContentBased(
      weightedCategories.length ? weightedCategories : categories,
      viewedItemIds,
      Math.floor(limit * 0.3),
    );

    const trending = await this.getTrending(Math.floor(limit * 0.2));

    const allItems = [...collaborative, ...contentBased, ...trending];
    const uniqueItems = Array.from(
      new Map(allItems.map((item) => [item.externalId, item])).values(),
    );

    return uniqueItems.slice(0, limit);
  },

  async getCollaborativeFiltering(
    userId: string,
    categories: string[],
    excludeIds: string[],
    limit: number,
  ) {
    const similarUsers = await prisma.userView.groupBy({
      by: ["userId"],
      where: {
        category: { in: categories },
        userId: { not: userId },
        itemId: { notIn: excludeIds },
      },
      _count: { itemId: true },
      orderBy: { _count: { itemId: "desc" } },
      take: 10,
    });

    const similarUserIds = similarUsers
      .map((u) => u.userId)
      .filter((id): id is string => id !== null);

    if (similarUserIds.length === 0) return [];

    const viewedBySimilarUsers = await prisma.userView.findMany({
      where: {
        userId: { in: similarUserIds },
        category: { in: categories },
        itemId: { notIn: excludeIds },
      },
      select: { itemId: true },
      distinct: ["itemId"],
      take: limit,
    });

    const itemIds = viewedBySimilarUsers.map((v) => v.itemId);
    if (itemIds.length === 0) return [];

    return await prisma.recommendation.findMany({
      where: { externalId: { in: itemIds } },
      take: limit,
    });
  },

  async getContentBased(
    categories: string[],
    excludeIds: string[],
    limit: number,
  ) {
    return await prisma.recommendation.findMany({
      where: {
        category: { in: categories },
        externalId: { notIn: excludeIds },
      },
      orderBy: { views: "desc" },
      take: limit,
    });
  },

  async getTrending(limit: number) {
    return await prisma.recommendation.findMany({
      where: { views: { gt: 0 } },
      orderBy: { views: "desc" },
      take: limit,
    });
  },

  async create(data: any) {
    return await prisma.recommendation.create({
      data: { ...data, views: 0 },
    });
  },

  async deleteById(id: number) {
    return await prisma.recommendation.delete({ where: { id } });
  },

  async deleteByExternalId(externalId: string) {
    return await prisma.recommendation.deleteMany({ where: { externalId } });
  },

  async increment(externalId: string) {
    return await prisma.recommendation.updateMany({
      where: { externalId },
      data: { views: { increment: 1 } },
    });
  },

  async trackUserView(userId: string, itemId: string, category: string) {
    return await prisma.userView.create({
      data: { userId, itemId, category, viewedAt: new Date() },
    });
  },
};

export async function getRecommendations(req: Request, res: Response) {
  try {
    const limit = parseInt((req.query.limit as string) || "6", 10);
    const userId = (req as any).user?.id || (req.query.userId as string);
    let items;

    if (userId) {
      items = await cacheManager.withCache(
        CACHE_KEYS.RECOMMENDATIONS(userId, limit),
        () => recommendationService.getHybridRecommendations(userId, limit),
        CACHE_TTL.LIST,
      );
    } else {
      items = await cacheManager.withCache(
        CACHE_KEYS.RECOMMENDATIONS("global", limit),
        () => recommendationService.getTrending(limit),
        CACHE_TTL.LIST,
      );
    }

    return res.json(items);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch" });
  }
}

export async function getMostViewedCategories(req: Request, res: Response) {
  try {
    const limit = parseInt((req.query.limit as string) || "5", 10);
    const categories = await cacheManager.withCache(
      CACHE_KEYS.TOP_CATEGORIES,
      () => recommendationService.getMostViewedCategories(limit),
      CACHE_TTL.LIST,
    );
    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch categories" });
  }
}

export async function getUserTopCategories(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const limit = parseInt((req.query.limit as string) || "3", 10);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const categories = await cacheManager.withCache(
      CACHE_KEYS.USER_TOP_CATEGORIES(userId),
      () => recommendationService.getUserTopCategories(userId, limit),
      CACHE_TTL.LIST,
    );
    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch user categories" });
  }
}

export async function getMostClickedItems(req: Request, res: Response) {
  try {
    const limit = parseInt((req.query.limit as string) || "10", 10);
    const items = await recommendationService.getMostClickedItems(limit);
    return res.json(items);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch items" });
  }
}

export async function getCategoryClickThroughRate(req: Request, res: Response) {
  try {
    const categoryParam = req.params.category;
    const category = Array.isArray(categoryParam)
      ? categoryParam[0]
      : categoryParam;
    if (!category) return res.status(400).json({ error: "Category required" });

    const stats =
      await recommendationService.getCategoryClickThroughRate(category);
    return res.json(stats);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch CTR" });
  }
}

export async function getTrendingCategories(req: Request, res: Response) {
  try {
    const hours = parseInt((req.query.hours as string) || "24", 10);
    const trending = await recommendationService.getTrendingCategories(hours);
    return res.json(trending);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to fetch trending categories" });
  }
}

export async function createRecommendation(req: Request, res: Response) {
  try {
    const { externalId, source, category, title, description, price } =
      req.body;
    if (!externalId || !source || !category || !title || !price) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const item = await recommendationService.create({
      externalId,
      source,
      category,
      title,
      description,
      price,
    });

    await cacheManager.deletePattern("recommendations:*");
    await cacheManager.deletePattern("stats:*");
    return res.status(201).json(item);
  } catch (error) {
    return res.status(500).json({ error: "Create failed" });
  }
}

export async function deleteRecommendation(req: Request, res: Response) {
  try {
    const id = parseInt(
      Array.isArray(req.params.id) ? req.params.id[0] : req.params.id,
    );
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    await recommendationService.deleteById(id);
    await cacheManager.deletePattern("recommendations:*");
    await cacheManager.deletePattern("stats:*");
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Delete failed" });
  }
}

export async function deleteByExternalId(req: Request, res: Response) {
  try {
    const externalId = Array.isArray(req.params.externalId)
      ? req.params.externalId[0]
      : req.params.externalId;

    await recommendationService.deleteByExternalId(externalId);
    await cacheManager.deletePattern("recommendations:*");
    await cacheManager.deletePattern("stats:*");
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Delete failed" });
  }
}

export async function incrementViews(req: Request, res: Response) {
  try {
    const { externalId, category, userId } = req.body;
    if (!externalId)
      return res.status(400).json({ error: "externalId required" });

    await recommendationService.increment(externalId);

    if (userId && category) {
      await recommendationService.trackUserView(userId, externalId, category);
    }

    await cacheManager.deletePattern("recommendations:*");
    await cacheManager.deletePattern("stats:*");
    await cacheManager.deletePattern(`user:${userId}:*`);
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Update failed" });
  }
}

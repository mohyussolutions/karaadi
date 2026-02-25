import { Request, Response } from "express";
import prisma from "../../core/utils/db.ts";
import cacheManager from "src/services/redisserver/cacheManager.ts";
import { CACHE_TTL } from "src/config/contstanst.ts";

const CACHE_KEYS = {
  RECOMMENDATIONS: (limit: number) => `recommendations:limit:${limit}`,
};

export async function getRecommendations(req: Request, res: Response) {
  try {
    const limitParam = req.query.limit;
    const limit =
      parseInt(typeof limitParam === "string" ? limitParam : "6", 10) || 6;
    const cacheKey = CACHE_KEYS.RECOMMENDATIONS(limit);

    const items = await cacheManager.withCache(
      cacheKey,
      async () => {
        return await prisma.recommendation.findMany({
          take: limit,
          orderBy: { views: "desc" },
          select: {
            id: true,
            externalId: true,
            source: true,
            category: true,
            title: true,
            price: true,
            views: true,
          },
        });
      },
      CACHE_TTL.LIST,
    );

    return res.json(items);
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ error: "Failed to fetch recommendations", message: err.message });
  }
}

export async function createRecommendation(req: Request, res: Response) {
  try {
    const { externalId, source, category, title, price } = req.body;

    if (!externalId || !source || !category || !title || !price) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const item = await prisma.recommendation.create({
      data: {
        externalId,
        source,
        category,
        title,
        price,
        views: 0,
      },
    });

    await cacheManager.deletePattern("recommendations:limit:*");

    return res.status(201).json(item);
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ error: "Failed to create recommendation", message: err.message });
  }
}

export async function deleteRecommendation(req: Request, res: Response) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const numericId = parseInt(id);

    if (isNaN(numericId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    await prisma.recommendation.delete({
      where: { id: numericId },
    });

    await cacheManager.deletePattern("recommendations:limit:*");

    return res.json({ success: true });
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ error: "Failed to delete recommendation", message: err.message });
  }
}

export async function deleteByExternalId(req: Request, res: Response) {
  try {
    const externalId = Array.isArray(req.params.externalId)
      ? req.params.externalId[0]
      : req.params.externalId;

    await prisma.recommendation.deleteMany({
      where: { externalId },
    });

    await cacheManager.deletePattern("recommendations:limit:*");

    return res.json({ success: true });
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ error: "Failed to delete recommendation", message: err.message });
  }
}

export async function incrementViews(req: Request, res: Response) {
  try {
    const { externalId } = req.body;

    if (!externalId) {
      return res.status(400).json({ error: "externalId is required" });
    }

    await prisma.recommendation.updateMany({
      where: { externalId },
      data: { views: { increment: 1 } },
    });

    await cacheManager.deletePattern("recommendations:limit:*");

    return res.json({ success: true });
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ error: "Failed to update views", message: err.message });
  }
}

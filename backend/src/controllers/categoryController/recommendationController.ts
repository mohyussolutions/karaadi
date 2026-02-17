import { Request, Response } from "express";
import prisma from "../../core/utils/db.ts";
import cacheManager from "src/services/redisserver/cacheManager.ts";

export async function getRecommendations(req: Request, res: Response) {
  try {
    const limit = parseInt(req.query.limit as string) || 6;
    const cacheKey = `recommendations:limit:${limit}`;

    const items = await cacheManager.withCache(
      cacheKey,
      async () => {
        return await prisma.recommendation.findMany({
          take: limit,
          orderBy: { views: "desc" },
        });
      },
      300,
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
    const { id } = req.params;
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
    const { externalId } = req.params;

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

    return res.json({ success: true });
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ error: "Failed to update views", message: err.message });
  }
}

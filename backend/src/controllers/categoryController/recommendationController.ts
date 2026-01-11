import { Request, Response } from "express";
import prisma from "../../core/utils/db.js";

export async function getRecommendations(req: Request, res: Response) {
  try {
    const limit = parseInt(req.query.limit as string) || 6;
    const items = await prisma.recommendation.findMany({
      take: limit,
      orderBy: { views: "desc" },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recommendations" });
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

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: "Failed to create recommendation" });
  }
}

export async function deleteRecommendation(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await prisma.recommendation.delete({
      where: { id: parseInt(id) },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete recommendation" });
  }
}

export async function deleteByExternalId(req: Request, res: Response) {
  try {
    const { externalId } = req.params;
    await prisma.recommendation.deleteMany({
      where: { externalId },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete recommendation" });
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

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update views" });
  }
}

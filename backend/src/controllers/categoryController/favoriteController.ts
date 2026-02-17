import { Request, Response } from "express";
import prisma from "../../core/utils/db.ts";
import { User } from "@prisma/client";
import cacheManager from "src/services/redisserver/cacheManager.ts";

interface AuthRequest extends Request {
  user?: User & { _id?: string; sub?: string };
}

const getUserId = (req: AuthRequest): string | undefined =>
  req.user?.id || req.user?._id || req.user?.sub;

export const createFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { title, description, price, image, itemId, category } = req.body;

    if (!title || !itemId) {
      return res
        .status(400)
        .json({ message: "Title and Item ID are required" });
    }

    const exists = await prisma.favorite.findFirst({
      where: { userId, itemId },
    });

    if (exists) {
      return res
        .status(400)
        .json({ message: "This item is already in favorites" });
    }

    const sanitizedCategory = Array.isArray(category)
      ? category[0]
      : category || "General";

    const favorite = await prisma.favorite.create({
      data: {
        userId,
        itemId,
        title,
        description: description || "",
        price: price ? String(price) : null,
        image: image || null,
        category: sanitizedCategory,
      },
    });

    await Promise.all([
      cacheManager.delete(`favorites:list:${userId}`),
      cacheManager.delete(`favorites:count:${userId}`),
    ]);

    res.status(201).json(favorite);
  } catch (err) {
    res.status(500).json({ message: "Failed to save favorite!" });
  }
};

export const getMyFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const cacheKey = `favorites:list:${userId}`;
    const favorites = await cacheManager.withCache(cacheKey, async () => {
      return await prisma.favorite.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              profileImage: true,
            },
          },
        },
      });
    });

    res.status(200).json(favorites);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch favorites" });
  }
};

export const getFavoriteById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const cacheKey = `favorite:detail:${req.params.id}:${userId}`;
    const favorite = await cacheManager.withCache(cacheKey, async () => {
      return await prisma.favorite.findFirst({
        where: { id: req.params.id, userId },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              profileImage: true,
            },
          },
        },
      });
    });

    if (!favorite)
      return res.status(404).json({ message: "Favorite not found" });
    res.status(200).json(favorite);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch favorite details" });
  }
};

export const updateFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { title, description, price, image } = req.body;

    const exists = await prisma.favorite.findFirst({
      where: { id: req.params.id, userId },
    });

    if (!exists) return res.status(404).json({ message: "Favorite not found" });

    const updated = await prisma.favorite.update({
      where: { id: req.params.id },
      data: {
        title,
        description,
        price: price ? String(price) : null,
        image,
      },
    });

    await Promise.all([
      cacheManager.delete(`favorites:list:${userId}`),
      cacheManager.delete(`favorite:detail:${req.params.id}:${userId}`),
    ]);

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update favorite" });
  }
};

export const deleteFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const exists = await prisma.favorite.findFirst({
      where: { id: req.params.id, userId },
    });

    if (!exists) return res.status(404).json({ message: "Favorite not found" });

    await prisma.favorite.delete({ where: { id: req.params.id } });

    await Promise.all([
      cacheManager.delete(`favorites:list:${userId}`),
      cacheManager.delete(`favorites:count:${userId}`),
      cacheManager.delete(`favorite:detail:${req.params.id}:${userId}`),
    ]);

    res.status(200).json({ message: "Removed from favorites" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove favorite" });
  }
};

export const getFavoritesCount = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const cacheKey = `favorites:count:${userId}`;
    const total = await cacheManager.withCache(cacheKey, async () => {
      return await prisma.favorite.count({ where: { userId } });
    });

    res.status(200).json({ total });
  } catch (err) {
    res.status(500).json({ message: "Failed to count favorites" });
  }
};

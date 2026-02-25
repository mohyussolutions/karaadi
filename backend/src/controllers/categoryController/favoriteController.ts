import { Request, Response } from "express";
import prisma from "../../core/utils/db.ts";
import { User } from "@prisma/client";
import cacheManager from "src/services/redisserver/cacheManager.ts";
import { CACHE_TTL } from "src/config/contstanst.ts";

interface AuthRequest extends Request {
  user?: User & { _id?: string; sub?: string };
}

const getUserId = (req: AuthRequest): string | undefined =>
  req.user?.id || req.user?._id || req.user?.sub;

const CACHE_KEYS = {
  FAVORITES_LIST: (userId: string) => `favorites:list:${userId}`,
  FAVORITES_COUNT: (userId: string) => `favorites:count:${userId}`,
  FAVORITE_DETAIL: (favoriteId: string, userId: string) =>
    `favorite:detail:${favoriteId}:${userId}`,
};

const selectUserBasic = {
  select: {
    id: true,
    username: true,
    email: true,
    profileImage: true,
  },
};

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
      select: { id: true },
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
      cacheManager.delete(CACHE_KEYS.FAVORITES_LIST(userId)),
      cacheManager.delete(CACHE_KEYS.FAVORITES_COUNT(userId)),
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

    const cacheKey = CACHE_KEYS.FAVORITES_LIST(userId);
    const favorites = await cacheManager.withCache(
      cacheKey,
      async () => {
        return await prisma.favorite.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            image: true,
            category: true,
            itemId: true,
            createdAt: true,
            user: selectUserBasic,
          },
          take: 100,
        });
      },
      CACHE_TTL.LIST,
    );

    res.status(200).json(favorites);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch favorites" });
  }
};

export const getFavoriteById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const favoriteId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const cacheKey = CACHE_KEYS.FAVORITE_DETAIL(favoriteId, userId);

    const favorite = await cacheManager.withCache(
      cacheKey,
      async () => {
        return await prisma.favorite.findFirst({
          where: { id: favoriteId, userId },
          include: { user: selectUserBasic },
        });
      },
      CACHE_TTL.DETAIL,
    );

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

    const favoriteId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const { title, description, price, image } = req.body;

    const exists = await prisma.favorite.findFirst({
      where: { id: favoriteId, userId },
      select: { id: true },
    });

    if (!exists) return res.status(404).json({ message: "Favorite not found" });

    const updated = await prisma.favorite.update({
      where: { id: favoriteId },
      data: {
        title,
        description,
        price: price ? String(price) : null,
        image,
      },
    });

    await Promise.all([
      cacheManager.delete(CACHE_KEYS.FAVORITES_LIST(userId)),
      cacheManager.delete(CACHE_KEYS.FAVORITE_DETAIL(favoriteId, userId)),
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

    const favoriteId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const exists = await prisma.favorite.findFirst({
      where: { id: favoriteId, userId },
      select: { id: true },
    });

    if (!exists) return res.status(404).json({ message: "Favorite not found" });

    await prisma.favorite.delete({ where: { id: favoriteId } });

    await Promise.all([
      cacheManager.delete(CACHE_KEYS.FAVORITES_LIST(userId)),
      cacheManager.delete(CACHE_KEYS.FAVORITES_COUNT(userId)),
      cacheManager.delete(CACHE_KEYS.FAVORITE_DETAIL(favoriteId, userId)),
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

    const cacheKey = CACHE_KEYS.FAVORITES_COUNT(userId);
    const total = await cacheManager.withCache(
      cacheKey,
      async () => {
        return await prisma.favorite.count({ where: { userId } });
      },
      CACHE_TTL.STATS,
    );

    res.status(200).json({ total });
  } catch (err) {
    res.status(500).json({ message: "Failed to count favorites" });
  }
};

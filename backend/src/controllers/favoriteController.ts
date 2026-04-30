import { Request, Response } from "express";
import prisma from "src/core/utils/db.ts";
import { User, Prisma } from "@prisma/client";
import { CACHE_TTL } from "src/config/config.constants.ts";
import { AuthRequest } from "src/types/index.ts";
import cacheManager from "src/services/redis/cacheManager.ts";

const getUserId = (req: AuthRequest): string | undefined =>
  req.user?.id || req.user?._id || req.user?.sub;

const CACHE_KEYS = {
  FAVORITES_LIST: (userId: string) => `favorites:list:${userId}`,
  FAVORITES_COUNT: (userId: string) => `favorites:count:${userId}`,
  FAVORITE_DETAIL: (favoriteId: string, userId: string) =>
    `favorite:detail:${favoriteId}:${userId}`,
};

const ensureString = (val: string | string[] | undefined): string => {
  if (Array.isArray(val)) return val[0];
  return val || "";
};

export const createFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { title, description, price, image, itemId, category } = req.body;

    if (!itemId) {
      return res.status(400).json({ message: "Item ID is required" });
    }

    try {
      const createStart = Date.now();
      const favorite = await prisma.favorite.create({
        data: {
          userId,
          itemId,
          title: title || "Untitled",
          description: description || "",
          price: price ? String(price) : null,
          image: image || null,
          category: Array.isArray(category)
            ? category[0]
            : category || "General",
        },
      });
      const createDuration = Date.now() - createStart;
      if (process.env.DEBUG === "true")
        console.debug(
          `[createFavorite] prisma.create duration: ${createDuration}ms`,
        );

      res.status(201).json(favorite);

      Promise.all([
        cacheManager.delete(CACHE_KEYS.FAVORITES_LIST(userId)),
        cacheManager.delete(CACHE_KEYS.FAVORITES_COUNT(userId)),
      ]).catch(() => null);
    } catch (err: any) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        return res
          .status(400)
          .json({ message: "You have already saved this item" });
      }
      throw err;
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to save favorite" });
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
          take: 50,
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            image: true,
            createdAt: true,
            category: true,
            itemId: true,
          },
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

    const favoriteId = ensureString(req.params.id);
    const cacheKey = CACHE_KEYS.FAVORITE_DETAIL(favoriteId, userId);

    const favorite = await cacheManager.withCache(
      cacheKey,
      async () => {
        return await prisma.favorite.findUnique({
          where: { id: favoriteId },
        });
      },
      CACHE_TTL.DETAIL,
    );

    if (!favorite || favorite.userId !== userId) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    res.status(200).json(favorite);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch favorite" });
  }
};

export const updateFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const favoriteId = ensureString(req.params.id);
    const { title, description, price, image } = req.body;

    const favorite = await prisma.favorite.findUnique({
      where: { id: favoriteId },
      select: { userId: true },
    });

    if (!favorite || favorite.userId !== userId) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    const updated = await prisma.favorite.update({
      where: { id: favoriteId },
      data: {
        title,
        description,
        price: price ? String(price) : null,
        image,
      },
    });

    res.status(200).json(updated);

    Promise.all([
      cacheManager.delete(CACHE_KEYS.FAVORITES_LIST(userId)),
      cacheManager.delete(CACHE_KEYS.FAVORITE_DETAIL(favoriteId, userId)),
    ]).catch(() => null);
  } catch (err) {
    res.status(500).json({ message: "Failed to update favorite" });
  }
};

export const deleteFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const favoriteId = ensureString(req.params.id);

    const favorite = await prisma.favorite.findUnique({
      where: { id: favoriteId },
      select: { userId: true },
    });

    if (!favorite || favorite.userId !== userId) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    await prisma.favorite.delete({ where: { id: favoriteId } });

    res.status(200).json({ message: "Removed from favorites" });

    Promise.all([
      cacheManager.delete(CACHE_KEYS.FAVORITES_LIST(userId)),
      cacheManager.delete(CACHE_KEYS.FAVORITES_COUNT(userId)),
      cacheManager.delete(CACHE_KEYS.FAVORITE_DETAIL(favoriteId, userId)),
    ]).catch(() => null);
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

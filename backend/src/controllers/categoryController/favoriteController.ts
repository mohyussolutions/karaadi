import { Request, Response } from "express";
import prisma from "../../core/utils/db.ts";

const getUserId = (req: Request) =>
  (req.user as any)?.id || (req.user as any)?._id || (req.user as any)?.sub;

export const createFavorite = async (req: Request, res: Response) => {
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

    res.status(201).json(favorite);
  } catch (err) {
    res.status(500).json({ message: "Failed to save favorite!" });
  }
};

export const getMyFavorites = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, username: true, email: true, profileImage: true },
        },
      },
    });

    res.status(200).json(favorites);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch favorites" });
  }
};

export const getFavoriteById = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const favorite = await prisma.favorite.findFirst({
      where: { id: req.params.id, userId },
      include: {
        user: {
          select: { id: true, username: true, email: true, profileImage: true },
        },
      },
    });

    if (!favorite)
      return res.status(404).json({ message: "Favorite not found" });
    res.status(200).json(favorite);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch favorite details" });
  }
};

export const updateFavorite = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { title, description, price, image } = req.body;
    const favorite = await prisma.favorite.findFirst({
      where: { id: req.params.id, userId },
    });

    if (!favorite)
      return res.status(404).json({ message: "Favorite not found" });

    const updated = await prisma.favorite.update({
      where: { id: req.params.id },
      data: {
        title,
        description,
        price: price ? String(price) : null,
        image,
      },
    });

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update favorite" });
  }
};

export const deleteFavorite = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const favorite = await prisma.favorite.findFirst({
      where: { id: req.params.id, userId },
    });

    if (!favorite)
      return res.status(404).json({ message: "Favorite not found" });

    await prisma.favorite.delete({ where: { id: req.params.id } });
    res.status(200).json({ message: "Removed from favorites" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove favorite" });
  }
};

export const getFavoritesCount = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const total = await prisma.favorite.count({ where: { userId } });
    res.status(200).json({ total });
  } catch (err) {
    res.status(500).json({ message: "Failed to count favorites" });
  }
};

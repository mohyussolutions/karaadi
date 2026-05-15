import { Request, Response } from "express";
import prisma from "src/core/utils/db.ts";
import { CACHE_TTL } from "src/config/config.constants.ts";
import cacheManager from "src/services/redis/cacheManager.ts";

const POPULAR_SEARCH_CACHE_KEY = "search:popular";
const ADMIN_LOGS_CACHE_KEY = "search:admin_logs";

export const createSearchLog = async (req: Request, res: Response) => {
  try {
    const { query, category, userId } = req.body;
    if (!query) return res.status(400).json({ message: "Query is required" });

    const newLog = await prisma.searchLog.create({
      data: {
        query: query.trim(),
        category: category || "all",
        userId: userId || null,
      },
    });

    await cacheManager.delete(POPULAR_SEARCH_CACHE_KEY);
    await cacheManager.delete(ADMIN_LOGS_CACHE_KEY);

    res.status(201).json(newLog);
  } catch (error) {
    res.status(500).json({ message: "Error logging search" });
  }
};

export const getAdminLogs = async (req: Request, res: Response) => {
  try {
    const logs = await cacheManager.withCache(
      ADMIN_LOGS_CACHE_KEY,
      async () => {
        return await prisma.searchLog.findMany({
          orderBy: { createdAt: "desc" },
          take: 100,
          include: {
            user: {
              select: {
                username: true,
                email: true,
                profileImage: true,
              },
            },
          },
        });
      },
      300,
    );

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching logs" });
  }
};

export const getPopularSearches = async (req: Request, res: Response) => {
  try {
    const popular = await cacheManager.withCache(
      POPULAR_SEARCH_CACHE_KEY,
      async () => {
        return await prisma.searchLog.groupBy({
          by: ["query"],
          _count: { query: true },
          orderBy: { _count: { query: "desc" } },
          take: 10,
        });
      },
      CACHE_TTL.DEFAULT,
    );

    res.status(200).json(popular);
  } catch (error) {
    res.status(500).json({ message: "Error fetching popular searches" });
  }
};

export const getUserSearchLogs = async (req: Request, res: Response) => {
  try {
    const { userId, limit } = req.query;
    if (!userId) return res.status(400).json({ message: "userId is required" });
    const take = Math.min(Number(limit) || 10, 50);
    const logs = await prisma.searchLog.findMany({
      where: { userId: String(userId) },
      orderBy: { createdAt: "desc" },
      take,
      select: { id: true, query: true, category: true, createdAt: true },
    });
    res.status(200).json(logs);
  } catch {
    res.status(500).json({ message: "Error fetching search logs" });
  }
};

export const deleteSearchLogByQuery = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q)
      return res
        .status(400)
        .json({ message: "Query parameter 'q' is required" });

    await prisma.searchLog.deleteMany({
      where: { query: String(q) },
    });

    await cacheManager.delete(POPULAR_SEARCH_CACHE_KEY);
    await cacheManager.delete(ADMIN_LOGS_CACHE_KEY);

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting logs" });
  }
};

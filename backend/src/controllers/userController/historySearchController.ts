import { Request, Response } from "express";
import prisma from "src/core/utils/db.ts";

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
    res.status(201).json(newLog);
  } catch (error) {
    res.status(500).json({ message: "Error logging search" });
  }
};

export const getAdminLogs = async (req: Request, res: Response) => {
  try {
    const logs = await prisma.searchLog.findMany({
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
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching logs" });
  }
};

export const getPopularSearches = async (req: Request, res: Response) => {
  try {
    const popular = await prisma.searchLog.groupBy({
      by: ["query"],
      _count: {
        query: true,
      },
      orderBy: {
        _count: {
          query: "desc",
        },
      },
      take: 10,
    });
    res.status(200).json(popular);
  } catch (error) {
    res.status(500).json({ message: "Error fetching popular searches" });
  }
};

export const deleteSearchLogByQuery = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res
        .status(400)
        .json({ message: "Query parameter 'q' is required" });
    }

    await prisma.searchLog.deleteMany({
      where: {
        query: String(q),
      },
    });

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting logs" });
  }
};

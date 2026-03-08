import { Request, Response } from "express";
import prisma from "../../core/utils/db.ts";
import cacheManager from "src/services/redisserver/cacheManager.ts";
import {
  CACHE_TTL,
  getPaginationParams,
} from "src/constants/config.constants.ts";

const parseId = (id: any) => (Array.isArray(id) ? id[0] : id);

export const getAgencyStats = async (_req: Request, res: Response) => {
  try {
    const stats = await cacheManager.withCache(
      "agency:stats",
      async () => {
        const [total, verified] = await Promise.all([
          prisma.agency.count(),
          prisma.agency.count({ where: { status: "Verified" } }),
        ]);
        return { total, verified };
      },
      CACHE_TTL.STATS,
    );
    res.status(200).json({ success: true, ...stats });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const getAllAgencies = async (req: Request, res: Response) => {
  try {
    const { page, limit, skip } = getPaginationParams(
      req.query.page as string,
      req.query.pageSize as string,
    );
    const cacheKey = `agency:all:page:${page}:limit:${limit}`;

    const agencies = await cacheManager.withCache(
      cacheKey,
      () =>
        prisma.agency.findMany({
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
      CACHE_TTL.LIST,
    );
    res.status(200).json({ success: true, agencies });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const createAgency = async (req: Request, res: Response) => {
  try {
    const agency = await prisma.agency.create({ data: req.body });
    // Activity: Delete lists and stats so they refresh on next GET
    await cacheManager.deletePattern("agency:all:*");
    await cacheManager.delete("agency:stats");
    res.status(201).json({ success: true, agency });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const updateAgency = async (req: Request, res: Response) => {
  try {
    const id = parseId(req.params.id);
    const agency = await prisma.agency.update({
      where: { id },
      data: req.body,
    });

    await Promise.all([
      cacheManager.deletePattern("agency:all:*"),
      cacheManager.delete("agency:stats"),
      cacheManager.delete(`agency:detail:${id}`),
    ]);
    res.status(200).json({ success: true, agency });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const deleteAgency = async (req: Request, res: Response) => {
  try {
    const id = parseId(req.params.id);
    await prisma.agency.delete({ where: { id } });

    await Promise.all([
      cacheManager.deletePattern("agency:all:*"),
      cacheManager.delete("agency:stats"),
      cacheManager.delete(`agency:detail:${id}`),
    ]);
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

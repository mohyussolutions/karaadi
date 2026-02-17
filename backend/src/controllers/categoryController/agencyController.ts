import { Request, Response } from "express";
import prisma from "../../core/utils/db.ts";
import cacheManager from "src/services/redisserver/cacheManager.ts";

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
      600,
    );

    res.status(200).json({ success: true, ...stats });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createAgency = async (req: Request, res: Response) => {
  try {
    const { name, type, location, specialty, image, link, userId } = req.body;

    const agency = await prisma.agency.create({
      data: {
        name,
        type,
        location,
        specialty: specialty || "",
        image: image || "",
        link: link || "",
        userId,
      },
    });

    await Promise.all([
      cacheManager.delete("agency:all"),
      cacheManager.delete("agency:stats"),
    ]);

    res.status(201).json({ success: true, agency });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ success: false, error: err.message });
  }
};

export const getAllAgencies = async (_req: Request, res: Response) => {
  try {
    const agencies = await cacheManager.withCache("agency:all", async () => {
      return await prisma.agency.findMany({
        orderBy: { createdAt: "desc" },
      });
    });

    res.status(200).json({ success: true, agencies });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateAgency = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const agency = await prisma.agency.update({
      where: { id },
      data: req.body,
    });

    await Promise.all([
      cacheManager.delete("agency:all"),
      cacheManager.delete("agency:stats"),
      cacheManager.delete(`agency:detail:${id}`),
    ]);

    res.status(200).json({ success: true, agency });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ success: false, error: err.message });
  }
};

export const deleteAgency = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.agency.delete({ where: { id } });

    await Promise.all([
      cacheManager.delete("agency:all"),
      cacheManager.delete("agency:stats"),
      cacheManager.delete(`agency:detail:${id}`),
    ]);

    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, error: err.message });
  }
};

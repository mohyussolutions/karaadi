import { Request, Response } from "express";
import prisma from "../../core/utils/db.ts";

export const getAllRegions = async (req: Request, res: Response) => {
  try {
    const pageParam = req.query.page;
    const pageSizeParam = req.query.pageSize;

    const page =
      parseInt(typeof pageParam === "string" ? pageParam : "1", 10) || 1;
    const pageSize =
      parseInt(typeof pageSizeParam === "string" ? pageSizeParam : "20", 10) ||
      20;
    const skip = (page - 1) * pageSize;

    const data = await prisma.region.findMany({
      include: {
        _count: { select: { cities: true } },
        cities: true,
      },
      skip,
      take: pageSize,
      orderBy: { name: "asc" },
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getRegionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const regionId = Array.isArray(id) ? id[0] : id;

    const data = await prisma.region.findUnique({
      where: { id: regionId },
      include: { cities: true },
    });

    if (!data) return res.status(404).json({ error: "Region not found" });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createRegion = async (req: Request, res: Response) => {
  try {
    const { id, name } = req.body;
    const data = await prisma.region.create({ data: { id, name } });
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: "Create failed" });
  }
};

export const updateRegion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const regionId = Array.isArray(id) ? id[0] : id;
    const { name } = req.body;

    const data = await prisma.region.update({
      where: { id: regionId },
      data: { name },
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: "Update failed" });
  }
};

export const deleteRegion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const regionId = Array.isArray(id) ? id[0] : id;
    await prisma.region.delete({ where: { id: regionId } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Delete failed" });
  }
};

export const getAllCities = async (req: Request, res: Response) => {
  try {
    const data = await prisma.city.findMany({
      include: {
        region: { select: { name: true } },
      },
      orderBy: [{ region: { name: "asc" } }, { name: "asc" }],
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createCity = async (req: Request, res: Response) => {
  try {
    const { id, name, regionId, isActive } = req.body;
    const data = await prisma.city.upsert({
      where: { id },
      update: {
        name,
        regionId,
        isActive: isActive !== undefined ? isActive : true,
      },
      create: {
        id,
        name,
        regionId,
        isActive: isActive !== undefined ? isActive : true,
      },
    });
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: "Operation failed" });
  }
};

export const deleteCity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cityId = Array.isArray(id) ? id[0] : id;
    await prisma.city.delete({ where: { id: cityId } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Delete failed" });
  }
};

export const getLocationStats = async (_req: Request, res: Response) => {
  try {
    const [regionCount, cityCount] = await Promise.all([
      prisma.region.count(),
      prisma.city.count(),
    ]);
    res.status(200).json({
      totalRegions: regionCount,
      totalCities: cityCount,
    });
  } catch (error) {
    res.status(500).json({ error: "Could not fetch stats" });
  }
};

export const syncAllLocations = async (req: Request, res: Response) => {
  const { regions, cities } = req.body;
  try {
    await prisma.$transaction(
      async (tx) => {
        for (const reg of regions) {
          await tx.region.upsert({
            where: { id: reg.id },
            update: { name: reg.name },
            create: { id: reg.id, name: reg.name },
          });
        }
        for (const city of cities) {
          await tx.city.upsert({
            where: { id: city.id },
            update: { name: city.name, regionId: city.regionId },
            create: {
              id: city.id,
              name: city.name,
              regionId: city.regionId,
              isActive: true,
            },
          });
        }
      },
      { timeout: 60000 },
    );
    res.status(200).json({ message: "Synced successfully" });
  } catch (error) {
    res.status(500).json({ error: "Sync failed" });
  }
};

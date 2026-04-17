import { Request, Response } from "express";
import prisma from "../../core/utils/db.ts";

export const regionsWithMostItemListings = async (
  _req: Request,
  res: Response,
) => {
  try {
    const regions = await prisma.marketplace.groupBy({
      by: ["region"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });
    const regionNames = await prisma.region.findMany({
      where: { id: { in: regions.map((r) => r.region) } },
      select: { id: true, name: true },
    });
    const result = regions.map((r) => ({
      region: regionNames.find((n) => n.id === r.region)?.name || r.region,
      listings: r._count.id,
    }));
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch regions with most item listings" });
  }
};

export const citiesWithMostItemListings = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const cities = await prisma.marketplace.groupBy({
      by: ["city"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    });

    const cityNames = await prisma.city.findMany({
      where: { id: { in: cities.map((c) => c.city) } },
      select: { id: true, name: true },
    });

    const result = cities.map((c) => ({
      name: cityNames.find((n) => n.id === c.city)?.name || c.city || "Unknown",
      buyers: c._count.id,
    }));

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
export const getAllRegions = async (req: Request, res: Response) => {
  try {
    const data = await prisma.region.findMany({
      select: { id: true, name: true },
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
      select: { id: true, name: true, regionId: true, isActive: true },
      orderBy: { name: "asc" },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createCity = async (req: Request, res: Response) => {
  try {
    const { id, name, regionId, isActive } = req.body;
    const cityId = id || crypto.randomUUID();
    const existing = id
      ? await prisma.city.findFirst({ where: { id } })
      : await prisma.city.findFirst({ where: { name, regionId } });
    let data;
    if (existing) {
      data = await prisma.city.update({
        where: { id: existing.id },
        data: { name, regionId, isActive: isActive !== undefined ? isActive : true },
      });
    } else {
      data = await prisma.city.create({
        data: { id: cityId, name, regionId, isActive: isActive !== undefined ? isActive : true },
      });
    }
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

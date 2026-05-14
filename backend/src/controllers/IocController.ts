import { Request, Response } from "express";
import prisma from "src/core/utils/db.ts";
import { serverError } from "src/core/utils/serverError.ts";

export const regionsWithMostItemListings = async (
  _req: Request,
  res: Response,
) => {
  try {
    const [marketplace, cars, realEstate, motorcycles, boats, farmEquipment] =
      await Promise.all([
        prisma.marketplace.groupBy({ by: ["region"], _count: { id: true } }),
        prisma.car.groupBy({ by: ["region"], _count: { id: true } }),
        prisma.realEstate.groupBy({ by: ["region"], _count: { id: true } }),
        prisma.motorcycle.groupBy({ by: ["region"], _count: { id: true } }),
        prisma.boat.groupBy({ by: ["region"], _count: { id: true } }),
        prisma.farmequipment.groupBy({ by: ["region"], _count: { id: true } }),
      ]);

    const countMap: Record<string, number> = {};
    for (const row of [
      ...marketplace,
      ...cars,
      ...realEstate,
      ...motorcycles,
      ...boats,
      ...farmEquipment,
    ]) {
      countMap[row.region] = (countMap[row.region] ?? 0) + row._count.id;
    }

    const allRegionIds = Object.keys(countMap);
    const regionNames = await prisma.region.findMany({
      where: { id: { in: allRegionIds } },
      select: { id: true, name: true },
    });

    const result = Object.entries(countMap)
      .map(([regionId, count]) => ({
        name: regionNames.find((r) => r.id === regionId)?.name || regionId,
        buyers: count,
      }))
      .sort((a, b) => b.buyers - a.buyers);

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
    const [marketplace, cars, realEstate, motorcycles, boats, farmEquipment] =
      await Promise.all([
        prisma.marketplace.groupBy({ by: ["city"], _count: { id: true } }),
        prisma.car.groupBy({ by: ["city"], _count: { id: true } }),
        prisma.realEstate.groupBy({ by: ["city"], _count: { id: true } }),
        prisma.motorcycle.groupBy({ by: ["city"], _count: { id: true } }),
        prisma.boat.groupBy({ by: ["city"], _count: { id: true } }),
        prisma.farmequipment.groupBy({ by: ["city"], _count: { id: true } }),
      ]);

    const countMap: Record<string, number> = {};
    for (const row of [
      ...marketplace,
      ...cars,
      ...realEstate,
      ...motorcycles,
      ...boats,
      ...farmEquipment,
    ]) {
      countMap[row.city] = (countMap[row.city] ?? 0) + row._count.id;
    }

    const allCityIds = Object.keys(countMap);
    const cityNames = await prisma.city.findMany({
      where: { id: { in: allCityIds } },
      select: { id: true, name: true },
    });

    const result = Object.entries(countMap)
      .map(([cityId, count]) => ({
        name:
          cityNames.find((c) => c.id === cityId)?.name || cityId || "Unknown",
        buyers: count,
      }))
      .sort((a, b) => b.buyers - a.buyers)
      .slice(0, 20);

    res.status(200).json(result);
  } catch (error: any) {
    serverError(res, error);
  }
};
export const getAllRegions = async (req: Request, res: Response) => {
  try {
    const data = await prisma.region.findMany({
      select: {
        id: true,
        name: true,
        cities: {
          select: { id: true, name: true, regionId: true, isActive: true },
          orderBy: { name: "asc" },
        },
      },
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
    const regionId = req.query.regionId as string | undefined;
    const data = await prisma.city.findMany({
      where: regionId ? { regionId } : undefined,
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
        data: {
          name,
          regionId,
          isActive: isActive !== undefined ? isActive : true,
        },
      });
    } else {
      data = await prisma.city.create({
        data: {
          id: cityId,
          name,
          regionId,
          isActive: isActive !== undefined ? isActive : true,
        },
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

export const updateCity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cityId = Array.isArray(id) ? id[0] : id;
    const { name, isActive } = req.body;
    const data: Record<string, any> = {};
    if (name !== undefined) data.name = name;
    if (isActive !== undefined) data.isActive = isActive;
    const result = await prisma.city.update({ where: { id: cityId }, data });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: "Update failed" });
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

export const bulkSeedLocations = async (req: Request, res: Response) => {
  const { regions, cities } = req.body;
  if (!Array.isArray(regions) || !Array.isArray(cities))
    return res.status(400).json({ error: "Invalid payload" });
  try {
    await prisma.$transaction(async (tx) => {
      await Promise.all(
        regions.map((r: { id: string; name: string }) =>
          tx.region.upsert({
            where: { id: r.id },
            update: { name: r.name },
            create: { id: r.id, name: r.name },
          })
        )
      );
      await Promise.all(
        cities.map((c: { id: string; name: string; regionId: string }) =>
          tx.city.upsert({
            where: { id: c.id },
            update: { name: c.name, regionId: c.regionId },
            create: { id: c.id, name: c.name, regionId: c.regionId },
          })
        )
      );
    }, { timeout: 30000 });
    res.json({ success: true, regions: regions.length, cities: cities.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Bulk seed failed" });
  }
};

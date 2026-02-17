import { Request, Response } from "express";
import prisma from "../../core/utils/db.ts";
import cacheManager from "src/services/redisserver/cacheManager.ts";

const capitalize = (str: string | null) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const getAllRegions = async (_req: Request, res: Response) => {
  try {
    const cacheKey = "locations:regions:all";
    const formatted = await cacheManager.withCache(cacheKey, async () => {
      const data = await prisma.region.findMany({
        include: {
          _count: { select: { cities: true } },
          cities: true,
        },
      });

      return data.map((region) => ({
        ...region,
        name: capitalize(region.name),
        cities:
          region.cities?.map((city) => ({
            ...city,
            name: capitalize(city.name),
          })) || [],
      }));
    });

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getRegionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cacheKey = `locations:region:${id}`;

    const formatted = await cacheManager.withCache(cacheKey, async () => {
      const data = await prisma.region.findUnique({
        where: { id },
        include: { cities: true },
      });
      if (!data) return null;

      return {
        ...data,
        name: capitalize(data.name),
        cities:
          data.cities?.map((city) => ({
            ...city,
            name: capitalize(city.name),
          })) || [],
      };
    });

    if (!formatted) return res.status(404).json({ error: "Region not found" });
    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createRegion = async (req: Request, res: Response) => {
  try {
    const { id, name } = req.body;
    const data = await prisma.region.create({ data: { id, name } });

    await Promise.all([
      cacheManager.delete("locations:regions:all"),
      cacheManager.delete("locations:stats"),
    ]);

    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: "Create failed" });
  }
};

export const updateRegion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const data = await prisma.region.update({
      where: { id },
      data: { name },
    });

    await Promise.all([
      cacheManager.delete("locations:regions:all"),
      cacheManager.delete(`locations:region:${id}`),
    ]);

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: "Update failed" });
  }
};

export const deleteRegion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.region.delete({ where: { id } });

    await Promise.all([
      cacheManager.delete("locations:regions:all"),
      cacheManager.delete(`locations:region:${id}`),
      cacheManager.delete("locations:stats"),
    ]);

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Delete failed" });
  }
};

export const getAllCities = async (_req: Request, res: Response) => {
  try {
    const cacheKey = "locations:cities:all";
    const data = await cacheManager.withCache(cacheKey, async () => {
      return await prisma.city.findMany();
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

    await Promise.all([
      cacheManager.delete("locations:cities:all"),
      cacheManager.delete(`locations:region:${regionId}`),
      cacheManager.delete("locations:regions:all"),
      cacheManager.delete("locations:stats"),
    ]);

    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: "Operation failed" });
  }
};

export const deleteCity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const city = await prisma.city.findUnique({ where: { id } });
    await prisma.city.delete({ where: { id } });

    if (city) {
      await Promise.all([
        cacheManager.delete("locations:cities:all"),
        cacheManager.delete(`locations:region:${city.regionId}`),
        cacheManager.delete("locations:regions:all"),
        cacheManager.delete("locations:stats"),
      ]);
    }

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Delete failed" });
  }
};

export const getLocationStats = async (_req: Request, res: Response) => {
  try {
    const cacheKey = "locations:stats";
    const stats = await cacheManager.withCache(
      cacheKey,
      async () => {
        const [regionCount, cityCount] = await Promise.all([
          prisma.region.count(),
          prisma.city.count(),
        ]);
        return {
          totalRegions: regionCount,
          totalCities: cityCount,
        };
      },
      3600,
    );

    res.status(200).json(stats);
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

    await cacheManager.deletePattern("locations:*");

    res.status(200).json({ message: "Synced successfully" });
  } catch (error) {
    res.status(500).json({ error: "Sync failed" });
  }
};

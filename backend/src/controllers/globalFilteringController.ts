import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import prisma from "src/core/utils/db.ts";
import cacheManager from "src/services/redisserver/cacheManager.ts";
export const globalFiltering = async (req: Request, res: Response) => {
  const { q, region, city, minPrice, maxPrice } = req.query;
  const cacheKey = `filter:${JSON.stringify(req.query).toLowerCase()}`;

  try {
    const cachedResults = await cacheManager.get(cacheKey);
    if (cachedResults) return res.json(cachedResults);

    const mode: Prisma.QueryMode = "insensitive";
    const regionArray = region ? String(region).split(",").filter(Boolean) : [];
    const cityArray = city ? String(city).split(",").filter(Boolean) : [];
    const keywords = q
      ? String(q).toLowerCase().split(" ").filter(Boolean)
      : [];

    const buildWhereClause = (
      extraFields: string[] = [],
      pField: string | null = "price",
    ) => {
      const where: any = { AND: [] };
      where.AND.push({ isPaid: true });

      if (keywords.length > 0) {
        where.AND.push({
          AND: keywords.map((word) => ({
            OR: [
              { title: { contains: word, mode } },
              { city: { contains: word, mode } },
              { region: { contains: word, mode } },
              ...extraFields.map((f) => ({ [f]: { contains: word, mode } })),
            ],
          })),
        });
      }

      if (regionArray.length > 0) {
        where.AND.push({ region: { in: regionArray, mode } });
      }

      if (cityArray.length > 0) {
        where.AND.push({ city: { in: cityArray, mode } });
      }

      if (pField && (minPrice || maxPrice)) {
        const priceFilter: any = {};
        if (minPrice) priceFilter.gte = Number(minPrice);
        if (maxPrice) priceFilter.lte = Number(maxPrice);
        where.AND.push({ [pField]: priceFilter });
      }

      return where;
    };

    const [market, real, cars, boats, motos, farmequipments, jobs] =
      await Promise.all([
        prisma.marketplace
          .findMany({ where: buildWhereClause() })
          .catch(() => []),
        prisma.realEstate
          .findMany({ where: buildWhereClause() })
          .catch(() => []),
        prisma.car
          .findMany({ where: buildWhereClause(["brand", "model"]) })
          .catch(() => []),
        prisma.boat
          .findMany({ where: buildWhereClause(["type"]) })
          .catch(() => []),
        prisma.motorcycle
          .findMany({ where: buildWhereClause(["make"]) })
          .catch(() => []),
        prisma.farmequipment
          .findMany({ where: buildWhereClause(["make"]) })
          .catch(() => []),
        prisma.job
          .findMany({ where: buildWhereClause(["company"], "salary") })
          .catch(() => []),
      ]);

    const results = [
      ...market.map((i) => ({ ...i, itemType: "marketplace" })),
      ...real.map((i) => ({ ...i, itemType: "real-estate" })),
      ...cars.map((i) => ({ ...i, itemType: "car" })),
      ...boats.map((i) => ({ ...i, itemType: "boat" })),
      ...motos.map((i) => ({ ...i, itemType: "motorcycle" })),
      ...farmequipments.map((i) => ({ ...i, itemType: "farmequipment" })),
      ...jobs.map((i) => ({ ...i, itemType: "job" })),
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    await cacheManager.set(cacheKey, results, 300);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Global filtering failed" });
  }
};

export const getFilterMetadata = async (req: Request, res: Response) => {
  try {
    const where = { isPaid: true };
    const select = { region: true, city: true };

    const responses = await Promise.allSettled([
      prisma.marketplace.findMany({ where, select }),
      prisma.realEstate.findMany({ where, select }),
      prisma.car.findMany({ where, select }),
      prisma.boat.findMany({ where, select }),
      prisma.motorcycle.findMany({ where, select }),
      prisma.farmequipment.findMany({ where, select }),
      prisma.job.findMany({ where, select }),
    ]);

    const allItems = responses
      .filter(
        (r): r is PromiseFulfilledResult<any[]> => r.status === "fulfilled",
      )
      .flatMap((r) => r.value);

    const dataStructure: Record<
      string,
      { total: number; cities: Record<string, number> }
    > = {};

    allItems.forEach((item) => {
      const r = item.region?.trim();
      const c = item.city?.trim();
      if (!r) return;

      if (!dataStructure[r]) dataStructure[r] = { total: 0, cities: {} };
      dataStructure[r].total += 1;

      if (c) {
        dataStructure[r].cities[c] = (dataStructure[r].cities[c] || 0) + 1;
      }
    });

    const regions = Object.entries(dataStructure)
      .map(([name, data]) => ({
        name,
        total: data.total,
        cities: Object.entries(data.cities)
          .map(([cityName, cityTotal]) => ({
            name: cityName,
            total: cityTotal,
          }))
          .sort((a, b) => b.total - a.total),
      }))
      .sort((a, b) => b.total - a.total);

    res.json({ regions });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch metadata" });
  }
};

export const rangePriceAndRooms = async (req: Request, res: Response) => {
  const { region, city, minPrice, maxPrice, minRooms, maxRooms, type } =
    req.query;

  try {
    const mode: Prisma.QueryMode = "insensitive";

    const regionArray = region
      ? String(region)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    const cityArray = city
      ? String(city)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const where: any = {
      AND: [{ isPaid: true }],
    };

    if (type) {
      where.AND.push({ type: String(type) });
    }

    if (regionArray.length > 0) {
      where.AND.push({ region: { in: regionArray, mode } });
    }

    if (cityArray.length > 0) {
      where.AND.push({ city: { in: cityArray, mode } });
    }

    const priceFilter: any = {};
    if (minPrice !== undefined && minPrice !== "")
      priceFilter.gte = Number(minPrice);
    if (maxPrice !== undefined && maxPrice !== "")
      priceFilter.lte = Number(maxPrice);
    if (Object.keys(priceFilter).length > 0) {
      where.AND.push({ price: priceFilter });
    }

    const roomFilter: any = {};
    if (minRooms !== undefined && minRooms !== "")
      roomFilter.gte = Number(minRooms);
    if (maxRooms !== undefined && maxRooms !== "")
      roomFilter.lte = Number(maxRooms);
    if (Object.keys(roomFilter).length > 0) {
      where.AND.push({ rooms: roomFilter });
    }

    const results = await prisma.realEstate.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Filtering failed" });
  }
};

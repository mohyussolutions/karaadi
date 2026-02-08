import prisma from "../../core/utils/db.ts";
import cacheManager from "../../services/redisserver/cacheManager.ts";
import { Request, Response } from "express";

export const globalSearch = async (req: Request, res: Response) => {
  const { q } = req.query;
  if (!q || typeof q !== "string") return res.json([]);

  const queryStr = q.trim();
  if (!queryStr) return res.json([]);

  const cacheKey = `search:${queryStr.toLowerCase()}`;

  try {
    const cachedResults = await cacheManager.get(cacheKey);
    if (cachedResults) {
      return res.json(cachedResults);
    }

    const keywords = queryStr.split(" ").filter(Boolean);
    const searchPrice = keywords.find((word) => !isNaN(Number(word)));
    const priceValue = searchPrice ? Number(searchPrice) : null;
    const mode = "insensitive";

    const [market, real, cars, boats, motos, traktors, jobs] =
      await Promise.all([
        prisma.marketplace.findMany({
          where: {
            AND: keywords.map((word) => ({
              OR: [
                { title: { contains: word, mode } },
                { description: { contains: word, mode } },
                { city: { contains: word, mode } },
                { region: { contains: word, mode } },
                ...(priceValue && !isNaN(Number(word))
                  ? [
                      {
                        price: { lte: priceValue * 1.1, gte: priceValue * 0.9 },
                      },
                    ]
                  : []),
              ],
            })),
          },
        }),
        prisma.realEstate.findMany({
          where: {
            AND: keywords.map((word) => ({
              OR: [
                { title: { contains: word, mode } },
                { description: { contains: word, mode } },
                { city: { contains: word, mode } },
                { region: { contains: word, mode } },
                ...(priceValue && !isNaN(Number(word))
                  ? [
                      {
                        price: { lte: priceValue * 1.1, gte: priceValue * 0.9 },
                      },
                    ]
                  : []),
              ],
            })),
          },
        }),
        prisma.car.findMany({
          where: {
            AND: keywords.map((word) => ({
              OR: [
                { title: { contains: word, mode } },
                { description: { contains: word, mode } },
                { brand: { contains: word, mode } },
                { city: { contains: word, mode } },
                { region: { contains: word, mode } },
                ...(priceValue && !isNaN(Number(word))
                  ? [
                      {
                        price: { lte: priceValue * 1.1, gte: priceValue * 0.9 },
                      },
                    ]
                  : []),
              ],
            })),
          },
        }),
        prisma.boat.findMany({
          where: {
            AND: keywords.map((word) => ({
              OR: [
                { title: { contains: word, mode } },
                { description: { contains: word, mode } },
                { type: { contains: word, mode } },
                { city: { contains: word, mode } },
                { region: { contains: word, mode } },
                ...(priceValue && !isNaN(Number(word))
                  ? [
                      {
                        price: { lte: priceValue * 1.1, gte: priceValue * 0.9 },
                      },
                    ]
                  : []),
              ],
            })),
          },
        }),
        prisma.motorcycle.findMany({
          where: {
            AND: keywords.map((word) => ({
              OR: [
                { title: { contains: word, mode } },
                { description: { contains: word, mode } },
                { make: { contains: word, mode } },
                { city: { contains: word, mode } },
                { region: { contains: word, mode } },
                ...(priceValue && !isNaN(Number(word))
                  ? [
                      {
                        price: { lte: priceValue * 1.1, gte: priceValue * 0.9 },
                      },
                    ]
                  : []),
              ],
            })),
          },
        }),
        prisma.traktor.findMany({
          where: {
            AND: keywords.map((word) => ({
              OR: [
                { title: { contains: word, mode } },
                { description: { contains: word, mode } },
                { make: { contains: word, mode } },
                { city: { contains: word, mode } },
                { region: { contains: word, mode } },
                ...(priceValue && !isNaN(Number(word))
                  ? [
                      {
                        price: { lte: priceValue * 1.1, gte: priceValue * 0.9 },
                      },
                    ]
                  : []),
              ],
            })),
          },
        }),
        prisma.job.findMany({
          where: {
            AND: keywords.map((word) => ({
              OR: [
                { title: { contains: word, mode } },
                { description: { contains: word, mode } },
                { company: { contains: word, mode } },
                { city: { contains: word, mode } },
                { region: { contains: word, mode } },
                ...(priceValue && !isNaN(Number(word))
                  ? [{ salary: { gte: priceValue } }]
                  : []),
              ],
            })),
          },
        }),
      ]);

    const results = [
      ...market.map((i) => ({
        ...i,
        itemType: "marketplace",
        region: i.region,
        city: i.city,
      })),
      ...real.map((i) => ({
        ...i,
        itemType: "real-estate",
        region: i.region,
        city: i.city,
      })),
      ...cars.map((i) => ({
        ...i,
        itemType: "car",
        region: i.region,
        city: i.city,
      })),
      ...boats.map((i) => ({
        ...i,
        itemType: "boat",
        region: i.region,
        city: i.city,
      })),
      ...motos.map((i) => ({
        ...i,
        itemType: "motorcycle",
        region: i.region,
        city: i.city,
      })),
      ...traktors.map((i) => ({
        ...i,
        itemType: "traktor",
        region: i.region,
        city: i.city,
      })),
      ...jobs.map((i) => ({
        ...i,
        itemType: "job",
        region: i.region,
        city: i.city,
      })),
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    await cacheManager.set(cacheKey, results, 300);

    res.json(results);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Search failed" });
  }
};

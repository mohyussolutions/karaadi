import prisma from "../../core/utils/db.ts";
import cacheManager from "../../services/redisserver/cacheManager.ts";
import { Request, Response } from "express";
import { CACHE_TTL, CACHE_KEYS } from "../../constants/config.constants.ts";

interface SearchResultItem {
  id: string;
  title: string;
  description: string;
  city: string;
  region: string;
  createdAt: Date;
  price?: number;
  salary?: number;
  [key: string]: any;
}

export const globalSearch = async (req: Request, res: Response) => {
  const { q } = req.query;
  if (!q || typeof q !== "string") return res.json([]);

  const queryStr = q.trim();
  if (!queryStr) return res.json([]);

  const cacheKey = CACHE_KEYS.SEARCH_RESULTS
    ? CACHE_KEYS.SEARCH_RESULTS(queryStr.toLowerCase())
    : `search:${queryStr.toLowerCase()}`;
  const searchTTL = CACHE_TTL.SEARCH || 120;

  try {
    await cacheManager.connect?.();

    const cachedResults = await cacheManager.get(cacheKey);
    if (cachedResults) return res.json(cachedResults);

    const keywords = queryStr.split(" ").filter(Boolean);
    const searchPrice = keywords.find((word) => !isNaN(Number(word)));
    const priceValue = searchPrice ? Number(searchPrice) : null;
    const mode = "insensitive";

    const [market, real, cars, boats, motos, farmequipments, jobs] =
      await Promise.all([
        prisma.marketplace.findMany({
          where: {
            AND: keywords.map((word) => ({
              OR: [
                { title: { contains: word, mode } },
                { description: { contains: word, mode } },
                { city: { contains: word, mode } },
                { region: { contains: word, mode } },
                ...(priceValue
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
                ...(priceValue
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
                ...(priceValue
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
                ...(priceValue
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
                ...(priceValue
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
        prisma.farmequipment.findMany({
          where: {
            AND: keywords.map((word) => ({
              OR: [
                { title: { contains: word, mode } },
                { description: { contains: word, mode } },
                { make: { contains: word, mode } },
                { city: { contains: word, mode } },
                { region: { contains: word, mode } },
                ...(priceValue
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
                { city: { contains: word, mode } },
                { region: { contains: word, mode } },
                ...(priceValue ? [{ salary: { gte: priceValue } }] : []),
              ],
            })),
          },
        }),
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

    await cacheManager.set(cacheKey, results, searchTTL);
    res.json(results);
  } catch (error) {
    console.error("Search API Error:", error);
    res.status(500).json({ error: "Search failed" });
  }
};

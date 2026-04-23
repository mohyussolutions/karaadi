import prisma from "src/core/utils/db.ts";
import { Request, Response } from "express";

import cacheManager from "src/services/redisserver/cacheManager.ts";
import { SearchResultItem } from "src/types/user.types.ts";
import { CACHE_KEYS, CACHE_TTL } from "src/config/config.constants.ts";

export const globalSearch = async (req: Request, res: Response) => {
  const { q } = req.query;
  if (!q || typeof q !== "string") return res.json([]);

  const queryStr = String(q).trim();
  if (!queryStr) return res.json([]);

  const rawKeywords = queryStr.split(/[\s,]+/).map((w) =>
    String(w)
      .trim()
      .replace(/[^\w\u00C0-\u024f-]/g, ""),
  );
  const keywords = Array.from(new Set(rawKeywords.filter(Boolean))).slice(0, 8);

  const cacheKey = CACHE_KEYS.SEARCH_RESULTS
    ? CACHE_KEYS.SEARCH_RESULTS(keywords.join("+"))
    : `search:${keywords.join("+")}`;
  const searchTTL = CACHE_TTL.SEARCH || 120;

  const RESULTS_PER_TABLE = 20;

  try {
    const cached = await cacheManager.get<SearchResultItem[]>(cacheKey);
    if (cached) return res.json(cached);

    const searchPriceWord = keywords.find(
      (word) => !isNaN(Number(String(word).replace(/,/g, ""))),
    );
    const priceValue = searchPriceWord
      ? Number(String(searchPriceWord).replace(/,/g, ""))
      : null;
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
          take: RESULTS_PER_TABLE,
          orderBy: { createdAt: "desc" },
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
          take: RESULTS_PER_TABLE,
          orderBy: { createdAt: "desc" },
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
          take: RESULTS_PER_TABLE,
          orderBy: { createdAt: "desc" },
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
          take: RESULTS_PER_TABLE,
          orderBy: { createdAt: "desc" },
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
          take: RESULTS_PER_TABLE,
          orderBy: { createdAt: "desc" },
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
          take: RESULTS_PER_TABLE,
          orderBy: { createdAt: "desc" },
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
          take: RESULTS_PER_TABLE,
          orderBy: { createdAt: "desc" },
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

    try {
      await cacheManager.set(cacheKey, results, searchTTL);
    } catch (cacheErr) {
      console.warn("Search cache set failed:", cacheErr);
    }
    res.json(results);
  } catch (error) {
    console.error("Search API Error:", error);
    res.status(500).json({ error: "Search failed" });
  }
};

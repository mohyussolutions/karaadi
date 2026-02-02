import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import prisma from "core/utils/db.ts";
import cacheManager from "services/redisserver/cacheManager.ts";

export const globalSearch = async (req: Request, res: Response) => {
  const { q } = req.query;
  if (!q) return res.json([]);

  const queryStr = String(q).trim();
  const cacheKey = `search:${queryStr.toLowerCase()}`;

  try {
    const cachedResults = await cacheManager.get(cacheKey);
    if (cachedResults) {
      return res.json(cachedResults);
    }

    const keywords = queryStr.toLowerCase().split(" ").filter(Boolean);
    const searchPrice = keywords.find((word) => !isNaN(Number(word)));
    const priceValue = searchPrice ? Number(searchPrice) : null;
    const mode: Prisma.QueryMode = "insensitive";

    const [market, real, cars, boats, motos, traktors, jobs] =
      await Promise.all([
        prisma.marketplace.findMany({
          where: {
            AND: keywords.map((word) => ({
              OR: [
                { title: { contains: word, mode } },
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
      ...market.map((i) => ({ ...i, itemType: "marketplace" })),
      ...real.map((i) => ({ ...i, itemType: "real-estate" })),
      ...cars.map((i) => ({ ...i, itemType: "car" })),
      ...boats.map((i) => ({ ...i, itemType: "boat" })),
      ...motos.map((i) => ({ ...i, itemType: "motorcycle" })),
      ...traktors.map((i) => ({ ...i, itemType: "traktor" })),
      ...jobs.map((i) => ({ ...i, itemType: "job" })),
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    await cacheManager.set(cacheKey, results, 300);

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Search failed" });
  }
};

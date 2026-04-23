import prisma from "../core/utils/db.ts";
import cacheManager from "../services/redisserver/cacheManager.ts";
import { Request, Response } from "express";

const FEED_TTL = 30;

function rank(item: any): number {
  if (item.isPremium90) return 0;
  if (item.isStandard60) return 1;
  if (item.isBasic30) return 2;
  return 3;
}

function normalize(item: any, category: string) {
  const id = item.id || item._id;
  const images = (
    Array.isArray(item.images) && item.images.length
      ? item.images
      : item.image
        ? [item.image]
        : item.companyLogo
          ? [item.companyLogo]
          : item.logo
            ? [item.logo]
            : []
  )
    .filter((img: string) => img && !img.startsWith("data:"))
    .slice(0, 3);

  return {
    id,
    title: item.title || item.name || "",
    price: item.price ?? null,
    city: item.city || item.region || "",
    images,
    description: item.description || "",
    category: item.category || item.mainCategory || category,
    subcategory: item.subcategory || null,
    maGaday: !!item.maGaday,
    isBasic30: !!item.isBasic30,
    isStandard60: !!item.isStandard60,
    isPremium90: !!item.isPremium90,
    type: item.type || item.vehicleModel || "",
  };
}

export const getFeed = async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(100, Number(req.query.pageSize) || 60);
  const perCategory = Math.ceil(pageSize / 7);
  const skip = (page - 1) * perCategory;

  const cacheKey = `feed:v1:${page}:${pageSize}`;

  try {
    const cached = await cacheManager.get(cacheKey);
    if (cached) return res.json(cached);

    const now = new Date();
    const active = { OR: [{ expiryDate: null }, { expiryDate: { gt: now } }] };

    const [market, real, cars, boats, motos, farm, jobs] = await Promise.all([
      prisma.marketplace.findMany({ where: { isPaid: true, ...active }, take: perCategory, skip, orderBy: { createdAt: "desc" } }),
      prisma.realEstate.findMany({ where: { isPaid: true, ...active }, take: perCategory, skip, orderBy: { createdAt: "desc" } }),
      prisma.car.findMany({ where: { isPaid: true, ...active }, take: perCategory, skip, orderBy: { createdAt: "desc" } }),
      prisma.boat.findMany({ where: { isPaid: true, ...active }, take: Math.max(1, Math.floor(perCategory / 2)), skip, orderBy: { createdAt: "desc" } }),
      prisma.motorcycle.findMany({ where: { isPaid: true, ...active }, take: perCategory, skip, orderBy: { createdAt: "desc" } }),
      prisma.farmequipment.findMany({ where: { isPaid: true, ...active }, take: perCategory, skip, orderBy: { createdAt: "desc" } }),
      prisma.job.findMany({ where: { isPaid: true, ...active }, take: perCategory, skip, orderBy: { createdAt: "desc" } }),
    ]);

    const all = [
      ...market.map((i) => normalize(i, "marketplace")),
      ...real.map((i) => normalize(i, "real-estate")),
      ...cars.map((i) => normalize(i, "cars")),
      ...boats.map((i) => normalize(i, "boats")),
      ...motos.map((i) => normalize(i, "motorcycles")),
      ...farm.map((i) => normalize(i, "traktor")),
      ...jobs.map((i) => normalize(i, "jobs")),
    ];

    const seen = new Set<string>();
    const deduped = all.filter((item) => {
      const id = String(item.id ?? "");
      if (!id || id === "undefined" || seen.has(id)) return false;
      seen.add(id);
      return true;
    });

    const n = deduped.length || 1;
    const bucket = n / 4;
    const sorted = deduped
      .map((item) => ({ item, score: rank(item) * bucket + Math.random() * bucket }))
      .sort((a, b) => a.score - b.score)
      .map((x) => x.item);

    await cacheManager.set(cacheKey, sorted, FEED_TTL);
    res.json(sorted);
  } catch (err) {
    console.error("Feed error:", err);
    res.status(500).json([]);
  }
};

import cacheManager from "src/services/redis/cacheManager.ts";
import prisma from "../core/utils/db.ts";
import { Request, Response } from "express";

const FEED_TTL = 300;
const BASE_SELECT = {
  id: true,
  title: true,
  description: true,
  maGaday: true,
  isBasic30: true,
  isStandard60: true,
  isPremium90: true,
  expiryDate: true,
};
const SPATIAL = { price: true, city: true, region: true, images: true };
const JOB_SELECT = {
  ...BASE_SELECT,
  salary: true,
  mainCategory: true,
  category: true,
  subcategory: true,
};

function rank(item: any): number {
  if (item.isPremium90) return 0;
  if (item.isStandard60) return 1;
  if (item.isBasic30) return 2;
  return 3;
}

function normalize(item: any, category: string) {
  const id = item.id || item._id;
  const raw: string[] = Array.isArray(item.images) && item.images.length
    ? item.images
    : item.image
      ? [item.image]
      : item.companyLogo
        ? [item.companyLogo]
        : item.logo
          ? [item.logo]
          : [];
  const images = raw
    .filter((img: string) => img && img.trim() !== "")
    .slice(0, 1)
    .map((img: string) =>
      img.startsWith("data:") ? `api/images/${category}/${id}` : img,
    );

  return {
    id,
    title: item.title || item.name || "",
    price: item.price ?? item.salary ?? null,
    city: item.city || item.region || "",
    images,
    description: item.description || "",
    category: item.category || item.mainCategory || category,
    subcategory: item.subcategory || null,
    maGaday: !!item.maGaday,
    isBasic30: !!item.isBasic30,
    isStandard60: !!item.isStandard60,
    isPremium90: !!item.isPremium90,
    type: item.vehicleModel || item.type || "",
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

    const q = (model: any, extra?: object) =>
      model.findMany({
        where: { isPaid: true, ...active },
        select: { ...BASE_SELECT, ...SPATIAL, ...extra },
        take: perCategory,
        skip,
        orderBy: { createdAt: "desc" },
      });

    const opts = {
      where: { isPaid: true, ...active },
      take: perCategory,
      skip,
      orderBy: { createdAt: "desc" as const },
    };

    const [market, real, cars, boats, motos, farm, jobs] = await Promise.all([
      q(prisma.marketplace, { category: true, subcategory: true }),
      q(prisma.realEstate, { mainCategory: true }),
      q(prisma.car, { mainCategory: true, vehicleModel: true }),
      q(prisma.boat, { type: true }),
      q(prisma.motorcycle, { type: true }),
      q(prisma.farmequipment, {}),
      prisma.job.findMany({ ...opts, select: JOB_SELECT }),
    ]);

    const all = [
      ...market.map((i: any) => normalize(i, "marketplace")),
      ...real.map((i: any) => normalize(i, "real-estate")),
      ...cars.map((i: any) => normalize(i, "cars")),
      ...boats.map((i: any) => normalize(i, "boats")),
      ...motos.map((i: any) => normalize(i, "motorcycles")),
      ...farm.map((i: any) => normalize(i, "traktor")),
      ...jobs.map((i: any) => normalize(i, "jobs")),
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
      .map((item) => ({
        item,
        score: rank(item) * bucket + Math.random() * bucket,
      }))
      .sort((a, b) => a.score - b.score)
      .map((x) => x.item);

    await cacheManager.set(cacheKey, sorted, FEED_TTL);
    res.json(sorted);
  } catch (err) {
    console.error("Feed error:", err);
    res.status(500).json([]);
  }
};

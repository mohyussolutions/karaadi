import { Request, Response } from "express";
import prisma from "../core/utils/db.ts";
import cacheManager from "../services/redisserver/cacheManager.ts";

const monthKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

const mergeToCountMap = (rows: any[], key: string): Record<string, number> => {
  const map: Record<string, number> = {};
  for (const row of rows.flat())
    map[row[key]] = (map[row[key]] ?? 0) + row._count.id;
  return map;
};

async function fetchCategoryTotals() {
  const [marketplace, cars, boats, motorcycles, realEstate, farmEquipment] =
    await Promise.all([
      prisma.marketplace.count(),
      prisma.car.count(),
      prisma.boat.count(),
      prisma.motorcycle.count(),
      prisma.realEstate.count(),
      prisma.farmequipment.count(),
    ]);
  return { marketplace, cars, boats, motorcycles, realEstate, farmEquipment };
}

async function fetchStatTotals() {
  const [users, visitors, messages, ads, subscriptions, regions, cities] =
    await Promise.all([
      prisma.user.count(),
      prisma.visitor.count(),
      prisma.customerSupportTicket.count(),
      prisma.advertisement.count(),
      prisma.subscription.count(),
      prisma.region.count(),
      prisma.city.count(),
    ]);
  return { users, visitors, messages, ads, subscriptions, regions, cities };
}

async function fetchPayments(since: Date) {
  return prisma.payment.findMany({
    where: { createdAt: { gte: since }, status: "COMPLETED" },
    select: { createdAt: true, totalAmount: true },
  });
}

async function fetchSignupGroups(since: Date) {
  return prisma.user.groupBy({
    by: ["createdAt"],
    _count: { id: true },
    where: { createdAt: { gte: since } },
    orderBy: { createdAt: "asc" },
  });
}

async function fetchRegionGroups() {
  return Promise.all([
    prisma.marketplace.groupBy({ by: ["region"], _count: { id: true } }),
    prisma.car.groupBy({ by: ["region"], _count: { id: true } }),
    prisma.realEstate.groupBy({ by: ["region"], _count: { id: true } }),
    prisma.motorcycle.groupBy({ by: ["region"], _count: { id: true } }),
    prisma.boat.groupBy({ by: ["region"], _count: { id: true } }),
    prisma.farmequipment.groupBy({ by: ["region"], _count: { id: true } }),
  ]);
}

async function fetchCityGroups() {
  return Promise.all([
    prisma.marketplace.groupBy({ by: ["city"], _count: { id: true } }),
    prisma.car.groupBy({ by: ["city"], _count: { id: true } }),
    prisma.realEstate.groupBy({ by: ["city"], _count: { id: true } }),
    prisma.motorcycle.groupBy({ by: ["city"], _count: { id: true } }),
    prisma.boat.groupBy({ by: ["city"], _count: { id: true } }),
    prisma.farmequipment.groupBy({ by: ["city"], _count: { id: true } }),
  ]);
}

// ─── builders (call fetchers, return shaped data) ────────────────────────────

async function getRevenue(since: Date) {
  const payments = await fetchPayments(since);
  const map: Record<string, number> = {};
  for (const r of payments) {
    const k = monthKey(new Date(r.createdAt));
    map[k] = (map[k] ?? 0) + Number(r.totalAmount ?? 0);
  }
  return Object.entries(map).map(([month, revenue]) => ({ month, revenue }));
}

async function getSignups(since: Date) {
  const raw = await fetchSignupGroups(since);
  const sorted = [...raw].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
  const map: Record<string, number> = {};
  for (const r of sorted) {
    const k = monthKey(new Date(r.createdAt));
    map[k] = (map[k] ?? 0) + r._count.id;
  }
  let running = 0;
  return Object.entries(map).map(([month, users]) => {
    running += users;
    return { month, users, totalUsers: running };
  });
}

async function getRegionListings() {
  const raw = await fetchRegionGroups();
  const countMap = mergeToCountMap(raw, "region");
  const ids = Object.keys(countMap);
  const names = ids.length
    ? await prisma.region.findMany({
        where: { id: { in: ids } },
        select: { id: true, name: true },
      })
    : [];
  return Object.entries(countMap)
    .map(([id, buyers]) => ({
      name: names.find((r) => r.id === id)?.name || id,
      buyers,
    }))
    .sort((a, b) => b.buyers - a.buyers);
}

async function getCityListings() {
  const raw = await fetchCityGroups();
  const countMap = mergeToCountMap(raw, "city");
  const ids = Object.keys(countMap);
  const names = ids.length
    ? await prisma.city.findMany({
        where: { id: { in: ids } },
        select: { id: true, name: true },
      })
    : [];
  return Object.entries(countMap)
    .map(([id, buyers]) => ({
      name: names.find((c) => c.id === id)?.name || id || "Unknown",
      buyers,
    }))
    .sort((a, b) => b.buyers - a.buyers)
    .slice(0, 20);
}

export const getDashboardSummary = async (_req: Request, res: Response) => {
  const CACHE_KEY = "dashboard:summary:v2";
  const CACHE_TTL = 60;

  try {
    const cached = await cacheManager.get(CACHE_KEY);
    if (cached) {
      res.setHeader("X-Cache", "HIT");
      return res.json(cached);
    }

    const since = new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1);

    const [categoryTotals, stats, revenue, signups, regionListings, cityListings] =
      await Promise.all([
        fetchCategoryTotals(),
        fetchStatTotals(),
        getRevenue(since),
        getSignups(since),
        getRegionListings(),
        getCityListings(),
      ]);

    const payload = { categoryTotals, stats, revenue, signups, regionListings, cityListings };
    await cacheManager.set(CACHE_KEY, payload, CACHE_TTL);
    res.setHeader("X-Cache", "MISS");
    res.json(payload);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch dashboard summary", message: error.message });
  }
};

import { Request, Response } from "express";
import prisma from "../core/utils/db.ts";

export const getDashboardSummary = async (_req: Request, res: Response) => {
  try {
    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const monthKey = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const [counts, analytics] = await Promise.all([
      Promise.all([
        prisma.marketplace.count(),
        prisma.car.count(),
        prisma.boat.count(),
        prisma.motorcycle.count(),
        prisma.realEstate.count(),
        prisma.farmequipment.count(),
        prisma.user.count(),
        prisma.visitor.count(),
        prisma.customerSupportTicket.count(),
        prisma.advertisement.count(),
        prisma.subscription.count(),
        prisma.agency.count(),
        prisma.region.count(),
        prisma.city.count(),
      ]),
      Promise.allSettled([
        prisma.payment.findMany({
          where: { createdAt: { gte: twelveMonthsAgo }, status: "COMPLETED" },
          select: { createdAt: true, totalAmount: true },
        }),
        prisma.user.groupBy({
          by: ["createdAt"],
          _count: { id: true },
          where: { createdAt: { gte: twelveMonthsAgo } },
          orderBy: { createdAt: "asc" },
        }),
        Promise.all([
          prisma.marketplace.groupBy({ by: ["region"], _count: { id: true } }),
          prisma.car.groupBy({ by: ["region"], _count: { id: true } }),
          prisma.realEstate.groupBy({ by: ["region"], _count: { id: true } }),
          prisma.motorcycle.groupBy({ by: ["region"], _count: { id: true } }),
          prisma.boat.groupBy({ by: ["region"], _count: { id: true } }),
          prisma.farmequipment.groupBy({
            by: ["region"],
            _count: { id: true },
          }),
        ]),
        Promise.all([
          prisma.marketplace.groupBy({ by: ["city"], _count: { id: true } }),
          prisma.car.groupBy({ by: ["city"], _count: { id: true } }),
          prisma.realEstate.groupBy({ by: ["city"], _count: { id: true } }),
          prisma.motorcycle.groupBy({ by: ["city"], _count: { id: true } }),
          prisma.boat.groupBy({ by: ["city"], _count: { id: true } }),
          prisma.farmequipment.groupBy({ by: ["city"], _count: { id: true } }),
        ]),
      ]),
    ]);

    const [
      marketplaceCount,
      carsCount,
      boatsCount,
      motorcyclesCount,
      realEstateCount,
      farmEquipmentCount,
      usersCount,
      visitorsCount,
      ticketsCount,
      adsCount,
      subscriptionsCount,
      agenciesCount,
      regionsCount,
      citiesCount,
    ] = counts;

    const paymentsRaw =
      analytics[0].status === "fulfilled" ? analytics[0].value : [];
    const signupsRaw =
      analytics[1].status === "fulfilled" ? analytics[1].value : [];
    const regionListingsRaw =
      analytics[2].status === "fulfilled" ? analytics[2].value : [];
    const cityListingsRaw =
      analytics[3].status === "fulfilled" ? analytics[3].value : [];

    const revenueMap: Record<string, number> = {};
    for (const r of paymentsRaw) {
      const k = monthKey(new Date(r.createdAt));
      revenueMap[k] = (revenueMap[k] ?? 0) + Number(r.totalAmount ?? 0);
    }
    const revenue = Object.entries(revenueMap).map(([month, revenue]) => ({
      month,
      revenue,
    }));

    const signupMap: Record<string, number> = {};
    let runningTotal = 0;
    const signupsSorted = [...signupsRaw].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
    for (const r of signupsSorted) {
      const k = monthKey(new Date(r.createdAt));
      signupMap[k] = (signupMap[k] ?? 0) + r._count.id;
    }
    runningTotal = 0;
    const signups = Object.entries(signupMap).map(([month, users]) => {
      runningTotal += users;
      return { month, users, totalUsers: runningTotal };
    });

    const regionCountMap: Record<string, number> = {};
    for (const row of (regionListingsRaw as any[]).flat()) {
      regionCountMap[row.region] =
        (regionCountMap[row.region] ?? 0) + row._count.id;
    }
    const allRegionIds = Object.keys(regionCountMap);
    const regionNames = allRegionIds.length
      ? await prisma.region.findMany({
          where: { id: { in: allRegionIds } },
          select: { id: true, name: true },
        })
      : [];
    const regionListings = Object.entries(regionCountMap)
      .map(([id, buyers]) => ({
        name: regionNames.find((r) => r.id === id)?.name || id,
        buyers,
      }))
      .sort((a, b) => b.buyers - a.buyers);

    const cityCountMap: Record<string, number> = {};
    for (const row of (cityListingsRaw as any[]).flat()) {
      cityCountMap[row.city] = (cityCountMap[row.city] ?? 0) + row._count.id;
    }
    const allCityIds = Object.keys(cityCountMap);
    const cityNames = allCityIds.length
      ? await prisma.city.findMany({
          where: { id: { in: allCityIds } },
          select: { id: true, name: true },
        })
      : [];
    const cityListings = Object.entries(cityCountMap)
      .map(([id, buyers]) => ({
        name: cityNames.find((c) => c.id === id)?.name || id || "Unknown",
        buyers,
      }))
      .sort((a, b) => b.buyers - a.buyers)
      .slice(0, 20);

    res.json({
      categoryTotals: {
        marketplace: marketplaceCount,
        cars: carsCount,
        boats: boatsCount,
        motorcycles: motorcyclesCount,
        realEstate: realEstateCount,
        farmEquipment: farmEquipmentCount,
      },
      stats: {
        users: usersCount,
        visitors: visitorsCount,
        messages: ticketsCount,
        ads: adsCount,
        subscriptions: subscriptionsCount,
        agencies: agenciesCount,
        regions: regionsCount,
        cities: citiesCount,
      },
      revenue,
      signups,
      regionListings,
      cityListings,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({
        error: "Failed to fetch dashboard summary",
        message: error.message,
      });
  }
};

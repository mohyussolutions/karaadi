"use server";

import { getTotalUsersAction } from "./usersAction";
import { fetchVisitors } from "./visitorActions";
import { getTicketStats } from "./contactMeAction";
import { getAdStats } from "./advertisementService";
import { getTotalSubscriptions } from "./subscriptionsActions";
import { getAgencyStats } from "./actionsAgency";
import { getGeoStats } from "./geoAction";

export interface DashboardStats {
  users: number;
  visitors: number;
  messages: number;
  ads: number;
  subscriptions: number;
  agencies: number;
  regions: number;
  cities: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [users, visitors, tickets, ads, subs, agencies, geo] = await Promise.all([
    getTotalUsersAction().catch(() => ({ data: 0 })),
    fetchVisitors().catch(() => []),
    getTicketStats().catch(() => ({ total: 0, today: 0 })),
    getAdStats().catch(() => ({ totalAds: 0 })),
    getTotalSubscriptions().catch(() => ({ total: 0 })),
    getAgencyStats().catch(() => ({ total: 0, verified: 0 })),
    getGeoStats().catch(() => ({ totalRegions: 0, totalCities: 0 })),
  ]);

  return {
    users: (users as any)?.data ?? 0,
    visitors: Array.isArray(visitors) ? visitors.length : 0,
    messages: (tickets as any)?.today ?? (tickets as any)?.total ?? 0,
    ads: (ads as any)?.totalAds ?? 0,
    subscriptions: (subs as any)?.total ?? (subs as any)?.count ?? 0,
    agencies: (agencies as any)?.total ?? 0,
    regions: (geo as any)?.totalRegions ?? 0,
    cities: (geo as any)?.totalCities ?? 0,
  };
}

"use server";

import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";
import { BASE_API_URL } from "../constant/BASE_API_URL";

export interface DashboardSummaryData {
  categoryTotals: {
    marketplace: number;
    cars: number;
    boats: number;
    motorcycles: number;
    realEstate: number;
    farmEquipment: number;
  };
  stats: {
    users: number;
    visitors: number;
    messages: number;
    ads: number;
    subscriptions: number;
    agencies: number;
    regions: number;
    cities: number;
  };
  revenue: { month: string; revenue: number }[];
  signups: { month: string; users: number; totalUsers: number }[];
  regionListings: { name: string; buyers: number }[];
  cityListings: { name: string; buyers: number }[];
}

const EMPTY: DashboardSummaryData = {
  categoryTotals: { marketplace: 0, cars: 0, boats: 0, motorcycles: 0, realEstate: 0, farmEquipment: 0 },
  stats: { users: 0, visitors: 0, messages: 0, ads: 0, subscriptions: 0, agencies: 0, regions: 0, cities: 0 },
  revenue: [],
  signups: [],
  regionListings: [],
  cityListings: [],
};

export async function getDashboardSummary(): Promise<DashboardSummaryData> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_API_URL}/api/dashboard/summary`, {
      headers: headers as HeadersInit,
      cache: "no-store",
    });
    return res.ok ? await res.json() : EMPTY;
  } catch {
    return EMPTY;
  }
}

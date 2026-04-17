"use server";

import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";
import { apiUrlsForCharts } from "../constant/constant";

export interface RevenueData {
  month: string;
  revenue: number;
}

export interface UserSignupData {
  month: string;
  users: number;
  totalUsers?: number;
}

export interface ChartData {
  name: string;
  buyers: number;
  [key: string]: string | number;
}

export async function getRegionData(token?: string): Promise<ChartData[]> {
  try {
    const headers = await getAuthHeaders(token);
    const response = await fetch(apiUrlsForCharts.GetRegionData, {
      method: "GET",
      headers: headers as HeadersInit,
      cache: "no-store",
    });
    return response.ok ? await response.json() : [];
  } catch {
    return [];
  }
}

export async function getCityData(token?: string): Promise<ChartData[]> {
  try {
    const headers = await getAuthHeaders(token);
    const response = await fetch(apiUrlsForCharts.GetCityData, {
      method: "GET",
      headers: headers as HeadersInit,
      cache: "no-store",
    });
    return response.ok ? await response.json() : [];
  } catch {
    return [];
  }
}

export async function getUserSignupData(
  token?: string,
): Promise<UserSignupData[]> {
  try {
    const headers = await getAuthHeaders(token);
    const response = await fetch(apiUrlsForCharts.GetUserSignupData, {
      method: "GET",
      headers: headers as HeadersInit,
      cache: "no-store",
    });
    if (!response.ok) return [];
    const json = await response.json();
    return Array.isArray(json) ? json : [];
  } catch {
    return [];
  }
}

export async function getRevenueData(token?: string): Promise<RevenueData[]> {
  try {
    const headers = await getAuthHeaders(token);
    const response = await fetch(apiUrlsForCharts.GetRevenueData, {
      method: "GET",
      headers: headers as HeadersInit,
      cache: "no-store",
    });
    if (!response.ok) return [];
    const json = await response.json();
    if (Array.isArray(json)) return json;
    if (json && Array.isArray(json.data)) return json.data;
    return [];
  } catch {
    return [];
  }
}

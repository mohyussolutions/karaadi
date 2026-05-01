"use server";

import { FILTERING_ENDPOINTS, geoEndpoints } from "../constant/constant";
import { Region } from "@/app/utils/types/geoTypes";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";

export const getTotalOfCities = async (): Promise<number> => {
  const stats = await getGeoStats();
  return stats.totalCities || 0;
};

export const getTotalOfRegions = async (): Promise<number> => {
  const stats = await getGeoStats();
  return stats.totalRegions || 0;
};

export const getAllRegions = async (): Promise<Region[]> => {
  const headers = await getAuthHeaders();
  const [regRes, cityRes] = await Promise.all([
    fetch(geoEndpoints.GET_ALL_REGIONS, { headers: headers as HeadersInit, next: { revalidate: 300 } }),
    fetch(geoEndpoints.GET_ALL_CITIES, { headers: headers as HeadersInit, next: { revalidate: 300 } }),
  ]);
  if (!regRes.ok) return [];
  const regions: Region[] = await regRes.json();
  const cities = cityRes.ok ? await cityRes.json() : [];
  if (!regions[0]?.cities) {
    const cityMap = new Map<string, typeof cities>();
    for (const city of cities) {
      if (!cityMap.has(city.regionId)) cityMap.set(city.regionId, []);
      cityMap.get(city.regionId)!.push(city);
    }
    return regions.map((r) => ({ ...r, cities: cityMap.get(r.id) ?? [] }));
  }
  return regions;
};

export const addRegion = async (data: { id: string; name: string }) => {
  const headers = await getAuthHeaders();
  const res = await fetch(geoEndpoints.ADD_REGION, {
    method: "POST",
    headers: headers as HeadersInit,
    body: JSON.stringify(data),
    cache: "no-store",
  });
  return { success: res.ok, data: await res.json() };
};

export const updateRegion = async (id: string, name: string) => {
  const headers = await getAuthHeaders();
  const res = await fetch(geoEndpoints.UPDATE_REGION(id), {
    method: "PUT",
    headers: headers as HeadersInit,
    body: JSON.stringify({ name }),
    cache: "no-store",
  });
  return { success: res.ok, data: await res.json() };
};

export const deleteRegion = async (id: string) => {
  const headers = await getAuthHeaders();
  const res = await fetch(geoEndpoints.DELETE_REGION(id), {
    method: "DELETE",
    headers: headers as HeadersInit,
    cache: "no-store",
  });
  return { success: res.ok };
};

export const getAllCities = async (regionId?: string) => {
  const headers = await getAuthHeaders();
  const url = regionId
    ? `${geoEndpoints.GET_ALL_CITIES}?regionId=${regionId}`
    : geoEndpoints.GET_ALL_CITIES;
  const res = await fetch(url, {
    headers: headers as HeadersInit,
    next: { revalidate: 300 },
  });
  return res.ok ? await res.json() : [];
};

export const addCity = async (data: { name: string; regionId: string }) => {
  const headers = await getAuthHeaders();
  const res = await fetch(geoEndpoints.ADD_CITY, {
    method: "POST",
    headers: headers as HeadersInit,
    body: JSON.stringify(data),
    cache: "no-store",
  });
  return { success: res.ok, data: await res.json() };
};

export const updateCity = async (id: string, data: { name?: string; isActive?: boolean }) => {
  const headers = await getAuthHeaders();
  const res = await fetch(geoEndpoints.UPDATE_CITY(id), {
    method: "PATCH",
    headers: headers as HeadersInit,
    body: JSON.stringify(data),
    cache: "no-store",
  });
  return { success: res.ok, data: await res.json() };
};

export const deleteCity = async (id: string) => {
  const headers = await getAuthHeaders();
  const res = await fetch(geoEndpoints.DELETE_CITY(id), {
    method: "DELETE",
    headers: headers as HeadersInit,
    cache: "no-store",
  });
  return { success: res.ok };
};

export const getGeoStats = async () => {
  const headers = await getAuthHeaders();
  const res = await fetch(geoEndpoints.GET_GEO_STATS, {
    headers: headers as HeadersInit,
    next: { revalidate: 60 },
  });
  return res.ok
    ? await res.json()
    : { totalRegions: 0, totalCities: 0, totalDistricts: 0 };
};

export const syncGeoData = async (payload: Record<string, unknown>) => {
  const headers = await getAuthHeaders();
  const res = await fetch(geoEndpoints.SYNC_DATA, {
    method: "POST",
    headers: headers as HeadersInit,
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  return { success: res.ok, data: await res.json() };
};

export const filterByPriceAndRooms = async (filters: {
  region?: string;
  city?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  minRooms?: string | number;
  maxRooms?: string | number;
}) => {
  const headers = await getAuthHeaders();
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.append(key, value.toString());
    }
  });
  const res = await fetch(
    `${FILTERING_ENDPOINTS.RANGE_PRICE_ROOMS}?${params.toString()}`,
    {
      headers: headers as HeadersInit,
      cache: "no-store",
    },
  );
  return res.ok ? await res.json() : [];
};

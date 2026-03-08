"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { FILTERING_ENDPOINTS, geoEndpoints } from "../constant/constant";
import { GeoStats, Region } from "@/app/utils/types/geoTypes";

export const getTotalOfCities = async (): Promise<number> => {
  const stats = await getGeoStats();
  return stats.totalCities || 0;
};

export const getTotalOfRegions = async (): Promise<number> => {
  const stats = await getGeoStats();
  return stats.totalRegions || 0;
};

export const getAllRegions = async (): Promise<Region[]> => {
  try {
    const res = await fetch(geoEndpoints.GET_ALL_REGIONS, {
      cache: "no-store",
      next: { tags: ["geo-regions"] },
    });
    return res.ok ? await res.json() : [];
  } catch {
    return [];
  }
};

export const addRegion = async (data: { id: string; name: string }) => {
  try {
    const res = await fetch(geoEndpoints.ADD_REGION, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      revalidateTag("geo-regions");
      revalidateTag("geo-stats");
      revalidatePath("/");
    }
    return { success: res.ok, data: await res.json() };
  } catch {
    return { success: false };
  }
};

export const updateRegion = async (id: string, name: string) => {
  try {
    const res = await fetch(geoEndpoints.UPDATE_REGION(id), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      revalidateTag("geo-regions");
      revalidatePath("/");
    }
    return { success: res.ok, data: await res.json() };
  } catch {
    return { success: false };
  }
};

export const deleteRegion = async (id: string) => {
  try {
    const res = await fetch(geoEndpoints.DELETE_REGION(id), {
      method: "DELETE",
    });
    if (res.ok) {
      revalidateTag("geo-regions");
      revalidateTag("geo-stats");
      revalidatePath("/");
    }
    return { success: res.ok };
  } catch {
    return { success: false };
  }
};

export const getAllCities = async (regionId?: string) => {
  try {
    const url = regionId
      ? `${geoEndpoints.GET_ALL_CITIES}?regionId=${regionId}`
      : geoEndpoints.GET_ALL_CITIES;

    const res = await fetch(url, {
      cache: "no-store",
      next: { tags: ["geo-cities"] },
    });
    return res.ok ? await res.json() : [];
  } catch {
    return [];
  }
};

export const addCity = async (
  newCityName: string,
  newCitySo: string,
  region: string,
  data: {
    id: string;
    name: string;
    regionId: string;
    isActive: boolean;
  },
) => {
  try {
    const res = await fetch(geoEndpoints.ADD_CITY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      revalidateTag("geo-cities");
      revalidateTag("geo-stats");
      return { success: true, data: result };
    }

    return { success: false, message: result.error || "Lama darid karo" };
  } catch {
    return { success: false, message: "Cillad ayaa dhacday" };
  }
};

export const deleteCity = async (id: string) => {
  try {
    const res = await fetch(geoEndpoints.DELETE_CITY(id), { method: "DELETE" });
    if (res.ok) {
      revalidateTag("geo-cities");
      revalidateTag("geo-stats");
      revalidatePath("/");
    }
    return { success: res.ok };
  } catch {
    return { success: false };
  }
};

export const getGeoStats = async (): Promise<GeoStats> => {
  try {
    const res = await fetch(geoEndpoints.GET_GEO_STATS, {
      cache: "no-store",
      next: { tags: ["geo-stats"] },
    });
    return res.ok ? await res.json() : { totalRegions: 0, totalCities: 0 };
  } catch {
    return { totalRegions: 0, totalCities: 0 };
  }
};

export const syncGeoData = async (payload: any) => {
  try {
    const res = await fetch(geoEndpoints.SYNC_DATA, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      revalidateTag("geo-regions");
      revalidateTag("geo-cities");
      revalidateTag("geo-stats");
      revalidatePath("/");
    }
    return { success: res.ok, data: await res.json() };
  } catch {
    return { success: false };
  }
};

export const filterByPriceAndRooms = async (filters: {
  region?: string;
  city?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  minRooms?: string | number;
  maxRooms?: string | number;
}) => {
  try {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.append(key, value.toString());
      }
    });

    const url = `${FILTERING_ENDPOINTS.RANGE_PRICE_ROOMS}?${params.toString()}`;

    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    return [];
  }
};

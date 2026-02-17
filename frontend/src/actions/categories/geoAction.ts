"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { geoEndpoints } from "../constant/constant";
import { GeoStats, Region } from "@/app/utils/types/geoTypes";

export const getAllRegions = async (): Promise<Region[]> => {
  try {
    const res = await fetch(geoEndpoints.GET_ALL_REGIONS, {
      next: {
        revalidate: 86400,
        tags: ["geo-regions"],
      },
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

export const getAllCities = async () => {
  try {
    const res = await fetch(geoEndpoints.GET_ALL_CITIES, {
      next: {
        revalidate: 86400,
        tags: ["geo-cities"],
      },
    });
    return res.ok ? await res.json() : [];
  } catch {
    return [];
  }
};

export const addCity = async (data: {
  id: string;
  name: string;
  regionId: string;
  isActive: boolean;
}) => {
  try {
    const res = await fetch(geoEndpoints.ADD_CITY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      revalidateTag("geo-cities");
      revalidateTag("geo-stats");
    }
    return { success: res.ok, data: await res.json() };
  } catch {
    return { success: false };
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
    const res = await fetch(geoEndpoints.TOTAL_STATS, {
      next: {
        revalidate: 3600,
        tags: ["geo-stats"],
      },
    });
    return res.ok ? await res.json() : { totalRegions: 0, totalCities: 0 };
  } catch {
    return { totalRegions: 0, totalCities: 0 };
  }
};

export const getTotalOfRegions = async (): Promise<number> => {
  const stats = await getGeoStats();
  return stats.totalRegions;
};

export const getTotalOfCities = async (): Promise<number> => {
  const stats = await getGeoStats();
  return stats.totalCities;
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

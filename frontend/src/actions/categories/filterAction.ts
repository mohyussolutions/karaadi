"use server";

import { revalidateTag } from "next/cache";
import { FILTERING_ENDPOINTS } from "../constant/constant";

export interface FilterParams {
  q?: string;
  region?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
}

export async function getGlobalFilteredResults(params: FilterParams) {
  try {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${FILTERING_ENDPOINTS.BASE}${FILTERING_ENDPOINTS.GLOBAL}?${queryParams.toString()}`;

    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    return [];
  }
}

export async function getFilterMetadata() {
  try {
    const url = `${FILTERING_ENDPOINTS.BASE}${FILTERING_ENDPOINTS.METADATA}`;

    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) return { regions: [] };
    return await res.json();
  } catch (error) {
    return { regions: [] };
  }
}

export async function clearSearchCache() {
  revalidateTag("global-search");
}

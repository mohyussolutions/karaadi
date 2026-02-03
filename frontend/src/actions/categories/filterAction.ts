"use server";

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

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to fetch filtered results");
    }

    return await res.json();
  } catch (error) {
    console.error("Filter Action Error:", error);
    return [];
  }
}

export async function getFilterMetadata() {
  try {
    const url = `${FILTERING_ENDPOINTS.BASE}${FILTERING_ENDPOINTS.METADATA}`;

    const res = await fetch(url, {
      method: "GET",
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch filter metadata");
    }

    return await res.json();
  } catch (error) {
    console.error("Metadata Action Error:", error);
    return { regions: [] };
  }
}

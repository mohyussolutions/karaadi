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
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== null) {
      queryParams.append(key, value.toString());
    }
  });

  const res = await fetch(
    `${FILTERING_ENDPOINTS.BASE}${FILTERING_ENDPOINTS.GLOBAL}?${queryParams.toString()}`,
    {
      cache: "no-store",
    },
  );

  return res.ok ? res.json() : [];
}

export async function getFilterMetadata() {
  const res = await fetch(
    `${FILTERING_ENDPOINTS.BASE}${FILTERING_ENDPOINTS.METADATA}`,
    {
      cache: "no-store",
    },
  );

  return res.ok ? res.json() : { regions: [] };
}

export async function clearSearchCache() {
  return;
}

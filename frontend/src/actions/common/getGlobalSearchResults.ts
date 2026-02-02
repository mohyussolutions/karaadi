"use server";

import { SEARCH_ENDPOINT } from "../constant/constant";

export async function getGlobalSearchResults(query: string) {
  try {
    const res = await fetch(
      `${SEARCH_ENDPOINT}?q=${encodeURIComponent(query)}`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Search Action Error:", error);
    return [];
  }
}

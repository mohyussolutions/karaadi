"use server";

import { unstable_cache } from "next/cache";
import { UniversalCardProps } from "@/app/utils/types/universalCard.types";
import { FEED_ENDPOINTS } from "../constant/constant";

export const loadFeedPage = unstable_cache(
  async (page: number): Promise<UniversalCardProps[]> => {
    try {
      const res = await fetch(FEED_ENDPOINTS.PAGE(page), {
        cache: "no-store",
      });
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? (data as UniversalCardProps[]) : [];
    } catch {
      return [];
    }
  },
  ["feed-page"],
  { revalidate: 30 },
);

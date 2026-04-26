"use server";

import { UniversalCardProps } from "@/app/utils/types/universalCard.types";
import { FEED_ENDPOINTS } from "../constant/constant";

export async function loadFeedPage(page: number): Promise<UniversalCardProps[]> {
  try {
    const res = await fetch(FEED_ENDPOINTS.PAGE(page), {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? (data as UniversalCardProps[]) : [];
  } catch {
    return [];
  }
}

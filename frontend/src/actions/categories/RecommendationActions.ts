"use server";

import {
  CategoryCTR,
  CategoryStats,
  CreateRecommendationData,
  RecommendationItem,
} from "@/app/utils/types/recommendation";
import { RECOMMENDATION_ENDPOINTS } from "../constant/constant";

export async function fetchRecommendations(
  userId?: string | null,
  limit: number = 6,
): Promise<RecommendationItem[]> {
  const url = userId
    ? `${RECOMMENDATION_ENDPOINTS.RECOMMENDATIONS}?limit=${limit}&userId=${userId}`
    : `${RECOMMENDATION_ENDPOINTS.RECOMMENDATIONS}?limit=${limit}`;

  const res = await fetch(url, { cache: "no-store" });
  return res.ok ? await res.json() : [];
}

export async function fetchMostViewedCategories(
  limit: number = 5,
): Promise<CategoryStats[]> {
  const res = await fetch(
    `${RECOMMENDATION_ENDPOINTS.MOST_VIEWED_CATEGORIES}?limit=${limit}`,
    { cache: "no-store" },
  );
  return res.ok ? await res.json() : [];
}

export async function fetchUserTopCategories(
  userId: string,
  limit: number = 3,
): Promise<CategoryStats[]> {
  const res = await fetch(
    `${RECOMMENDATION_ENDPOINTS.USER_TOP_CATEGORIES}?limit=${limit}`,
    {
      headers: userId ? { "X-User-Id": userId } : {},
      cache: "no-store",
    },
  );
  return res.ok ? await res.json() : [];
}

export async function fetchTrendingCategories(
  hours: number = 24,
): Promise<CategoryStats[]> {
  const res = await fetch(
    `${RECOMMENDATION_ENDPOINTS.TRENDING_CATEGORIES}?hours=${hours}`,
    { cache: "no-store" },
  );
  return res.ok ? await res.json() : [];
}

export async function fetchMostClickedItems(
  limit: number = 10,
): Promise<RecommendationItem[]> {
  const res = await fetch(
    `${RECOMMENDATION_ENDPOINTS.MOST_CLICKED_ITEMS}?limit=${limit}`,
    { cache: "no-store" },
  );
  return res.ok ? await res.json() : [];
}

export async function fetchCategoryClickThroughRate(
  category: string,
): Promise<CategoryCTR | null> {
  const res = await fetch(RECOMMENDATION_ENDPOINTS.CATEGORY_CTR(category), {
    cache: "no-store",
  });
  return res.ok ? await res.json() : null;
}

export async function trackItemView(
  externalId: string,
  category: string,
  userId?: string | null,
): Promise<boolean> {
  if (!userId) return false;
  const res = await fetch(RECOMMENDATION_ENDPOINTS.TRACK_VIEW, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ externalId, category, userId }),
    cache: "no-store",
  });
  return res.ok;
}

export async function createRecommendation(
  data: CreateRecommendationData,
): Promise<{ success: boolean; id?: number; error?: string }> {
  const res = await fetch(RECOMMENDATION_ENDPOINTS.RECOMMENDATIONS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const result = await res.json();
  return res.ok
    ? { success: true, id: result.id }
    : { success: false, error: result.error || "Failed" };
}

export async function removeRecommendation(
  id: number,
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(RECOMMENDATION_ENDPOINTS.RECOMMENDATION_BY_ID(id), {
    method: "DELETE",
    cache: "no-store",
  });
  return res.ok ? { success: true } : { success: false, error: "Failed" };
}

export async function removeRecommendationByExternalId(
  externalId: string,
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(
    RECOMMENDATION_ENDPOINTS.RECOMMENDATION_BY_EXTERNAL_ID(externalId),
    { method: "DELETE", cache: "no-store" },
  );
  return res.ok ? { success: true } : { success: false, error: "Failed" };
}

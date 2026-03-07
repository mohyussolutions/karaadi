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

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) return [];
  const result = await response.json();
  return result || [];
}

export async function fetchMostViewedCategories(
  limit: number = 5,
): Promise<CategoryStats[]> {
  const response = await fetch(
    `${RECOMMENDATION_ENDPOINTS.MOST_VIEWED_CATEGORIES}?limit=${limit}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok) return [];
  const result = await response.json();
  return result || [];
}

export async function fetchUserTopCategories(
  userId: string,
  limit: number = 3,
): Promise<CategoryStats[]> {
  const response = await fetch(
    `${RECOMMENDATION_ENDPOINTS.USER_TOP_CATEGORIES}?limit=${limit}`,
    {
      method: "GET",
      headers: userId ? { "X-User-Id": userId } : {},
      cache: "no-store",
    },
  );

  if (!response.ok) return [];
  const result = await response.json();
  return result || [];
}

export async function fetchTrendingCategories(
  hours: number = 24,
): Promise<CategoryStats[]> {
  const response = await fetch(
    `${RECOMMENDATION_ENDPOINTS.TRENDING_CATEGORIES}?hours=${hours}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok) return [];
  const result = await response.json();
  return result || [];
}

export async function fetchMostClickedItems(
  limit: number = 10,
): Promise<RecommendationItem[]> {
  const response = await fetch(
    `${RECOMMENDATION_ENDPOINTS.MOST_CLICKED_ITEMS}?limit=${limit}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok) return [];
  const result = await response.json();
  return result || [];
}

export async function fetchCategoryClickThroughRate(
  category: string,
): Promise<CategoryCTR | null> {
  const response = await fetch(
    RECOMMENDATION_ENDPOINTS.CATEGORY_CTR(category),
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok) return null;
  const result = await response.json();
  return result || null;
}

export async function trackItemView(
  externalId: string,
  category: string,
  userId?: string | null,
): Promise<boolean> {
  if (!userId) return false;

  try {
    const response = await fetch(RECOMMENDATION_ENDPOINTS.TRACK_VIEW, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ externalId, category, userId }),
      cache: "no-store",
    });

    return response.ok;
  } catch (error) {
    console.error("Error tracking view:", error);
    return false;
  }
}

export async function createRecommendation(
  data: CreateRecommendationData,
): Promise<{ success: boolean; id?: number; error?: string }> {
  const response = await fetch(RECOMMENDATION_ENDPOINTS.RECOMMENDATIONS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    return { success: false, error: result.error || "Failed to create" };
  }

  return { success: true, id: result.id };
}

export async function removeRecommendation(
  id: number,
): Promise<{ success: boolean; error?: string }> {
  const response = await fetch(
    RECOMMENDATION_ENDPOINTS.RECOMMENDATION_BY_ID(id),
    {
      method: "DELETE",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const result = await response.json();
    return { success: false, error: result.error || "Failed to delete" };
  }

  return { success: true };
}

export async function removeRecommendationByExternalId(
  externalId: string,
): Promise<{ success: boolean; error?: string }> {
  const response = await fetch(
    RECOMMENDATION_ENDPOINTS.RECOMMENDATION_BY_EXTERNAL_ID(externalId),
    {
      method: "DELETE",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const result = await response.json();
    return { success: false, error: result.error || "Failed to delete" };
  }

  return { success: true };
}

"use client";

import { SEARCH_HISTORY_ENDPOINTS } from "@/actions/constant/constant";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";

export const fetchPopularSearches = async () => {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(SEARCH_HISTORY_ENDPOINTS.POPULAR_SEARCHES, {
      headers: headers as HeadersInit,
      cache: "no-store",
    });
    return res.ok ? await res.json() : [];
  } catch {
    return [];
  }
};

export const deleteGlobalTrending = async (query: string) => {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(
      `${SEARCH_HISTORY_ENDPOINTS.DELETE_BY_QUERY}?q=${encodeURIComponent(query)}`,
      {
        method: "DELETE",
        headers: headers as HeadersInit,
        cache: "no-store",
      },
    );
    return res.ok;
  } catch {
    return false;
  }
};

export const deleteLogEntry = async (logId: string) => {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(SEARCH_HISTORY_ENDPOINTS.DELETE_BY_ID(logId), {
      method: "DELETE",
      headers: headers as HeadersInit,
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
};

export const saveSearchToDb = async (
  query: string,
  user?: { token?: string; _id?: string; id?: string },
) => {
  if (!query.trim()) return false;
  try {
    const headers = await getAuthHeaders(user?.token);
    const res = await fetch(SEARCH_HISTORY_ENDPOINTS.LOG_SEARCH, {
      method: "POST",
      headers: headers as HeadersInit,
      body: JSON.stringify({
        query: query.trim(),
        category: "all",
        userId: user?._id || user?.id || null,
      }),
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
};

export const fetchSearchItemPreview = async (query: string) => {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(SEARCH_HISTORY_ENDPOINTS.SEARCH_ITEMS(query), {
      headers: headers as HeadersInit,
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data[0] || null;
  } catch {
    return null;
  }
};

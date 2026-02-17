"use client";

import { verifySession } from "@/actions/core/authAction";
import { SEARCH_HISTORY_ENDPOINTS } from "@/actions/constant/constant";

export const fetchPopularSearches = async () => {
  try {
    const res = await fetch(SEARCH_HISTORY_ENDPOINTS.POPULAR_SEARCHES);
    return res.ok ? await res.json() : [];
  } catch (error) {
    return [];
  }
};

export const deleteGlobalTrending = async (query: string) => {
  try {
    const res = await fetch(
      `${SEARCH_HISTORY_ENDPOINTS.DELETE_BY_QUERY}?q=${encodeURIComponent(query)}`,
      { method: "DELETE" },
    );
    return res.ok;
  } catch (error) {
    return false;
  }
};

export const deleteLogEntry = async (logId: string) => {
  try {
    const res = await fetch(SEARCH_HISTORY_ENDPOINTS.DELETE_BY_ID(logId), {
      method: "DELETE",
    });
    return res.ok;
  } catch (error) {
    return false;
  }
};

export const saveSearchToDb = async (query: string) => {
  if (!query.trim()) return;
  try {
    const session = await verifySession();
    const response = await fetch(SEARCH_HISTORY_ENDPOINTS.LOG_SEARCH, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: query.trim(),
        category: "all",
        userId: session?._id || null,
      }),
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

export const fetchSearchItemPreview = async (query: string) => {
  try {
    const res = await fetch(SEARCH_HISTORY_ENDPOINTS.SEARCH_ITEMS(query));
    if (!res.ok) return null;
    const data = await res.json();
    return data[0] || null;
  } catch (error) {
    return null;
  }
};

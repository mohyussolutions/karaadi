"use client";

import { verifySession } from "@/actions/core/authAction";
import { SEARCH_HISTORY_ENDPOINTS } from "@/actions/constant/constant";

export const fetchPopularSearches = async () => {
  const res = await fetch(SEARCH_HISTORY_ENDPOINTS.POPULAR_SEARCHES, {
    cache: "no-store",
  });
  return res.ok ? await res.json() : [];
};

export const deleteGlobalTrending = async (query: string) => {
  const res = await fetch(
    `${SEARCH_HISTORY_ENDPOINTS.DELETE_BY_QUERY}?q=${encodeURIComponent(query)}`,
    {
      method: "DELETE",
      cache: "no-store",
    },
  );
  return res.ok;
};

export const deleteLogEntry = async (logId: string) => {
  const res = await fetch(SEARCH_HISTORY_ENDPOINTS.DELETE_BY_ID(logId), {
    method: "DELETE",
    cache: "no-store",
  });
  return res.ok;
};

export const saveSearchToDb = async (query: string) => {
  if (!query.trim()) return;

  const session = await verifySession();
  const response = await fetch(SEARCH_HISTORY_ENDPOINTS.LOG_SEARCH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: query.trim(),
      category: "all",
      userId: session?._id || null,
    }),
    cache: "no-store",
  });
  return response.ok;
};

export const fetchSearchItemPreview = async (query: string) => {
  const res = await fetch(SEARCH_HISTORY_ENDPOINTS.SEARCH_ITEMS(query), {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data[0] || null;
};

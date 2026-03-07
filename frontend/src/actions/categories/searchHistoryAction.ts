"use client";

import { verifySession } from "@/actions/core/authAction";
import { SEARCH_HISTORY_ENDPOINTS } from "@/actions/constant/constant";

async function getAuthHeaders() {
  const session = await verifySession();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  };

  if (session?.accessToken) {
    headers["Authorization"] = `Bearer ${session.accessToken}`;
  }

  return headers;
}

export const fetchPopularSearches = async () => {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(SEARCH_HISTORY_ENDPOINTS.POPULAR_SEARCHES, {
      headers,
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
        headers,
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
      headers,
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
};

export const saveSearchToDb = async (query: string) => {
  if (!query.trim()) return false;

  try {
    const session = await verifySession();
    const headers = await getAuthHeaders();

    const response = await fetch(SEARCH_HISTORY_ENDPOINTS.LOG_SEARCH, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: query.trim(),
        category: "all",
        userId: session?._id || null,
      }),
      cache: "no-store",
    });
    return response.ok;
  } catch {
    return false;
  }
};

export const fetchSearchItemPreview = async (query: string) => {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(SEARCH_HISTORY_ENDPOINTS.SEARCH_ITEMS(query), {
      headers,
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data[0] || null;
  } catch {
    return null;
  }
};

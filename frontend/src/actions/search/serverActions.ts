"use server";

import { SEARCH_HISTORY_ENDPOINTS } from "@/actions/constant/constant";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";

export const getSearchHistory = async (token?: string) => {
  try {
    const headers = await getAuthHeaders(token);
    const res = await fetch(SEARCH_HISTORY_ENDPOINTS.BASE, {
      headers: headers as HeadersInit,
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.message === "Not authorized" ? [] : data;
  } catch {
    return [];
  }
};

export const logSearch = async (query: string, token?: string) => {
  const headers = await getAuthHeaders(token);
  const res = await fetch(SEARCH_HISTORY_ENDPOINTS.LOG_SEARCH, {
    method: "POST",
    headers: headers as HeadersInit,
    body: JSON.stringify({ query }),
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok || data?.message === "Not authorized") throw new Error("Log failed");
  return data;
};

export const getPopularSearches = async (token?: string) => {
  try {
    const headers = await getAuthHeaders(token);
    const res = await fetch(SEARCH_HISTORY_ENDPOINTS.POPULAR_SEARCHES, {
      headers: headers as HeadersInit,
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

export const deleteSearchQuery = async (query: string, token?: string) => {
  const headers = await getAuthHeaders(token);
  const res = await fetch(
    `${SEARCH_HISTORY_ENDPOINTS.DELETE_BY_QUERY}?q=${encodeURIComponent(query)}`,
    {
      method: "DELETE",
      headers: headers as HeadersInit,
      cache: "no-store",
    },
  );
  const data = await res.json();
  if (!res.ok || data?.message === "Not authorized") throw new Error("Delete failed");
  return data;
};

export const deleteSearchById = async (id: string, token?: string) => {
  const headers = await getAuthHeaders(token);
  const res = await fetch(SEARCH_HISTORY_ENDPOINTS.DELETE_BY_ID(id), {
    method: "DELETE",
    headers: headers as HeadersInit,
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok || data?.message === "Not authorized") throw new Error("Delete failed");
  return data;
};

export const searchItems = async (query: string, token?: string) => {
  try {
    const headers = await getAuthHeaders(token);
    const res = await fetch(SEARCH_HISTORY_ENDPOINTS.SEARCH_ITEMS(query), {
      headers: headers as HeadersInit,
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.message === "Not authorized" ? [] : data;
  } catch {
    return [];
  }
};

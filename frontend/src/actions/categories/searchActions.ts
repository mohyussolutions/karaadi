"use server";

import { SEARCH_HISTORY_ENDPOINTS } from "../constant/constant";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

async function getAuthHeaders(token?: string) {
  const cookieStore = await cookies();
  const cookieToken =
    cookieStore.get("idToken")?.value || cookieStore.get("accessToken")?.value;
  const authToken = token || cookieToken;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
    console.log("✅ Auth token added to headers");
  } else {
    console.warn("❌ No auth token found");
  }

  return headers;
}

export const getSearchHistory = async (token?: string) => {
  try {
    const headers = await getAuthHeaders(token);
    const response = await fetch(SEARCH_HISTORY_ENDPOINTS.SEARCH_HISTORY, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Failed to fetch search history: ${response.status}`);
      return [];
    }

    const data = await response.json();

    // Check if response contains error message
    if (data && data.message === "Not authorized") {
      console.error("Not authorized to fetch search history");
      return [];
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch search history:", error);
    return [];
  }
};

export const logSearch = async (query: string, token?: string) => {
  try {
    const headers = await getAuthHeaders(token);
    const response = await fetch(SEARCH_HISTORY_ENDPOINTS.LOG_SEARCH, {
      method: "POST",
      headers,
      body: JSON.stringify({ query }),
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Log search failed");

    const data = await response.json();

    if (data && data.message === "Not authorized") {
      throw new Error("Not authorized to log search");
    }

    return data;
  } catch (error) {
    console.error("Failed to log search:", error);
    throw new Error("Log search failed");
  }
};

export const getPopularSearches = async (token?: string) => {
  try {
    const headers = await getAuthHeaders(token);
    console.log("Fetching from:", SEARCH_HISTORY_ENDPOINTS.POPULAR_SEARCHES);

    const response = await fetch(SEARCH_HISTORY_ENDPOINTS.POPULAR_SEARCHES, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Failed to fetch popular searches: ${response.status}`,
        errorText,
      );
      return [];
    }

    const data = await response.json();
    console.log("Popular searches raw data:", data);

    // Check if response contains error message
    if (data && data.message === "Not authorized") {
      console.error("Not authorized to fetch popular searches");
      return [];
    }

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch popular searches:", error);
    return [];
  }
};

export const deleteSearchQuery = async (query: string, token?: string) => {
  try {
    const headers = await getAuthHeaders(token);
    const response = await fetch(
      `${SEARCH_HISTORY_ENDPOINTS.DELETE_BY_QUERY}?q=${encodeURIComponent(query)}`,
      {
        method: "DELETE",
        headers,
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Delete failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (data && data.message === "Not authorized") {
      throw new Error("Not authorized to delete search query");
    }

    revalidatePath("/admin/analytics");
    return data;
  } catch (error) {
    console.error("Failed to delete search query:", error);
    throw new Error("Delete failed");
  }
};

export const deleteSearchById = async (id: string, token?: string) => {
  try {
    const headers = await getAuthHeaders(token);
    const response = await fetch(SEARCH_HISTORY_ENDPOINTS.DELETE_BY_ID(id), {
      method: "DELETE",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Delete by ID failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (data && data.message === "Not authorized") {
      throw new Error("Not authorized to delete search by ID");
    }

    revalidatePath("/admin/analytics");
    return data;
  } catch (error) {
    console.error("Failed to delete search by ID:", error);
    throw new Error("Delete by ID failed");
  }
};

export const searchItems = async (query: string, token?: string) => {
  try {
    const headers = await getAuthHeaders(token);
    const response = await fetch(SEARCH_HISTORY_ENDPOINTS.SEARCH_ITEMS(query), {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Failed to search items: ${response.status}`);
      return [];
    }

    const data = await response.json();

    if (data && data.message === "Not authorized") {
      console.error("Not authorized to search items");
      return [];
    }

    return data;
  } catch (error) {
    console.error("Failed to search items:", error);
    return [];
  }
};

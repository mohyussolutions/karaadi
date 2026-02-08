import { SEARCH_ENDPOINT } from "../constant/constant";

export async function getGlobalSearchResults(query: string) {
  try {
    if (!query || query.trim() === "") {
      return [];
    }

    const normalizedQuery = query.trim();

    const res = await fetch(
      `${SEARCH_ENDPOINT}?q=${encodeURIComponent(normalizedQuery)}`,
      {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.ok) {
      console.error(`Search request failed with status: ${res.status}`);
      return [];
    }

    const results = await res.json();
    return results || [];
  } catch (error) {
    console.error("Search Action Error:", error);
    return [];
  }
}

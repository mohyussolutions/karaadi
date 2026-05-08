import { SearchResultTypes } from "@/app/utils/types/SearchResult.types";

const BACKEND = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/^(https:\/\/.+):8080(\/|$)/, "$1$2");

export async function fetchSearch(q: string): Promise<SearchResultTypes[]> {
  if (!q.trim()) return [];
  try {
    const res = await fetch(`${BACKEND}/api/search?q=${encodeURIComponent(q)}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function getGlobalSearchResults(query: string): Promise<SearchResultTypes[]> {
  const q = query?.trim();
  if (!q) return [];

  try {
    const res = await fetch(`${BACKEND}/api/search?q=${encodeURIComponent(q)}`);
    if (!res.ok) return [];
    const results: SearchResultTypes[] = await res.json();

    return results.map((item) => {
      let cat = "marketplace";
      if (item.source === "cars" || item.make || item.brand || item.vehicleModel) {
        cat = "cars";
      } else if (item.source === "boats" || item.boatModel) {
        cat = "boats";
      } else if (item.source === "motorcycles" || item.modelName) {
        cat = "motorcycles";
      } else if (item.source === "realestate" || item.bedrooms !== undefined || item.squareFeet) {
        cat = "real-estate";
      } else if (item.source === "jobs" || item.company || item.salary) {
        cat = "jobs";
      } else if (item.source === "farmequipment" || item.hours !== undefined || item.enginePower) {
        cat = "farmequipment";
      } else if (item.mainCategory) {
        cat = (item.mainCategory as string).toLowerCase();
      } else if (item.category) {
        cat = (item.category as string).toLowerCase();
      }
      return { ...item, category: cat };
    });
  } catch {
    return [];
  }
}

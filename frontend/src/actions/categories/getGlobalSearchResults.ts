import { SearchResultTypes } from "@/app/utils/types/SearchResult.types";

export async function getGlobalSearchResults(
  query: string,
): Promise<SearchResultTypes[]> {
  const q = query?.trim();
  if (!q) return [];

  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    if (!res.ok) return [];
    const results: any[] = await res.json();

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
        cat = item.mainCategory.toLowerCase();
      } else if (item.category) {
        cat = item.category.toLowerCase();
      }

      return { ...item, category: cat } as SearchResultTypes;
    });
  } catch {
    return [];
  }
}

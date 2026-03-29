import { SEARCH_ENDPOINT } from "../constant/constant";

export type SearchResult = {
  id?: string;
  _id?: string;
  title?: string;
  description?: string;
  price?: number;
  images?: string[];
  city?: string;
  region?: string;
  source?: string;
  make?: string;
  brand?: string;
  vehicleModel?: string;
  boatModel?: string;
  modelName?: string;
  bedrooms?: number;
  squareFeet?: number;
  company?: string;
  salary?: number;
  hours?: number;
  enginePower?: string;
  mainCategory?: string;
  category?: string;
  subcategory?: string[];
  [key: string]: unknown;
};

export async function getGlobalSearchResults(
  query: string,
): Promise<SearchResult[]> {
  try {
    const normalizedQuery = query?.trim();
    if (!normalizedQuery) return [];

    const res = await fetch(
      `${SEARCH_ENDPOINT}?q=${encodeURIComponent(normalizedQuery)}`,
      {
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
      },
    );

    if (!res.ok) return [];

    const results = (await res.json()) as SearchResult[];

    return (results || []).map((item) => {
      let cat = "marketplace";

      if (
        item.source === "cars" ||
        item.make ||
        item.brand ||
        item.vehicleModel
      ) {
        cat = "cars";
      } else if (item.source === "boats" || item.boatModel) {
        cat = "boats";
      } else if (item.source === "motorcycles" || item.modelName) {
        cat = "motorcycles";
      } else if (
        item.source === "realestate" ||
        item.bedrooms !== undefined ||
        item.squareFeet
      ) {
        cat = "real-estate";
      } else if (item.source === "jobs" || item.company || item.salary) {
        cat = "jobs";
      } else if (
        item.source === "farmequipment" ||
        item.hours !== undefined ||
        item.enginePower
      ) {
        cat = "farmequipment";
      } else if (item.mainCategory) {
        cat = item.mainCategory.toLowerCase();
      } else if (item.category) {
        cat = item.category.toLowerCase();
      }

      return { ...item, category: cat };
    });
  } catch {
    return [];
  }
}

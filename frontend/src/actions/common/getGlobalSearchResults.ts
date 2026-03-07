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
      let errorMsg = `Search request failed with status: ${res.status}`;
      try {
        const errorData = await res.json();
        errorMsg += ` | Message: ${errorData?.message || JSON.stringify(errorData)}`;
      } catch {
        try {
          const errorText = await res.text();
          errorMsg += ` | Response: ${errorText}`;
        } catch {}
      }
      console.error(errorMsg);
      return [];
    }
    const results = await res.json();

    return (results || []).map((item: any) => {
      let category = "marketplace";

      if (
        item.source === "cars" ||
        item.make ||
        item.brand ||
        item.vehicleModel
      ) {
        category = "cars";
      } else if (item.source === "boats" || item.boatModel) {
        category = "boats";
      } else if (item.source === "motorcycles" || item.modelName) {
        category = "motorcycles";
      } else if (
        item.source === "realestate" ||
        item.bedrooms !== undefined ||
        item.squareFeet
      ) {
        category = "real-estate";
      } else if (item.source === "jobs" || item.company || item.salary) {
        category = "jobs";
      } else if (
        item.source === "farmequipment" ||
        item.hours !== undefined ||
        item.enginePower
      ) {
        category = "farmequipment";
      } else if (item.mainCategory) {
        category = item.mainCategory.toLowerCase();
      } else if (item.category) {
        category = item.category.toLowerCase();
      }

      return {
        ...item,
        category: category,
      };
    });
  } catch (error) {
    console.error("Search Action Error:", error);
    return [];
  }
}

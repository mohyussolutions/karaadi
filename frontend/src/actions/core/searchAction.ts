const BASE_URL = "/api/saved-searches";

export const apiService = {
  getSavedSearches: async (userId: string) => {
    const res = await fetch(`${BASE_URL}?userId=${userId}`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });
    if (!res.ok) throw new Error("Failed to fetch saved searches");
    return res.json();
  },

  createSavedSearch: async (userId: string, name: string, query: string) => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, name, query }),
    });
    if (!res.ok) throw new Error("Failed to create saved search");
    return res.json();
  },

  deleteSavedSearch: async (id: string, userId: string) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) throw new Error("Failed to delete saved search");
    return res.json();
  },
};

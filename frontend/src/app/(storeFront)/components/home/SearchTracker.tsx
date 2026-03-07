"use client";

import { logSearch } from "@/actions/categories/searchActions";
import { verifySession } from "@/actions/core/authAction";

export const saveSearchToDb = async (query: string) => {
  if (!query.trim()) return;

  try {
    const session = await verifySession();
    const token = session?.accessToken;

    await logSearch(query, token);

    console.log("Search saved successfully:", query);
  } catch (error) {
    console.error("Failed to save search history:", error);
  }
};

export const SearchComponent = () => {
  const handleSearch = async (query: string) => {
    await saveSearchToDb(query);
  };

  return (
    <input
      type="text"
      placeholder="Search..."
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleSearch(e.currentTarget.value);
        }
      }}
    />
  );
};

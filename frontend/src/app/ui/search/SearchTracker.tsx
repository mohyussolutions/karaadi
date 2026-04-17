"use client";

import { logSearch } from "@/actions/categories/searchActions";
import { useAuth } from "@/context/AuthContext";
export const SearchComponent = () => {
  const { user } = useAuth();

  const saveSearchToDb = async (query: string) => {
    if (!query.trim()) return;

    try {
      const token = user?.accessToken || user?.token;
      await logSearch(query, token);
    } catch (error) {
      console.error("Failed to save search history:", error);
    }
  };

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

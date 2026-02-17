"use client";

import { getGlobalSearchResults } from "@/actions/common/getGlobalSearchResults";
import { useState, useEffect, useMemo } from "react";
import ItemsGrid from "../Cards/mainCard";
import SearchInput from "../../../(search)/SearchInput";

interface HomeContentProps {
  initialData: Record<string, any[] | null>;
  children: React.ReactNode;
}

export default function HomeContent({
  initialData,
  children,
}: HomeContentProps) {
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setSearchResults(null);
      setLoading(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await getGlobalSearchResults(query);
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const displayItems = useMemo(() => {
    if (searchResults !== null) {
      return searchResults.map((item) => ({
        ...item,
        price: Number(item?.price) || 0,
        images: Array.isArray(item?.images) ? item.images : [],
      }));
    }

    return Object.entries(initialData).flatMap(([categoryKey, items]) => {
      if (!Array.isArray(items)) return [];
      return items.map((item) => ({
        ...item,
        category: categoryKey,
        price: Number(item?.price) || 0,
        images: Array.isArray(item?.images) ? item.images : [],
      }));
    });
  }, [searchResults, initialData]);

  if (!mounted) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-12 bg-gray-200 rounded-xl w-full" />
        <div className="h-96 bg-gray-100 rounded-xl w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SearchInput onSearch={setQuery} />

      <div className={query.trim() ? "hidden" : "block"}>
        <div className="flex flex-col gap-8">{children}</div>
      </div>

      <div
        className={`transition-opacity duration-300 ${loading ? "opacity-40" : "opacity-100"}`}
      >
        <ItemsGrid items={displayItems} />
      </div>
    </div>
  );
}

"use client";

import { useMemo } from "react";

export interface FeedItem {
  id: string | number;
  category: string;
  price: number;
  images: string[];
  [key: string]: any;
}

export function useRandomFeed(
  initialData: Record<string, any[] | null>,
  searchResults: FeedItem[] | null,
): FeedItem[] {
  return useMemo(() => {
    if (searchResults !== null) {
      return searchResults.map((item) => ({
        ...item,
        price: Number(item?.price) || 0,
        images: Array.isArray(item?.images) ? item.images : [],
      }));
    }

    const allItems: FeedItem[] = Object.entries(initialData).flatMap(
      ([categoryKey, items]) => {
        if (!Array.isArray(items)) return [];
        return items.map((item) => ({
          ...item,
          category: categoryKey,
          price: Number(item?.price) || 0,
          images: Array.isArray(item?.images) ? item.images : [],
        }));
      },
    );

    const shuffled = [...allItems];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }, [searchResults, initialData]);
}

"use client";

import { FeedItem } from "@/app/utils/types/feed";

interface PriorityMap {
  [key: string]: number;
}

const PRIORITY_ORDER: PriorityMap = {
  premium90: 1,
  standard60: 2,
  basic30: 3,
};

const DEFAULT_PRIORITY = 3;

export function useRandomFeed(
  initialData: Record<string, FeedItem[] | null>,
  searchResults: FeedItem[] | null,
): FeedItem[] {
  if (searchResults !== null) {
    return searchResults.map((item) => ({
      ...item,
      price: Number(item?.price) || 0,
      images: Array.isArray(item?.images) ? item.images : [],
    }));
  }

  const allItems: FeedItem[] = [];

  for (const [categoryKey, items] of Object.entries(initialData)) {
    if (!Array.isArray(items)) continue;

    for (const item of items) {
      allItems.push({
        ...item,
        category: categoryKey,
        price: Number(item?.price) || 0,
        images: Array.isArray(item?.images) ? item.images : [],
        priority: item.priority || "basic30",
      });
    }
  }

  const premium: FeedItem[] = [];
  const standard: FeedItem[] = [];
  const basic: FeedItem[] = [];

  for (const item of allItems) {
    const priority = item.priority;
    if (priority === "premium90") premium.push(item);
    else if (priority === "standard60") standard.push(item);
    else basic.push(item);
  }

  for (let i = standard.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [standard[i], standard[j]] = [standard[j], standard[i]];
  }

  for (let i = basic.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [basic[i], basic[j]] = [basic[j], basic[i]];
  }

  return [...premium, ...standard, ...basic];
}

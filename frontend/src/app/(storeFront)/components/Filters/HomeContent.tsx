"use client";

import { useState, useEffect, useCallback } from "react";
import ItemsGrid from "../Cards/mainCard";
import { FeedItem, useRandomFeed } from "../hooks/useRandomFeed";
import { trackItemView } from "@/actions/categories/RecommendationActions";
import { InitialData } from "../home/DataFeed";

interface HomeContentProps {
  initialData: InitialData;
  children: React.ReactNode;
  userId: string | null;
  serverSearchResults: FeedItem[] | null;
  isSearching: boolean;
}

export default function HomeContent({
  initialData,
  children,
  userId,
  serverSearchResults,
  isSearching,
}: HomeContentProps) {
  const [mounted, setMounted] = useState<boolean>(false);
  const [trackedItems, setTrackedItems] = useState<Set<string>>(new Set());

  const displayItems = useRandomFeed(initialData, serverSearchResults);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTrackItemView = useCallback(
    async (item: FeedItem) => {
      const itemId = item.id || item._id;
      if (!userId || !itemId || trackedItems.has(itemId)) return;

      try {
        await trackItemView(itemId, item.category, userId);
        setTrackedItems((prev) => new Set(prev).add(itemId));
      } catch (error) {
        console.error(error);
      }
    },
    [userId, trackedItems],
  );

  useEffect(() => {
    if (mounted && userId && displayItems.length > 0) {
      displayItems.slice(0, 10).forEach((item) => {
        handleTrackItemView(item);
      });
    }
  }, [mounted, userId, displayItems, handleTrackItemView]);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {!isSearching && <div className="flex flex-col gap-6">{children}</div>}

      <div className="px-2">
        <ItemsGrid items={displayItems} onItemView={handleTrackItemView} />
      </div>
    </div>
  );
}

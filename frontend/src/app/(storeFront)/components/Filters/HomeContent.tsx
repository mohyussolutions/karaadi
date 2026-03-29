"use client";

import { useState, useEffect, useCallback } from "react";
import Pagination from "@/app/ui/invoices/pagination";
import ItemsGrid from "../Cards/mainCard";
import { useRandomFeed } from "../hooks/useRandomFeed";
import { trackItemView } from "@/actions/categories/RecommendationActions";
import { InitialData } from "../home/DataFeed";
import { GRID_CONFIG } from "@/actions/constant/constant";
import { FeedItem } from "@/app/utils/types/feed";

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
  const [trackedItems, setTrackedItems] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(GRID_CONFIG.INITIAL_LOAD);
  const [loading, setLoading] = useState(false);
  const [loadCount, setLoadCount] = useState(0);

  const displayItems = useRandomFeed(initialData, serverSearchResults);
  const ITEMS_PER_LOAD = GRID_CONFIG.ITEMS_PER_LOAD;
  const MAX_LOADS = 3;
  const itemsToShow = displayItems.slice(0, visibleCount);
  const hasMore = visibleCount < displayItems.length && loadCount < MAX_LOADS;

  const handleSeeMore = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) =>
        Math.min(prev + ITEMS_PER_LOAD, displayItems.length),
      );
      setLoadCount((prev) => prev + 1);
      setLoading(false);
    }, 300);
  };

  const handleTrackItemView = useCallback(
    async (item: FeedItem) => {
      const itemId = item.id || item._id;
      if (!userId || !itemId || trackedItems.has(itemId as string)) return;

      try {
        await trackItemView(itemId as string, item.category || "", userId);
        setTrackedItems((prev) => new Set(prev).add(itemId as string));
      } catch (error) {
        console.error(error);
      }
    },
    [userId, trackedItems],
  );

  useEffect(() => {
    if (userId && displayItems.length > 0) {
      const itemsToTrack = displayItems.slice(0, 10);
      for (const item of itemsToTrack) {
        handleTrackItemView(item);
      }
    }
  }, [userId, displayItems, handleTrackItemView]);

  return (
    <div className="space-y-6">
      {!isSearching && <div className="flex flex-col gap-6">{children}</div>}

      <div>
        <ItemsGrid items={itemsToShow} onItemView={handleTrackItemView} />
        <Pagination
          hasMore={hasMore}
          onSeeMore={handleSeeMore}
          loading={loading}
        />
      </div>
    </div>
  );
}

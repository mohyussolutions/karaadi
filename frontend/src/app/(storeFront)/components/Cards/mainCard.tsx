"use client";

import React, { useState, useMemo, useEffect } from "react";
import SeeEmore from "../shared/buttons/SeeEmore";
import UniversalCard from "./UniversalCard";
import { GRID_CONFIG } from "@/actions/constant/constant";
import Loading from "../shared/Loading/Loading";
import { FeedItem } from "../hooks/useRandomFeed";

interface ItemsGridProps {
  items: FeedItem[];
  onItemView?: (item: FeedItem) => void;
  isLoading?: boolean;
}

export default function ItemsGrid({
  items,
  onItemView,
  isLoading = false,
}: ItemsGridProps) {
  const [visibleCount, setVisibleCount] = useState<number>(
    GRID_CONFIG.INITIAL_LOAD,
  );
  const [viewedItems, setViewedItems] = useState<Set<string>>(new Set());

  const itemsToShow = useMemo(() => {
    if (!items) return [];
    return items.slice(0, Math.min(visibleCount, GRID_CONFIG.MAX_ITEMS));
  }, [items, visibleCount]);

  const hasMore = useMemo(() => {
    return (
      (items?.length || 0) > visibleCount &&
      visibleCount < GRID_CONFIG.MAX_ITEMS
    );
  }, [items, visibleCount]);

  useEffect(() => {
    if (!onItemView || !items || !items.length) return;

    const visibleItems = items.slice(0, Math.min(8, items.length));

    visibleItems.forEach((item) => {
      const itemId = String(item.id || item._id || "");
      if (!viewedItems.has(itemId)) {
        onItemView(item);
        setViewedItems((prev) => {
          const next = new Set(prev);
          next.add(itemId);
          return next;
        });
      }
    });
  }, [items, onItemView, viewedItems]);

  if (isLoading) {
    return <Loading />;
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 mx-4">
        <p className="text-gray-400 font-medium italic">
          Ma jiraan waxyaabo la helay
        </p>
      </div>
    );
  }

  return (
    <div className="relative transition-opacity pb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {itemsToShow.map((item, index) => {
          const category = item.category || item.categoryKey || "marketplace";
          const itemId = item.id || item._id || index;
          const itemCity =
            item.city ||
            item.location ||
            item.area ||
            item.address ||
            item.region ||
            "Mogadishu";
          const itemDescription =
            item.description || item.title || `Item in ${itemCity}`;

          return (
            <UniversalCard
              key={`${category}-${itemId}`}
              id={itemId}
              title={item.title || "Untitled"}
              description={itemDescription}
              city={itemCity}
              price={item.price || 0}
              images={item.images || []}
              maGaday={item.maGaday}
              category={category}
              make={item.make}
              model={item.model}
              year={item.year}
              mileage={item.mileage}
              area={item.area}
              rooms={item.rooms}
              company={item.company}
              location={item.location}
            />
          );
        })}
      </div>

      {hasMore && (
        <div className="flex flex-col items-center justify-center pt-8 pb-10 space-y-3">
          <SeeEmore
            onClick={() =>
              setVisibleCount((prev) =>
                Math.min(
                  prev + GRID_CONFIG.ITEMS_PER_LOAD,
                  GRID_CONFIG.MAX_ITEMS,
                ),
              )
            }
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 px-8 py-3 rounded-full font-bold"
          />
        </div>
      )}
    </div>
  );
}

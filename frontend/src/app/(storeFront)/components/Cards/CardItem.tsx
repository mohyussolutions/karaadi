"use client";

import React, { useState, useMemo } from "react";
import SeeEmore from "../shared/buttons/SeeEmore";
import UniversalCard from "./UniversalCard";
import { GRID_CONFIG } from "@/actions/constant/constant";

interface ItemData {
  id: string | number;
  _id?: string | number;
  title?: string;
  description?: string;
  city?: string;
  price?: number;
  images?: string[];
  maGaday?: boolean;
  category?: string;
  categoryKey?: string;
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  area?: string;
  rooms?: number;
  company?: string;
  location?: string;
}

interface ItemsGridProps {
  items: ItemData[];
}

export default function ItemsGrid({ items }: ItemsGridProps) {
  const [visibleCount, setVisibleCount] = useState<number>(
    GRID_CONFIG.INITIAL_LOAD,
  );

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 mx-4">
        <p className="text-gray-400 font-medium italic">
          Ma jiraan waxyaabo la helay
        </p>
      </div>
    );
  }

  const itemsToShow = useMemo(() => {
    return items.slice(0, Math.min(visibleCount, GRID_CONFIG.MAX_ITEMS));
  }, [items, visibleCount]);

  const hasMore =
    items.length > visibleCount && visibleCount < GRID_CONFIG.MAX_ITEMS;

  return (
    <div className="relative transition-opacity pb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {itemsToShow.map((item, index) => {
          const category = item.category || item.categoryKey || "marketplace";
          const itemId = item.id || item._id || index;

          return (
            <UniversalCard
              key={`${category}-${itemId}`}
              id={itemId}
              title={item.title || "Untitled"}
              description={item.description}
              city={item.city || ""}
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
          <div className="group relative">
            <SeeEmore
              onClick={() =>
                setVisibleCount((prev) =>
                  Math.min(
                    prev + GRID_CONFIG.ITEMS_PER_LOAD,
                    GRID_CONFIG.MAX_ITEMS,
                  ),
                )
              }
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 transition-all transform hover:scale-105 active:scale-95 px-8 py-3 rounded-full font-bold"
            />
          </div>
        </div>
      )}

      {visibleCount >= GRID_CONFIG.MAX_ITEMS &&
        items.length > GRID_CONFIG.MAX_ITEMS && (
          <div className="flex items-center justify-center space-x-4 py-10">
            <div className="h-[1px] w-12 bg-gray-200" />
            <span className="text-gray-400 text-xs font-medium uppercase tracking-tighter">
              Waxaad aragtay dhammaan {GRID_CONFIG.MAX_ITEMS} shay
            </span>
            <div className="h-[1px] w-12 bg-gray-200" />
          </div>
        )}
    </div>
  );
}

"use client";

import React, { useState, useEffect, useCallback } from "react";
import UniversalCard from "./UniversalCard";
import SeeEmore from "../shared/buttons/SeeEmore";

interface ItemsGridProps {
  fetchFunctions?: {
    getBoats: () => Promise<any>;
    getCars: () => Promise<any>;
    getJobs: () => Promise<any>;
    getMarketplaceItems: () => Promise<any>;
    getMotorcycles: () => Promise<any>;
    getRealEstateListings: () => Promise<any>;
    getTraktors: () => Promise<any>;
  };
  initialData?: any;
}

const ITEMS_PER_LOAD = 12;
const INITIAL_LOAD = 24;
const MAX_ITEMS = 100;

export default function ItemsGrid({
  fetchFunctions,
  initialData,
}: ItemsGridProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD);
  const [allItems, setAllItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(!initialData);

  const processData = useCallback((data: any) => {
    const toSafe = (res: any) => (Array.isArray(res) ? res : []);
    const combined = [
      ...toSafe(data.boats).map((i) => ({ ...i, category: "boats" })),
      ...toSafe(data.cars).map((i) => ({ ...i, category: "cars" })),
      ...toSafe(data.jobs).map((i) => ({ ...i, category: "jobs" })),
      ...toSafe(data.marketplace).map((i) => ({
        ...i,
        category: "marketplace",
      })),
      ...toSafe(data.motorcycles).map((i) => ({
        ...i,
        category: "motorcycles",
      })),
      ...toSafe(data.realEstate || data.real_estate).map((i) => ({
        ...i,
        category: "real-estate",
      })),
      ...toSafe(data.tractors || data.traktors).map((i) => ({
        ...i,
        category: "tractors",
      })),
    ];

    return combined.map((item) => ({
      ...item,
      id: item.id || item._id,
      price: Number(item.price) || 0,
      images: Array.isArray(item.images) ? item.images : [],
    }));
  }, []);

  useEffect(() => {
    if (initialData) {
      setAllItems(processData(initialData));
      setIsLoading(false);
      return;
    }

    const fetchAll = async () => {
      if (!fetchFunctions) return;
      try {
        const [
          boats,
          cars,
          jobs,
          marketplace,
          motorcycles,
          realEstate,
          tractors,
        ] = await Promise.all([
          fetchFunctions.getBoats(),
          fetchFunctions.getCars(),
          fetchFunctions.getJobs(),
          fetchFunctions.getMarketplaceItems(),
          fetchFunctions.getMotorcycles(),
          fetchFunctions.getRealEstateListings(),
          fetchFunctions.getTraktors(),
        ]);

        setAllItems(
          processData({
            boats,
            cars,
            jobs,
            marketplace,
            motorcycles,
            realEstate,
            tractors,
          }),
        );
      } catch (err) {
        console.error("Data fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, [fetchFunctions, initialData, processData]);

  const itemsToShow = allItems.slice(0, Math.min(visibleCount, MAX_ITEMS));

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-8">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : itemsToShow.map((item, index) => (
              <UniversalCard
                key={item.id ? `${item.category}-${item.id}` : `idx-${index}`}
                {...item}
              />
            ))}
      </div>

      {!isLoading && allItems.length > visibleCount && (
        <div className="flex justify-center pb-16">
          <SeeEmore
            onClick={() =>
              setVisibleCount((prev) =>
                Math.min(prev + ITEMS_PER_LOAD, MAX_ITEMS),
              )
            }
          />
        </div>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white h-[400px] flex flex-col">
      <div className="h-56 w-full bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-3 flex-grow">
        <div className="h-6 w-1/3 bg-gray-200 animate-pulse rounded" />
        <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
        <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded" />
        <div className="mt-auto pt-4 flex justify-between">
          <div className="h-3 w-16 bg-gray-100 animate-pulse rounded" />
          <div className="h-3 w-16 bg-gray-100 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}

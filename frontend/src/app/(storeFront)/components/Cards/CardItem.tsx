"use client";

import React, { useState, useEffect, useCallback } from "react";
import Loading from "../shared/Loading/Loading";
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

const ITEMS_PER_LOAD = 10;
const INITIAL_LOAD = 30;
const MAX_ITEMS = 100;

export default function ItemsGrid({
  fetchFunctions,
  initialData,
}: ItemsGridProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD);
  const [allItems, setAllItems] = useState<any[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(!initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const processData = useCallback((data: any) => {
    const toSafe = (res: any) => (Array.isArray(res) ? res : []);
    return [
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
    ].map((item) => ({
      ...item,
      price: Number(item.price) || 0,
      images: Array.isArray(item.images) ? item.images : [],
    }));
  }, []);

  const fetchAll = useCallback(async () => {
    if (!fetchFunctions) return;
    if (allItems.length === 0) setIsInitialLoading(true);
    else setIsRefreshing(true);

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
      console.error(err);
    } finally {
      setIsInitialLoading(false);
      setIsRefreshing(false);
    }
  }, [fetchFunctions, allItems.length, processData]);

  useEffect(() => {
    if (initialData) {
      setAllItems(processData(initialData));
      setIsInitialLoading(false);
    } else {
      fetchAll();
    }
  }, [initialData, fetchAll, processData]);

  if (isInitialLoading)
    return (
      <div className="flex justify-center py-20">
        <Loading />
      </div>
    );

  const itemsToShow = allItems.slice(0, Math.min(visibleCount, MAX_ITEMS));

  return (
    <div
      className={`relative ${isRefreshing ? "opacity-60" : "opacity-100"} transition-opacity duration-300`}
    >
      {isRefreshing && (
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-600 animate-pulse z-10" />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {itemsToShow.map((item, index) => (
          <UniversalCard
            key={item.id ? `${item.category}-${item.id}` : `idx-${index}`}
            {...item}
          />
        ))}
      </div>
      {allItems.length > visibleCount && (
        <div className="flex justify-center pb-10">
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

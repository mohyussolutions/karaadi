"use client";

import React, { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PathSegmentsDisplay from "../../../(details)/historyPath/pathSegmentsDisplay";
import UniversalCard from "@/app/(storeFront)/components/Cards/UniversalCard";
import SomaliMap from "@/app/(storeFront)/components/shared/SomLocs/page";
import LocationSelector from "@/app/(storeFront)/components/shared/SomLocs/regionsandCities";
import { AnimalAndSuppliesNestedSub } from "@/app/(links)/storeFrontLinks/nestedSubcategoryForMarketplace";
import { getGlobalSearchResults } from "@/actions/common/getGlobalSearchResults";
import {
  getMarketplaceItems,
  MarketplaceItem,
} from "@/actions/categories/marketplaceActions";
import SearchInput from "@/app/ui/search/SearchInput";

export default function AnimalAndSupplies() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null,
  );
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MarketplaceItem[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [checkedCities, setCheckedCities] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    getMarketplaceItems().then((data) => {
      setItems(data || []);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
      getGlobalSearchResults(query).then((results) => {
        const filtered = results.filter((item: any) =>
          Array.isArray(item.category)
            ? item.category.includes("Animals & Supplies")
            : item.category === "Animals & Supplies",
        );
        const mappedResults: MarketplaceItem[] = filtered.map((item: any) => ({
          _id: item._id ?? item.id ?? "",
          id: item.id ?? item._id ?? "",
          user: item.user ?? "",
          title: item.title ?? "",
          description: item.description ?? "",
          city: item.city ?? "",
          price: item.price ?? 0,
          images: item.images ?? [],
          category: item.category ?? "",
          subcategory: item.subcategory ?? "",
          region: item.region ?? "",
          mainCategory: item.mainCategory ?? "Animals & Supplies",
        }));
        setSearchResults(mappedResults);
      });
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const allAnimalItems: MarketplaceItem[] = items.filter((item) =>
    Array.isArray(item.category)
      ? item.category.includes("Animals & Supplies")
      : item.category === "Animals & Supplies",
  );

  const regionCounts: Record<string, number> = {};
  const cityCounts: Record<string, number> = {};
  for (const item of allAnimalItems) {
    if (item.region) {
      const reg = item.region.toLowerCase().trim();
      regionCounts[reg] = (regionCounts[reg] || 0) + 1;
    }
    if (item.city) {
      const cit = item.city.toLowerCase().trim();
      cityCounts[cit] = (cityCounts[cit] || 0) + 1;
    }
  }
  const regionCityCounts = { regionCounts, cityCounts };

  let itemsToDisplay: MarketplaceItem[] = query.trim()
    ? searchResults
    : allAnimalItems;
  if (selectedSubcategory) {
    itemsToDisplay = itemsToDisplay.filter((item: MarketplaceItem) => {
      const sub = Array.isArray(item.subcategory)
        ? item.subcategory
        : [item.subcategory];
      return sub.some((s) =>
        s?.toLowerCase().includes(selectedSubcategory?.toLowerCase() || ""),
      );
    });
  }
  if (selectedRegion) {
    itemsToDisplay = itemsToDisplay.filter(
      (item: MarketplaceItem) =>
        item.region?.toLowerCase().trim() ===
        (selectedRegion?.toLowerCase().trim() || ""),
    );
  }
  const activeCitiesList = Object.keys(checkedCities).filter(
    (city) => checkedCities[city],
  );
  if (activeCitiesList.length > 0) {
    itemsToDisplay = itemsToDisplay.filter((item: MarketplaceItem) =>
      activeCitiesList.includes(item.city?.toLowerCase().trim() || ""),
    );
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      scrollRef.current.scrollTo({
        left: scrollLeft + (direction === "left" ? -clientWidth : clientWidth),
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 pb-10">
      <SearchInput onSearch={setQuery} />
      <div className="pt-2">
        <PathSegmentsDisplay />
      </div>
      <div className="relative py-6">
        <div className="flex justify-center relative">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full border hover:bg-gray-50"
          >
            <FaChevronLeft />
          </button>
          <div
            ref={scrollRef}
            className="flex overflow-x-auto space-x-4 scrollbar-hide px-8 max-w-[calc(100%-80px)] py-2"
          >
            {AnimalAndSuppliesNestedSub.map((filter: any) => (
              <button
                key={filter.title}
                onClick={() =>
                  setSelectedSubcategory((prev) =>
                    prev === filter.title ? null : filter.title,
                  )
                }
                className={`flex-shrink-0 w-40 flex flex-col items-center text-center rounded-lg p-4 transition-all border ${
                  selectedSubcategory === filter.title
                    ? "bg-blue-100 border-blue-400 scale-105 shadow-sm"
                    : "bg-gray-50 border-gray-200 hover:bg-white"
                }`}
              >
                <div className="text-2xl text-blue-500 mb-2">{filter.icon}</div>
                <span className="text-[13px] font-medium text-gray-800 leading-tight">
                  {filter.so}
                </span>
                <span className="text-[10px] text-gray-400 uppercase mt-1">
                  {filter.title}
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full border hover:bg-gray-50"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
      <div className="flex flex-col-reverse md:flex-row gap-8 pt-2">
        <aside className="md:w-1/3 sticky top-4 self-start">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-32 bg-gray-100 rounded-xl" />
              <div className="h-40 bg-gray-100 rounded-xl" />
            </div>
          ) : (
            <>
              <LocationSelector
                onFilterChange={(reg, cities) => {
                  setSelectedRegion(reg);
                  setCheckedCities(cities);
                }}
                selectedRegion={selectedRegion}
                checkedCities={checkedCities}
                regionCounts={regionCityCounts.regionCounts}
                cityCounts={regionCityCounts.cityCounts}
              />
              <div className="mt-4 bg-gray-50 rounded-xl p-2 border border-gray-100 shadow-sm">
                <SomaliMap
                  selectedRegion={selectedRegion}
                  onRegionClick={setSelectedRegion}
                  items={allAnimalItems}
                />
              </div>
            </>
          )}
        </aside>
        <main className="md:w-2/3 w-full">
          <div className="mb-6 text-sm font-medium text-gray-600 bg-blue-50 py-2 px-4 rounded-lg inline-block border border-blue-100">
            Waxaa la soo bandhigayaa{" "}
            <span className="text-blue-700 font-bold">
              {itemsToDisplay.length}
            </span>{" "}
            alaabta xoolaha ah
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {itemsToDisplay.length > 0
              ? itemsToDisplay.map((item) => (
                  <UniversalCard
                    key={item._id}
                    id={item._id}
                    title={item.title}
                    description={item.description}
                    city={item.city}
                    price={item.price}
                    images={item.images}
                    category="marketplace"
                  />
                ))
              : !isLoading && (
                  <div className="col-span-full text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 font-medium">
                    Ma jiro wax alaab ah oo la helay deegaankan.
                  </div>
                )}
          </div>
        </main>
      </div>
    </div>
  );
}

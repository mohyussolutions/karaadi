"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PathSegmentsDisplay from "../../../(details)/historyPath/pathSegmentsDisplay";
import UniversalCard from "@/app/(storeFront)/components/Cards/UniversalCard";
import SomaliMap from "@/app/(storeFront)/components/shared/SomLocs/page";
import LocationSelector from "@/app/(storeFront)/components/shared/SomLocs/regionsandCities";
import { AnimalAndSuppliesNestedSub } from "@/app/(links)/storeFrontLinks/nestedSubcategoryForMarketplace";
import SearchInput from "@/app/(search)/SearchInput";
import { getGlobalSearchResults } from "@/actions/common/getGlobalSearchResults";
import {
  getMarketplaceItems,
  MarketplaceItem,
} from "@/actions/categories/marketplaceActions";

export default function AnimalAndSupplies() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
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
    async function loadData() {
      try {
        const data = await getMarketplaceItems();
        if (data) setItems(data);
      } catch (err) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const allAnimalItems = useMemo(() => {
    return items.filter((item) =>
      Array.isArray(item.category)
        ? item.category.includes("Animals & Supplies")
        : item.category === "Animals & Supplies",
    );
  }, [items]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
      const results = await getGlobalSearchResults(query);
      const filtered = results.filter((item: any) =>
        Array.isArray(item.category)
          ? item.category.includes("Animals & Supplies")
          : item.category === "Animals & Supplies",
      );
      setSearchResults(filtered);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const regionCityCounts = useMemo(() => {
    const regionCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};

    allAnimalItems.forEach((item) => {
      if (item.region) {
        const reg = item.region.toLowerCase().trim();
        regionCounts[reg] = (regionCounts[reg] || 0) + 1;
      }
      if (item.city) {
        const cit = item.city.toLowerCase().trim();
        cityCounts[cit] = (cityCounts[cit] || 0) + 1;
      }
    });
    return { regionCounts, cityCounts };
  }, [allAnimalItems]);

  const itemsToDisplay = useMemo(() => {
    let list = query.trim() ? searchResults : allAnimalItems;

    if (selectedSubcategory) {
      list = list.filter((item) => {
        const sub = Array.isArray(item.subcategory)
          ? item.subcategory
          : [item.subcategory];
        return sub.some((s) =>
          s?.toLowerCase().includes(selectedSubcategory.toLowerCase()),
        );
      });
    }

    if (selectedRegion) {
      list = list.filter(
        (item) =>
          item.region?.toLowerCase().trim() ===
          selectedRegion.toLowerCase().trim(),
      );
    }

    const activeCities = Object.keys(checkedCities).filter(
      (city) => checkedCities[city],
    );
    if (activeCities.length > 0) {
      list = list.filter((item) =>
        activeCities.includes(item.city?.toLowerCase().trim() || ""),
      );
    }

    return list;
  }, [
    allAnimalItems,
    searchResults,
    query,
    selectedSubcategory,
    selectedRegion,
    checkedCities,
  ]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      scrollRef.current.scrollTo({
        left: scrollLeft + (direction === "left" ? -clientWidth : clientWidth),
        behavior: "smooth",
      });
    }
  };

  if (isError)
    return (
      <div className="text-red-500 p-10 font-bold text-center">
        Cilad ayaa ku timid soo dejinta alaabta.
      </div>
    );

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

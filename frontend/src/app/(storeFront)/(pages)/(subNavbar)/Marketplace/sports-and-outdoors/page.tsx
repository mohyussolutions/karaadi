"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PathSegmentsDisplay from "../../../(details)/historyPath/pathSegmentsDisplay";
import UniversalCard from "@/app/(storeFront)/components/Cards/UniversalCard";
import { SportsAndOutdoorsNestedSub } from "@/app/(links)/storeFrontLinks/nestedSubcategoryForMarketplace";
import { getGlobalSearchResults } from "@/actions/common/getGlobalSearchResults";
import LocationSelector from "@/app/(storeFront)/components/shared/SomLocs/regionsandCities";
import SomaliMap from "@/app/(storeFront)/components/shared/SomLocs/page";
import {
  getMarketplaceItems,
  MarketplaceItem,
} from "@/actions/categories/marketplaceActions";
import SearchInput from "@/app/ui/search/SearchInput";

export default function SportsAndOutdoors() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MarketplaceItem[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null,
  );
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [checkedCities, setCheckedCities] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    async function loadItems() {
      try {
        const data = await getMarketplaceItems();
        if (data) setItems(data);
      } catch (err) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadItems();
  }, []);

  const allSportsItems = useMemo(() => {
    return items.filter((item) =>
      Array.isArray(item.category)
        ? item.category.includes("Sports & Outdoors")
        : item.category === "Sports & Outdoors",
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
          ? item.category.includes("Sports & Outdoors")
          : item.category === "Sports & Outdoors",
      );
      const mappedResults: MarketplaceItem[] = filtered.map((item: any) => ({
        _id: item._id ?? item.id ?? "",
        id: item.id ?? item._id ?? "",
        user: item.user ?? null,
        title: item.title ?? "",
        description: item.description ?? "",
        city: item.city ?? "",
        price: item.price ?? 0,
        images: item.images ?? [],
        category: item.category ?? "",
        subcategory: item.subcategory ?? "",
        region: item.region ?? "",
        mainCategory: item.mainCategory ?? "Sports & Outdoors",
      }));
      setSearchResults(mappedResults);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const regionCityCounts = useMemo(() => {
    const regionCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};

    allSportsItems.forEach((item) => {
      const capitalize = (s: string) =>
        s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
      if (item.region) {
        const reg = capitalize(item.region.trim());
        regionCounts[reg] = (regionCounts[reg] || 0) + 1;
      }
      if (item.city) {
        const cit = capitalize(item.city.trim());
        cityCounts[cit] = (cityCounts[cit] || 0) + 1;
      }
    });
    return { regionCounts, cityCounts };
  }, [allSportsItems]);

  const itemsToDisplay = useMemo(() => {
    let list = query.trim() ? searchResults : allSportsItems;

    if (selectedSubcategory) {
      list = list.filter((item) => {
        const subs = Array.isArray(item.subcategory)
          ? item.subcategory
          : [item.subcategory];
        return subs.some(
          (s) => s?.toLowerCase() === selectedSubcategory.toLowerCase(),
        );
      });
    }

    if (selectedRegion) {
      const activeRegs = selectedRegion.split(",");
      list = list.filter(
        (item) =>
          item.region &&
          activeRegs.some(
            (r) => r.toLowerCase() === item.region!.toLowerCase(),
          ),
      );
    }

    const activeCities = Object.keys(checkedCities).filter(
      (city) => checkedCities[city],
    );
    if (activeCities.length > 0) {
      list = list.filter(
        (item) =>
          item.city &&
          activeCities.some(
            (c) => c.toLowerCase() === item.city!.toLowerCase(),
          ),
      );
    }

    return Array.from(new Map(list.map((item) => [item._id, item])).values());
  }, [
    allSportsItems,
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
      <div className="text-red-500 p-10 text-center font-bold">
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
        <div className="flex justify-center relative items-center">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 z-10 bg-white shadow-md p-3 rounded-full border hover:bg-gray-100 transition-all"
          >
            <FaChevronLeft />
          </button>
          <div
            ref={scrollRef}
            className="flex overflow-x-auto space-x-6 scrollbar-hide px-10 max-w-[calc(100%-100px)] py-4"
          >
            {SportsAndOutdoorsNestedSub.map((filter) => (
              <button
                key={filter.title}
                onClick={() =>
                  setSelectedSubcategory((prev) =>
                    prev === filter.title ? null : filter.title,
                  )
                }
                className={`flex-shrink-0 w-44 flex flex-col items-center justify-center text-center rounded-xl p-5 border transition-all duration-300 ${
                  selectedSubcategory === filter.title
                    ? "bg-blue-600 border-blue-600 shadow-lg scale-105 text-white"
                    : "bg-white border-gray-200 hover:border-blue-400 hover:shadow-md text-gray-900"
                }`}
              >
                <div className="text-2xl mb-2">{filter.icon}</div>
                <span className="text-[15px] font-medium leading-tight">
                  {filter.so}
                </span>
                <span
                  className={`text-[10px] uppercase mt-1 ${selectedSubcategory === filter.title ? "text-blue-100" : "text-gray-500"}`}
                >
                  ({filter.title})
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 z-10 bg-white shadow-md p-3 rounded-full border hover:bg-gray-100 transition-all"
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
              items={allSportsItems}
            />
          </div>
        </aside>

        <main className="md:w-2/3 w-full">
          <div className="mb-6 text-sm font-medium text-gray-600 bg-blue-50 py-2 px-4 rounded-lg inline-block border border-blue-100">
            Waxaa la soo bandhigayaa{" "}
            <span className="text-blue-700 font-bold">
              {itemsToDisplay.length}
            </span>{" "}
            alaabta isboortiga ah.
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

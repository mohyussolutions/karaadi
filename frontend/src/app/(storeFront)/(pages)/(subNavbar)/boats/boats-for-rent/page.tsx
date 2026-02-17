"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PathSegmentsDisplay from "../../../(details)/historyPath/pathSegmentsDisplay";
import UniversalCard from "@/app/(storeFront)/components/Cards/UniversalCard";
import { BoatsForRentNestedSub } from "@/app/(links)/storeFrontLinks/nestedSubcategoryForBoats";
import { getGlobalSearchResults } from "@/actions/common/getGlobalSearchResults";
import SearchInput from "@/app/(search)/SearchInput";
import LocationSelector from "@/app/(storeFront)/components/shared/SomLocs/regionsandCities";
import SomaliMap from "@/app/(storeFront)/components/shared/SomLocs/page";
import { getBoats, Boat } from "@/actions/categories/boatActions";

export default function BoatsForRent() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<Boat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Boat[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null,
  );
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [checkedCities, setCheckedCities] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getBoats();
        setItems(data || []);
      } catch (err) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const allRentItems = useMemo(() => {
    return items.filter((item: Boat) =>
      item.category.includes("Boats for Rent"),
    );
  }, [items]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
      const results = await getGlobalSearchResults(query);
      const filtered = results.filter(
        (item: any) =>
          item.mainCategory === "Boats" &&
          item.category.includes("Boats for Rent"),
      );
      setSearchResults(filtered);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const regionCityCounts = useMemo(() => {
    const regionCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};

    allRentItems.forEach((item) => {
      if (item.region)
        regionCounts[item.region] = (regionCounts[item.region] || 0) + 1;
      if (item.city) cityCounts[item.city] = (cityCounts[item.city] || 0) + 1;
    });

    return { regionCounts, cityCounts };
  }, [allRentItems]);

  const itemsToDisplay = useMemo(() => {
    let list = query.trim() ? searchResults : allRentItems;

    if (selectedSubcategory) {
      list = list.filter((item) =>
        item.subcategory.some((sub) =>
          sub.toLowerCase().includes(selectedSubcategory.toLowerCase()),
        ),
      );
    }

    if (selectedRegion) {
      list = list.filter((item) => item.region === selectedRegion);
    }

    const activeCities = Object.keys(checkedCities).filter(
      (city) => checkedCities[city],
    );
    if (activeCities.length > 0) {
      list = list.filter((item) => activeCities.includes(item.city));
    }

    return list;
  }, [
    allRentItems,
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

  return (
    <div className="container mx-auto px-4 pb-10">
      <SearchInput onSearch={setQuery} />
      <PathSegmentsDisplay />

      <div className="relative py-6">
        <div className="flex justify-center relative">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full border"
          >
            <FaChevronLeft />
          </button>
          <div
            ref={scrollRef}
            className="flex overflow-x-auto space-x-4 scrollbar-hide px-8 max-w-[calc(100%-80px)]"
          >
            {BoatsForRentNestedSub.map((filter: any) => (
              <button
                key={filter.title}
                onClick={() =>
                  setSelectedSubcategory((prev) =>
                    prev === filter.title ? null : filter.title,
                  )
                }
                className={`flex-shrink-0 w-40 flex flex-col items-center text-center rounded-lg p-4 transition-all m-2 border ${
                  selectedSubcategory === filter.title
                    ? "bg-blue-100 border-blue-400 scale-105"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="text-xl mb-1 text-blue-600">{filter.icon}</div>
                <span className="text-sm font-bold text-gray-800">
                  {filter.so}
                </span>
                <span className="text-xs text-gray-400 uppercase">
                  {filter.title}
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full border"
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
          <div className="mt-4 bg-gray-50 rounded-xl p-2 border border-gray-100">
            <SomaliMap
              selectedRegion={selectedRegion}
              onRegionClick={setSelectedRegion}
              items={allRentItems}
            />
          </div>
        </aside>

        <main className="md:w-2/3 w-full">
          <div className="mb-4 text-sm font-medium text-gray-600 bg-blue-50 py-2 px-4 rounded-lg inline-block">
            Waxaa la helay{" "}
            <span className="text-blue-700 font-bold">
              {isLoading ? "..." : itemsToDisplay.length}
            </span>{" "}
            doonyo kireysi ah
          </div>

          {isError ? (
            <div className="text-red-500 p-10 text-center bg-red-50 rounded-xl font-bold">
              Cilad ayaa ku timid soo dejinta. Fadlan dib u tijaabi.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-72 w-full bg-gray-100 animate-pulse rounded-xl"
                    />
                  ))
                : itemsToDisplay.map((item) => (
                    <UniversalCard
                      key={item._id}
                      id={item._id}
                      title={item.title}
                      description={item.description}
                      city={item.city}
                      price={item.price}
                      images={item.images}
                      category="Boats"
                    />
                  ))}
              {!isLoading && itemsToDisplay.length === 0 && (
                <div className="col-span-full text-center py-20 border-2 border-dashed rounded-2xl text-gray-400">
                  Lama helin doonyo kireysi ah deegaankan.
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

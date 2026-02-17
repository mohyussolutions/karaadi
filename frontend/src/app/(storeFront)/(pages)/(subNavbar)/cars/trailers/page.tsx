"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PathSegmentsDisplay from "../../../(details)/historyPath/pathSegmentsDisplay";
import VehicleCard from "@/app/(storeFront)/components/Cards/VehicleCard";
import { TrailerNestedSub } from "@/app/(links)/storeFrontLinks/nestedSubcategoryForCars";
import { getGlobalSearchResults } from "@/actions/common/getGlobalSearchResults";
import SearchInput from "@/app/(search)/SearchInput";
import LocationSelector from "@/app/(storeFront)/components/shared/SomLocs/regionsandCities";
import SomaliMap from "@/app/(storeFront)/components/shared/SomLocs/page";
import { getCars, Car } from "@/actions/categories/carActions";

export default function Trailers() {
  const subCategoryLinks = TrailerNestedSub;
  const scrollRef = useRef<HTMLDivElement>(null);

  const [items, setItems] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null,
  );
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [checkedCities, setCheckedCities] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getCars();
        setItems(data || []);
      } catch (err) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const allTrailerItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return items.filter((item: any) => {
      const subCats = Array.isArray(item.subcategory)
        ? item.subcategory
        : [item.subcategory || ""];
      const titles = Array.isArray(item.title)
        ? item.title
        : [item.title || ""];

      return (
        subCats.some((s: string) => {
          const val = String(s).toLowerCase();
          return val.includes("trailer") || val.includes("rimoor");
        }) ||
        titles.some((t: string) => String(t).toLowerCase().includes("rimoor"))
      );
    });
  }, [items]);

  const regionCityCounts = useMemo(() => {
    const regionCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};
    allTrailerItems.forEach((item) => {
      if (item.region)
        regionCounts[item.region] = (regionCounts[item.region] || 0) + 1;
      if (item.city) cityCounts[item.city] = (cityCounts[item.city] || 0) + 1;
    });
    return { regionCounts, cityCounts };
  }, [allTrailerItems]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
      const results = await getGlobalSearchResults(query);
      const filtered = results.filter((item: any) => {
        const subCats = Array.isArray(item.subcategory)
          ? item.subcategory
          : [item.subcategory || ""];
        return subCats.some((s: string) => {
          const val = String(s).toLowerCase();
          return val.includes("trailer") || val.includes("rimoor");
        });
      });
      setSearchResults(filtered);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const itemsToDisplay = useMemo(() => {
    let source = query.trim() ? searchResults : allTrailerItems;

    if (selectedSubcategory) {
      const normalized = selectedSubcategory.toLowerCase();
      source = source.filter((item: any) => {
        const subCats = Array.isArray(item.subcategory)
          ? item.subcategory
          : [item.subcategory || ""];
        const subMatch = subCats.some(
          (s: string) => String(s).toLowerCase() === normalized,
        );
        const titleMatch = (item.title || "")
          .toLowerCase()
          .includes(normalized);
        return subMatch || titleMatch;
      });
    }

    if (selectedRegion) {
      const selectedRegionsList = selectedRegion.split(",");
      source = source.filter((item) =>
        selectedRegionsList.includes(item.region),
      );
    }

    const activeCities = Object.keys(checkedCities).filter(
      (c) => checkedCities[c],
    );
    if (activeCities.length > 0) {
      source = source.filter((item) => activeCities.includes(item.city));
    }

    return Array.from(
      new Map(source.map((item) => [item._id || item.id, item])).values(),
    );
  }, [
    query,
    searchResults,
    allTrailerItems,
    selectedSubcategory,
    selectedRegion,
    checkedCities,
  ]);

  const currentDisplayTitle = useMemo(() => {
    if (query.trim()) return `Natiijada: "${query}"`;
    if (!selectedSubcategory) return "Rimoorro (Trailers)";
    const found = subCategoryLinks.find(
      (cat) =>
        cat.so === selectedSubcategory || cat.title === selectedSubcategory,
    );
    return found ? `${found.so} (${found.title})` : selectedSubcategory;
  }, [query, selectedSubcategory, subCategoryLinks]);

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
        <div className="flex justify-center relative items-center">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 z-10 bg-white shadow-md p-3 rounded-full border border-gray-100"
          >
            <FaChevronLeft />
          </button>
          <div
            ref={scrollRef}
            className="flex overflow-x-auto space-x-6 scrollbar-hide px-10 max-w-[calc(100%-100px)] py-4"
          >
            {subCategoryLinks.map((category: any) => (
              <button
                key={category.so}
                onClick={() =>
                  setSelectedSubcategory((prev) =>
                    prev === category.so ? null : category.so,
                  )
                }
                className={`flex-shrink-0 w-44 flex flex-col items-center justify-center text-center rounded-xl p-5 border transition-all ${
                  selectedSubcategory === category.so
                    ? "bg-blue-600 border-blue-600 shadow-lg scale-105 text-white"
                    : "bg-white border-gray-200 text-gray-900"
                }`}
              >
                <div
                  className={`text-2xl mb-2 ${selectedSubcategory === category.so ? "text-white" : "text-blue-600"}`}
                >
                  {category.icon}
                </div>
                <span className="text-sm font-bold">{category.so}</span>
                <span
                  className={`text-[10px] uppercase ${selectedSubcategory === category.so ? "text-blue-100" : "text-gray-500"}`}
                >
                  ({category.title})
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 z-10 bg-white shadow-md p-3 rounded-full border border-gray-100"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      <div className="px-4 text-sm text-gray-700 mb-6 italic">
        Waxaa la helay{" "}
        <span className="text-blue-600 font-bold">
          {isLoading ? "..." : itemsToDisplay.length}
        </span>{" "}
        rimoor: <strong>{currentDisplayTitle}</strong>
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
              items={allTrailerItems}
            />
          </div>
        </aside>

        <main className="md:w-2/3 w-full">
          {error ? (
            <div className="text-center py-10 text-red-500 font-bold bg-red-50 rounded-xl">
              Cilad baa ku timid soo dejinta xogta rimoorada.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-80 w-full bg-gray-100 animate-pulse rounded-2xl border border-gray-200"
                  />
                ))
              ) : itemsToDisplay.length > 0 ? (
                itemsToDisplay.map((item: any) => (
                  <VehicleCard
                    key={item._id || item.id}
                    id={item._id || item.id}
                    title={item.title || item.name}
                    description={
                      item.description
                        ? (Array.isArray(item.description)
                            ? item.description
                            : [item.description]
                          ).filter(Boolean)
                        : []
                    }
                    city={item.city}
                    images={item.images}
                    price={item.price}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-500">
                  Lama helin rimoorro ku haboon xogta aad raadineyso.
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

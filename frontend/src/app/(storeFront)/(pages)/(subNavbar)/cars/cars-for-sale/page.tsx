"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PathSegmentsDisplay from "../../../(details)/historyPath/pathSegmentsDisplay";
import UniversalCard from "@/app/(storeFront)/components/Cards/UniversalCard";
import SomaliMap from "@/app/(storeFront)/components/shared/SomLocs/page";
import LocationSelector from "@/app/(storeFront)/components/shared/SomLocs/regionsandCities";
import { getGlobalSearchResults } from "@/actions/common/getGlobalSearchResults";
import { getCars, Car } from "@/actions/categories/carActions";
import { carsNestedData } from "@/app/(links)/storeFrontLinks/nestedSubcategoryForCars";
import SearchInput from "@/app/ui/search/SearchInput";
import { useTranslation } from "react-i18next";

export default function CarsForSale() {
  const { t } = useTranslation();
  const subCategoryLinks = useMemo(() => {
    const cars = carsNestedData?.CarsForSaleNestedSub || [];
    const trucks = carsNestedData?.TruckNestedSub || [];
    return [...cars, ...trucks];
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null,
  );
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Car[]>([]);
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
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const allSaleItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return items.filter((item) => {
      const cats = Array.isArray(item.category)
        ? item.category
        : [item.category];
      return cats.some(
        (c) =>
          String(c).toLowerCase().includes("sale") || String(c).includes("iib"),
      );
    });
  }, [items]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
      const results = await getGlobalSearchResults(query);
      const filtered = (results as any[]).filter(
        (item: any) =>
          item.mainCategory === "Cars" || item.mainCategory === "Trucks",
      ) as Car[];
      setSearchResults(filtered);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const itemsToDisplay = useMemo(() => {
    let source = query.trim() ? searchResults : allSaleItems;

    if (selectedSubcategory) {
      const normalized = selectedSubcategory.toLowerCase();
      source = source.filter((item: any) => {
        const subCats = Array.isArray(item.subcategory)
          ? item.subcategory
          : [item.subcategory || ""];
        const subMatch = subCats.some(
          (s: any) => String(s).toLowerCase() === normalized,
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

    return Array.from(new Map(source.map((item) => [item._id, item])).values());
  }, [
    query,
    searchResults,
    selectedSubcategory,
    allSaleItems,
    selectedRegion,
    checkedCities,
  ]);

  const regionCityCounts = useMemo(() => {
    const regionCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};
    allSaleItems.forEach((item) => {
      if (item.region)
        regionCounts[item.region] = (regionCounts[item.region] || 0) + 1;
      if (item.city) cityCounts[item.city] = (cityCounts[item.city] || 0) + 1;
    });
    return { regionCounts, cityCounts };
  }, [allSaleItems]);

  const currentDisplayTitle = useMemo(() => {
    if (query.trim()) return `Natiijada: "${query}"`;
    if (!selectedSubcategory) return "Gawaarida iibka ah";
    const found = subCategoryLinks.find(
      (cat) =>
        cat.so === selectedSubcategory || cat.title === selectedSubcategory,
    );
    return found ? `${found.so}` : selectedSubcategory;
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
    <div className="container mx-auto px-2 py-2">
      <SearchInput onSearch={setQuery} />
      <div className="pt-1">
        <PathSegmentsDisplay />
      </div>

      <div className="relative py-4">
        <div className="flex items-center group">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 z-10 bg-white shadow-sm p-2 rounded-full border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FaChevronLeft size={12} />
          </button>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto space-x-2 scrollbar-hide px-2 w-full py-2"
          >
            {subCategoryLinks.map((category: any) => (
              <button
                key={category.title}
                onClick={() =>
                  setSelectedSubcategory((prev) =>
                    prev === category.so ? null : category.so,
                  )
                }
                className={`flex-shrink-0 w-24 sm:w-28 flex flex-col items-center justify-center text-center rounded-lg p-2 border transition-all active:scale-95 ${
                  selectedSubcategory === category.so
                    ? "bg-blue-600 border-blue-600 shadow-md text-white"
                    : "bg-white border-gray-100 text-gray-700 hover:border-blue-200"
                }`}
              >
                <div
                  className={`text-xl mb-1 ${selectedSubcategory === category.so ? "text-white" : "text-blue-500"}`}
                >
                  {category.icon}
                </div>
                <span className="text-[10px] sm:text-[11px] font-medium leading-tight truncate w-full px-1">
                  {t(category.labelKey ?? "", {
                    defaultValue:
                      category.so ?? category.title ?? category.labelKey,
                  })}
                </span>
                <span
                  className={`text-[8px] uppercase tracking-tighter ${selectedSubcategory === category.so ? "text-blue-100" : "text-gray-400"}`}
                >
                  {category.title}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 z-10 bg-white shadow-sm p-2 rounded-full border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FaChevronRight size={12} />
          </button>
        </div>
      </div>

      <div className="px-4 mb-4 border-b border-gray-100 pb-2 flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-700 uppercase tracking-tight">
          {currentDisplayTitle}
          <span className="ml-2 text-blue-500">({itemsToDisplay.length})</span>
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <aside className="md:w-1/4">
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
          <div className="mt-4 bg-white rounded-xl p-1 border border-gray-100 shadow-sm">
            <SomaliMap
              selectedRegion={selectedRegion}
              onRegionClick={setSelectedRegion}
              items={allSaleItems}
            />
          </div>
        </aside>

        <main className="md:w-3/4 w-full">
          {isError ? (
            <div className="text-center py-10 text-red-500 text-sm font-medium">
              Cilad baa ku timid soo dejinta gawaarida.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-64 w-full bg-gray-50 animate-pulse rounded-xl border border-gray-100"
                  />
                ))
              ) : itemsToDisplay.length > 0 ? (
                itemsToDisplay.map((item: any) => (
                  <UniversalCard
                    key={item._id}
                    id={item._id}
                    title={item.title}
                    description={item.description}
                    city={item.city}
                    price={item.price}
                    images={item.images}
                    category="Cars"
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400 text-sm">
                  Lama helin gawaari waafaqsan raadintaada.
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PathSegmentsDisplay from "../../../(details)/historyPath/pathSegmentsDisplay";
import UniversalCard from "@/app/(storeFront)/components/Cards/UniversalCard";
import LocationSelector from "@/app/(storeFront)/components/shared/SomLocs/regionsandCities";
import SomaliMap from "@/app/(storeFront)/components/shared/SomLocs/page";

import {
  getFarmequipment,
  FarmEquipment,
} from "@/actions/categories/FarmequipmentAction";
import { getGlobalSearchResults } from "@/actions/common/getGlobalSearchResults";
import { TraktorTopCategories } from "@/app/(links)/storeFrontLinks/nestedsubcategoryfortractors";
import SearchInput from "@/app/ui/search/SearchInput";

export default function TractorForSale() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const subCategoryLinks = TraktorTopCategories;
  const { t } = useTranslation();

  const [items, setItems] = useState<FarmEquipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null,
  );
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FarmEquipment[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [checkedCities, setCheckedCities] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const data = await getFarmequipment();
        setItems(data || []);
      } catch (err) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
      const results = await getGlobalSearchResults(query);

      const filtered = (results as any[]).filter((item) => {
        const mainCat = String(item.mainCategory || "");
        const type = String(item.type || "").toLowerCase();
        return (
          mainCat === "Traktor" ||
          mainCat === "Farm Equipment" ||
          type.includes("tractor")
        );
      });

      setSearchResults(filtered as FarmEquipment[]);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const regionCityCounts = useMemo(() => {
    const regionCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};

    items.forEach((item) => {
      const capitalize = (s: string) =>
        s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";

      if (item.region) {
        const reg = capitalize(item.region.trim());
        if (reg) regionCounts[reg] = (regionCounts[reg] || 0) + 1;
      }
      if (item.city) {
        const cit = capitalize(item.city.trim());
        if (cit) cityCounts[cit] = (cityCounts[cit] || 0) + 1;
      }
    });

    return { regionCounts, cityCounts };
  }, [items]);

  const itemsToDisplay = useMemo(() => {
    let list = query.trim() ? searchResults : items;

    if (selectedSubcategory) {
      const normalized = selectedSubcategory.toLowerCase();
      list = list.filter((item) => {
        const subCats = Array.isArray(item.subcategory)
          ? item.subcategory
          : [item.subcategory || ""];
        return (
          subCats.some((s: string) => s.toLowerCase() === normalized) ||
          item.title?.toLowerCase().includes(normalized)
        );
      });
    }

    if (selectedRegion) {
      const activeRegs = selectedRegion.split(",");
      list = list.filter(
        (item) =>
          item.region &&
          activeRegs.some((r) => r.toLowerCase() === item.region.toLowerCase()),
      );
    }

    const activeCities = Object.keys(checkedCities).filter(
      (c) => checkedCities[c],
    );
    if (activeCities.length > 0) {
      list = list.filter(
        (item) =>
          item.city &&
          activeCities.some((c) => c.toLowerCase() === item.city.toLowerCase()),
      );
    }

    return Array.from(new Map(list.map((item) => [item._id, item])).values());
  }, [
    items,
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
        <div className="flex justify-center relative items-center">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 z-10 bg-white shadow-md p-3 rounded-full hover:bg-gray-100 border transition-all"
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
                className={`flex-shrink-0 w-44 flex flex-col items-center justify-center text-center rounded-xl p-5 border transition-all duration-300 ${
                  selectedSubcategory === category.so
                    ? "bg-blue-600 border-blue-600 shadow-lg scale-105 text-white"
                    : "bg-white border-gray-200 hover:border-blue-400 hover:shadow-md text-gray-900"
                }`}
              >
                <div
                  className={`text-2xl mb-2 ${selectedSubcategory === category.so ? "text-white" : "text-blue-600"}`}
                >
                  {category.icon}
                </div>
                <span className="text-sm font-bold">
                  {t(category.labelKey ?? "", {
                    defaultValue:
                      category.so ?? category.title ?? category.labelKey,
                  })}
                </span>
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
            className="absolute right-0 z-10 bg-white shadow-md p-3 rounded-full hover:bg-gray-100 border transition-all"
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
              items={items}
            />
          </div>
        </aside>

        <main className="md:w-2/3 w-full">
          <div className="mb-6 text-sm font-medium text-gray-600 bg-blue-50 py-2 px-4 rounded-lg inline-block border border-blue-100">
            {isLoading
              ? "Waa la soo dejinayaa..."
              : `Waxaa la soo bandhigayaa ${itemsToDisplay.length} qalabka beeraha ee iibka ah.`}
          </div>

          {isError ? (
            <div className="text-red-500 p-10 text-center font-bold">
              Cilad baa ku timid soo dejinta xogta.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-72 w-full bg-gray-100 animate-pulse rounded-2xl border border-gray-200"
                  />
                ))
              ) : itemsToDisplay.length > 0 ? (
                itemsToDisplay.map((item) => (
                  <UniversalCard
                    key={item._id}
                    id={item._id}
                    title={item.title}
                    description={item.description}
                    city={item.city}
                    price={item.price}
                    images={item.images}
                    category="Farmequipment"
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 font-medium">
                  Ma jiraan wax qalab ah oo la helay deegaankan.
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

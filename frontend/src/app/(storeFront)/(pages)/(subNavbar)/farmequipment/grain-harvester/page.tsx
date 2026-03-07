"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PathSegmentsDisplay from "../../../(details)/historyPath/pathSegmentsDisplay";
import UniversalCard from "@/app/(storeFront)/components/Cards/UniversalCard";
import {
  FertilizerSpreaderNestedSub,
  TraktorSubCategoryItem,
} from "@/app/(links)/storeFrontLinks/nestedsubcategoryfortractors";
import {
  getFarmequipment,
  FarmEquipment,
} from "@/actions/categories/FarmequipmentAction";
import { getGlobalSearchResults } from "@/actions/common/getGlobalSearchResults";
import SearchInput from "@/app/(search)/SearchInput";
import LocationSelector from "@/app/(storeFront)/components/shared/SomLocs/regionsandCities";
import SomaliMap from "@/app/(storeFront)/components/shared/SomLocs/page";

export default function FertilizerSpreader() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const subCategoryLinks =
    FertilizerSpreaderNestedSub as TraktorSubCategoryItem[];

  const [items, setItems] = useState<FarmEquipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const allFertilizerItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return items.filter((item: FarmEquipment) => {
      const catStr = Array.isArray(item.category)
        ? item.category.join(" ")
        : String(item.category || "");
      const subStr = Array.isArray(item.subcategory)
        ? item.subcategory.join(" ")
        : String(item.subcategory || "");
      const searchTarget = `${catStr} ${subStr} ${item.title}`.toLowerCase();

      return (
        searchTarget.includes("fertilizer") ||
        searchTarget.includes("spreader") ||
        searchTarget.includes("bacriminta")
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
      const filtered = results.filter((item: any) => {
        const cat = String(item.category || "").toLowerCase();
        const sub = String(item.subcategory || "").toLowerCase();
        return (
          cat.includes("fertilizer") ||
          sub.includes("fertilizer") ||
          cat.includes("bacriminta")
        );
      });
      setSearchResults(filtered);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const regionCityCounts = useMemo(() => {
    const regionCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};

    allFertilizerItems.forEach((item) => {
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
  }, [allFertilizerItems]);

  const itemsToDisplay = useMemo(() => {
    let list = query.trim() ? searchResults : allFertilizerItems;

    if (selectedCategory) {
      const normalized = selectedCategory.toLowerCase();
      list = list.filter((item: FarmEquipment) => {
        const sub = Array.isArray(item.subcategory)
          ? item.subcategory.join(" ")
          : String(item.subcategory || "");
        const title = String(item.title || "").toLowerCase();
        return (
          sub.toLowerCase().includes(normalized) || title.includes(normalized)
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
    query,
    searchResults,
    allFertilizerItems,
    selectedCategory,
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
      <SearchInput defaultValue={query} />
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
            {subCategoryLinks.map((category) => (
              <button
                key={category.title}
                onClick={() =>
                  setSelectedCategory((prev) =>
                    prev === category.title ? null : category.title,
                  )
                }
                className={`flex-shrink-0 w-44 flex flex-col items-center justify-center text-center rounded-xl p-5 border transition-all duration-300 ${
                  selectedCategory === category.title
                    ? "bg-emerald-600 border-emerald-600 shadow-lg scale-105 text-white"
                    : "bg-white border-gray-200 hover:border-emerald-400 hover:shadow-md text-gray-900"
                }`}
              >
                <div
                  className={`text-2xl mb-2 ${selectedCategory === category.title ? "text-white" : "text-emerald-600"}`}
                >
                  {category.icon}
                </div>
                <span className="text-sm font-bold">{category.so}</span>
                <span
                  className={`text-[10px] uppercase ${selectedCategory === category.title ? "text-emerald-100" : "text-gray-500"}`}
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
              items={allFertilizerItems}
            />
          </div>
        </aside>

        <main className="md:w-2/3 w-full">
          <div className="mb-6 text-sm font-medium text-gray-600 bg-emerald-50 py-2 px-4 rounded-lg inline-block border border-emerald-100">
            {isLoading
              ? "Waa la soo dejinayaa..."
              : `Waxaa la soo bandhigayaa ${itemsToDisplay.length} qalabka bacriminta ah.`}
          </div>

          {error ? (
            <div className="text-center py-10 text-red-500 font-bold">
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
                    images={item.images}
                    price={item.price}
                    category="Farmequipment"
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 font-medium">
                  Ma jiraan qalab bacrimin oo waafaqsan raadintaada.
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

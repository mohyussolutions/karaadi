"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getMotorcycles } from "@/actions/categories/motorcycleActions";
import { getGlobalSearchResults } from "@/actions/common/getGlobalSearchResults";
import { MCPartsNestedSub } from "@/app/(links)/storeFrontLinks/nestedSubcategoryForMotorcycles";
import UniversalCard from "@/app/(storeFront)/components/Cards/UniversalCard";
import PathSegmentsDisplay from "../../../(details)/historyPath/pathSegmentsDisplay";
import LocationSelector from "@/app/(storeFront)/components/shared/SomLocs/regionsandCities";
import SearchInput from "@/app/(search)/SearchInput";
import SomaliMap from "@/app/(storeFront)/components/shared/SomLocs/page";

export default function SpareParts() {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [checkedCities, setCheckedCities] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getMotorcycles();
        setItems(data || []);
      } catch (err) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const sparePartsItems = useMemo(() => {
    return items.filter((item) => {
      const cat = String(item?.category || "").toLowerCase();
      return cat.includes("spare parts") || cat.includes("qalab");
    });
  }, [items]);

  const regionCityCounts = useMemo(() => {
    const regionCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};
    sparePartsItems.forEach((item) => {
      const format = (s: any) => {
        const str = String(s || "").trim();
        if (!str) return null;
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      };
      const reg = format(item.region);
      const cit = format(item.city);
      if (reg) regionCounts[reg] = (regionCounts[reg] || 0) + 1;
      if (cit) cityCounts[cit] = (cityCounts[cit] || 0) + 1;
    });
    return { regionCounts, cityCounts };
  }, [sparePartsItems]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
      const results = await getGlobalSearchResults(query);
      setSearchResults(
        results.filter((item: any) => {
          const mainCat = String(item?.mainCategory || "");
          const cat = String(item?.category || "").toLowerCase();
          return (
            mainCat === "Motorcycle" &&
            (cat.includes("spare parts") || cat.includes("qalab"))
          );
        }),
      );
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const finalItems = useMemo(() => {
    let list = query.trim() ? searchResults : sparePartsItems;
    if (selectedCategory) {
      list = list.filter((item) => {
        const sub = Array.isArray(item?.subcategory)
          ? item.subcategory.join(" ")
          : String(item?.subcategory || "");
        return sub.toLowerCase().includes(selectedCategory.toLowerCase());
      });
    }
    if (selectedRegion) {
      const activeRegs = selectedRegion.split(",").map((r) => r.toLowerCase());
      list = list.filter((item) => {
        const itemReg = String(item?.region || "").toLowerCase();
        return itemReg && activeRegs.includes(itemReg);
      });
    }
    const activeCities = Object.keys(checkedCities)
      .filter((c) => checkedCities[c])
      .map((c) => c.toLowerCase());
    if (activeCities.length > 0) {
      list = list.filter((item) => {
        const itemCity = String(item?.city || "").toLowerCase();
        return itemCity && activeCities.includes(itemCity);
      });
    }
    return Array.from(
      new Map(list.map((item: any) => [item._id || item.id, item])).values(),
    );
  }, [
    query,
    searchResults,
    selectedCategory,
    sparePartsItems,
    selectedRegion,
    checkedCities,
  ]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const move = direction === "left" ? -clientWidth / 2 : clientWidth / 2;
      scrollRef.current.scrollTo({
        left: scrollLeft + move,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 pb-10">
      <SearchInput onSearch={setQuery} />

      <div className="relative py-6">
        <PathSegmentsDisplay />
        <div className="relative mt-4">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full border hover:bg-gray-100"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full border hover:bg-gray-100"
          >
            <FaChevronRight />
          </button>
          <div
            ref={scrollRef}
            className="flex overflow-x-auto space-x-4 scrollbar-hide px-8 py-2"
          >
            {MCPartsNestedSub.map((category) => (
              <button
                key={category.title}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category.title ? null : category.title,
                  )
                }
                className={`flex-shrink-0 w-44 flex flex-col items-center text-center rounded-xl p-4 shadow-sm border transition-all ${
                  selectedCategory === category.title
                    ? "bg-blue-600 border-blue-600 text-white scale-105"
                    : "bg-white text-gray-800 hover:border-blue-300 hover:shadow-md"
                }`}
              >
                <span className="text-xs font-bold leading-tight">
                  {t(category.labelKey ?? "", {
                    defaultValue:
                      category.so ?? category.title ?? category.labelKey,
                  })}
                </span>
                <span
                  className={`text-[9px] uppercase mt-1 ${selectedCategory === category.title ? "text-blue-100" : "text-gray-400"}`}
                >
                  ({category.title})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse md:flex-row gap-8 pt-2">
        <aside className="w-full md:w-1/3 sticky top-4 self-start">
          <div className="space-y-6">
            <LocationSelector
              onFilterChange={(region, cities) => {
                setSelectedRegion(region);
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
                items={sparePartsItems}
              />
            </div>
          </div>
        </aside>

        <main className="md:w-2/3 w-full">
          <div className="mb-6 flex justify-between items-center bg-blue-50 py-2 px-4 rounded-lg border border-blue-100">
            <h2 className="text-sm font-medium text-gray-600 uppercase tracking-tight">
              {isLoading
                ? "Waa la soo dejinayaa..."
                : selectedCategory || "Qalabka Mootooyinka & Bajaajta"}
              {!isLoading && (
                <span className="ml-2 text-blue-700 font-bold">
                  ({finalItems.length})
                </span>
              )}
            </h2>
          </div>

          {error ? (
            <div className="text-red-500 p-10 text-center font-bold">
              Cilad ayaa ku timid soo dejinta qalabka.
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
              ) : finalItems.length > 0 ? (
                finalItems.map((item, index) => (
                  <UniversalCard
                    key={item._id || item.id}
                    id={item._id || item.id}
                    title={item.title}
                    price={item.price}
                    city={item.city}
                    images={item.images}
                    category="motorcycles"
                    description={
                      Array.isArray(item.description)
                        ? item.description.join(" ")
                        : String(item.description || "")
                    }
                    make={item.make}
                    priority={index < 6}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-20 text-gray-400 border-2 border-dashed rounded-2xl bg-gray-50 font-medium">
                  Ma jirto qalab la helay waafaqsan raadintaada.
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

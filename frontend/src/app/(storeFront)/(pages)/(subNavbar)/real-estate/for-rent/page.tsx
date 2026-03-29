"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PathSegmentsDisplay from "../../../(details)/historyPath/pathSegmentsDisplay";
import RealEstateCard from "@/app/(storeFront)/components/Cards/RealEstateCard";
import { RealEstateForRentNestedSub } from "@/app/(links)/storeFrontLinks/nestedSubcategoryProperties";
import { getGlobalSearchResults } from "@/actions/common/getGlobalSearchResults";

import SomaliMap from "@/app/(storeFront)/components/shared/SomLocs/page";
import LocationSelector from "@/app/(storeFront)/components/shared/SomLocs/regionsandCities";

import {
  getRealEstateListings,
  RealEstate,
} from "@/actions/categories/realEstateActions";
import RoomRangeFilter from "@/app/(storeFront)/components/Filters/RoomRangeFilter";
import SearchInput from "@/app/ui/search/SearchInput";

function ForRent() {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<RealEstate[]>([]);
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

  const [rangeFilters, setRangeFilters] = useState({
    maxRooms: 10,
  });

  useEffect(() => {
    async function loadInitialData() {
      try {
        const data = await getRealEstateListings();
        if (data) setItems(data);
      } catch (err) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  const allForRentItems = useMemo(() => {
    return items.filter((item: any) => {
      const cat = Array.isArray(item.category)
        ? item.category.join(" ").toLowerCase()
        : String(item.category || "").toLowerCase();
      const subCat = String(item.subCategory || "").toLowerCase();
      return (
        cat.includes("for rent") ||
        cat.includes("kiro") ||
        subCat.includes("for rent")
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
      setSearchResults(
        results.filter((item: any) => {
          const cat = Array.isArray(item.category)
            ? item.category.join(" ").toLowerCase()
            : String(item.category || "").toLowerCase();
          return cat.includes("for rent") || cat.includes("kiro");
        }),
      );
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const regionCityCounts = useMemo(() => {
    const regionCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};

    allForRentItems.forEach((item: any) => {
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
  }, [allForRentItems]);

  const finalItems = useMemo(() => {
    let list = query.trim() ? searchResults : allForRentItems;

    list = list.filter((item: any) => {
      const rooms = Number(item.rooms) || 0;
      return rooms >= 0 && rooms <= Number(rangeFilters.maxRooms);
    });

    if (selectedSubcategory) {
      const normalized = selectedSubcategory.toLowerCase();
      list = list.filter(
        (item: any) =>
          String(item.subCategory || "")
            .toLowerCase()
            .includes(normalized) ||
          (Array.isArray(item.subcategory) &&
            item.subcategory.some((s: string) =>
              s.toLowerCase().includes(normalized),
            )),
      );
    }

    if (selectedRegion) {
      const activeRegs = selectedRegion.toLowerCase().split(",");
      list = list.filter((item: any) =>
        activeRegs.includes(String(item.region || "").toLowerCase()),
      );
    }

    const activeCities = Object.keys(checkedCities)
      .filter((k) => checkedCities[k])
      .map((c) => c.toLowerCase());

    if (activeCities.length > 0) {
      list = list.filter((item: any) =>
        activeCities.includes(String(item.city || "").toLowerCase()),
      );
    }

    return Array.from(
      new Map(list.map((item: any) => [item._id || item.id, item])).values(),
    );
  }, [
    query,
    searchResults,
    selectedSubcategory,
    allForRentItems,
    selectedRegion,
    checkedCities,
    rangeFilters,
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

  if (error)
    return (
      <div className="text-red-500 p-10 text-center font-bold">
        Cilad baa ku timid soo dejinta xogta rentals.
      </div>
    );

  return (
    <div className="container mx-auto px-4 pb-10">
      <SearchInput onSearch={setQuery} />

      <div className="relative py-6">
        <div className="pt-2">
          <PathSegmentsDisplay />
        </div>

        <div className="relative mt-4">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full border hover:bg-gray-100 transition-all"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full border hover:bg-gray-100 transition-all"
          >
            <FaChevronRight />
          </button>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto space-x-4 scrollbar-hide px-8 py-4"
          >
            {RealEstateForRentNestedSub.map((category) => (
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
                    : "bg-white border-gray-100 hover:border-blue-400 hover:shadow-md text-gray-900"
                }`}
              >
                <span className="text-2xl mb-2">{category.icon}</span>
                <span className="text-[15px] font-medium leading-tight">
                  {t(category.labelKey ?? "", {
                    defaultValue:
                      category.so ?? category.title ?? category.labelKey,
                  })}
                </span>
                <span
                  className={`text-[10px] uppercase mt-1 ${selectedSubcategory === category.so ? "text-blue-100" : "text-gray-500"}`}
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
            <RoomRangeFilter onFilterChange={setRangeFilters} />
            <SomaliMap
              selectedRegion={selectedRegion}
              onRegionClick={setSelectedRegion}
              items={allForRentItems}
            />
          </div>
        </aside>

        <main className="md:w-2/3 w-full">
          <div className="mb-6 flex justify-between items-center bg-blue-50 py-2 px-4 rounded-lg border border-blue-100">
            <h2 className="text-sm font-medium text-gray-600 uppercase tracking-tight">
              {selectedSubcategory || "Guryaha Kireysiga"}
              <span className="ml-2 text-blue-700 font-bold">
                ({finalItems.length})
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {finalItems.length > 0
              ? finalItems.map((item) => (
                  <RealEstateCard
                    key={item._id || item.id}
                    id={item._id || item.id}
                    title={item.title}
                    description={item.description}
                    city={item.city}
                    price={item.price}
                    images={item.images}
                    purpose="kiro"
                  />
                ))
              : !isLoading && (
                  <div className="col-span-full text-center py-20 text-gray-400 border-2 border-dashed rounded-2xl bg-gray-50 font-medium">
                    Ma jiraan guryo kireysi ah oo waafaqsan xogtaada.
                  </div>
                )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default ForRent;

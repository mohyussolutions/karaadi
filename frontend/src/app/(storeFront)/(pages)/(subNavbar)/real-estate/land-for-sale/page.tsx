"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PathSegmentsDisplay from "../../../(details)/historyPath/pathSegmentsDisplay";
import RealEstateCard from "@/app/(storeFront)/components/Cards/RealEstateCard";
import { RealEstateLandForSaleNestedSub } from "@/app/(links)/storeFrontLinks/nestedSubcategoryProperties";
import { getGlobalSearchResults } from "@/actions/common/getGlobalSearchResults";
import SearchInput from "@/app/(search)/SearchInput";
import LocationSelector from "@/app/(storeFront)/components/shared/SomLocs/regionsandCities";
import SomaliMap from "@/app/(storeFront)/components/shared/SomLocs/page";
import {
  getRealEstateListings,
  RealEstate,
} from "@/actions/categories/realEstateActions";

function LandForSale() {
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

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getRealEstateListings();
        if (data) setItems(data);
      } catch (err) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const allLandItems = useMemo(() => {
    return Array.isArray(items)
      ? items.filter((item: any) => {
          const cat = Array.isArray(item.category)
            ? item.category.join(" ")
            : String(item.category || "");
          return (
            cat.toLowerCase().includes("land") ||
            cat.toLowerCase().includes("dhul")
          );
        })
      : [];
  }, [items]);

  const regionCityCounts = useMemo(() => {
    const regionCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};

    allLandItems.forEach((item: any) => {
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
  }, [allLandItems]);

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
            ? item.category.join(" ")
            : String(item.category || "");
          return cat.toLowerCase().includes("land");
        }),
      );
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const itemsToDisplay = useMemo(() => {
    let list = query.trim() ? searchResults : allLandItems;

    if (selectedSubcategory) {
      const normalized = selectedSubcategory.toLowerCase();
      list = list.filter((item: any) =>
        item.subcategory?.some((sub: string) =>
          sub.toLowerCase().includes(normalized),
        ),
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

    return list;
  }, [
    query,
    searchResults,
    selectedSubcategory,
    allLandItems,
    selectedRegion,
    checkedCities,
  ]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      scrollRef.current.scrollTo({
        left:
          scrollLeft +
          (direction === "left" ? -clientWidth / 2 : clientWidth / 2),
        behavior: "smooth",
      });
    }
  };

  if (error)
    return (
      <div className="text-red-500 p-10 text-center font-bold">
        Cilad baa ku timid soo dejinta xogta.
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
            className="flex overflow-x-auto space-x-6 scrollbar-hide px-10 py-4 max-w-[calc(100%-100px)]"
          >
            {RealEstateLandForSaleNestedSub.map((category) => (
              <button
                key={category.so}
                onClick={() =>
                  setSelectedSubcategory(
                    selectedSubcategory === category.so ? null : category.so,
                  )
                }
                className={`flex-shrink-0 w-44 flex flex-col items-center justify-center text-center rounded-xl p-5 border transition-all duration-300 ${
                  selectedSubcategory === category.so
                    ? "bg-blue-600 border-blue-600 shadow-lg scale-105 text-white"
                    : "bg-white border-gray-100 hover:border-blue-400 hover:shadow-md text-gray-900"
                }`}
              >
                <div
                  className={`text-2xl mb-2 ${selectedSubcategory === category.so ? "text-white" : "text-blue-500"}`}
                >
                  {category.icon}
                </div>
                <span className="text-[15px] font-medium leading-tight">
                  {category.so}
                </span>
                <span
                  className={`text-[10px] uppercase mt-1 ${selectedSubcategory === category.so ? "text-blue-100" : "text-gray-500"}`}
                >
                  {category.title}
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
            onFilterChange={(reg, cit) => {
              setSelectedRegion(reg);
              setCheckedCities(cit);
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
              items={allLandItems}
            />
          </div>
        </aside>

        <main className="md:w-2/3 w-full">
          <div className="mb-6 flex justify-between items-center bg-blue-50 py-2 px-4 rounded-lg border border-blue-100">
            <h2 className="text-sm font-medium text-gray-600 uppercase">
              Dhul Iib ah{" "}
              <span className="ml-2 text-blue-700 font-bold">
                ({itemsToDisplay.length})
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {itemsToDisplay.length > 0
              ? itemsToDisplay.map((item: any) => (
                  <RealEstateCard
                    key={item._id || item.id}
                    id={item._id || item.id}
                    title={item.title}
                    description={item.description}
                    city={item.city}
                    price={item.price}
                    images={item.images}
                    purpose="iib"
                  />
                ))
              : !isLoading && (
                  <div className="col-span-full text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-500">
                    Ma jiro wax dhul ah oo la helay.
                  </div>
                )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default LandForSale;

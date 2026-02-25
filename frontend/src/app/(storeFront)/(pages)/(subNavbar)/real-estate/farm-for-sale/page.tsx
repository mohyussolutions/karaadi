"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PathSegmentsDisplay from "../../../(details)/historyPath/pathSegmentsDisplay";
import RealEstateCard from "@/app/(storeFront)/components/Cards/RealEstateCard";
import { RealEstateFarmForSaleNestedSub } from "@/app/(links)/storeFrontLinks/nestedSubcategoryProperties";
import { getGlobalFilteredResults } from "@/actions/categories/filterAction";
import PriceRangeFilter from "@/app/(storeFront)/components/Filters/PriceRangeFilter";
import RoomRangeFilter from "@/app/(storeFront)/components/Filters/RoomRangeFilter";
import SearchInput from "@/app/(search)/SearchInput";
import LocationSelector from "@/app/(storeFront)/components/shared/SomLocs/regionsandCities";
import SomaliMap from "@/app/(storeFront)/components/shared/SomLocs/page";
import {
  getRealEstateListings,
  RealEstate,
} from "@/actions/categories/realEstateActions";

function FarmForSale() {
  const subCategoryLinks = RealEstateFarmForSaleNestedSub;
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
  const [isFiltering, setIsFiltering] = useState(false);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);

  const [rangeFilters, setRangeFilters] = useState({
    maxPrice: 1000000,
    maxRooms: 10,
  });

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

  const allFarmItems = useMemo(() => {
    return items.filter((item: any) => {
      const cat = Array.isArray(item.category)
        ? item.category.join(" ")
        : String(item.category || "");
      return (
        cat.toLowerCase().includes("farm for sale") ||
        cat.includes("Beer iib ah") ||
        cat.toLowerCase().includes("farm")
      );
    });
  }, [items]);

  const regionCityCounts = useMemo(() => {
    const regionCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};

    allFarmItems.forEach((item: any) => {
      const normalize = (val: any) => (val ? String(val).trim() : null);
      const reg = normalize(item.region);
      const cit = normalize(item.city);

      if (reg) regionCounts[reg] = (regionCounts[reg] || 0) + 1;
      if (cit) cityCounts[cit] = (cityCounts[cit] || 0) + 1;
    });

    return { regionCounts, cityCounts };
  }, [allFarmItems]);

  useEffect(() => {
    const applyLocationFilter = async () => {
      if (!selectedRegion && Object.values(checkedCities).every((v) => !v)) {
        setFilteredItems([]);
        return;
      }
      setIsFiltering(true);
      try {
        const activeCities = Object.keys(checkedCities).filter(
          (c) => checkedCities[c],
        );
        let allResults = [];

        if (activeCities.length > 0) {
          for (const city of activeCities) {
            const results = await getGlobalFilteredResults({
              city,
              region: selectedRegion || undefined,
              q: query || undefined,
            });
            allResults.push(...results);
          }
        } else if (selectedRegion) {
          allResults = await getGlobalFilteredResults({
            region: selectedRegion,
            q: query || undefined,
          });
        }

        const uniqueItems = Array.from(
          new Map(
            allResults
              .filter((i: any) => {
                const cat = Array.isArray(i.category)
                  ? i.category.join(" ")
                  : String(i.category || "");
                return (
                  cat.toLowerCase().includes("farm for sale") ||
                  cat.includes("Beer iib ah")
                );
              })
              .map((item: any) => [item._id || item.id, item]),
          ).values(),
        );
        setFilteredItems(uniqueItems);
      } catch (err) {
        setFilteredItems([]);
      } finally {
        setIsFiltering(false);
      }
    };
    applyLocationFilter();
  }, [selectedRegion, checkedCities, query]);

  const itemsToDisplay = useMemo(() => {
    let baseList =
      selectedRegion || Object.values(checkedCities).some((v) => v)
        ? filteredItems
        : query.trim()
          ? searchResults
          : allFarmItems;

    const maxP = Number(rangeFilters.maxPrice) || Infinity;
    const maxR = Number(rangeFilters.maxRooms) || 10;

    let list = baseList.filter((item: any) => {
      const price = Number(item.price) || 0;
      const rooms = Number(item.rooms) || 0;
      return price <= maxP && rooms <= maxR;
    });

    if (selectedSubcategory) {
      const norm = selectedSubcategory.toLowerCase();
      return list.filter((item: any) => {
        const sub = Array.isArray(item.subcategory)
          ? item.subcategory
          : [item.subcategory];
        return sub.some((s: any) => String(s).toLowerCase().includes(norm));
      });
    }
    return list;
  }, [
    query,
    searchResults,
    selectedSubcategory,
    allFarmItems,
    selectedRegion,
    checkedCities,
    filteredItems,
    rangeFilters,
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
      <div className="text-red-500 p-4 text-center font-bold">
        Cilad baa dhacday.
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
            className="absolute left-0 z-10 bg-white shadow-md p-3 rounded-full border border-gray-100 hover:bg-gray-100 transition-all"
          >
            <FaChevronLeft />
          </button>
          <div
            ref={scrollRef}
            className="flex overflow-x-auto space-x-6 scrollbar-hide px-10 max-w-[calc(100%-100px)] py-4"
          >
            {subCategoryLinks.map((category) => (
              <button
                key={category.so}
                onClick={() =>
                  setSelectedSubcategory((prev) =>
                    prev === category.so ? null : category.so,
                  )
                }
                className={`flex-shrink-0 w-44 flex flex-col items-center justify-center text-center rounded-xl p-5 border transition-all ${selectedSubcategory === category.so ? "bg-blue-600 border-blue-600 shadow-lg scale-105 text-white" : "bg-white border-gray-100 hover:border-blue-400 hover:shadow-md"}`}
              >
                <div
                  className={`text-2xl mb-2 ${selectedSubcategory === category.so ? "text-white" : "text-blue-500"}`}
                >
                  {category.icon}
                </div>
                <span className="text-[15px] font-medium block leading-tight">
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
            className="absolute right-0 z-10 bg-white shadow-md p-3 rounded-full border border-gray-100 hover:bg-gray-100 transition-all"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      <div className="flex flex-col-reverse md:flex-row gap-8 pt-2">
        <aside className="md:w-1/3 sticky top-4 self-start space-y-4">
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
            <PriceRangeFilter onFilterChange={setRangeFilters} />
            <SomaliMap
              selectedRegion={selectedRegion}
              onRegionClick={setSelectedRegion}
              items={allFarmItems}
            />
          </div>
        </aside>

        <main className="md:w-3/4 w-full">
          <div className="mb-6 text-sm font-medium text-gray-700 bg-blue-50 py-2 px-4 rounded-lg inline-block border border-blue-100">
            Waxaa la helay{" "}
            <span className="text-blue-600 font-bold">
              {itemsToDisplay.length}
            </span>{" "}
            beero ah.
          </div>

          {isFiltering ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
          ) : (
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
                      Ma jiro wax beero ah oo la helay.
                    </div>
                  )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default FarmForSale;

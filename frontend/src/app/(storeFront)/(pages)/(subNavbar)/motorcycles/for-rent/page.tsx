"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useGetMotorcyclesQuery } from "@/app/(storeFront)/store/slices/motorcyclesSlice";
import VehicleCard from "@/app/(storeFront)/components/Cards/VehicleCard";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import PathSegmentsDisplay from "../../../(details)/historyPath/pathSegmentsDisplay";
import LocationSelector from "@/app/(storeFront)/components/shared/SomLocs/regionsandCities";
import { MotorcycleRentNestedSub } from "@/app/(links)/storeFrontLinks/nestedSubcategoryForMotorcycles";
import SearchInput from "@/app/(storeFront)/components/shared/(search)/SearchInput";
import SomaliMap from "@/app/(storeFront)/components/shared/SomLocs/page";
import { getGlobalFilteredResults } from "@/actions/categories/filterAction";
import { getGlobalSearchResults } from "@/actions/common/getGlobalSearchResults";

function ForRent() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: items = [], isLoading, error } = useGetMotorcyclesQuery();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [checkedCities, setCheckedCities] = useState<Record<string, boolean>>(
    {},
  );
  const [isFiltering, setIsFiltering] = useState(false);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);

  const rentCategories = MotorcycleRentNestedSub;

  const motorcyclesForRent = useMemo(() => {
    return items.filter((item) =>
      rentCategories.some(
        (cat) => cat.title === item.subCategory || cat.so === item.subCategory,
      ),
    );
  }, [items, rentCategories]);

  const regionCityCounts = useMemo(() => {
    const regionCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};
    motorcyclesForRent.forEach((item) => {
      if (item.region)
        regionCounts[item.region] = (regionCounts[item.region] || 0) + 1;
      if (item.city) cityCounts[item.city] = (cityCounts[item.city] || 0) + 1;
    });
    return { regionCounts, cityCounts };
  }, [motorcyclesForRent]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
      const results = await getGlobalSearchResults(query);
      const filteredResults = results.filter(
        (item: any) => item.itemType === "motorcycle",
      );
      setSearchResults(filteredResults);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  useEffect(() => {
    const applyLocationFilter = async () => {
      if (!selectedRegion && Object.keys(checkedCities).length === 0) {
        setFilteredItems([]);
        setIsFiltering(false);
        return;
      }
      setIsFiltering(true);
      try {
        const selectedCities = Object.entries(checkedCities)
          .filter(([_, isChecked]) => isChecked)
          .map(([cityName]) => cityName);
        let allResults: any[] = [];
        if (selectedCities.length > 0) {
          for (const city of selectedCities) {
            let params: any = { city, itemType: "motorcycle" };
            if (selectedRegion) params.region = selectedRegion;
            const results = await getGlobalFilteredResults(params);
            const unique = results.filter(
              (r: any) =>
                !allResults.some((ex) => (ex.id || ex._id) === (r.id || r._id)),
            );
            allResults.push(...unique);
          }
        } else if (selectedRegion) {
          let params: any = { region: selectedRegion, itemType: "motorcycle" };
          allResults = await getGlobalFilteredResults(params);
        }
        setFilteredItems(allResults);
      } catch (err) {
        console.error(err);
      } finally {
        setIsFiltering(false);
      }
    };
    applyLocationFilter();
  }, [selectedRegion, checkedCities, query]);

  const finalItems = useMemo(() => {
    if (selectedRegion || Object.keys(checkedCities).length > 0)
      return filteredItems;
    if (query.trim()) return searchResults;
    if (selectedCategory) {
      return motorcyclesForRent.filter(
        (item) =>
          item.subCategory === selectedCategory ||
          item.title === selectedCategory,
      );
    }
    return motorcyclesForRent;
  }, [
    query,
    searchResults,
    selectedCategory,
    motorcyclesForRent,
    selectedRegion,
    checkedCities,
    filteredItems,
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

  if (isLoading) return <Loading />;
  if (error)
    return (
      <div className="text-red-500 p-4 text-center">Error loading items.</div>
    );

  return (
    <div className="container mx-auto px-2 pb-10">
      <SearchInput onSearch={setQuery} />

      <div className="relative py-6">
        <PathSegmentsDisplay />
        <div className="relative group mt-4">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full hover:bg-gray-100"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full hover:bg-gray-100"
          >
            <FaChevronRight />
          </button>
          <div
            ref={scrollRef}
            className="flex overflow-x-auto space-x-4 scrollbar-hide px-8"
          >
            {rentCategories.map((category) => (
              <button
                key={category.title}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category.title ? null : category.title,
                  )
                }
                className={`flex-shrink-0 w-40 flex flex-col items-center text-center rounded-lg p-5 shadow transition-all ${selectedCategory === category.title ? "bg-blue-100 ring-2 ring-blue-500 scale-[1.03]" : "bg-gray-50 hover:bg-white"}`}
              >
                <span className="text-xl mb-1">{category.icon}</span>
                <span className="text-sm font-medium">{category.so}</span>
                <span className="text-xs text-gray-500">{category.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <aside className="w-full md:w-72 flex-shrink-0 sticky top-4">
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
            <SomaliMap
              selectedRegion={selectedRegion}
              onRegionClick={setSelectedRegion}
            />
          </div>
        </aside>

        <main className="flex-1 w-full">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {selectedCategory || "Dhammaan Mootooyinka"} ({finalItems.length})
            </h2>
          </div>

          {isFiltering ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {finalItems.length > 0 ? (
                finalItems.map((item) => (
                  <VehicleCard
                    key={item._id || item.id}
                    id={item._id || item.id}
                    title={item.title}
                    description={item.description}
                    city={item.city}
                    images={item.images}
                    price={item.price}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-20 text-gray-500 border-2 border-dashed rounded-xl">
                  Hanti lama helin.
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default ForRent;

"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useGetBoatsQuery } from "@/app/(storeFront)/store/slices/boatsSlice";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import PathSegmentsDisplay from "../../../(details)/historyPath/pathSegmentsDisplay";
import VehicleCard from "@/app/(storeFront)/components/Cards/VehicleCard";
import { BoatsForRentNestedSub } from "@/app/(links)/storeFrontLinks/nestedSubcategoryForBoats";
import { getGlobalFilteredResults } from "@/actions/categories/filterAction";
import { getGlobalSearchResults } from "@/actions/common/getGlobalSearchResults";
import SearchInput from "@/app/(storeFront)/components/shared/(search)/SearchInput";
import LocationSelector from "@/app/(storeFront)/components/shared/SomLocs/regionsandCities";
import SomaliMap from "@/app/(storeFront)/components/shared/SomLocs/page";

export default function BoatsForRent() {
  const subCategoryLinks = BoatsForRentNestedSub;
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: items = [], isLoading, isError } = useGetBoatsQuery();

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

  const allRentItems = useMemo(() => {
    return Array.isArray(items)
      ? items.filter(
          (item: any) =>
            (item.subCategory && item.subCategory.includes("Rent")) ||
            (item.name && item.name.includes("kireysi")),
        )
      : [];
  }, [items]);

  const regionCityCounts = useMemo(() => {
    const regionCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};

    allRentItems.forEach((item: any) => {
      if (item.region)
        regionCounts[item.region] = (regionCounts[item.region] || 0) + 1;
      if (item.city) cityCounts[item.city] = (cityCounts[item.city] || 0) + 1;
    });

    return { regionCounts, cityCounts };
  }, [allRentItems]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
      const results = await getGlobalSearchResults(query);
      const filtered = results.filter(
        (item: any) =>
          (item.subCategory && item.subCategory.includes("Rent")) ||
          (item.name && item.name.includes("kireysi")),
      );
      setSearchResults(filtered);
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

        let combinedResults: any[] = [];

        if (selectedCities.length > 0) {
          for (const city of selectedCities) {
            let params: any = { city, itemType: "boat" };
            if (selectedRegion) params.region = selectedRegion;
            if (query.trim()) params.q = query;

            const results = await getGlobalFilteredResults(params);
            const boats = results.filter(
              (item: any) =>
                (item.subCategory && item.subCategory.includes("Rent")) ||
                (item.name && item.name.includes("kireysi")),
            );

            const existingIds = new Set(
              combinedResults.map((i) => i.id || i._id),
            );
            const unique = boats.filter(
              (i: any) => !existingIds.has(i.id || i._id),
            );
            combinedResults.push(...unique);
          }
        } else if (selectedRegion) {
          let params: any = { region: selectedRegion, itemType: "boat" };
          if (query.trim()) params.q = query;
          const results = await getGlobalFilteredResults(params);
          combinedResults = results.filter(
            (item: any) =>
              (item.subCategory && item.subCategory.includes("Rent")) ||
              (item.name && item.name.includes("kireysi")),
          );
        }
        setFilteredItems(combinedResults);
      } catch (error) {
        console.error(error);
      } finally {
        setIsFiltering(false);
      }
    };
    applyLocationFilter();
  }, [selectedRegion, checkedCities, query]);

  const itemsToDisplay = useMemo(() => {
    if (selectedRegion || Object.keys(checkedCities).length > 0)
      return filteredItems;
    if (query.trim()) return searchResults;
    if (selectedSubcategory) {
      return allRentItems.filter(
        (item: any) =>
          (item.subCategory &&
            item.subCategory.includes(selectedSubcategory)) ||
          (item.title && item.title.includes(selectedSubcategory)),
      );
    }
    return allRentItems;
  }, [
    query,
    searchResults,
    selectedSubcategory,
    allRentItems,
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
  if (isError)
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load boats for rent
      </div>
    );

  return (
    <div className="container mx-auto px-4 pb-10">
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

          <div
            ref={scrollRef}
            className="flex overflow-x-auto space-x-4 scrollbar-hide px-8"
          >
            {subCategoryLinks.map((category: any) => (
              <Link
                key={category.so}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedSubcategory(
                    selectedSubcategory === category.title
                      ? null
                      : category.title,
                  );
                }}
                className={`flex-shrink-0 w-40 flex flex-col items-center text-center rounded-lg p-5 m-2 shadow transition-all duration-300 ${
                  selectedSubcategory === category.title
                    ? "bg-blue-100 ring-2 ring-blue-500 scale-[1.03]"
                    : "bg-gray-50 hover:bg-white hover:shadow-lg"
                }`}
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <span className="text-sm font-medium text-gray-800">
                  {category.so}
                </span>
                <span className="text-xs text-gray-500">
                  ({category.title})
                </span>
              </Link>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full hover:bg-gray-100"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      <div className="px-4 text-sm text-gray-700 mb-4">
        Showing{" "}
        <span className="text-blue-600 font-semibold">
          {itemsToDisplay.length}
        </span>{" "}
        items
      </div>

      <div className="flex flex-col-reverse md:flex-row gap-4 pt-2 ml-2">
        <aside className="sticky top-4 space-y-4 md:w-1/4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 mr-7">
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
          </div>
          <div className="mr-7">
            <SomaliMap
              selectedRegion={selectedRegion}
              onRegionClick={setSelectedRegion}
            />
          </div>
        </aside>

        <main className="md:w-3/4 w-full">
          {isFiltering ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {itemsToDisplay.length > 0 ? (
                itemsToDisplay.map((item: any) => (
                  <VehicleCard
                    key={item._id || item.id}
                    id={item._id || item.id}
                    title={item.title}
                    description={
                      Array.isArray(item.description)
                        ? item.description
                        : [item.description]
                    }
                    city={item.city}
                    images={item.images}
                    price={item.price}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-20 text-gray-500">
                  No boats for rent found for this selection.
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

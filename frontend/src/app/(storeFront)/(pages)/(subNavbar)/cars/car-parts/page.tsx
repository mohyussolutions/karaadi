"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useGetCarsQuery } from "@/app/(storeFront)/store/slices/carsSlice";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import PathSegmentsDisplay from "../../../(details)/historyPath/pathSegmentsDisplay";
import VehicleCard from "@/app/(storeFront)/components/Cards/VehicleCard";
import { CarPartsNestedSub } from "@/app/(links)/storeFrontLinks/nestedSubcategoryForCars";
import { getGlobalSearchResults } from "@/actions/common/getGlobalSearchResults";
import SearchInput from "@/app/(storeFront)/components/shared/(search)/SearchInput";
import LocationSelector from "@/app/(storeFront)/components/shared/SomLocs/regionsandCities";
import SomaliMap from "@/app/(storeFront)/components/shared/SomLocs/page";

export default function CarParts() {
  const subCategoryLinks = CarPartsNestedSub;
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: items = [], isLoading, isError } = useGetCarsQuery();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null,
  );
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [checkedCities, setCheckedCities] = useState<Record<string, boolean>>(
    {},
  );

  const allCarPartsItems = useMemo(() => {
    return Array.isArray(items)
      ? items.filter((item: any) => {
          const subCat = (item.subCategory || "").toLowerCase();
          const soName = (item.so || "").toLowerCase();
          return subCat.includes("parts") || soName.includes("qaybaha");
        })
      : [];
  }, [items]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
      const results = await getGlobalSearchResults(query);
      const filtered = results.filter((item: any) => {
        const subCat = (item.subCategory || "").toLowerCase();
        const soName = (item.so || "").toLowerCase();
        return subCat.includes("parts") || soName.includes("qaybaha");
      });
      setSearchResults(filtered);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const itemsToDisplay = useMemo(() => {
    let source = query.trim() ? searchResults : allCarPartsItems;

    if (selectedSubcategory) {
      const normalized = selectedSubcategory.toLowerCase();
      return source.filter((item: any) => {
        const titleMatch = item.title?.toLowerCase().includes(normalized);
        const soMatch = item.so?.toLowerCase().includes(normalized);
        return titleMatch || soMatch;
      });
    }
    return source;
  }, [query, searchResults, selectedSubcategory, allCarPartsItems]);

  const currentDisplayTitle = useMemo(() => {
    if (query.trim()) return `Search Results: "${query}"`;
    if (!selectedSubcategory)
      return "All Car Parts (Dhammaan Qaybaha Gawaarida)";

    const foundCategory = subCategoryLinks.find(
      (cat: any) =>
        cat.so.toLowerCase() === selectedSubcategory ||
        cat.title.toLowerCase() === selectedSubcategory,
    );
    return foundCategory
      ? `${foundCategory.so} (${foundCategory.title})`
      : selectedSubcategory;
  }, [query, selectedSubcategory, subCategoryLinks]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount =
        direction === "left" ? -clientWidth / 2 : clientWidth / 2;
      scrollRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load car parts
      </div>
    );

  return (
    <div className="container mx-auto px-4 pb-10">
      <SearchInput onSearch={setQuery} />
      <PathSegmentsDisplay />

      <div className="relative py-6">
        <div className="flex justify-center relative">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FaChevronLeft />
          </button>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto space-x-4 scrollbar-hide px-8 max-w-[calc(100%-80px)]"
          >
            {subCategoryLinks.map((category: any) => (
              <Link
                key={category.so}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  const normalized = category.so.toLowerCase();
                  setSelectedSubcategory(
                    selectedSubcategory === normalized ? null : normalized,
                  );
                }}
                className={`flex-shrink-0 w-40 flex flex-col items-center justify-center text-center border rounded-lg p-4 shadow-sm transition-all duration-300 m-6 ${
                  selectedSubcategory === category.so.toLowerCase()
                    ? "bg-blue-100 border-blue-400 scale-[1.03] shadow-md"
                    : "bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:shadow-lg"
                }`}
              >
                <div className="text-2xl text-gray-600 mb-2">
                  {category.icon}
                </div>
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
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      <div className="px-4 text-sm text-gray-700 mb-4">
        <p>
          Showing{" "}
          <span className="text-blue-600 font-semibold">
            {itemsToDisplay.length}
          </span>{" "}
          listings in <strong>{currentDisplayTitle}</strong>
        </p>
      </div>

      <div className="flex flex-col-reverse md:flex-row gap-4 pt-2 ml-2">
        <aside className="sticky top-4 space-y-4 md:w-1/4">
          <LocationSelector
            onFilterChange={(reg, cities) => {
              setSelectedRegion(reg);
              setCheckedCities(cities);
            }}
            selectedRegion={selectedRegion}
            checkedCities={checkedCities}
          />
          <SomaliMap
            selectedRegion={selectedRegion}
            onRegionClick={setSelectedRegion}
          />
        </aside>

        <main className="md:w-3/4 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {itemsToDisplay.length > 0 ? (
              itemsToDisplay.map((item: any) => (
                <VehicleCard
                  key={item._id}
                  id={item._id}
                  title={item.title}
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
              <div className="col-span-full text-center py-10 text-gray-500">
                {query.trim()
                  ? `No car parts found for "${query}"`
                  : "No car parts found for this selection."}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

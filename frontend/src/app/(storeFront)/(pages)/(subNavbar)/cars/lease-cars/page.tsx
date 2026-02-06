"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PathSegmentsDisplay from "../../../(details)/historyPath/pathSegmentsDisplay";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import { useGetCarsQuery } from "@/app/(storeFront)/store/slices/carsSlice";
import LocationSelector from "@/app/(storeFront)/components/shared/SomLocs/regionsandCities";
import SomaliMap from "@/app/(storeFront)/components/shared/SomLocs/page";
import VehicleCard from "@/app/(storeFront)/components/Cards/VehicleCard";
import { LeaseCarsNestedSub } from "@/app/(links)/storeFrontLinks/nestedSubcategoryForCars";
import SearchInput from "@/app/(storeFront)/components/shared/(search)/SearchInput";
import { getGlobalSearchResults } from "@/actions/common/getGlobalSearchResults";

export default function RentCars() {
  const subCategoryLinks = LeaseCarsNestedSub;
  const { data: items = [], isLoading, isError } = useGetCarsQuery();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null,
  );
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [checkedCities, setCheckedCities] = useState<Record<string, boolean>>(
    {},
  );

  const allRentItems = useMemo(() => {
    return Array.isArray(items)
      ? items.filter(
          (item: any) =>
            (item.subCategory && item.subCategory.includes("Lease")) ||
            (item.so && item.so.includes("kirayn")),
        )
      : [];
  }, [items]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
      const results = await getGlobalSearchResults(query);
      const filtered = results.filter(
        (item: any) =>
          (item.subCategory && item.subCategory.includes("Lease")) ||
          (item.so && item.so.includes("kirayn")),
      );
      setSearchResults(filtered);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const itemsToDisplay = useMemo(() => {
    let source = query.trim() ? searchResults : allRentItems;
    if (selectedSubcategory) {
      const normalized = selectedSubcategory.toLowerCase();
      return source.filter(
        (item: any) =>
          item.title?.toLowerCase().includes(normalized) ||
          item.so?.toLowerCase().includes(normalized),
      );
    }
    return source;
  }, [allRentItems, searchResults, query, selectedSubcategory]);

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
        Failed to load rental cars
      </div>
    );

  return (
    <div className="container mx-auto px-4 pb-10">
      <SearchInput onSearch={setQuery} />
      <PathSegmentsDisplay />

      <div className="relative py-6">
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
            {subCategoryLinks.map((category) => (
              <Link
                key={category.so}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedSubcategory(
                    selectedSubcategory === category.so.toLowerCase()
                      ? null
                      : category.so.toLowerCase(),
                  );
                }}
                className={`flex-shrink-0 w-40 flex flex-col items-center text-center rounded-lg p-5 m-2 shadow transition-all duration-300 ${selectedSubcategory === category.so.toLowerCase() ? "bg-blue-100 ring-2 ring-blue-500 scale-[1.03]" : "bg-gray-50 hover:bg-white hover:shadow-lg"}`}
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
                No rental cars found.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

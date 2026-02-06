"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  FaChevronLeft,
  FaChevronRight,
  FaCar,
  FaCarSide,
} from "react-icons/fa";
import PathSegmentsDisplay from "../../../(details)/historyPath/pathSegmentsDisplay";
import VehicleCard from "@/app/(storeFront)/components/Cards/VehicleCard";
import { useGetTractorsQuery } from "@/app/(storeFront)/store/slices/tractorsSlice";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import LocationSelector from "@/app/(storeFront)/components/shared/SomLocs/regionsandCities";
import SomaliMap from "@/app/(storeFront)/components/shared/SomLocs/page";
import {
  CarsForSaleNestedSub,
  TruckNestedSub,
} from "@/app/(links)/storeFrontLinks/nestedSubcategoryForCars";
import SearchInput from "@/app/(storeFront)/components/shared/(search)/SearchInput";
import { getGlobalSearchResults } from "@/actions/common/getGlobalSearchResults";

export default function CarsForSale() {
  const subCategoryLinks = CarsForSaleNestedSub.concat(TruckNestedSub);
  const { data: items = [], isLoading, isError } = useGetTractorsQuery();
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

  const allSaleItems = useMemo(() => {
    if (!Array.isArray(items)) return [];

    return items.filter((item: any) => {
      const subCat = (item.subCategory || "").toLowerCase();
      const name = (item.name || "").toLowerCase();

      return (
        subCat.includes("sale") ||
        subCat.includes("iib ah") ||
        name.includes("iib ah")
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
        const subCat = (item.subCategory || "").toLowerCase();
        return subCat.includes("sale") || subCat.includes("iib ah");
      });
      setSearchResults(filtered);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const itemsToDisplay = useMemo(() => {
    let source = query.trim() ? searchResults : allSaleItems;

    if (selectedSubcategory) {
      const normalized = selectedSubcategory.toLowerCase();
      return source.filter((item: any) => {
        const titleMatch = item.title?.toLowerCase().includes(normalized);
        const nameMatch = item.name?.toLowerCase().includes(normalized);
        const catMatch = item.subCategory?.toLowerCase().includes(normalized);
        return titleMatch || nameMatch || catMatch;
      });
    }
    return source;
  }, [allSaleItems, searchResults, query, selectedSubcategory]);

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
        Failed to load listings
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
                    selectedSubcategory === category.so ? null : category.so,
                  );
                }}
                className={`flex-shrink-0 w-40 flex flex-col items-center text-center rounded-lg p-5 m-2 shadow transition-all duration-300 ${
                  selectedSubcategory === category.so
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
                  title={item.title || item.name}
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
                Ma jiraan wax la helay oo waafaqsan raadintaada.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

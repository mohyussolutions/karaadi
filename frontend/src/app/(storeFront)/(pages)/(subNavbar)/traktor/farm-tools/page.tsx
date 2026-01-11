"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Search from "@/app/(storeFront)/components/shared/search/SearchInput";
import { useGetTractorsQuery } from "@/app/(storeFront)/store/slices/tractorsSlice";
import PathSegmentsDisplay from "../../../(details)/historyPath/pathSegmentsDisplay";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import LocationSelector from "@/app/(storeFront)/components/shared/SomaliMapRegionsAndCities/regionsandCities";
import SomaliMap from "@/app/(storeFront)/components/shared/SomaliMap/page";
import VehicleCard from "@/app/(storeFront)/components/Cards/VehicleCard";
import {
  FarmToolsNestedSub,
  TraktorSubCategoryItem,
} from "@/app/(storeFront)/components/navbar/mainCreateAdCategories/nestedsubcategoryfortractors";

function Farmtools() {
  const subCategoryLinks = FarmToolsNestedSub as TraktorSubCategoryItem[];
  const { data: items = [], isLoading, isError } = useGetTractorsQuery();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  const allFarmToolItems = useMemo(() => {
    return Array.isArray(items)
      ? items.filter(
          (item: any) =>
            item.category &&
            Array.isArray(item.category) &&
            item.category.includes("Farm Tools")
        )
      : [];
  }, [items]);

  const itemsToDisplay = useMemo(() => {
    if (!selectedCategory) {
      return allFarmToolItems;
    }

    const normalizedSelectedCategory = selectedCategory.toLowerCase();

    return allFarmToolItems.filter((item: any) => {
      return (
        item.subcategory &&
        Array.isArray(item.subcategory) &&
        item.subcategory.some(
          (sub: string) => sub.toLowerCase() === normalizedSelectedCategory
        )
      );
    });
  }, [allFarmToolItems, selectedCategory]);

  const totalFound = itemsToDisplay.length;

  const handleCategoryClick = (title: string) => {
    const normalizedTitle = title.toLowerCase();
    setSelectedCategory((prev) =>
      prev === normalizedTitle ? null : normalizedTitle
    );
  };

  const currentDisplayTitle = useMemo(() => {
    if (!selectedCategory) {
      return "All Farm Tools (Dhammaan Qalabka Beeraha)";
    }
    const foundCategory = subCategoryLinks.find(
      (cat) => cat.title.toLowerCase() === selectedCategory
    );
    return foundCategory
      ? `${foundCategory.so} (${foundCategory.title})`
      : selectedCategory;
  }, [selectedCategory, subCategoryLinks]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
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
        Failed to load Farm Tools
      </div>
    );

  return (
    <div className="container mx-auto px-6 md:px-8 lg:px-12 pb-10">
      <Search />
      <PathSegmentsDisplay />

      <div className="relative py-6">
        {subCategoryLinks.length > 0 && (
          <div className="flex justify-center relative">
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Scroll left"
            >
              <FaChevronLeft className="hover:scale-110 transition-transform" />
            </button>

            <div
              ref={scrollRef}
              className="flex overflow-x-auto space-x-4 scrollbar-hide px-8 max-w-[calc(100%-80px)]"
            >
              {subCategoryLinks.map((category) => (
                <Link
                  prefetch={false}
                  key={category.title}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryClick(category.title);
                  }}
                  className={`flex-shrink-0 w-40 flex flex-col items-center justify-center text-center group border rounded-lg p-4 shadow-sm transition-all duration-300 m-6
                  ${
                    selectedCategory === category.title.toLowerCase()
                      ? "bg-blue-100 border-blue-400 scale-[1.03] shadow-md"
                      : "bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:shadow-lg"
                  } active:scale-95`}
                >
                  <div className="text-2xl text-gray-600 mb-2 group-hover:text-blue-600">
                    {category.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-800 group-hover:text-blue-600">
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
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Scroll right"
            >
              <FaChevronRight className="hover:scale-110 transition-transform" />
            </button>
          </div>
        )}
      </div>

      <div className="px-6 mb-6 text-sm text-gray-700">
        <p>
          Showing{" "}
          <span className="text-blue-600 font-semibold">{totalFound}</span>
          listings in <strong>{currentDisplayTitle}</strong>.
        </p>
      </div>

      <div className="flex flex-col-reverse md:flex-row gap-4 pt-2 ml-2">
        <div className="sticky top-4 space-y-4">
          <LocationSelector />
          <SomaliMap />
        </div>
        <div className="md:w-3/4">
          <h2 className="text-xl font-semibold mb-6">
            {currentDisplayTitle} ({totalFound})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                        ).filter((desc: any): desc is string => !!desc)
                      : []
                  }
                  city={item.city}
                  images={item.images}
                  price={item.price}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-gray-500 min-h-[200px]">
                No items found for this selection.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Farmtools;

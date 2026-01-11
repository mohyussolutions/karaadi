"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useGetMotorcyclesQuery } from "@/app/(storeFront)/store/slices/motorcyclesSlice";
import VehicleCard from "@/app/(storeFront)/components/Cards/VehicleCard";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import Search from "@/app/(storeFront)/components/shared/search/SearchInput";
import PathSegmentsDisplay from "../../../(details)/historyPath/pathSegmentsDisplay";
import LocationSelector from "@/app/(storeFront)/components/shared/SomaliMapRegionsAndCities/regionsandCities";
import SomaliMap from "@/app/(storeFront)/components/shared/SomaliMap/page";

import { MotorcyclesForNestedSub } from "@/app/(storeFront)/components/navbar/mainCreateAdCategories/nestedSubcategoryForMotorcycles";

function MotoForSale() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: items = [], isLoading } = useGetMotorcyclesQuery();

  const salesCategories = MotorcyclesForNestedSub;

  const filteredItems = items.filter((item) =>
    salesCategories.some(
      (cat) => cat.title === item.subCategory || cat.so === item.subCategory
    )
  );

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const finalItems = selectedCategory
    ? filteredItems.filter(
        (item) =>
          item.title === selectedCategory || item.so === selectedCategory
      )
    : filteredItems;

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

  const handleCategoryClick = (categoryTitle: string) => {
    setSelectedCategory(
      categoryTitle === selectedCategory ? null : categoryTitle
    );
  };

  return (
    <div className="mx-2">
      <Search />

      <div className="relative px-4 py-6 m-2">
        <PathSegmentsDisplay />

        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full"
        >
          <FaChevronRight />
        </button>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto space-x-4 scrollbar-hide px-8 mt-4"
        >
          {salesCategories.map((category) => (
            <Link
              key={category.title}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleCategoryClick(category.title);
              }}
              className={`flex-shrink-0 w-40 flex flex-col items-center text-center group rounded-lg p-5 m-2 shadow transition-colors ${
                selectedCategory === category.title
                  ? "bg-blue-100 ring-2 ring-blue-500"
                  : "bg-gray-50 hover:bg-white"
              }`}
            >
              <span className="text-xl mb-1">{category.icon}</span>
              <span className="text-sm font-medium text-gray-800">
                {category.so}
              </span>
              <span className="text-xs text-gray-500">{category.title}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col-reverse md:flex-row gap-4 pt-2">
        <div className="sticky top-4 space-y-4 md:w-1/4">
          <LocationSelector />
          <SomaliMap />
        </div>

        <div className="md:w-3/4 w-full">
          <h2 className="text-xl font-semibold mb-6 px-2 md:px-0">
            {selectedCategory || "All Motorcycles/Bajaj for Sale"} (
            {finalItems.length})
          </h2>

          {isLoading ? (
            <div className="text-center text-gray-500 py-20">
              <Loading />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-2 md:px-0">
              {finalItems.length > 0 ? (
                finalItems.map((item) => (
                  <VehicleCard
                    key={item._id}
                    id={item._id}
                    title={item.title}
                    description={
                      item.description
                        ? (Array.isArray(item.description)
                            ? item.description
                            : [item.description]
                          ).filter((desc): desc is string => !!desc)
                        : []
                    }
                    city={item.city}
                    images={item.images}
                    price={item.price}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-20 text-gray-500 min-h-[200px]">
                  No items found for the selected category or initial filter.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MotoForSale;

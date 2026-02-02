"use client";
import React, { useRef, useState, useMemo } from "react";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import PathSegmentsDisplay from "../../../(details)/historyPath/pathSegmentsDisplay";
import RealEstateCard from "@/app/(storeFront)/components/Cards/RealEstateCard";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import { useGetRealEstateItemsQuery } from "@/app/(storeFront)/store/slices/realtStateSlice";
import Search from "@/app/(storeFront)/components/shared/search/SearchInput";
import LocationSelector from "@/app/(storeFront)/components/shared/SomLocs/regionsandCities";
import SomaliMap from "@/app/(storeFront)/components/shared/SomaliMap/page";
import { RealEstateForRentNestedSub } from "@/app/(storeFront)/components/navbar/mainCreateAdCategories/nestedSubcategoryProperties";

function ForRent() {
  const subCategoryLinks = RealEstateForRentNestedSub;

  // --- START: ALL HOOKS DEFINED HERE AT THE TOP LEVEL ---
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: items = [], isLoading, error } = useGetRealEstateItemsQuery();

  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null,
  );

  const allForRentItems = useMemo(() => {
    return items.filter((item: any) => item.category.includes("For Rent"));
  }, [items]);

  const itemsToDisplay = useMemo(() => {
    if (!selectedSubcategory) {
      return allForRentItems;
    }

    const normalizedSelectedCategory = selectedSubcategory.toLowerCase();

    return allForRentItems.filter((item: any) => {
      // Filter based on the Somali subcategory name (e.g., "Guri dabaq ah")
      return item.subcategory.some(
        (sub: string) => sub.toLowerCase() === normalizedSelectedCategory,
      );
    });
  }, [allForRentItems, selectedSubcategory]);

  const currentDisplayTitle = useMemo(() => {
    if (!selectedSubcategory) {
      return "For Rent listings (Kirada)";
    }
    const foundCategory = subCategoryLinks.find(
      (cat) => cat.so === selectedSubcategory,
    );
    // Display the Somali subcategory name followed by the English translation
    return foundCategory
      ? `${foundCategory.so} (${foundCategory.title})`
      : selectedSubcategory;
  }, [selectedSubcategory, subCategoryLinks]);
  // --- END: ALL HOOKS DEFINED HERE AT THE TOP LEVEL ---

  const totalFound = itemsToDisplay.length;

  // Functions defined below hooks
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

  const handleCategoryClick = (subcategory: string) => {
    // Sets the Somali name as the selected filter
    setSelectedSubcategory((prev) =>
      prev === subcategory ? null : subcategory,
    );
  };

  // --- CONDITIONAL RETURNS (Must follow all Hook calls) ---
  if (isLoading) return <Loading />;
  if (error) return <div className="text-red-500 p-4">Error loading items</div>;

  return (
    <div className="pb-10">
      <Search />
      <PathSegmentsDisplay />

      {/* Subcategory Navigation Bar */}
      <div className="relative px-4 py-6">
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
                key={category.so}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryClick(category.so); // Filter by Somali subcategory name
                }}
                className={`flex-shrink-0 w-40 flex flex-col items-center justify-center text-center group border rounded-lg p-4 shadow-sm transition-all duration-300 m-6
                  ${
                    selectedSubcategory === category.so
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
      </div>

      <div className="px-4 text-sm text-gray-700 mb-4">
        <p>
          Showing
          <span className="text-blue-600 font-semibold">{totalFound}</span>
          properties in
          <strong> {currentDisplayTitle}</strong>
        </p>
      </div>

      <div className="container mx-auto">
        <div className="flex flex-col-reverse md:flex-row gap-4 pt-2 ml-2">
          <div className="sticky top-4 space-y-4">
            <LocationSelector />
            <SomaliMap />
          </div>

          <div className="w-full md:w-5/6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {itemsToDisplay.length > 0 ? (
                itemsToDisplay.map((item: any) => (
                  <RealEstateCard
                    key={item._id}
                    id={item._id}
                    title={item.title}
                    description={item.description}
                    city={item.city}
                    price={item.price}
                    images={item.images}
                    purpose="kiro"
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-gray-500">
                  No rental properties found for this selection.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForRent;

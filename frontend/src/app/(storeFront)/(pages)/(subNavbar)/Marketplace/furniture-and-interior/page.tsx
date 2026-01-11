"use client";

import React, { useRef, useState, useMemo } from "react";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Search from "@/app/(storeFront)/components/shared/search/SearchInput";
import PathSegmentsDisplay from "../../../(details)/historyPath/pathSegmentsDisplay";
import { useGetMarketplaceItemsQuery } from "@/app/(storeFront)/store/slices/marketplaceSlice";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import LocationSelector from "@/app/(storeFront)/components/shared/SomaliMapRegionsAndCities/regionsandCities";
import SomaliMap from "@/app/(storeFront)/components/shared/SomaliMap/page";
import CardItem from "@/app/(storeFront)/components/Cards/CardItem";
import { FurnitureNestedSub } from "@/app/(storeFront)/components/navbar/mainCreateAdCategories/nestedSubcategoryForMarketplace";

interface MarketplaceItem {
  id: string;
  title: string;
  so: string;
  description: string;
  price: number;
  mainCategory: string;
  category: string[];
  subcategory: string[];
  region: string;
  city: string;
  district: string;
  subDistrict: string | null;
  images: string[];
  extra: any;
  userId: string;
}

function FurnitureAndInterior() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const {
    data: items = [],
    isLoading,
    error,
  } = useGetMarketplaceItemsQuery() as unknown as {
    data: MarketplaceItem[];
    isLoading: boolean;
    error: any;
  };

  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  );

  const allFurnitureItems = useMemo(() => {
    return items.filter(
      (item) => item.category && item.category.includes("Furniture & Interior")
    );
  }, [items]);

  const itemsToDisplay = useMemo(() => {
    if (!selectedSubcategory) {
      return allFurnitureItems;
    }
    return allFurnitureItems.filter(
      (item) =>
        item.subcategory && item.subcategory.includes(selectedSubcategory)
    );
  }, [allFurnitureItems, selectedSubcategory]);

  const subcategoryFilters = useMemo(() => {
    return FurnitureNestedSub.map((item) => ({
      subcategory: item.title,
      soName: item.so,
    }));
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      scrollRef.current.scrollTo({
        left: scrollLeft + (direction === "left" ? -clientWidth : clientWidth),
        behavior: "smooth",
      });
    }
  };

  const handleCategoryClick = (subcategory: string) => {
    setSelectedSubcategory((prev) =>
      prev === subcategory ? null : subcategory
    );
  };

  if (isLoading) return <Loading />;
  if (error) return <div className="text-red-500 p-4">erro</div>;

  const currentItemDisplay =
    selectedSubcategory || "Dhamaan Alaabta Guriga & Qurxinta";

  return (
    <div className="pb-10">
      eeeee
      <Search />
      <PathSegmentsDisplay />
      <div className="relative px-4 py-6">
        <div className="flex justify-center relative">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md p-2 m-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Bidix u dhaqaaji"
          >
            <FaChevronLeft />
          </button>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto space-x-4 scrollbar-hide px-8 max-w-[calc(100%-80px)]"
          >
            {subcategoryFilters.map((filter) => (
              <Link
                key={filter.subcategory}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryClick(filter.subcategory);
                }}
                className={`flex-shrink-0 w-40 flex flex-col items-center text-center group rounded-lg p-4 shadow transition-all duration-300 m-6 ${
                  selectedSubcategory === filter.subcategory
                    ? "bg-blue-100 scale-105 shadow-md"
                    : "bg-gray-50 hover:bg-white hover:shadow-lg hover:-translate-y-1"
                }`}
              >
                <span className="text-sm font-medium text-gray-800">
                  {filter.soName}
                </span>
                <span className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors">
                  {filter.subcategory}
                </span>
              </Link>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md p-2 m-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Midig u dhaqaaji"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
      <div className="px-4 text-sm text-gray-700 mb-4">
        <p>
          Waxaa la soo bandhigayaa{" "}
          <span className="text-blue-600 font-semibold">
            {itemsToDisplay.length}
          </span>{" "}
          alaab gudaha <strong>{currentItemDisplay}</strong>
        </p>
      </div>
      <div className="container mx-auto">
        <div className="flex flex-col-reverse md:flex-row gap-4 pt-2 ml-2">
          <div className="sticky top-4 space-y-4">
            <LocationSelector />
            <SomaliMap />
          </div>

          <div className="w-full md:w-5/6">
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-3 gap-6">
              {itemsToDisplay.length > 0 ? (
                itemsToDisplay.map((item) => (
                  <CardItem
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    description={item.description}
                    city={item.city}
                    price={item.price}
                    images={item.images}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-gray-500">
                  Ma jiro wax alaab **Alaabta Guriga & Qurxinta** ah oo laga
                  helay xulashadaan.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FurnitureAndInterior;

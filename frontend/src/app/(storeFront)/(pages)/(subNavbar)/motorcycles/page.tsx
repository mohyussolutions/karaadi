"use client";

import React from "react";
import Link from "next/link";

import PathSegmentsDisplay from "../../(details)/historyPath/pathSegmentsDisplay";
import VehicleCard from "@/app/(storeFront)/components/Cards/VehicleCard";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import { useGetMotorcyclesQuery } from "@/app/(storeFront)/store/slices/motorcyclesSlice";

// Assuming these imports are correct based on your previous component structure
import WantSell from "@/app/(storeFront)/components/shared/wantSellBtn/page";
import Search from "@/app/(storeFront)/components/shared/search/SearchInput";
import { motorcyclesSubCategories } from "@/app/(storeFront)/components/navbar/mainCreateAdCategories/subCategories";

function MotorcyclesLinks() {
  const mcLinks = motorcyclesSubCategories;
  const { data: items = [], isLoading, isError } = useGetMotorcyclesQuery();

  // Styling classes derived from the MarketplaceLinks and CategoryLinks examples
  const iconBaseClasses =
    "flex items-center justify-center rounded-xl transition-colors duration-300";
  const iconSizeClasses = "w-16 h-16 sm:w-16 sm:h-16 lg:w-20 lg:h-20";
  const linkHoverClasses = "border border-transparent";

  if (isLoading) return <Loading />;

  if (isError)
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load motorcycles
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-4">
      <Search />
      <PathSegmentsDisplay />

      <div className="grid grid-cols-2 gap-4 px-4 py-6">
        {mcLinks.map((category, index) => {
          const linkClasses = `flex flex-col items-center text-center group space-y-0 p-1 rounded-xl ${linkHoverClasses} transition-all duration-300 hover:scale-[1.03]`;

          const categoryContent = (
            <>
              <div
                className={`${iconBaseClasses} ${iconSizeClasses} text-3xl text-blue-400 group-hover:text-black`}
              >
                {category.icon}
              </div>
              <span className="text-sm font-medium text-gray-800 leading-snug pt-0">
                {category.so}
              </span>
            </>
          );

          return (
            <Link
              prefetch={false}
              key={category.title || index}
              href={
                (category as any).href ||
                `/motorcycles/${category.title
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`
              }
              className={linkClasses}
            >
              {categoryContent}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center justify-center min-h-[112px]">
        <WantSell />
      </div>

      <h2 className="text-xl font-semibold mb-4">
        All Motorcycles ({items.length})
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {items.length > 0 ? (
          items.map((item, index) => (
            <VehicleCard
              key={item._id || index}
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
              price={item.price}
              images={item.images}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-gray-500 min-h-[200px]">
            No motorcycles found
          </div>
        )}
      </div>
    </div>
  );
}

export default MotorcyclesLinks;

"use client";
import Link from "next/link";
import React from "react";

import PathSegmentsDisplay from "../../(details)/historyPath/pathSegmentsDisplay";
import VehicleCard from "@/app/(storeFront)/components/Cards/VehicleCard";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import { useGetCarsQuery } from "@/app/(storeFront)/store/slices/carsSlice";

import WantSell from "@/app/(storeFront)/components/shared/wantSellInk/page";
import { carsSubCategories } from "@/app/(links)/storeFrontLinks/subCategories";
import SearchInput from "@/app/(storeFront)/components/shared/(search)/SearchInput";

function CarLinks() {
  const carLinks = carsSubCategories;
  const { data: items = [], isLoading, isError } = useGetCarsQuery();

  const iconBaseClasses =
    "flex items-center justify-center rounded-xl transition-colors duration-300";
  const iconSizeClasses = "w-16 h-16 sm:w-16 sm:h-16 lg:w-20 lg:h-20";
  const linkHoverClasses = "border border-transparent";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load cars. Please try again later.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <PathSegmentsDisplay />
      <SearchInput />

      {/* Category Links Grid: 2 columns with new styling */}
      <div className="grid grid-cols-2 gap-4 px-4 py-6">
        {carLinks.map((category) => {
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
              key={category.title}
              href={
                (category as any).href ||
                `/cars/${category.title.toLowerCase().replace(/\s/g, "-")}`
              }
              className={linkClasses}
            >
              {categoryContent}
            </Link>
          );
        })}
        <div className="flex items-center justify-center min-h-[112px]">
          <WantSell />
        </div>
        ;
      </div>

      <h2 className="text-xl font-semibold mb-4">All Cars ({items.length})</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {items.length > 0 ? (
          items.map((item, index) => (
            <VehicleCard
              key={item._id || index}
              id={item._id || null}
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
            No cars found
          </div>
        )}
      </div>
    </div>
  );
}

export default CarLinks;

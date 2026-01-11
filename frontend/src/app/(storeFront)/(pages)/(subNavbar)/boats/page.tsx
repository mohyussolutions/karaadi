"use client";
import Link from "next/link";
import React from "react";

import PathSegmentsDisplay from "../../(details)/historyPath/pathSegmentsDisplay";
import VehicleCard from "@/app/(storeFront)/components/Cards/VehicleCard";
import WantSell from "@/app/(storeFront)/components/shared/wantSellBtn/page";
import Search from "@/app/(storeFront)/components/shared/search/SearchInput";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import { boatsSubCategories } from "@/app/(storeFront)/components/navbar/mainCreateAdCategories/subCategories";
import { useGetBoatsQuery } from "@/app/(storeFront)/store/slices/boatsSlice";

function BoatLinks() {
  const boatLinks = boatsSubCategories;

  const { data: boatsData, isLoading, isError } = useGetBoatsQuery();

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
        Failed to load boats. Please try again later.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 py-3">
      <Search />
      <PathSegmentsDisplay />

      <div className="grid grid-cols-2 gap-4 px-4 py-6">
        {boatLinks.map((category) => {
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
                `/boats/${category.title.toLowerCase().replace(/\s/g, "-")}`
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

      <h2 className="text-xl font-semibold mt-6 mb-4">
        All Boats ({boatsData ? boatsData.length : 0})
      </h2>

      {boatsData && boatsData.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
          {boatsData.map((item, index) => (
            <VehicleCard
              key={item._id || index}
              id={item._id || null}
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
          ))}
        </div>
      )}
      {boatsData && boatsData.length === 0 && !isLoading && (
        <div className="col-span-full text-center py-10 text-gray-500">
          No boats found
        </div>
      )}
    </div>
  );
}

export default BoatLinks;

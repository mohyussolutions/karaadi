"use client";

import Link from "next/link";
import React from "react";
import PathSegmentsDisplay from "../../(details)/historyPath/pathSegmentsDisplay";

import { useGetMarketplaceItemsQuery } from "@/app/(storeFront)/store/slices/marketplaceSlice";
import CardItem from "@/app/(storeFront)/components/Cards/CardItem";

import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import { marketplaceSubCategories } from "@/app/(links)/storeFrontLinks/subCategories";
import WantSell from "@/app/(storeFront)/components/shared/wantSellInk/page";
import SearchInput from "@/app/(storeFront)/components/shared/(search)/SearchInput";

function MarketplaceLinks() {
  const {
    data: marketplaceData,
    isLoading,
    isError,
  } = useGetMarketplaceItemsQuery();

  const iconBaseClasses =
    "flex items-center justify-center rounded-xl transition-colors duration-300";
  const iconSizeClasses = "w-16 h-16 sm:w-16 sm:h-16 lg:w-20 lg:h-20";
  const linkHoverClasses = "border border-transparent";

  const items = marketplaceData || [];
  const itemCount = items.length;

  return (
    <div className="container mx-auto px-3 py-3">
      <PathSegmentsDisplay />
      <SearchInput />
      <div className="grid grid-cols-3 gap-2 px-4 py-6 sm:grid-cols-4 lg:grid-cols-4">
        {marketplaceSubCategories.map((category) => {
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
                category.href ||
                `/Marketplace/${category.title
                  .replace(/\s/g, "-")
                  .toLowerCase()}`
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

      {isLoading && (
        <p className="text-center mt-6">
          <Loading />
        </p>
      )}
      {isError && (
        <p className="text-center text-red-500 mt-6">Failed to load items</p>
      )}

      <h2 className="text-xl font-semibold mt-6 mb-4">
        All Marketplace Items ({itemCount})
      </h2>

      {items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
          {items.map((item) => (
            <CardItem
              key={item.id}
              id={item.id}
              title={item.title}
              price={Number(item.price)}
              description={item.description}
              city={item.city}
              images={item.images}
              maGaday={item.maGaday}
            />
          ))}
        </div>
      )}
      {items.length === 0 && !isLoading && (
        <div className="col-span-full text-center py-10 text-gray-500">
          No marketplace items found
        </div>
      )}
    </div>
  );
}

export default MarketplaceLinks;

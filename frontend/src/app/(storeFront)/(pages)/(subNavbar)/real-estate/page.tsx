"use client";
import React, { JSX } from "react";
import Link from "next/link";
import { FaHome, FaBuilding, FaWarehouse, FaTree } from "react-icons/fa";

import PathSegmentsDisplay from "../../(details)/historyPath/pathSegmentsDisplay";
import RealEstateCard from "@/app/(storeFront)/components/Cards/RealEstateCard";
import { useGetRealEstateItemsQuery } from "@/app/(storeFront)/store/slices/realtStateSlice";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import WantSell from "@/app/(storeFront)/components/shared/wantSellBtn/page";
import Search from "@/app/(storeFront)/components/shared/search/SearchInput";
import { realEstateSubCategories } from "@/app/(storeFront)/components/navbar/mainCreateAdCategories/subCategories";

const iconMap: Record<string, JSX.Element> = {
  Apartment: <FaBuilding size={32} />,
  House: <FaHome size={32} />,
  Warehouse: <FaWarehouse size={32} />,
  Land: <FaTree size={32} />,
};

function RealEstateLinks() {
  const { data: items = [], isLoading, error } = useGetRealEstateItemsQuery();

  if (isLoading)
    return (
      <div>
        <Loading />
      </div>
    );
  if (error) return <div>Error loading items</div>;

  return (
    <>
      <Search />
      <div className="px-2 py-2 sm:px-2 ">
        <PathSegmentsDisplay />
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4 justify-items-center mt-4 sm:mt-6">
          {realEstateSubCategories.map((category) => (
            <Link
              key={category.title}
              href={`/real-estate/${category.title
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
            >
              <div className="w-[160px] xs:w-[180px] sm:w-[200px] bg-white shadow-md hover:shadow-lg transition-shadow rounded-xl p-3 cursor-pointer group border hover:border-blue-500 text-center mx-auto mb-4 sm:mb-0">
                <div className="text-3xl text-blue-400 group-hover:text-black transition-colors duration-200 mb-3 flex justify-center items-center h-[45px]">
                  {iconMap[category.title] || category.icon}
                </div>
                <span className="text-sm font-medium text-gray-800 block mb-1">
                  {category.so}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center min-h-[112px]">
        <WantSell />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {items.map((item: any) => (
          <RealEstateCard
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            city={item.city}
            price={item.price}
            images={item.images}
          />
        ))}
      </div>
    </>
  );
}

export default RealEstateLinks;

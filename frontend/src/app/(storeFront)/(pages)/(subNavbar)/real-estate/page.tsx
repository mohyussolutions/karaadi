"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { FaHome, FaBuilding, FaWarehouse, FaTree } from "react-icons/fa";
import PathSegmentsDisplay from "../../(details)/historyPath/pathSegmentsDisplay";
import RealEstateCard from "@/app/(storeFront)/components/Cards/RealEstateCard";
import { realEstateSubCategories } from "@/app/(links)/storeFrontLinks/subCategories";
import WantSell from "@/app/(storeFront)/components/shared/wantSellInk/page";
import { getRealEstateListings } from "@/actions/categories/realEstateActions";
import SearchInput from "@/app/(storeFront)/components/shared/(search)/SearchInput";

const iconMap: Record<string, React.ReactNode> = {
  Apartment: <FaBuilding size={24} />,
  House: <FaHome size={24} />,
  Warehouse: <FaWarehouse size={24} />,
  Land: <FaTree size={24} />,
};

export default function RealEstateLinks() {
  const [items, setItems] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getRealEstateListings();
        setItems(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const itemsToDisplay = useMemo(() => {
    if (!query.trim()) return items;
    const lowerQuery = query.toLowerCase();
    return items.filter((item) => {
      return (
        item.title?.toLowerCase().includes(lowerQuery) ||
        item.description?.toLowerCase().includes(lowerQuery) ||
        item.city?.toLowerCase().includes(lowerQuery) ||
        item.location?.toLowerCase().includes(lowerQuery)
      );
    });
  }, [items, query]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 py-2">
      <SearchInput onSearch={setQuery} />

      <div className="px-1 py-1">
        <PathSegmentsDisplay />
        <div className="grid grid-cols-3 gap-1 justify-items-center mt-2 sm:grid-cols-4 lg:grid-cols-4">
          {realEstateSubCategories.map((category) => (
            <Link
              key={category.title}
              href={`/real-estate/${category.title.toLowerCase().replace(/\s+/g, "-")}`}
              className="w-full"
            >
              <div className="bg-white hover:shadow transition-shadow rounded-lg p-2 cursor-pointer group border border-gray-200 hover:border-blue-400 text-center">
                <div className="text-xl text-blue-500 group-hover:text-blue-700 transition-colors duration-150 mb-2 flex justify-center items-center h-[35px]">
                  {iconMap[category.title] || category.icon}
                </div>
                <span className="text-sm font-medium text-gray-800 block">
                  {category.so}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center min-h-[80px]">
        <WantSell />
      </div>

      <div className="px-2 mb-3">
        <h2 className="text-lg font-medium">
          {query
            ? `Natiijada Raadinta (${itemsToDisplay.length})`
            : `Dhammaan Guryaha & Dhulka (${itemsToDisplay.length})`}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2">
        {itemsToDisplay.length > 0 ? (
          itemsToDisplay.map((item: any) => (
            <RealEstateCard
              key={item.id || item._id}
              id={item.id || item._id}
              title={item.title}
              description={item.description}
              city={item.city || item.location}
              price={item.price}
              images={item.images}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500 border-2 border-dashed rounded-xl font-normal">
            Ma jiro hanti maguurtada ah oo la helay
          </div>
        )}
      </div>
    </div>
  );
}

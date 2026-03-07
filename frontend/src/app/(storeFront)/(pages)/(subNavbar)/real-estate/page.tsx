"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { FaHome, FaBuilding, FaWarehouse, FaTree } from "react-icons/fa";
import PathSegmentsDisplay from "../../(details)/historyPath/pathSegmentsDisplay";
import RealEstateCard from "@/app/(storeFront)/components/Cards/RealEstateCard";
import { realEstateSubCategories } from "@/app/(links)/storeFrontLinks/subCategories";
import WantSell from "@/app/(storeFront)/components/shared/wantSellInk/page";
import { getRealEstateListings } from "@/actions/categories/realEstateActions";
import SearchInput from "@/app/(search)/SearchInput";

const iconMap: Record<string, React.ReactNode> = {
  Apartment: <FaBuilding />,
  House: <FaHome />,
  Warehouse: <FaWarehouse />,
  Land: <FaTree />,
};

export default function RealEstateLinks() {
  const [items, setItems] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getRealEstateListings();
        if (data) setItems(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const itemsToDisplay = useMemo(() => {
    const safeItems = Array.isArray(items) ? items : [];
    if (!query.trim()) return safeItems;

    const lowerQuery = query.toLowerCase();
    return safeItems.filter((item) => {
      return (
        item.title?.toLowerCase().includes(lowerQuery) ||
        item.description?.toLowerCase().includes(lowerQuery) ||
        item.city?.toLowerCase().includes(lowerQuery) ||
        item.location?.toLowerCase().includes(lowerQuery)
      );
    });
  }, [items, query]);

  return (
    <div className="container mx-auto px-2 py-2">
      <SearchInput onSearch={setQuery} />

      <div className="pt-2">
        <PathSegmentsDisplay />
      </div>

      <div className="grid grid-cols-3 gap-2 px-2 py-2 sm:grid-cols-4 lg:grid-cols-3">
        {realEstateSubCategories.map((category) => (
          <Link
            key={category.title}
            prefetch={true}
            href={`/real-estate/${category.title.toLowerCase().replace(/\s+/g, "-")}`}
            className="flex flex-col items-center text-center group p-2 rounded-lg border border-gray-100 bg-white hover:border-blue-200 hover:shadow-sm transition-all active:scale-80"
          >
            <div className="flex items-center justify-center rounded-xl transition-colors duration-300 w-12 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16">
              <div className="text-3xl text-blue-400 group-hover:text-black transition-colors">
                {iconMap[category.title] || category.icon}
              </div>
            </div>

            <div className="flex flex-col pt-1">
              <span className="text-[10px] sm:text-sm font-medium text-gray-700 leading-tight">
                {category.so}
              </span>
              <span className="text-[11px] font-normal text-gray-500 leading-tight">
                {category.title}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-center my-6">
        <WantSell />
      </div>

      <div className="px-4 mb-4 flex justify-between items-center border-b border-gray-100 pb-2">
        <h2 className="text-lg font-medium text-gray-700 uppercase tracking-tight">
          {query ? "Natiijada Raadinta" : "Hantida Maguurtada"}
          <span className="ml-2 text-blue-500 text-base">
            ({itemsToDisplay.length})
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {itemsToDisplay.length > 0
          ? itemsToDisplay.map((item: any) => (
              <RealEstateCard
                key={item.id || item._id}
                id={item.id || item._id}
                title={item.title}
                description={item.description}
                city={item.city || item.location}
                region={item.region}
                price={item.price}
                images={item.images}
              />
            ))
          : !isLoading && (
              <div className="col-span-full text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400 text-sm font-normal">
                Ma jiro hanti maguurtada ah oo la helay.
              </div>
            )}
      </div>
    </div>
  );
}

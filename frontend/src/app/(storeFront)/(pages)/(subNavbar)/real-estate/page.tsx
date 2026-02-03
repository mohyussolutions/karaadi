"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaHome, FaBuilding, FaWarehouse, FaTree } from "react-icons/fa";
import PathSegmentsDisplay from "../../(details)/historyPath/pathSegmentsDisplay";
import RealEstateCard from "@/app/(storeFront)/components/Cards/RealEstateCard";
import { realEstateSubCategories } from "@/app/(links)/storeFrontLinks/subCategories";
import WantSell from "@/app/(storeFront)/components/shared/wantSellInk/page";
import { getRealEstateListings } from "@/actions/categories/realEstateActions";
import SearchInput from "@/app/(storeFront)/components/shared/(search)/SearchInput";
import { getGlobalSearchResults } from "@/actions/common/getGlobalSearchResults";

const iconMap: Record<string, React.ReactNode> = {
  Apartment: <FaBuilding size={24} />,
  House: <FaHome size={24} />,
  Warehouse: <FaWarehouse size={24} />,
  Land: <FaTree size={24} />,
};

export default function RealEstateLinks() {
  const [items, setItems] = useState<any[]>([]);
  const [initialItems, setInitialItems] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInitialData() {
      const data = await getRealEstateListings();
      setItems(data || []);
      setInitialItems(data || []);
      setLoading(false);
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!query.trim()) {
        setItems(initialItems);
        return;
      }
      const results = await getGlobalSearchResults(query);
      const filteredItems = results.filter(
        (i: any) => i.itemType === "real-estate",
      );
      setItems(filteredItems);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [query, initialItems]);

  return (
    <div className="container mx-auto px-2 py-2">
      <SearchInput onSearch={setQuery} />

      <div className="px-1 py-1">
        <PathSegmentsDisplay />
        <div className="grid grid-cols-3 gap-1 justify-items-center mt-2">
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
                <span className="text-xs font-medium text-gray-800 block">
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

      <h2 className="text-lg font-semibold px-2 mb-3">
        {query
          ? `Natiijada Raadinta (${items.length})`
          : `Dhammaan Guryaha & Dhulka (${items.length})`}
      </h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-6 w-6 border-3 border-blue-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2">
          {items.length > 0 ? (
            items.map((item: any) => (
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
            <div className="col-span-full text-center py-12 text-gray-500">
              Ma jiro hanti maguurtada ah oo la helay
            </div>
          )}
        </div>
      )}
    </div>
  );
}

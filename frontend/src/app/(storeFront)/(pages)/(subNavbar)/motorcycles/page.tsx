"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import PathSegmentsDisplay from "../../(details)/historyPath/pathSegmentsDisplay";
import VehicleCard from "@/app/(storeFront)/components/Cards/VehicleCard";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import { motorcyclesSubCategories } from "@/app/(links)/storeFrontLinks/subCategories";
import SearchInput from "@/app/(storeFront)/components/shared/(search)/SearchInput";
import WantSell from "@/app/(storeFront)/components/shared/wantSellInk/page";
import { getMotorcycles } from "@/actions/categories/motorcycleActions";

function MotorcyclesLinks() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");

  const iconBaseClasses =
    "flex items-center justify-center rounded-xl transition-colors duration-300";
  const iconSizeClasses = "w-16 h-16 sm:w-16 sm:h-16 lg:w-20 lg:h-20";

  useEffect(() => {
    async function fetchItems() {
      try {
        const data = await getMotorcycles();
        setItems(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchItems();
  }, []);

  const itemsToDisplay = useMemo(() => {
    if (!query.trim()) return items;

    const lowerQuery = query.toLowerCase();
    return items.filter((item) => {
      const titleMatch = item.title?.toLowerCase().includes(lowerQuery);
      const cityMatch = item.city?.toLowerCase().includes(lowerQuery);
      const descText = Array.isArray(item.description)
        ? item.description.join(" ")
        : item.description;
      const descMatch = descText?.toLowerCase().includes(lowerQuery);

      return titleMatch || cityMatch || descMatch;
    });
  }, [items, query]);

  if (isLoading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-4">
      <SearchInput onSearch={setQuery} />
      <PathSegmentsDisplay />

      <div className="grid grid-cols-2 gap-4 px-4 py-6 sm:grid-cols-4 lg:grid-cols-4">
        {motorcyclesSubCategories.map((category, index) => (
          <Link
            prefetch={false}
            key={category.title || index}
            href={
              (category as any).href ||
              `/motorcycles/${category.title.toLowerCase().replace(/\s+/g, "-")}`
            }
            className="flex flex-col items-center text-center group space-y-0 p-1 rounded-xl transition-all duration-300 hover:scale-[1.03]"
          >
            <div
              className={`${iconBaseClasses} ${iconSizeClasses} text-3xl text-blue-400 group-hover:text-black`}
            >
              {category.icon}
            </div>
            <span className="text-sm font-medium text-gray-800 leading-snug">
              {category.so}
            </span>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-center min-h-[112px]">
        <WantSell />
      </div>

      <div className="px-4 mb-4">
        <h2 className="text-xl font-semibold">
          {query
            ? `Search Results (${itemsToDisplay.length})`
            : `All Motorcycles (${itemsToDisplay.length})`}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {itemsToDisplay.length > 0 ? (
          itemsToDisplay.map((item, index) => (
            <VehicleCard
              key={item._id || index}
              id={item._id}
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
              price={item.price}
              images={item.images}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-gray-500 min-h-[200px] border-2 border-dashed rounded-xl">
            No motorcycles found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}

export default MotorcyclesLinks;

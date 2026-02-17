"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import PathSegmentsDisplay from "../../(details)/historyPath/pathSegmentsDisplay";
import UniversalCard from "@/app/(storeFront)/components/Cards/UniversalCard";
import { motorcyclesSubCategories } from "@/app/(links)/storeFrontLinks/subCategories";
import SearchInput from "@/app/(search)/SearchInput";
import WantSell from "@/app/(storeFront)/components/shared/wantSellInk/page";
import { getMotorcycles } from "@/actions/categories/motorcycleActions";

function MotorcyclesLinks() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function fetchItems() {
      try {
        const data = await getMotorcycles();
        if (data) setItems(data);
      } catch (error) {
        setIsError(true);
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

  if (isError) {
    return (
      <div className="text-center py-6 text-red-500 font-medium">
        Cilad baa ku timid soo dejinta mootooyinka. Fadlan dib u tijaabi.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <SearchInput onSearch={setQuery} />
      <div className="pt-2">
        <PathSegmentsDisplay />
      </div>

      <div className="grid grid-cols-2 gap-3 py-6 max-w-4xl mx-auto">
        {motorcyclesSubCategories.map((category, index) => (
          <Link
            key={category.title || index}
            prefetch={true}
            href={
              (category as any).href ||
              `/motorcycles/${category.title.toLowerCase().replace(/\s+/g, "-")}`
            }
            className="flex flex-col items-center justify-center p-5 rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-blue-300 hover:bg-blue-50/10 group text-center"
          >
            <div className="text-3xl text-blue-500 mb-3 transform transition-transform duration-300 group-hover:-translate-y-0.5">
              {category.icon}
            </div>
            <div className="flex flex-col items-center w-full">
              <span className="text-[15px] font-medium text-gray-800 leading-snug group-hover:text-blue-600">
                {category.so}
              </span>
              <span className="text-[12px] text-gray-400 font-normal uppercase tracking-normal mt-1.5">
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
          {query ? "Natiijada Raadinta" : "Dhammaan Mootooyinka"}
          <span className="ml-2 text-blue-500 text-base">
            ({itemsToDisplay.length})
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {itemsToDisplay.length > 0
          ? itemsToDisplay.map((item, index) => (
              <UniversalCard
                key={`moto-${item._id || item.id || index}`}
                id={item._id || item.id}
                title={item.title}
                description={item.description}
                city={item.city}
                images={item.images}
                price={item.price}
                category="Motorcycles"
              />
            ))
          : !isLoading && (
              <div className="col-span-full text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400 text-sm">
                Ma jiraan mootooyin waafaqsan raadintaada.
              </div>
            )}
      </div>
    </div>
  );
}

export default MotorcyclesLinks;

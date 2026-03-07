"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import PathSegmentsDisplay from "../../(details)/historyPath/pathSegmentsDisplay";
import UniversalCard from "@/app/(storeFront)/components/Cards/UniversalCard";
import WantSell from "@/app/(storeFront)/components/shared/wantSellInk/page";
import SearchInput from "@/app/(search)/SearchInput";
import { getCars } from "@/actions/categories/carActions";
import { carsSubCategories } from "@/app/(links)/storeFrontLinks/nestedSubcategoryForCars";

function CarLinks() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function fetchItems() {
      try {
        const data = await getCars();
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
    const sourceItems = Array.isArray(items) ? items : [];
    if (!query.trim()) return sourceItems;

    const lowerQuery = query.toLowerCase();
    return sourceItems.filter((item) => {
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
        Cilad baa ku timid soo dejinta xogta gawaarida. Fadlan dib u tijaabi.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 py-2">
      <SearchInput onSearch={setQuery} />
      <div className="pt-1">
        <PathSegmentsDisplay />
      </div>

      <div className="grid grid-cols-3 gap-2 py-4 max-w-4xl mx-auto sm:grid-cols-4 lg:grid-cols-4">
        {carsSubCategories.map((category) => (
          <Link
            key={category.title}
            prefetch={true}
            href={
              (category as any).href ||
              `/cars/${category.title.toLowerCase().replace(/\s/g, "-")}`
            }
            className="flex flex-col items-center justify-center p-2 rounded-lg border border-gray-100 bg-white hover:border-blue-200 transition-all active:scale-95 group text-center"
          >
            <div className="text-2xl text-blue-500 mb-1 transition-transform duration-300 group-hover:-translate-y-0.5 sm:text-3xl">
              {category.icon}
            </div>
            <div className="flex flex-col items-center w-full leading-tight">
              <span className="text-[11px] font-medium text-gray-700 sm:text-sm group-hover:text-blue-600">
                {category.so}
              </span>
              <span className="text-[9px] text-gray-400 font-normal uppercase tracking-tighter sm:text-[10px]">
                {category.title}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-center my-4">
        <WantSell />
      </div>

      <div className="px-4 mb-4 flex justify-between items-center border-b border-gray-100 pb-2">
        <h2 className="text-base font-medium text-gray-700 uppercase tracking-tight sm:text-lg">
          {query ? "Natiijada Raadinta" : "Gawaarida"}
          <span className="ml-2 text-blue-500">({itemsToDisplay.length})</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
        {itemsToDisplay.length > 0
          ? itemsToDisplay.map((item, index) => (
              <UniversalCard
                key={`car-${item._id || item.id || index}`}
                id={item._id || item.id}
                title={item.title}
                description={item.description}
                city={item.city}
                images={item.images}
                price={item.price}
                category="Cars"
              />
            ))
          : !isLoading && (
              <div className="col-span-full text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400 text-sm">
                Lama helin gawaari waafaqsan raadintaada.
              </div>
            )}
      </div>
    </div>
  );
}

export default CarLinks;

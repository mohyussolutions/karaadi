"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import PathSegmentsDisplay from "../../(details)/historyPath/pathSegmentsDisplay";
import UniversalCard from "@/app/(storeFront)/components/Cards/UniversalCard";
import { marketplaceSubCategories } from "@/app/(links)/storeFrontLinks/subCategories";
import WantSell from "@/app/(storeFront)/components/shared/wantSellInk/page";
import SearchInput from "@/app/(search)/SearchInput";
import {
  getMarketplaceItems,
  MarketplaceItem,
} from "@/actions/categories/marketplaceActions";

function MarketplaceLinks() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function fetchInitialItems() {
      try {
        const data = await getMarketplaceItems();
        if (data) setItems(data);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchInitialItems();
  }, []);

  const itemsToDisplay = useMemo(() => {
    if (!query.trim()) return items;

    const lowerQuery = query.toLowerCase();
    return items.filter((item) => {
      const descText = Array.isArray(item.description)
        ? item.description.join(" ")
        : item.description;

      return (
        item.title?.toLowerCase().includes(lowerQuery) ||
        descText?.toLowerCase().includes(lowerQuery) ||
        item.city?.toLowerCase().includes(lowerQuery) ||
        item.region?.toLowerCase().includes(lowerQuery)
      );
    });
  }, [items, query]);

  if (isError) {
    return (
      <div className="text-center py-6 text-red-500 font-medium">
        Cilad baa ku timid soo dejinta xogta marketplace-ka.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 py-2">
      <SearchInput onSearch={setQuery} />
      <div className="pt-2">
        <PathSegmentsDisplay />
      </div>

      <div className="grid grid-cols-3 gap-2 px-2 py-2 sm:grid-cols-4 lg:grid-cols-3">
        {marketplaceSubCategories.map((category) => (
          <Link
            key={category.title}
            prefetch={true}
            href={
              category.href ||
              `/Marketplace/${category.title.replace(/\s/g, "-").toLowerCase()}`
            }
            className="flex flex-col items-center text-center group p-2 rounded-lg border border-gray-100 bg-white hover:border-blue-200 hover:shadow-sm transition-all active:scale-95"
          >
            <div className="flex items-center justify-center rounded-xl transition-colors duration-300 w-12 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16">
              <div className="text-3xl text-blue-400 group-hover:text-black transition-colors">
                {category.icon}
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
          {query ? "Natiijada Raadinta" : "Dhammaan Agabyada Marketplace"}
          <span className="ml-2 text-blue-500 text-base">
            ({itemsToDisplay.length})
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {itemsToDisplay.length > 0
          ? itemsToDisplay.map((item) => (
              <UniversalCard
                key={item._id}
                id={item._id}
                title={item.title}
                description={item.description}
                city={item.city}
                price={item.price}
                images={item.images}
                category="marketplace"
              />
            ))
          : !isLoading && (
              <div className="col-span-full text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400 text-sm">
                Lama helin agab waafaqsan raadintaada.
              </div>
            )}
      </div>
    </div>
  );
}

export default MarketplaceLinks;

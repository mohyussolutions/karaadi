"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import PathSegmentsDisplay from "../../(details)/historyPath/pathSegmentsDisplay";
import UniversalCard from "@/app/(storeFront)/components/Cards/UniversalCard";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import { marketplaceSubCategories } from "@/app/(links)/storeFrontLinks/subCategories";
import WantSell from "@/app/(storeFront)/components/shared/wantSellInk/page";
import SearchInput from "@/app/(storeFront)/components/shared/(search)/SearchInput";
import {
  getMarketplaceItems,
  MarketplaceItem,
} from "@/actions/categories/marketplaceActions";

function MarketplaceLinks() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");

  // 1. Initial Fetch
  useEffect(() => {
    async function fetchInitialItems() {
      try {
        const data = await getMarketplaceItems();
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchInitialItems();
  }, []);

  // 2. Local Filtering Logic (Fast and Responsive)
  const itemsToDisplay = useMemo(() => {
    if (!query.trim()) return items;

    const lowerQuery = query.toLowerCase();
    return items.filter((item) => {
      return (
        item.title?.toLowerCase().includes(lowerQuery) ||
        item.description?.toLowerCase().includes(lowerQuery) ||
        item.city?.toLowerCase().includes(lowerQuery) ||
        item.region?.toLowerCase().includes(lowerQuery)
      );
    });
  }, [items, query]);

  if (isLoading) return <Loading />;

  return (
    <div className="container mx-auto px-3 py-3">
      <PathSegmentsDisplay />

      {/* Pass setQuery to the SearchInput */}
      <SearchInput onSearch={setQuery} />

      <div className="grid grid-cols-3 gap-2 px-4 py-6 sm:grid-cols-4 lg:grid-cols-4">
        {marketplaceSubCategories.map((category) => (
          <Link
            key={category.title}
            href={
              category.href ||
              `/Marketplace/${category.title.replace(/\s/g, "-").toLowerCase()}`
            }
            className="flex flex-col items-center text-center group p-1 rounded-xl transition-all duration-300 hover:scale-[1.03]"
          >
            <div className="flex items-center justify-center rounded-xl w-16 h-16 lg:w-20 lg:h-20 text-3xl text-blue-400 group-hover:text-black transition-colors">
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

      <div className="px-4 text-sm text-gray-700 mb-4 font-medium">
        {query ? (
          <p>
            Found <span className="text-blue-600">{itemsToDisplay.length}</span>{" "}
            results for "{query}"
          </p>
        ) : (
          <p>
            Showing{" "}
            <span className="text-blue-600">{itemsToDisplay.length}</span>{" "}
            Marketplace Items
          </p>
        )}
      </div>

      <div className="w-full pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
          {itemsToDisplay.length > 0 ? (
            itemsToDisplay.map((item) => (
              <UniversalCard
                key={item._id || item._id}
                id={item._id || item._id}
                title={item.title}
                description={item.description}
                city={item.city}
                price={item.price}
                images={item.images}
                category="marketplace"
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              No items found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MarketplaceLinks;

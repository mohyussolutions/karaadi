"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import Pagination from "@/app/ui/invoices/pagination";
import { GRID_CONFIG } from "@/actions/constant/constant";
import PathSegmentsDisplay from "../../(details)/historyPath/pathSegmentsDisplay";
import UniversalCard from "@/app/(storeFront)/components/Cards/UniversalCard";
import { boatsSubCategories } from "@/app/(links)/storeFrontLinks/subCategories";
import { getBoats } from "@/actions/categories/boatActions";
import SearchInput from "@/app/ui/search/SearchInput";
import WantSell from "@/app/(storeFront)/components/shared/WantToSell/page";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";

function BoatLinks() {
  const { t } = useTranslation();
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(GRID_CONFIG.INITIAL_LOAD);
  const [loadCount, setLoadCount] = useState(0);
  const ITEMS_PER_LOAD = GRID_CONFIG.ITEMS_PER_LOAD;
  const MAX_LOADS = GRID_CONFIG.MAX_LOADS;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getBoats();
        if (data) setItems(data);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, []);

  const filteredItems = (() => {
    if (!query.trim()) return items;
    const lowerQuery = query.toLowerCase();
    return items.filter((item) => {
      const descText = Array.isArray(item.description)
        ? item.description.join(" ")
        : item.description;
      return [item.title, item.city, descText]
        .filter(Boolean)
        .some((val) => val.toLowerCase().includes(lowerQuery));
    });
  })();

  const itemsToShow = filteredItems.slice(0, visibleCount);

  const hasMore = visibleCount < filteredItems.length && loadCount < MAX_LOADS;

  const handleSeeMore = () => {
    setVisibleCount((prev) =>
      Math.min(prev + ITEMS_PER_LOAD, filteredItems.length),
    );
    setLoadCount((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto px-2 py-2">
      <SearchInput onSearch={setQuery} />
      <div className="pt-1">
        <PathSegmentsDisplay />
      </div>

      <div className="grid grid-cols-2 gap-1 px-1 py-1 sm:grid-cols-2 lg:grid-cols-2">
        {boatsSubCategories.map((category) => (
          <Link
            key={category.title}
            prefetch
            href={`/boats/${category.title.toLowerCase().replace(/\s/g, "-")}`}
            className="flex flex-col items-center text-center group p-0.5 rounded-lg border border-gray-100 bg-white hover:border-blue-200 transition-all active:scale-95"
            aria-label={
              category.labelKey
                ? t(category.labelKey)
                : category.so || category.title
            }
          >
            <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 text-lg text-[#0063fb] group-hover:text-black">
              {(category as any).logo ? (
                <div className="relative w-5 h-5">
                  <Image
                    src={(category as any).logo}
                    alt={category.title}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                category.icon
              )}
            </div>
            <div className="flex flex-col pt-0.5">
              <span className="text-[12px] font-bold text-gray-900 leading-tight truncate w-full px-0.5">
                {category.labelKey
                  ? t(category.labelKey)
                  : category.so || category.title}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-center my-4">
        <WantSell />
      </div>

      {isError ? (
        <div className="text-center py-10 text-red-500 font-medium">
          Cilad baa ku timid soo dejinta doonyaha. Fadlan dib u tijaabi.
        </div>
      ) : isLoading ? (
        <div className="py-10">
          <Loading />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
          {itemsToShow.length > 0 ? (
            itemsToShow.map((item, index) => (
              <UniversalCard
                key={`boat-${item._id || index}`}
                id={item._id}
                title={item.title}
                description={item.description}
                city={item.city}
                images={item.images}
                price={item.price}
                category="Boats"
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400 text-sm">
              Ma jiraan doonyo waafaqsan raadintaada.
            </div>
          )}
          <Pagination
            hasMore={hasMore}
            onSeeMore={handleSeeMore}
            loading={false}
          />
        </div>
      )}
    </div>
  );
}

export default BoatLinks;

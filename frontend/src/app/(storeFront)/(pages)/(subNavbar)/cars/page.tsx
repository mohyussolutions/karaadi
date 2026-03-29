"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Pagination from "@/app/ui/invoices/pagination";
import { GRID_CONFIG } from "@/actions/constant/constant";
import PathSegmentsDisplay from "../../(details)/historyPath/pathSegmentsDisplay";
import UniversalCard from "@/app/(storeFront)/components/Cards/UniversalCard";
import { getCars } from "@/actions/categories/carActions";
import { carsSubCategories } from "@/app/(links)/storeFrontLinks/nestedSubcategoryForCars";
import { useTranslation } from "react-i18next";
import WantSell from "@/app/(storeFront)/components/shared/WantToSell/page";
import SearchInput from "@/app/ui/search/SearchInput";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";

function CarLinks() {
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
        const data = await getCars();
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
    return items.filter((item) =>
      [item.title, item.city, item.description]
        .filter(Boolean)
        .some((val) => val.toLowerCase().includes(lowerQuery)),
    );
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

      <div className="grid grid-cols-3 gap-1 px-1 py-1 sm:grid-cols-4 lg:grid-cols-3">
        {carsSubCategories.map((category) => (
          <Link
            key={category.title}
            prefetch
            href={`/cars/${category.title.toLowerCase().replace(/\s+/g, "-")}`}
            className="flex flex-col items-center text-center group p-0.5 rounded-lg border border-gray-100 bg-white hover:border-blue-200 transition-all active:scale-95"
            aria-label={t(category.labelKey ?? "", {
              defaultValue: category.so ?? category.title ?? category.labelKey,
            })}
          >
            <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 text-lg text-[#0063fb] group-hover:text-black">
              {category.icon}
            </div>
            <div className="flex flex-col pt-0.5">
              <span className="text-[12px] font-bold text-gray-900 leading-tight truncate w-full px-0.5">
                {t(category.labelKey ?? "", {
                  defaultValue:
                    category.so ?? category.title ?? category.labelKey,
                })}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-center my-4">
        <WantSell />
      </div>

      {isError ? (
        <div className="text-center py-6 text-red-500 font-medium">
          Cilad baa ku timid soo dejinta xogta gawaarida. Fadlan dib u tijaabi.
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
          ) : (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400 text-sm">
              Lama helin gawaari waafaqsan raadintaada.
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

export default CarLinks;

"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { FaHome, FaBuilding, FaWarehouse, FaTree } from "react-icons/fa";
import PathSegmentsDisplay from "../../(details)/historyPath/pathSegmentsDisplay";
import { useTranslation } from "react-i18next";
import { realEstateSubCategories } from "@/app/(links)/storeFrontLinks/subCategories";
import { getRealEstateListings } from "@/actions/categories/realEstateActions";
import SearchInput from "@/app/ui/search/SearchInput";
import WantSell from "@/app/(storeFront)/components/shared/WantToSell/page";
import UniversalCard from "@/app/(storeFront)/components/Cards/UniversalCard";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";

const iconMap: Record<string, React.ReactNode> = {
  Apartment: <FaBuilding />,
  House: <FaHome />,
  Warehouse: <FaWarehouse />,
  Land: <FaTree />,
};

export default function RealEstateLinks() {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const currentLang = i18n.language;

  useEffect(() => {
    async function loadData() {
      setIsError(false);
      try {
        const data = await getRealEstateListings();
        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const itemsToDisplay = useMemo(() => {
    const safeItems = items;
    if (!query.trim()) return safeItems;
    const lowerQuery = query.toLowerCase();
    return safeItems.filter(
      (item) =>
        item.title?.toLowerCase().includes(lowerQuery) ||
        item.city?.toLowerCase().includes(lowerQuery),
    );
  }, [items, query]);

  return (
    <div className="container mx-auto px-2 py-2">
      <SearchInput defaultValue={query} onSearch={setQuery} />
      <div className="pt-2">
        <PathSegmentsDisplay />
      </div>

      <div className="grid grid-cols-2 gap-1 px-1 py-1 sm:grid-cols-2 lg:grid-cols-2">
        {realEstateSubCategories.map((category) => {
          const translatedName = t(category.labelKey ?? "", {
            defaultValue: category.title ?? category.labelKey,
          });

          return (
            <Link
              key={category.title}
              href={`/real-estate/${category.title.toLowerCase().replace(/\s+/g, "-")}`}
              className="flex flex-col items-center text-center group p-0.5 rounded-lg border border-gray-100 bg-white hover:border-blue-200 transition-all active:scale-95"
              aria-label={translatedName}
            >
              <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 text-lg text-[#0063fb] group-hover:text-black">
                {iconMap[category.title] || category.icon}
              </div>
              <div className="flex flex-col pt-0.5">
                <span className="text-[12px] font-bold text-gray-900 leading-tight truncate w-full px-0.5">
                  {translatedName}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="flex items-center justify-center">
        <WantSell />
      </div>

      <div className="min-h-[400px] mt-4">
        {isError ? (
          <div className="text-center py-10 text-red-500 font-medium">
            {t("realEstate.errorLoading", {
              defaultValue: "Error loading data.",
            })}
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loading />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
            {itemsToDisplay.length > 0 ? (
              itemsToDisplay.map((item) => (
                <UniversalCard
                  key={item._id}
                  id={item._id}
                  title={item.title}
                  description={item.description}
                  city={item.city}
                  price={item.price}
                  images={item.images}
                  category="real-estate"
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-gray-50 rounded-2xl text-gray-400">
                {t("realEstate.noItems", { defaultValue: "No items found." })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

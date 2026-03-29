"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PathSegmentsDisplay from "../../(details)/historyPath/pathSegmentsDisplay";
import UniversalCard from "@/app/(storeFront)/components/Cards/UniversalCard";
import {
  getFarmequipment,
  FarmEquipment,
} from "@/actions/categories/FarmequipmentAction";
import { TraktorTopCategories } from "@/app/(links)/storeFrontLinks/nestedsubcategoryfortractors";
import SearchInput from "@/app/ui/search/SearchInput";
import WantSell from "@/app/(storeFront)/components/shared/WantToSell/page";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";

function TractorLinks() {
  const { t } = useTranslation();
  const [items, setItems] = useState<FarmEquipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  useEffect(() => {
    async function fetchInitialItems() {
      try {
        const data = await getFarmequipment();
        if (data) setItems(data);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchInitialItems();
  }, []);

  const itemsToDisplay = (() => {
    if (!query.trim()) return items;
    const lowerQuery = query.toLowerCase();
    return items.filter((item) => {
      const descText = Array.isArray(item.description)
        ? item.description.join(" ")
        : item.description || "";
      return (
        item.title?.toLowerCase().includes(lowerQuery) ||
        descText.toLowerCase().includes(lowerQuery) ||
        item.city?.toLowerCase().includes(lowerQuery) ||
        item.region?.toLowerCase().includes(lowerQuery)
      );
    });
  })();

  return (
    <div className="container mx-auto px-2 py-2">
      <SearchInput defaultValue={query} />
      <div className="pt-1">
        <PathSegmentsDisplay />
      </div>

      <div className="grid grid-cols-2 gap-1 px-1 py-1 sm:grid-cols-2 lg:grid-cols-2">
        {TraktorTopCategories.map((category) => (
          <Link
            key={category.title}
            prefetch={true}
            href={`/farmequipment/${category.title.replace(/\s/g, "-").toLowerCase()}`}
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
          Cilad baa ku timid soo dejinta cagafyada. Fadlan dib u tijaabi.
        </div>
      ) : isLoading ? (
        <div className="py-10">
          <Loading />
        </div>
      ) : (
        <>
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
                  category="farmequipment"
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400 text-sm">
                Lama helin wax cagafyo ah oo waafaqsan raadintaada.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default TractorLinks;

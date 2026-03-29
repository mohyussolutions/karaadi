"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import PathSegmentsDisplay from "../../(details)/historyPath/pathSegmentsDisplay";
import UniversalCard from "@/app/(storeFront)/components/Cards/UniversalCard";
import { motorcyclesSubCategories } from "@/app/(links)/storeFrontLinks/subCategories";
import { useTranslation } from "react-i18next";
import {
  getMotorcycles,
  Motorcycle,
} from "@/actions/categories/motorcycleActions";
import SearchInput from "@/app/ui/search/SearchInput";
import WantSell from "@/app/(storeFront)/components/shared/WantToSell/page";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";

function MotorcyclesLinks() {
  const { t } = useTranslation();
  const [items, setItems] = useState<Motorcycle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function fetchItems() {
      setIsError(false);
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

  const itemsToDisplay = (() => {
    if (!query.trim()) return items;
    const lowerQuery = query.toLowerCase();
    return items.filter((item) => {
      const descText = Array.isArray(item.description)
        ? item.description.join(" ")
        : item.description || "";
      return (
        item.title?.toLowerCase().includes(lowerQuery) ||
        item.city?.toLowerCase().includes(lowerQuery) ||
        descText.toLowerCase().includes(lowerQuery)
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
        {motorcyclesSubCategories.map((category, index) => (
          <Link
            key={category.title || index}
            href={
              (category as any).href ||
              `/motorcycles/${category.title.toLowerCase().replace(/\s+/g, "-")}`
            }
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
      <div className="flex items-center justify-center">
        <WantSell />
      </div>

      <div className="min-h-[450px]">
        {isError ? (
          <div className="text-center py-10 text-red-500 font-medium">
            Cilad baa ku timid soo dejinta mootooyinka. Fadlan dib u tijaabi.
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loading />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
            {itemsToDisplay.length > 0 ? (
              itemsToDisplay.map((item, index) => (
                <UniversalCard
                  key={`moto-${item._id || index}`}
                  id={item._id}
                  title={item.title}
                  description={item.description}
                  city={item.city}
                  images={item.images}
                  price={item.price}
                  category="Motorcycles"
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-gray-50 rounded-2xl text-gray-400 text-sm">
                Ma jiraan mootooyin waafaqsan raadintaada.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MotorcyclesLinks;

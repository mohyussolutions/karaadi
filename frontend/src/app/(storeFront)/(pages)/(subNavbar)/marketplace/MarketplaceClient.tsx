"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
import { BASE_API_URL } from "@/actions/constant/BASE_API_URL";
import { MarketplaceItem } from "@/app/utils/types/marketplace.types";
import PathSegmentsDisplay from "../../(details)/historyPath/pathSegmentsDisplay";
import SearchInput from "@/app/ui/search/SearchInput";
import WantSell from "@/app/(storeFront)/components/shared/WantToSell/page";
import Loading from "@/app/ui/loading/Loading";
import UniversalCard from "@/app/(storeFront)/components/Cards/categoriesCards/UniversalCard";
import ContainerLinks from "@/app/(storeFront)/components/Cards/containerCards/conainerLinks";

import SubCategoryList from "@/app/(storeFront)/components/navbar/categories/SubCategoryListClient";
import { useListingFeed } from "@/app/(storeFront)/components/policy/randomFeedUtils";
import { useRandomizedItems } from "@/app/(storeFront)/components/hooks/RandomizedItemShowcase";
import { useGetRoute } from "@/app/(storeFront)/components/hooks/useGetRoute";
import Pagination from "@/app/(storeFront)/components/shared/Pagination";
import { marketplaceSubCategories } from "@/app/(links)/storeFrontLinks/mainCategotyCategorySubCategory";
import { useListingData } from "@/app/(storeFront)/components/hooks/useListingData";

const PAGE_SIZE = 12;

const marketplaceFetcher = async (): Promise<any[]> => {
  const res = await fetch(`${BASE_API_URL}/api/marketplace`);
  if (!res.ok) throw new Error("fetch failed");
  const result = await res.json();
  const list = Array.isArray(result) ? result : (result?.data ?? []);
  return list.map((it: any) => ({
    ...it,
    _id: String(it._id ?? it.id ?? ""),
    id: String(it._id ?? it.id ?? ""),
  }));
};

export default function MarketplaceClient() {
  const { t } = useTranslation();

  const { items, isLoading, isError } = useListingData<MarketplaceItem>("marketplace", marketplaceFetcher);
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const filteredItems = useListingFeed(items, query, "marketplace");
  const shuffledItems = useRandomizedItems(filteredItems);
  const { getRoute } = useGetRoute();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);

  const displayItems = shuffledItems;
  const visibleItems = displayItems.slice(0, visibleCount);
  const hasMore = displayItems.length > visibleCount;

  const handleLoadMore = useCallback(() => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + PAGE_SIZE);
      setLoadingMore(false);
    }, 300);
  }, []);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query]);

  return (
    <div className="w-full max-w-screen-xl mx-auto px-2 py-2 space-y-4 overflow-x-hidden">
      <ContainerLinks>
        <SearchInput defaultValue={query} />
      </ContainerLinks>
      <div className="pt-1">
        <PathSegmentsDisplay />
      </div>
      <ContainerLinks>
        <SubCategoryList data={marketplaceSubCategories} />
      </ContainerLinks>
      <ContainerLinks>
        <WantSell />
      </ContainerLinks>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <div className="text-center py-12 text-gray-400 text-sm">
          {t("loadError", { defaultValue: "Waxaad dib u eegi kartaa markale." })}
        </div>
      ) : (
        <div className="space-y-4">
          <ContainerLinks>
            <div className="text-sm font-medium text-gray-600 px-3 py-1 flex justify-between items-center">
              <span>
                {t("resultsFound", { defaultValue: "Natiijada la helay:" })}
              </span>
              <span className="text-blue-700 font-bold">
                {displayItems.length} {t("items", { defaultValue: "items" })}
              </span>
            </div>
          </ContainerLinks>
          <ContainerLinks>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-3">
              {visibleItems.length > 0 ? (
                visibleItems.map((item: any, index: number) => {
                  const itemId = item._id || item.id;
                  const routePrefix = getRoute("marketplace");
                  const linkHref = itemId
                    ? `${routePrefix}/${encodeURIComponent(itemId)}`
                    : "/";
                  const categoryValue = Array.isArray(item.category)
                    ? item.category[0] || "marketplace"
                    : item.category || "marketplace";
                  return (
                    <UniversalCard
                      key={itemId || index}
                      id={itemId}
                      title={item.title || ""}
                      description={item.description || item.desc || ""}
                      city={
                        item.city || t("noCity", { defaultValue: "No city" })
                      }
                      images={item.images}
                      price={item.price}
                      category={categoryValue}
                      isBasic30={item.isBasic30}
                      isStandard60={item.isStandard60}
                      isPremium90={item.isPremium90}
                      linkHref={linkHref}
                    />
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12 text-gray-400 text-sm">
                  {t("noResults", {
                    defaultValue: "No results found matching your search.",
                  })}
                </div>
              )}
            </div>
          </ContainerLinks>
          <Pagination
            hasMore={hasMore}
            loading={loadingMore}
            onSeeMore={handleLoadMore}
          />
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
import { getFarmequipment } from "@/actions/categories/FarmequipmentAction";
import PathSegmentsDisplay from "../../(details)/historyPath/pathSegmentsDisplay";
import SearchInput from "@/app/ui/search/SearchInput";
import WantSell from "@/app/(storeFront)/components/shared/WantToSell/page";
import Loading from "@/app/ui/loading/Loading";
import UniversalCard from "@/app/(storeFront)/components/Cards/categoriesCards/UniversalCard";
import ContainerLinks from "@/app/(storeFront)/components/Cards/containerCards/conainerLinks";
import { useError } from "@/app/(storeFront)/components/hooks/useError";
import SubCategoryList from "@/app/(storeFront)/components/navbar/categories/SubCategoryListClient";
import { useListingFeed } from "@/app/(storeFront)/components/policy/randomFeedUtils";
import { useGetRoute } from "@/app/(storeFront)/components/hooks/useGetRoute";
import { FarmEquipment } from "@/app/utils/types/farmequipment.types";
import { farmEquipmentSubCategories } from "@/app/(links)/storeFrontLinks/mainCategotyCategorySubCategory";
import { useRandomizedItems } from "@/app/(storeFront)/components/hooks/RandomizedItemShowcase";
import Pagination from "@/app/(storeFront)/components/shared/Pagination";
import { useListingData } from "@/app/(storeFront)/components/hooks/useListingData";

const PAGE_SIZE = 12;

function TractorLinks() {
  const { t } = useTranslation();
  const { renderError } = useError();
  const { items, isLoading, isError } = useListingData<FarmEquipment>("farmequipment", getFarmequipment);

  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const filteredItems = useListingFeed(items, query, "Farm Equipment");
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

  if (isError) return renderError(isError);

  return (
    <div className="w-full max-w-screen-xl mx-auto px-2 py-2 space-y-4 overflow-x-hidden">
      <ContainerLinks>
        <SearchInput defaultValue={query} />
      </ContainerLinks>

      <div className="pt-1">
        <PathSegmentsDisplay />
      </div>

      <ContainerLinks>
        <SubCategoryList data={farmEquipmentSubCategories} />
      </ContainerLinks>

      <ContainerLinks>
        <WantSell />
      </ContainerLinks>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="space-y-4">
          <ContainerLinks>
            <div className="text-sm font-medium text-gray-600 px-3 py-1 flex justify-between items-center">
              <span>{t("resultsFound", "Natiijada la helay:")}</span>
              <span className="text-blue-700 font-bold">
                {displayItems.length} {t("tractors", "cagafyo")}
              </span>
            </div>
          </ContainerLinks>

          <ContainerLinks>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-3">
              {visibleItems.length > 0 ? (
                visibleItems.map((item: any, index: number) => {
                  const itemId = item._id || item.id;
                  const routePrefix = getRoute("farmequipment");
                  const linkHref = itemId
                    ? `${routePrefix}/${encodeURIComponent(itemId)}`
                    : "/";
                  return (
                    <UniversalCard
                      key={itemId || index}
                      id={itemId}
                      title={item.title}
                      description={item.description || ""}
                      city={item.city}
                      images={item.images}
                      price={item.price}
                      category="Farm Equipment"
                      isBasic30={item.isBasic30}
                      isStandard60={item.isStandard60}
                      isPremium90={item.isPremium90}
                      type={item.type}
                      linkHref={linkHref}
                    />
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12 text-gray-400 text-sm">
                  {t("noResults", "Lama helin wax cagafyo ah.")}
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

export default TractorLinks;

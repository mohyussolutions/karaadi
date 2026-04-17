"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PathSegmentsDisplay from "../../../(details)/historyPath/pathSegmentsDisplay";
import LocationSelector from "@/app/(storeFront)/components/shared/SomLocs/regionsandCities";
import SomaliMap from "@/app/(storeFront)/components/shared/SomLocs/SomaliMap";
import { getMarketplaceItems } from "@/actions/categories/marketplaceActions";
import { MarketplaceItem } from "@/app/utils/types/marketplace.types";
import { categories as nesCategories } from "@/app/(links)/storeFrontLinks/nesSubCategoryLinks";
import SearchInput from "@/app/ui/search/SearchInput";
import UniversalCard from "@/app/(storeFront)/components/Cards/categoriesCards/UniversalCard";
import ContainerLinks from "@/app/(storeFront)/components/Cards/containerCards/conainerLinks";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import { useError } from "@/app/(storeFront)/components/hooks/useError";
import { usehandleHorizontalScroll } from "@/app/(storeFront)/components/hooks/useHandleHorizontalScroll";
import { CommonSubCategoryLinks } from "@/app/(storeFront)/components/navbar/categories/CommonSubCategoryLinks";
import { useListingFeed } from "@/app/(storeFront)/components/policy/randomFeedUtils";
import { ITEM_DETAILS } from "@/app/(storeFront)/components/hooks/useGetRoute";

export default function FashionAndAccessories() {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { renderError } = useError();
  const { scroll } = usehandleHorizontalScroll(scrollRef);

  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null,
  );
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [checkedCities, setCheckedCities] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    async function loadItems() {
      try {
        const data = await getMarketplaceItems();
        if (data) setItems(data);
      } catch (err) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadItems();
  }, []);

  const allFashionItems = useMemo(() => {
    return items.filter((item) =>
      Array.isArray(item.category)
        ? item.category.includes("Fashion & Accessories")
        : item.category === "Fashion & Accessories",
    );
  }, [items]);

  const filteredForHook = useMemo(() => {
    let list = [...allFashionItems];

    if (selectedSubcategory) {
      list = list.filter((item) => {
        const subs = Array.isArray(item.subcategory)
          ? item.subcategory
          : [item.subcategory];
        return subs.some(
          (s) => s?.toLowerCase() === selectedSubcategory.toLowerCase(),
        );
      });
    }

    if (selectedRegion) {
      const activeRegs = selectedRegion.toLowerCase().split(",");
      list = list.filter(
        (item) => item.region && activeRegs.includes(item.region.toLowerCase()),
      );
    }

    const activeCities = Object.keys(checkedCities)
      .filter((city) => checkedCities[city])
      .map((c) => c.toLowerCase());

    if (activeCities.length > 0) {
      list = list.filter(
        (item) => item.city && activeCities.includes(item.city.toLowerCase()),
      );
    }

    return list;
  }, [allFashionItems, selectedSubcategory, selectedRegion, checkedCities]);

  const ordered = useListingFeed(
    filteredForHook,
    query,
    "Fashion & Accessories",
  );

  const regionCityCounts = useMemo(() => {
    const regionCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};
    allFashionItems.forEach((item) => {
      const capitalize = (s: string) =>
        s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
      if (item.region) {
        const reg = capitalize(item.region.trim());
        regionCounts[reg] = (regionCounts[reg] || 0) + 1;
      }
      if (item.city) {
        const cit = capitalize(item.city.trim());
        cityCounts[cit] = (cityCounts[cit] || 0) + 1;
      }
    });
    return { regionCounts, cityCounts };
  }, [allFashionItems]);

  if (isError) return renderError(isError);

  return (
    <div className="container mx-auto px-2 py-2 space-y-3">
      <ContainerLinks>
        <SearchInput onSearch={setQuery} defaultValue={query} />
      </ContainerLinks>

      <div className="pt-1">
        <PathSegmentsDisplay />
      </div>

      <ContainerLinks>
        <CommonSubCategoryLinks
          items={nesCategories.SportsAndOutdoorsNestedSub || []}
          selectedId={selectedSubcategory}
          onSelect={(id) =>
            setSelectedSubcategory((prev) => (prev === id ? null : id))
          }
          onScroll={scroll}
          scrollRef={scrollRef}
          t={t}
        />
      </ContainerLinks>

      <div className="flex flex-col-reverse md:flex-row gap-4 pt-1">
        <aside className="w-full md:w-1/3 space-y-4 sticky top-4 self-start">
          <ContainerLinks>
            <LocationSelector
              onFilterChange={(
                reg: React.SetStateAction<string | null>,
                cities: React.SetStateAction<Record<string, boolean>>,
              ) => {
                setSelectedRegion(reg);
                setCheckedCities(cities);
              }}
              selectedRegion={selectedRegion}
              checkedCities={checkedCities}
              regionCounts={regionCityCounts.regionCounts}
              cityCounts={regionCityCounts.cityCounts}
            />
          </ContainerLinks>
          <ContainerLinks>
            <div className="p-1">
              <SomaliMap
                selectedRegion={selectedRegion}
                onRegionClick={setSelectedRegion}
                items={allFashionItems}
              />
            </div>
          </ContainerLinks>
        </aside>

        <main className="md:w-2/3 w-full space-y-4">
          <ContainerLinks>
            <div className="text-xs font-medium text-gray-500 px-3 py-1 flex justify-between items-center">
              <span>{isLoading ? t("loading") : t("resultsFound")}</span>
              {!isLoading && (
                <span className="text-blue-700 font-bold">
                  {ordered.length} {t("items", { defaultValue: "shay" })}
                </span>
              )}
            </div>
          </ContainerLinks>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loading />
            </div>
          ) : (
            <ContainerLinks>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-3">
                {ordered.length > 0 ? (
                  ordered.map((item: any) => (
                    <UniversalCard
                      key={item.id}
                      id={item.id}
                      title={item.title}
                      description={item.description}
                      city={item.city}
                      price={item.price}
                      images={item.images}
                      category={item.category}
                      href={`${ITEM_DETAILS}/${item._id || item.id}`}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-20 text-gray-400 text-xs">
                    {t("noResults", {
                      defaultValue: "Ma jiraan wax la helay.",
                    })}
                  </div>
                )}
              </div>
            </ContainerLinks>
          )}
        </main>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PathSegmentsDisplay from "../../../(details)/historyPath/pathSegmentsDisplay";
import LocationSelector from "@/app/(storeFront)/components/shared/SomLocs/regionsandCities";
import SomaliMap from "@/app/(storeFront)/components/shared/SomLocs/SomaliMap";
import { getMarketplaceItems } from "@/actions/categories/marketplaceActions";
import { MarketplaceItem } from "@/app/utils/types/marketplace.types";
import SearchInput from "@/app/ui/search/SearchInput";
import UniversalCard from "@/app/(storeFront)/components/Cards/categoriesCards/UniversalCard";
import ContainerLinks from "@/app/(storeFront)/components/Cards/containerCards/conainerLinks";
import Loading from "@/app/ui/loading/Loading";
import { useError } from "@/app/(storeFront)/components/hooks/useError";
import { CommonSubCategoryLinks } from "@/app/(storeFront)/components/navbar/categories/CommonSubCategoryLinks";
import { useListingFeed } from "@/app/(storeFront)/components/policy/randomFeedUtils";
import { ITEM_DETAILS } from "@/app/(storeFront)/components/hooks/useGetRoute";
import { ElectronicsNestedSub } from "@/app/(links)/storeFrontLinks/mainCategotyCategorySubCategory";

export default function ElectronicsLinks() {
  const { t } = useTranslation();
  const { renderError } = useError();
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

  const allElectronicsItems = useMemo(() => {
    const enLabel = t("subcategories.marketplace.electronics", { lng: "en" }).toLowerCase();
    return items.filter((item) => {
      const cats = Array.isArray(item.category) ? item.category : [item.category];
      return cats.some((c) => { const s = String(c || "").toLowerCase(); return s === "electronics" || s === enLabel; });
    });
  }, [items, t]);

  const filteredForHook = useMemo(() => {
    let list = [...allElectronicsItems];

    if (selectedSubcategory) {
      const normalized = t(selectedSubcategory).toLowerCase();
      list = list.filter((item) => {
        const subs = Array.isArray(item.subcategory)
          ? item.subcategory
          : [item.subcategory];
        return subs.some((s) =>
          String(s || "")
            .toLowerCase()
            .includes(normalized),
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
      .filter((c) => checkedCities[c])
      .map((c) => c.toLowerCase());

    if (activeCities.length > 0) {
      list = list.filter(
        (item) => item.city && activeCities.includes(item.city.toLowerCase()),
      );
    }
    return list;
  }, [
    allElectronicsItems,
    selectedSubcategory,
    selectedRegion,
    checkedCities,
    t,
  ]);

  const regionCityCounts = useMemo(() => {
    const regionCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};
    allElectronicsItems.forEach((item) => {
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
  }, [allElectronicsItems]);

  const ordered = useListingFeed(
    filteredForHook,
    query,
    "Electronics & Home Goods",
  );

  if (isError) return renderError(isError);

  return (
    <div className="w-full max-w-screen-xl mx-auto px-2 py-2 space-y-3 overflow-x-hidden">
      <ContainerLinks>
        <SearchInput onSearch={setQuery} defaultValue={query} />
      </ContainerLinks>

      <div className="pt-1">
        <PathSegmentsDisplay />
      </div>

      <ContainerLinks>
        <CommonSubCategoryLinks
          items={ElectronicsNestedSub || []}
          selectedId={selectedSubcategory}
          onSelect={(id) =>
            setSelectedSubcategory((prev) => (prev === id ? null : id))
          }
          t={t}
        />
      </ContainerLinks>

      <div className="md:hidden px-2">
        <LocationSelector
          mobileOnly
          onFilterChange={(reg, cities) => {
            setSelectedRegion(reg);
            setCheckedCities(cities);
          }}
          selectedRegion={selectedRegion}
          checkedCities={checkedCities}
          regionCounts={regionCityCounts.regionCounts}
          cityCounts={regionCityCounts.cityCounts}
        />
      </div>

      <div className="flex flex-col-reverse md:flex-row gap-4 pt-1">
        <aside className="hidden md:flex md:flex-col md:w-1/3 space-y-4 md:sticky md:top-14 md:self-start">
          <ContainerLinks>
            <LocationSelector
              desktopOnly
              onFilterChange={(reg, cities) => {
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
                items={allElectronicsItems}
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
                  {ordered.length} {t("items")}
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
                      category="marketplace"
                      href={`${ITEM_DETAILS}/${item._id || item.id}`}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-20 text-gray-400 text-xs">
                    {t("noResults")}
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

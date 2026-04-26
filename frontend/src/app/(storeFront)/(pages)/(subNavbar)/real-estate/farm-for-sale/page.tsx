"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getRealEstateListings } from "@/actions/categories/realEstateActions";
import PathSegmentsDisplay from "../../../(details)/historyPath/pathSegmentsDisplay";
import LocationSelector from "@/app/(storeFront)/components/shared/SomLocs/regionsandCities";
import SomaliMap from "@/app/(storeFront)/components/shared/SomLocs/SomaliMap";
import SearchInput from "@/app/ui/search/SearchInput";
import PriceRangeFilter from "@/app/(storeFront)/components/Filters/PriceRangeFilter";
import ContainerLinks from "@/app/(storeFront)/components/Cards/containerCards/conainerLinks";
import Loading from "@/app/ui/loading/Loading";
import { useError } from "@/app/(storeFront)/components/hooks/useError";
import { usehandleHorizontalScroll } from "@/app/(storeFront)/components/hooks/useHandleHorizontalScroll";
import { CommonSubCategoryLinks } from "@/app/(storeFront)/components/navbar/categories/CommonSubCategoryLinks";
import UniversalCard from "@/app/(storeFront)/components/Cards/categoriesCards/UniversalCard";
import { RealEstate } from "@/app/utils/types/realestate.types";
import { REAL_ESTATE_DETAILS } from "@/app/(storeFront)/components/hooks/useGetRoute";
import { getGlobalSearchResults } from "@/actions/categories/getGlobalSearchResults";
import { categories } from "@/app/(links)/storeFrontLinks/mainCategotyCategorySubCategory";

export const dynamic = "force-dynamic";

export default function FarmForSale() {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { renderError } = useError();
  const { scroll } = usehandleHorizontalScroll(scrollRef);

  const [items, setItems] = useState<RealEstate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null,
  );
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [checkedCities, setCheckedCities] = useState<Record<string, boolean>>(
    {},
  );
  const [rangeFilters, setRangeFilters] = useState({ maxPrice: 1000000 });

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getRealEstateListings();
        setItems(data || []);
      } catch (err) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
      const results = await getGlobalSearchResults(query);
      setSearchResults(
        results.filter((item: any) => {
          const cat = Array.isArray(item.category)
            ? item.category.join(" ").toLowerCase()
            : String(item.category || "").toLowerCase();
          return cat.includes("farm") || cat.includes("beer");
        }),
      );
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const baseItems = useMemo(() => {
    return items.filter((item: any) => {
      const cat = Array.isArray(item.category)
        ? item.category.join(" ").toLowerCase()
        : String(item.category || "").toLowerCase();
      return cat.includes("farm") || cat.includes("beer");
    });
  }, [items]);

  const finalItems = useMemo(() => {
    let list = query.trim() ? searchResults : baseItems;

    list = list.filter((item: any) => {
      const price = Number(item.price) || 0;
      return price <= Number(rangeFilters.maxPrice);
    });

    if (selectedSubcategory) {
      const normalized = t(selectedSubcategory).toLowerCase();
      list = list.filter((item: any) => {
        const sub = Array.isArray(item.subcategory)
          ? item.subcategory
          : [item.subcategory];
        return sub.some((s: any) =>
          String(s).toLowerCase().includes(normalized),
        );
      });
    }

    if (selectedRegion) {
      const activeRegs = selectedRegion.toLowerCase().split(",");
      list = list.filter((item: any) =>
        activeRegs.includes(String(item.region || "").toLowerCase()),
      );
    }

    const activeCities = Object.keys(checkedCities)
      .filter((k) => checkedCities[k])
      .map((c) => c.toLowerCase());

    if (activeCities.length > 0) {
      list = list.filter((item: any) =>
        activeCities.includes(String(item.city || "").toLowerCase()),
      );
    }

    return Array.from(
      new Map(list.map((item: any) => [item._id || item.id, item])).values(),
    );
  }, [
    baseItems,
    searchResults,
    query,
    rangeFilters,
    selectedSubcategory,
    selectedRegion,
    checkedCities,
    t,
  ]);

  const counts = useMemo(() => {
    const regionCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};
    baseItems.forEach((item: any) => {
      const format = (s: any) => {
        const str = String(s || "").trim();
        return str
          ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
          : null;
      };
      const reg = format(item.region);
      const cit = format(item.city);
      if (reg) regionCounts[reg] = (regionCounts[reg] || 0) + 1;
      if (cit) cityCounts[cit] = (cityCounts[cit] || 0) + 1;
    });
    return { regionCounts, cityCounts };
  }, [baseItems]);

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
          items={categories.RealEstateFarmForSaleNestedSub || []}
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
                region: React.SetStateAction<string | null>,
                cities: React.SetStateAction<Record<string, boolean>>,
              ) => {
                setSelectedRegion(region);
                setCheckedCities(cities);
              }}
              selectedRegion={selectedRegion}
              checkedCities={checkedCities}
              regionCounts={counts.regionCounts}
              cityCounts={counts.cityCounts}
            />
          </ContainerLinks>

          <ContainerLinks>
            <div className="p-2 space-y-4">
              <PriceRangeFilter onFilterChange={setRangeFilters} />
              <SomaliMap
                selectedRegion={selectedRegion}
                onRegionClick={setSelectedRegion}
                items={baseItems}
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
                  {finalItems.length} {t("farms", { defaultValue: "beero" })}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-2">
                {finalItems.length > 0 ? (
                  finalItems.map((item) => (
                    <UniversalCard
                      key={item._id || item.id}
                      id={item._id || item.id}
                      title={item.title}
                      description={item.description}
                      city={item.city}
                      price={item.price}
                      images={item.images}
                      href={`${REAL_ESTATE_DETAILS}/${item._id || item.id}`}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-20 text-gray-400 text-xs">
                    {t("noResults", {
                      defaultValue: "Ma jiraan beero waafaqsan xogtaada.",
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

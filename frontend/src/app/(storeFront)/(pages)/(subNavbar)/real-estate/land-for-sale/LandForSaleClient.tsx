"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getRealEstateListings } from "@/actions/categories/realEstateActions";
import { categories } from "@/app/(links)/storeFrontLinks/mainCategotyCategorySubCategory";
import PathSegmentsDisplay from "../../../(details)/historyPath/pathSegmentsDisplay";
import LocationSelector from "@/app/(storeFront)/components/shared/SomLocs/regionsandCities";
import SomaliMap from "@/app/(storeFront)/components/shared/SomLocs/SomaliMap";
import SearchInput from "@/app/ui/search/SearchInput";
import ContainerLinks from "@/app/(storeFront)/components/Cards/containerCards/conainerLinks";
import Loading from "@/app/ui/loading/Loading";
import { useError } from "@/app/(storeFront)/components/hooks/useError";
import { CommonSubCategoryLinks } from "@/app/(storeFront)/components/navbar/categories/CommonSubCategoryLinks";
import UniversalCard from "@/app/(storeFront)/components/Cards/categoriesCards/UniversalCard";
import { REAL_ESTATE_DETAILS } from "@/app/(storeFront)/components/hooks/useGetRoute";
import { RealEstate } from "@/app/utils/types/realestate.types";
import { getGlobalSearchResults } from "@/actions/search/globalSearch";

export default function LandForSale({ initialData = [] }: { initialData?: any[] }) {
  const { t } = useTranslation();
  const { renderError } = useError();
  const [items, setItems] = useState<RealEstate[]>(initialData as RealEstate[]);
  const [isLoading, setIsLoading] = useState(initialData.length === 0);
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

  useEffect(() => {
    if (initialData.length > 0) { setIsLoading(false); return; }
    async function loadData() {
      try {
        const data = await getRealEstateListings();
        setItems(Array.isArray(data) ? data : []);
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
          return cat.includes("land") || cat.includes("dhul");
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
      return cat.includes("land") || cat.includes("dhul");
    });
  }, [items]);

  const finalItems = useMemo(() => {
    let filtered = query.trim() ? searchResults : baseItems;

    if (selectedSubcategory) {
      const normalized = selectedSubcategory.toLowerCase();
      filtered = filtered.filter((item: any) => {
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
      filtered = filtered.filter((item: any) =>
        activeRegs.includes(String(item.region || "").toLowerCase()),
      );
    }

    const activeCities = Object.keys(checkedCities)
      .filter((k) => checkedCities[k])
      .map((c) => c.toLowerCase());

    if (activeCities.length > 0) {
      filtered = filtered.filter((item: any) =>
        activeCities.includes(String(item.city || "").toLowerCase()),
      );
    }

    return Array.from(
      new Map(
        filtered.map((item: any) => [item._id || item.id, item]),
      ).values(),
    );
  }, [
    query,
    searchResults,
    baseItems,
    selectedSubcategory,
    selectedRegion,
    checkedCities,
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
    <div className="w-full max-w-screen-xl mx-auto px-2 py-2 space-y-4 overflow-x-hidden">
      <ContainerLinks>
        <SearchInput onSearch={setQuery} defaultValue={query} />
      </ContainerLinks>

      <div className="pt-1">
        <PathSegmentsDisplay />
      </div>

      <ContainerLinks>
        <CommonSubCategoryLinks
          items={categories.RealEstateLandForSaleNestedSub || []}
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
              onFilterChange={(
                region,
                cities,
              ) => {
                setSelectedRegion(region);
                setCheckedCities(cities);
              }}
              selectedRegion={selectedRegion}
              checkedCities={checkedCities}
              regionCounts={counts.regionCounts}
              cityCounts={counts.cityCounts}
            />
      </div>


      <div className="flex flex-col-reverse md:flex-row gap-4 pt-1">
        <aside className="hidden md:flex md:flex-col md:w-1/3 space-y-4 md:sticky md:top-14 md:self-start">
          <ContainerLinks>
            <LocationSelector
              desktopOnly
              onFilterChange={(region, cities) => {
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
            <div className="p-2">
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
            <div className="text-sm font-medium text-gray-600 px-3 py-1 flex justify-between items-center">
              <span>
                {isLoading ? "Waa la soo dejinayaa..." : "Natiijada la helay"}
              </span>
              {!isLoading && (
                <span className="text-blue-700 font-bold">
                  {finalItems.length} dhul iib ah
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
                {finalItems.length > 0 ? (
                  finalItems.map((item, index) => (
                    <UniversalCard
                      key={item._id || item.id}
                      id={item._id || item.id}
                      title={item.title}
                      description={item.description}
                      city={item.city}
                      price={item.price}
                      images={item.images}
                      priority={index < 6}
                      href={`${REAL_ESTATE_DETAILS}/${item._id || item.id}`}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400 text-sm">
                    Ma jiraan dhul iib ah oo waafaqsan xogtaada.
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

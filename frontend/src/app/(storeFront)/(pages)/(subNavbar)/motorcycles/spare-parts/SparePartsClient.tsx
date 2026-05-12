"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getMotorcycles } from "@/actions/categories/motorcycleActions";
import { categories } from "@/app/(links)/storeFrontLinks/mainCategotyCategorySubCategory";
import PathSegmentsDisplay from "../../../(details)/historyPath/pathSegmentsDisplay";
import LocationSelector from "@/app/(storeFront)/components/shared/SomLocs/regionsandCities";
import SomaliMap from "@/app/(storeFront)/components/shared/SomLocs/SomaliMap";
import UniversalCard from "@/app/(storeFront)/components/Cards/categoriesCards/UniversalCard";
import SearchInput from "@/app/ui/search/SearchInput";
import ContainerLinks from "@/app/(storeFront)/components/Cards/containerCards/conainerLinks";
import Loading from "@/app/ui/loading/Loading";
import { useError } from "@/app/(storeFront)/components/hooks/useError";
import { VEHICLES_DETAILS } from "@/app/(storeFront)/components/hooks/useGetRoute";
import { getGlobalSearchResults } from "@/actions/search/globalSearch";
import { CommonSubCategoryLinks } from "@/app/(storeFront)/components/navbar/categories/CommonSubCategoryLinks";

export default function SpareParts({ initialData = [] }: { initialData?: any[] }) {
  const { t } = useTranslation();
  const { renderError } = useError();
  const [items, setItems] = useState<any[]>(initialData);
  const [isLoading, setIsLoading] = useState(initialData.length === 0);
  const [isError, setIsError] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [checkedCities, setCheckedCities] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialData.length > 0) { setIsLoading(false); return; }
    async function loadData() {
      try {
        const data = await getMotorcycles();
        setItems(data || []);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!query.trim()) { setSearchResults([]); return; }
      const results = await getGlobalSearchResults(query);
      setSearchResults(
        results.filter((item: any) => {
          const mainCat = String(item?.mainCategory || "");
          const cat = String(item?.category || "").toLowerCase();
          return mainCat === "Motorcycle" && (cat.includes("spare parts") || cat.includes("qalab"));
        }),
      );
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const baseItems = useMemo(() => {
    return items.filter((item) => {
      const cat = String(item?.category || "").toLowerCase();
      return cat.includes("spare parts") || cat.includes("qalab");
    });
  }, [items]);

  const itemsToDisplay = useMemo(() => {
    let list = query.trim() ? searchResults : baseItems;

    if (selectedCategory) {
      list = list.filter((item) => {
        const raw = item?.subcategory ?? item?.subCategory;
        const sub = Array.isArray(raw) ? raw.join(" ") : String(raw || "");
        return sub.toLowerCase().includes(selectedCategory.toLowerCase());
      });
    }

    if (selectedRegion) {
      const activeRegs = selectedRegion.split(",").map((r) => r.toLowerCase());
      list = list.filter((item) => {
        const itemReg = String(item?.region || "").toLowerCase();
        return itemReg && activeRegs.includes(itemReg);
      });
    }

    const activeCities = Object.keys(checkedCities)
      .filter((c) => checkedCities[c])
      .map((c) => c.toLowerCase());

    if (activeCities.length > 0) {
      list = list.filter((item) => {
        const itemCity = String(item?.city || "").toLowerCase();
        return itemCity && activeCities.includes(itemCity);
      });
    }

    return Array.from(
      new Map(list.map((item: any) => [item._id || item.id, item])).values(),
    );
  }, [baseItems, searchResults, query, selectedCategory, selectedRegion, checkedCities]);

  const counts = useMemo(() => {
    const regionCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};
    baseItems.forEach((item) => {
      const format = (s: any) => {
        const str = String(s || "").trim();
        return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : null;
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
          items={categories.MCPartsNestedSub || []}
          selectedId={selectedCategory}
          onSelect={(id) => setSelectedCategory((prev) => (prev === id ? null : id))}
          t={t}
        />
      </ContainerLinks>

      <div className="md:hidden px-2">
      <LocationSelector
              mobileOnly
              onFilterChange={(region, cities) => {
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
            <div className="p-1">
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
              <span>{isLoading ? "Waa la soo dejinayaa..." : "Natiijada la helay"}</span>
              {!isLoading && (
                <span className="text-blue-700 font-bold">{itemsToDisplay.length} qalab</span>
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
                {itemsToDisplay.length > 0 ? (
                  itemsToDisplay.map((item, index) => (
                    <UniversalCard
                      key={item._id || item.id}
                      id={item._id || item.id}
                      title={item.title}
                      price={item.price}
                      city={item.city}
                      images={item.images}
                      category="motorcycles"
                      description={
                        Array.isArray(item.description)
                          ? item.description.join(" ")
                          : String(item.description || "")
                      }
                      priority={index < 6}
                      href={`${VEHICLES_DETAILS}/${item._id || item.id}`}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400 text-sm">
                    Ma jiraan wax qalab ah oo waafaqsan xogtaada.
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

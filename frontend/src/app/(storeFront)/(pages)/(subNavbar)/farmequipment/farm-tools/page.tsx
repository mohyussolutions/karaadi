"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PathSegmentsDisplay from "../../../(details)/historyPath/pathSegmentsDisplay";
import { categories } from "@/app/(links)/storeFrontLinks/mainCategotyCategorySubCategory";
import { getFarmequipment } from "@/actions/categories/FarmequipmentAction";
import LocationSelector from "@/app/(storeFront)/components/shared/SomLocs/regionsandCities";
import SomaliMap from "@/app/(storeFront)/components/shared/SomLocs/SomaliMap";
import SearchInput from "@/app/ui/search/SearchInput";
import UniversalCard from "@/app/(storeFront)/components/Cards/categoriesCards/UniversalCard";
import ContainerLinks from "@/app/(storeFront)/components/Cards/containerCards/conainerLinks";
import Loading from "@/app/ui/loading/Loading";
import { useError } from "@/app/(storeFront)/components/hooks/useError";
import { CommonSubCategoryLinks } from "@/app/(storeFront)/components/navbar/categories/CommonSubCategoryLinks";
import { FarmEquipment } from "@/app/utils/types/farmequipment.types";
import { VEHICLES_DETAILS } from "@/app/(storeFront)/components/hooks/useGetRoute";
import { getGlobalSearchResults } from "@/actions/categories/getGlobalSearchResults";

export default function Farmtools() {
  const { t } = useTranslation();
  const { renderError } = useError();
  const [items, setItems] = useState<FarmEquipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null,
  );
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FarmEquipment[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [checkedCities, setCheckedCities] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const data = await getFarmequipment();
        setItems(data || []);
      } catch (err) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const baseItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return items.filter((item: FarmEquipment) => {
      const cat = Array.isArray(item.category)
        ? item.category.join(" ").toLowerCase()
        : String(item.category || "").toLowerCase();
      const sub = Array.isArray(item.subcategory)
        ? item.subcategory.join(" ").toLowerCase()
        : String(item.subcategory || "").toLowerCase();

      return (
        cat.includes("farm") ||
        sub.includes("farm") ||
        cat.includes("qalabka beeraha") ||
        cat.includes("qalab")
      );
    });
  }, [items]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
      const results = await getGlobalSearchResults(query);
      const filtered = (results as any[]).filter((item) => {
        const cat = String(item.category || "").toLowerCase();
        const sub = String(item.subcategory || "").toLowerCase();
        return (
          cat.includes("farm") ||
          cat.includes("beeraha") ||
          sub.includes("farm") ||
          sub.includes("qalabka beeraha")
        );
      }) as FarmEquipment[];

      setSearchResults(filtered);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const counts = useMemo(() => {
    const regionCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};

    baseItems.forEach((item) => {
      const format = (s: string) =>
        s.trim().charAt(0).toUpperCase() + s.trim().slice(1).toLowerCase();
      if (item.region) {
        const reg = format(item.region);
        regionCounts[reg] = (regionCounts[reg] || 0) + 1;
      }
      if (item.city) {
        const cit = format(item.city);
        cityCounts[cit] = (cityCounts[cit] || 0) + 1;
      }
    });
    return { regionCounts, cityCounts };
  }, [baseItems]);

  const itemsToDisplay = useMemo(() => {
    let list = query.trim() ? searchResults : baseItems;

    if (selectedSubcategory) {
      const target = selectedSubcategory.toLowerCase();
      list = list.filter((item: FarmEquipment) => {
        const sub = Array.isArray(item.subcategory)
          ? item.subcategory.join(" ").toLowerCase()
          : String(item.subcategory || "").toLowerCase();
        const title = String(item.title || "").toLowerCase();
        return sub.includes(target) || title.includes(target);
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

    return Array.from(new Map(list.map((item) => [item._id, item])).values());
  }, [
    query,
    searchResults,
    baseItems,
    selectedSubcategory,
    selectedRegion,
    checkedCities,
  ]);

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
          items={categories.FarmToolsNestedSub || []}
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
                reg,
                cities,
              ) => {
                setSelectedRegion(reg);
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
              onFilterChange={(reg, cities) => {
                setSelectedRegion(reg);
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
            <div className="text-xs font-medium text-gray-500 px-3 py-1 flex justify-between items-center">
              <span>{isLoading ? t("loading") : t("resultsFound")}</span>
              {!isLoading && (
                <span className="text-green-700 font-bold">
                  {itemsToDisplay.length}{" "}
                  {t("farmToolsCount", { defaultValue: "qalabka beeraha" })}
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
                {itemsToDisplay.length > 0 ? (
                  itemsToDisplay.map((item) => (
                    <UniversalCard
                      key={item._id}
                      id={item._id}
                      title={item.title}
                      description={item.description}
                      city={item.city}
                      images={item.images}
                      price={item.price}
                      category="Farmequipment"
                      href={`${VEHICLES_DETAILS}/${item._id || item.id}`}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-20 text-gray-400 text-xs font-medium">
                    {t("noResults", {
                      defaultValue:
                        "Ma jiraan qalab beereed oo waafaqsan raadintaada.",
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

"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PathSegmentsDisplay from "../../../(details)/historyPath/pathSegmentsDisplay";
import { categories } from "@/app/(links)/storeFrontLinks/mainCategotyCategorySubCategory";
import LocationSelector from "@/app/(storeFront)/components/shared/SomLocs/regionsandCities";
import SomaliMap from "@/app/(storeFront)/components/shared/SomLocs/SomaliMap";
import { getCars } from "@/actions/categories/carActions";
import SearchInput from "@/app/ui/search/SearchInput";
import ContainerLinks from "@/app/(storeFront)/components/Cards/containerCards/conainerLinks";
import Loading from "@/app/ui/loading/Loading";
import { useError } from "@/app/(storeFront)/components/hooks/useError";
import { CommonSubCategoryLinks } from "@/app/(storeFront)/components/navbar/categories/CommonSubCategoryLinks";
import UniversalCard from "@/app/(storeFront)/components/Cards/categoriesCards/UniversalCard";
import { Car } from "@/app/utils/types/cars.types";
import { VEHICLES_DETAILS } from "@/app/(storeFront)/components/hooks/useGetRoute";
import { getGlobalSearchResults } from "@/actions/search/globalSearch";

export default function Buses({ initialData = [] }: { initialData?: any[] }) {
  const { t } = useTranslation();
  const { renderError } = useError();
  const subCategoryLinks = useMemo(() => categories.BusSubLinks || [], []);

  const [items, setItems] = useState<Car[]>(initialData as Car[]);
  const [isLoading, setIsLoading] = useState(initialData.length === 0);
  const [isError, setIsError] = useState(false);

  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null,
  );
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [checkedCities, setCheckedCities] = useState<Record<string, boolean>>(
    {},
  );
  useEffect(() => {
    if (initialData.length > 0) { setIsLoading(false); return; }
    async function loadData() {
      try {
        setIsLoading(true);
        const data = await getCars();
        setItems(data || []);
      } catch (err) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const allBusItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    const searchTerms = ["bus", "bas"];
    return items.filter((item: any) => {
      const subCats = Array.isArray(item.subcategory)
        ? item.subcategory
        : [item.subcategory || ""];
      const titles = Array.isArray(item.title)
        ? item.title
        : [item.title || ""];

      return (
        subCats.some((s: string) =>
          searchTerms.some((term) => String(s).toLowerCase().includes(term)),
        ) ||
        titles.some((t: string) =>
          searchTerms.some((term) => String(t).toLowerCase().includes(term)),
        )
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
      const filtered = results.filter((item: any) => {
        const subCats = Array.isArray(item.subcategory)
          ? item.subcategory
          : [item.subcategory || ""];
        return subCats.some((s: string) => {
          const val = String(s).toLowerCase();
          return val.includes("bus") || val.includes("bas");
        });
      });
      setSearchResults(filtered);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const counts = useMemo(() => {
    const regionCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};

    allBusItems.forEach((item) => {
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
  }, [allBusItems]);

  const itemsToDisplay = useMemo(() => {
    let source = query.trim() ? searchResults : allBusItems;

    if (selectedSubcategory) {
      const normalized = selectedSubcategory.toLowerCase();
      source = source.filter((item: any) => {
        const subCats = Array.isArray(item.subcategory)
          ? item.subcategory
          : [item.subcategory || ""];
        return (
          subCats.some((s: any) => String(s).toLowerCase() === normalized) ||
          (item.title || "").toLowerCase().includes(normalized)
        );
      });
    }

    if (selectedRegion) {
      const activeRegs = selectedRegion.toLowerCase().split(",");
      source = source.filter(
        (item) => item.region && activeRegs.includes(item.region.toLowerCase()),
      );
    }

    const activeCities = Object.keys(checkedCities)
      .filter((c) => checkedCities[c])
      .map((c) => c.toLowerCase());
    if (activeCities.length > 0) {
      source = source.filter(
        (item) => item.city && activeCities.includes(item.city.toLowerCase()),
      );
    }

    return Array.from(
      new Map(source.map((item) => [item._id || item.id, item])).values(),
    );
  }, [
    query,
    searchResults,
    allBusItems,
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
          items={[...subCategoryLinks]}
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
                items={allBusItems}
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
                  {itemsToDisplay.length}{" "}
                  {t("buses", { defaultValue: "basaska" })}
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
                  itemsToDisplay.map((item: any) => (
                    <UniversalCard
                      key={item._id || item.id}
                      id={item._id || item.id}
                      title={item.title}
                      description={item.description}
                      city={item.city}
                      price={item.price}
                      images={item.images}
                      href={`${VEHICLES_DETAILS}/${item._id || item.id}`}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-20 text-gray-400 text-xs font-medium">
                    {t("noBusesFound", {
                      defaultValue:
                        "Lama helin wax basas ah oo waafaqsan raadintaada.",
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

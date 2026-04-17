"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PathSegmentsDisplay from "../../../(details)/historyPath/pathSegmentsDisplay";
import LocationSelector from "@/app/(storeFront)/components/shared/SomLocs/regionsandCities";
import SomaliMap from "@/app/(storeFront)/components/shared/SomLocs/SomaliMap";
import { getFarmequipment } from "@/actions/categories/FarmequipmentAction";
import { categories } from "@/app/(links)/storeFrontLinks/nesSubCategoryLinks";
import { TraktorSubCategoryItem } from "@/app/utils/types/nesSubCategoryTypes";
import SearchInput from "@/app/ui/search/SearchInput";
import UniversalCard from "@/app/(storeFront)/components/Cards/categoriesCards/UniversalCard";
import ContainerLinks from "@/app/(storeFront)/components/Cards/containerCards/conainerLinks";
import LinksStyleCard from "@/app/(storeFront)/components/Cards/containerCards/linksstyleCard";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import { useError } from "@/app/(storeFront)/components/hooks/useError";
import { usehandleHorizontalScroll } from "@/app/(storeFront)/components/hooks/useHandleHorizontalScroll";
import { CommonSubCategoryLinks } from "@/app/(storeFront)/components/navbar/categories/CommonSubCategoryLinks";
import { FarmEquipment } from "@/app/utils/types/farmequipment.types";
import { VEHICLES_DETAILS } from "@/app/(storeFront)/components/hooks/useGetRoute";
import { getGlobalSearchResults } from "@/actions/categories/getGlobalSearchResults";

export default function TractorForSale({
  initialSubcategory,
}: { initialSubcategory?: string | null } = {}) {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { renderError } = useError();
  const { scroll } = usehandleHorizontalScroll(scrollRef);

  const subCategoryLinks = (categories.TraktorTopCategories ||
    []) as TraktorSubCategoryItem[];

  const [items, setItems] = useState<FarmEquipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    initialSubcategory ?? null,
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

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
      const results = await getGlobalSearchResults(query);

      const filtered = (results as any[]).filter((item) => {
        const mainCat = String(item.mainCategory || "");
        const type = String(item.type || "").toLowerCase();
        return (
          mainCat === "Traktor" ||
          mainCat === "Farm Equipment" ||
          type.includes("tractor")
        );
      });

      setSearchResults(filtered as FarmEquipment[]);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const counts = useMemo(() => {
    const regionCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};

    items.forEach((item) => {
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
  }, [items]);

  const itemsToDisplay = useMemo(() => {
    let list = query.trim() ? searchResults : items;

    if (selectedSubcategory) {
      const normalized = selectedSubcategory.toLowerCase();
      list = list.filter((item) => {
        const subCats = Array.isArray(item.subcategory)
          ? item.subcategory
          : [item.subcategory || ""];
        return (
          subCats.some((s: string) => s.toLowerCase() === normalized) ||
          item.title?.toLowerCase().includes(normalized)
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

    return Array.from(new Map(list.map((item) => [item._id, item])).values());
  }, [
    items,
    searchResults,
    query,
    selectedSubcategory,
    selectedRegion,
    checkedCities,
  ]);

  const onScrollClick = (direction: "left" | "right") => {
    scroll(direction);
  };

  if (isError) return renderError(isError);

  return (
    <div className="container mx-auto px-2 py-2 space-y-4">
      <ContainerLinks>
        <SearchInput onSearch={setQuery} defaultValue={query} />
      </ContainerLinks>

      <div className="pt-1">
        <PathSegmentsDisplay />
      </div>

      <ContainerLinks>
        <CommonSubCategoryLinks
          items={subCategoryLinks}
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
              regionCounts={counts.regionCounts}
              cityCounts={counts.cityCounts}
            />
          </ContainerLinks>

          <ContainerLinks>
            <div className="p-2">
              <SomaliMap
                selectedRegion={selectedRegion}
                onRegionClick={setSelectedRegion}
                items={items}
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
                  {itemsToDisplay.length} qalabka beeraha
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
                {itemsToDisplay.length > 0 ? (
                  itemsToDisplay.map((item) => (
                    <UniversalCard
                      key={item._id}
                      id={item._id}
                      title={item.title}
                      description={item.description}
                      city={item.city}
                      price={item.price}
                      images={item.images}
                      category="Farmequipment"
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

"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaChevronLeft, FaChevronRight } from "@/app/utils/icons";
import { getMotorcycles } from "@/actions/categories/motorcycleActions";
import { categories } from "@/app/(links)/storeFrontLinks/mainCategotyCategorySubCategory";
import PathSegmentsDisplay from "../../../(details)/historyPath/pathSegmentsDisplay";
import LocationSelector from "@/app/(storeFront)/components/shared/SomLocs/regionsandCities";
import SomaliMap from "@/app/(storeFront)/components/shared/SomLocs/SomaliMap";
import UniversalCard from "@/app/(storeFront)/components/Cards/categoriesCards/UniversalCard";
import SearchInput from "@/app/ui/search/SearchInput";
import ContainerLinks from "@/app/(storeFront)/components/Cards/containerCards/conainerLinks";
import LinksStyleCard from "@/app/(storeFront)/components/Cards/containerCards/linksstyleCard";
import Loading from "@/app/ui/loading/Loading";
import { useError } from "@/app/(storeFront)/components/hooks/useError";
import { usehandleHorizontalScroll } from "@/app/(storeFront)/components/hooks/useHandleHorizontalScroll";
import { VEHICLES_DETAILS } from "@/app/(storeFront)/components/hooks/useGetRoute";
import { getGlobalSearchResults } from "@/actions/categories/getGlobalSearchResults";

export default function SpareParts({ initialData = [] }: { initialData?: any[] }) {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { renderError } = useError();
  const { scroll } = usehandleHorizontalScroll(scrollRef);

  const [items, setItems] = useState<any[]>(initialData);
  const [isLoading, setIsLoading] = useState(initialData.length === 0);
  const [isError, setIsError] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [checkedCities, setCheckedCities] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    if (initialData.length > 0) { setIsLoading(false); return; }
    async function loadData() {
      try {
        const data = await getMotorcycles();
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
          const mainCat = String(item?.mainCategory || "");
          const cat = String(item?.category || "").toLowerCase();
          return (
            mainCat === "Motorcycle" &&
            (cat.includes("spare parts") || cat.includes("qalab"))
          );
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
  }, [
    baseItems,
    searchResults,
    query,
    selectedCategory,
    selectedRegion,
    checkedCities,
  ]);

  const counts = useMemo(() => {
    const regionCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};
    baseItems.forEach((item) => {
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
        <div className="relative py-2">
          <div className="flex justify-center relative items-center">
            <button
              onClick={() => onScrollClick("left")}
              className="absolute left-0 z-10 bg-white/80 shadow-sm p-2 rounded-full border hover:bg-gray-100 transition-all"
            >
              <FaChevronLeft size={14} />
            </button>
            <div
              ref={scrollRef}
              className="flex overflow-x-auto space-x-3 scrollbar-hide px-8 py-2 w-full"
            >
              {(categories.MCPartsNestedSub || []).map((category, idx) => {
                const id = category.labelKey ?? String(idx);
                const isActive = selectedCategory === id;
                return (
                  <button
                    key={id}
                    onClick={() =>
                      setSelectedCategory((prev) => (prev === id ? null : id))
                    }
                    className="flex-shrink-0 outline-none"
                  >
                    <LinksStyleCard
                      title={t(category.labelKey ?? "", {
                        defaultValue: category.labelKey,
                      })}
                      icon={category.icon}
                      isActive={isActive}
                    />
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => onScrollClick("right")}
              className="absolute right-0 z-10 bg-white/80 shadow-sm p-2 rounded-full border hover:bg-gray-100 transition-all"
            >
              <FaChevronRight size={14} />
            </button>
          </div>
        </div>
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
              <span>
                {isLoading ? "Waa la soo dejinayaa..." : "Natiijada la helay"}
              </span>
              {!isLoading && (
                <span className="text-blue-700 font-bold">
                  {itemsToDisplay.length} qalab
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

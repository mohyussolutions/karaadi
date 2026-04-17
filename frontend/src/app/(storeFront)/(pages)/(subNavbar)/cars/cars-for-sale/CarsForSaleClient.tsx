"use client";
import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { useTranslation } from "react-i18next";
import PathSegmentsDisplay from "../../../(details)/historyPath/pathSegmentsDisplay";
import { categories as nesCategories } from "@/app/(links)/storeFrontLinks/nesSubCategoryLinks";
import LocationSelector from "@/app/(storeFront)/components/shared/SomLocs/regionsandCities";
import SomaliMap from "@/app/(storeFront)/components/shared/SomLocs/SomaliMap";
import { getCars } from "@/actions/categories/carActions";
import UniversalCard from "@/app/(storeFront)/components/Cards/categoriesCards/UniversalCard";
import SearchInput from "@/app/ui/search/SearchInput";
import ContainerLinks from "@/app/(storeFront)/components/Cards/containerCards/conainerLinks";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import { useError } from "@/app/(storeFront)/components/hooks/useError";
import { usehandleHorizontalScroll } from "@/app/(storeFront)/components/hooks/useHandleHorizontalScroll";
import { CommonSubCategoryLinks } from "@/app/(storeFront)/components/navbar/categories/CommonSubCategoryLinks";
import { Car } from "@/app/utils/types/cars.types";
import { VEHICLES_DETAILS } from "@/app/(storeFront)/components/hooks/useGetRoute";
import { getGlobalSearchResults } from "@/actions/categories/getGlobalSearchResults";

export default function CarsForSale({ initialData = [] }: { initialData?: any[] }) {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { renderError } = useError();
  const { scroll } = usehandleHorizontalScroll(scrollRef);

  const subCategoryLinks = useMemo(() => {
    return [
      ...(nesCategories.carsNestedData?.CarsForSaleNestedSub || []),
      ...(nesCategories.carsNestedData?.TruckNestedSub || []),
    ];
  }, []);

  const [items, setItems] = useState<Car[]>(initialData as Car[]);
  const [isLoading, setIsLoading] = useState(initialData.length === 0);
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null,
  );
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Car[]>([]);
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
  const handleScroll = useCallback(() => {
    if (!hasMore || isLoading) return;
    const scrollY = window.scrollY || window.pageYOffset;
    const viewport = window.innerHeight;
    const fullHeight = document.body.offsetHeight;
    if (fullHeight - (scrollY + viewport) < 300) {
      setPage((p) => p + 1);
    }
  }, [hasMore, isLoading]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const allSaleItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return items.filter((item) => {
      const cats = Array.isArray(item.category)
        ? item.category
        : [item.category];
      return cats.some(
        (c) =>
          String(c).toLowerCase().includes("sale") || String(c).includes("iib"),
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
      const filtered = (results as any[]).filter(
        (item: any) =>
          item.mainCategory === "Cars" || item.mainCategory === "Trucks",
      ) as Car[];
      setSearchResults(filtered);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const counts = useMemo(() => {
    const regionCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};

    allSaleItems.forEach((item) => {
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
  }, [allSaleItems]);

  const itemsToDisplay = useMemo(() => {
    let source = query.trim() ? searchResults : allSaleItems;

    if (selectedSubcategory) {
      const foundSub = subCategoryLinks.find(
        (cat) => cat.labelKey === selectedSubcategory,
      );
      const matchStrings = foundSub
        ? [String(foundSub.labelKey || "").toLowerCase()]
        : [selectedSubcategory.toLowerCase()];

      source = source.filter((item: any) => {
        const subCats = Array.isArray(item.subcategory)
          ? item.subcategory
          : [item.subcategory || ""];
        return (
          subCats.some((s: any) =>
            matchStrings.includes(String(s).toLowerCase()),
          ) ||
          matchStrings.some((m) => (item.title || "").toLowerCase().includes(m))
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

    return Array.from(new Map(source.map((item) => [item._id, item])).values());
  }, [
    query,
    searchResults,
    allSaleItems,
    selectedSubcategory,
    selectedRegion,
    checkedCities,
    subCategoryLinks,
  ]);

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
          items={[...subCategoryLinks]}
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
                items={allSaleItems}
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
                  {itemsToDisplay.length} gawaari
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
                      key={item._id}
                      id={item._id}
                      title={item.title}
                      description={item.description}
                      city={item.city}
                      price={item.price}
                      images={item.images}
                      category="Cars"
                      href={`${VEHICLES_DETAILS}/${item._id || item.id}`}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-20 text-gray-400 text-xs font-medium">
                    {t("noResults", {
                      defaultValue: "Lama helin gawaari waafaqsan raadintaada.",
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

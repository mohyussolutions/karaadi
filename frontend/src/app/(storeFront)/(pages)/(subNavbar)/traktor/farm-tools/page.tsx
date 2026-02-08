"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PathSegmentsDisplay from "../../../(details)/historyPath/pathSegmentsDisplay";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import UniversalCard from "@/app/(storeFront)/components/Cards/UniversalCard";

import {
  FarmToolsNestedSub,
  TraktorSubCategoryItem,
} from "@/app/(links)/storeFrontLinks/nestedsubcategoryfortractors";
import { useGetTractorsQuery } from "@/app/(storeFront)/store/slices/tractorsSlice";
import {
  cities,
  regions,
} from "@/app/(storeFront)/components/shared/SomLocs/SomaliaRegions";
import { getGlobalSearchResults } from "@/actions/common/getGlobalSearchResults";
import SearchInput from "@/app/(storeFront)/components/shared/(search)/SearchInput";
import SomaliMap from "@/app/(storeFront)/components/shared/SomLocs/page";
import LocationSelector from "@/app/(storeFront)/components/shared/SomLocs/regionsandCities";
import { getGlobalFilteredResults } from "@/actions/categories/filterAction";

function Farmtools() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: items = [], isLoading, error } = useGetTractorsQuery();

  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null,
  );
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [checkedCities, setCheckedCities] = useState<Record<string, boolean>>(
    {},
  );
  const [isFiltering, setIsFiltering] = useState(false);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);

  const subCategoryLinks = FarmToolsNestedSub as TraktorSubCategoryItem[];

  const allFarmToolItems = useMemo(() => {
    return Array.isArray(items)
      ? items.filter(
          (item: any) =>
            item.category &&
            Array.isArray(item.category) &&
            item.category.includes("Farm Tools"),
        )
      : [];
  }, [items]);

  const getRegionForCity = (cityName: string): string | null => {
    if (!cityName) return null;
    const cityData = cities.find((c: any) => c.name === cityName);
    if (cityData) {
      const regionData = regions.find((r: any) => r.id === cityData.regionId);
      return regionData?.name || null;
    }
    return null;
  };

  const isValidRegionName = (name: string): boolean => {
    if (!name) return false;
    const validRegions = regions.map((r: any) => r.name);
    return validRegions.includes(name);
  };

  const isValidCityName = (name: string): boolean => {
    if (!name) return false;
    const validCities = cities.map((c: any) => c.name);
    return validCities.includes(name);
  };

  const regionCityCounts = useMemo(() => {
    const regionCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};

    allFarmToolItems.forEach((item: any) => {
      const cityName = item.city?.trim();

      if (cityName && isValidCityName(cityName)) {
        cityCounts[cityName] = (cityCounts[cityName] || 0) + 1;

        const itemRegion = item.region?.trim();
        const cityRegion = getRegionForCity(cityName);

        if (itemRegion && isValidRegionName(itemRegion)) {
          regionCounts[itemRegion] = (regionCounts[itemRegion] || 0) + 1;
        } else if (cityRegion) {
          regionCounts[cityRegion] = (regionCounts[cityRegion] || 0) + 1;
        }
      } else {
        const regionName = item.region?.trim();
        if (regionName && isValidRegionName(regionName)) {
          regionCounts[regionName] = (regionCounts[regionName] || 0) + 1;
        }
      }
    });

    return { regionCounts, cityCounts };
  }, [allFarmToolItems]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
      const results = await getGlobalSearchResults(query);
      const filtered = results.filter(
        (item: any) => item.category && item.category.includes("Farm Tools"),
      );
      setSearchResults(filtered);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  useEffect(() => {
    const applyLocationFilter = async () => {
      if (!selectedRegion && Object.keys(checkedCities).length === 0) {
        setFilteredItems([]);
        setIsFiltering(false);
        return;
      }

      setIsFiltering(true);
      try {
        const selectedCities = Object.entries(checkedCities)
          .filter(([_, isChecked]) => isChecked)
          .map(([cityName]) => cityName);

        if (selectedCities.length > 0) {
          const allResults: any[] = [];
          for (const city of selectedCities) {
            let filterParams: any = { city: city };
            if (selectedRegion) filterParams.region = selectedRegion;
            if (query.trim()) filterParams.q = query;

            const results = await getGlobalFilteredResults(filterParams);
            const filteredByCategory = results.filter(
              (item: any) =>
                item.category && item.category.includes("Farm Tools"),
            );

            const existingIds = new Set(
              allResults.map((item) => item.id || item._id),
            );
            const uniqueItems = filteredByCategory.filter(
              (item: any) => !existingIds.has(item.id || item._id),
            );
            allResults.push(...uniqueItems);
          }
          setFilteredItems(allResults);
        } else if (selectedRegion) {
          let filterParams: any = { region: selectedRegion };
          if (query.trim()) filterParams.q = query;

          const results = await getGlobalFilteredResults(filterParams);
          let filteredByCategory = results.filter(
            (item: any) =>
              item.category && item.category.includes("Farm Tools"),
          );

          const regionCities = cities
            .filter((c: any) => {
              const regionData = regions.find((r: any) => r.id === c.regionId);
              return regionData && regionData.name === selectedRegion;
            })
            .map((c: any) => c.name);

          const extraCityItems = allFarmToolItems.filter(
            (item: any) =>
              regionCities.includes(item.city) &&
              (!item.region || item.region !== selectedRegion),
          );

          const allRegionItems = [
            ...filteredByCategory,
            ...extraCityItems.filter(
              (item: any) =>
                !filteredByCategory.some(
                  (i: any) => (i.id || i._id) === (item.id || item._id),
                ),
            ),
          ];
          setFilteredItems(allRegionItems);
        }
      } catch (error) {
        console.error("Filter error:", error);
        setFilteredItems([]);
      } finally {
        setIsFiltering(false);
      }
    };
    applyLocationFilter();
  }, [selectedRegion, checkedCities, query, allFarmToolItems, cities, regions]);

  const itemsToDisplay = useMemo(() => {
    if (selectedRegion || Object.keys(checkedCities).length > 0) {
      return filteredItems;
    }

    if (query.trim()) {
      return searchResults;
    }

    if (selectedSubcategory) {
      const normalized = selectedSubcategory.toLowerCase();
      return allFarmToolItems.filter((item: any) =>
        item.subcategory?.some(
          (sub: string) => sub.toLowerCase() === normalized,
        ),
      );
    }

    return allFarmToolItems;
  }, [
    query,
    searchResults,
    selectedSubcategory,
    allFarmToolItems,
    selectedRegion,
    checkedCities,
    filteredItems,
  ]);

  const subcategoryFilters = useMemo(() => {
    return subCategoryLinks.map((item) => ({
      subcategory: item.title,
      soName: item.so,
      icon: item.icon,
    }));
  }, [subCategoryLinks]);

  const currentDisplayTitle = useMemo(() => {
    if (isFiltering) return "Shaandheyn...";
    const cityEntries = Object.entries(checkedCities).filter(
      ([_, isChecked]) => isChecked,
    );

    if (selectedRegion || cityEntries.length > 0) {
      let locationText = selectedRegion || "";
      const cityNames = cityEntries.map(([name]) => name).join(", ");
      if (cityNames) {
        locationText = locationText
          ? `${locationText} - ${cityNames}`
          : cityNames;
      }
      return `Goobta: ${locationText}`;
    }

    if (query.trim()) return `Natiijada: "${query}"`;
    if (!selectedSubcategory) return "Dhamaan Qalabka Beeraha";

    const found = subcategoryFilters.find(
      (cat) =>
        cat.subcategory.toLowerCase() === selectedSubcategory?.toLowerCase(),
    );
    return found
      ? `${found.soName} (${found.subcategory})`
      : selectedSubcategory;
  }, [
    query,
    selectedSubcategory,
    subcategoryFilters,
    selectedRegion,
    checkedCities,
    isFiltering,
  ]);

  const getLocationDisplay = (item: any) => {
    const city = item.city?.trim();
    const region = item.region?.trim();

    if (city && isValidCityName(city) && region && isValidRegionName(region)) {
      return `${city}, ${region}`;
    } else if (city && isValidCityName(city)) {
      const cityRegion = getRegionForCity(city);
      if (cityRegion) {
        return `${city}, ${cityRegion}`;
      }
      return city;
    } else if (region && isValidRegionName(region)) {
      return region;
    } else if (city && region) {
      return `${city}, ${region}`;
    } else if (city) {
      return city;
    } else if (region) {
      return region;
    }
    return "";
  };

  const getItemId = (item: any): string => {
    const id = item.id || item._id;
    if (!id || id === "undefined") {
      return `item-${item.title?.replace(/\s+/g, "-").toLowerCase()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    return id.toString();
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      scrollRef.current.scrollTo({
        left: scrollLeft + (direction === "left" ? -clientWidth : clientWidth),
        behavior: "smooth",
      });
    }
  };

  const handleCategoryClick = (subcategory: string) => {
    setSelectedSubcategory((prev) =>
      prev === subcategory ? null : subcategory,
    );
  };

  const handleLocationFilterChange = (
    region: string | null,
    citiesMap: Record<string, boolean>,
  ) => {
    setSelectedRegion(region);
    setCheckedCities(citiesMap);
  };

  if (isLoading) return <Loading />;
  if (error) return <div className="p-4 text-red-500">Cilad ayaa dhacday.</div>;

  return (
    <div className="container mx-auto px-4 pb-10">
      <SearchInput onSearch={setQuery} />
      <PathSegmentsDisplay />

      <div className="relative py-6">
        <div className="flex justify-center relative">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-2 m-2 rounded-full"
          >
            <FaChevronLeft />
          </button>
          <div
            ref={scrollRef}
            className="flex overflow-x-auto space-x-4 scrollbar-hide px-8 max-w-[calc(100%-80px)]"
          >
            {subcategoryFilters.map((filter) => (
              <div
                key={filter.subcategory}
                onClick={() => handleCategoryClick(filter.subcategory)}
                className={`flex-shrink-0 w-40 flex flex-col items-center text-center cursor-pointer rounded-lg p-4 shadow transition-all duration-300 m-6 ${
                  selectedSubcategory === filter.subcategory
                    ? "bg-blue-100 scale-105 shadow-md"
                    : "bg-gray-50 hover:bg-white hover:shadow-lg hover:-translate-y-1"
                }`}
              >
                <span className="text-2xl mb-2">{filter.icon}</span>
                <span className="text-sm font-medium text-gray-800">
                  {filter.soName}
                </span>
                <span className="text-xs text-gray-500">
                  {filter.subcategory}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-2 m-2 rounded-full"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      <div className="px-4 text-sm text-gray-700 mb-4">
        <p>
          Waxaa la helay{" "}
          <span className="text-blue-600 font-semibold">
            {itemsToDisplay.length}
          </span>{" "}
          qalab: <strong>{currentDisplayTitle}</strong>
        </p>
      </div>

      <div className="flex flex-col-reverse md:flex-row gap-4 pt-2 m  l-2">
        <div className="sticky top-4 h-fit space-y-4">
          <LocationSelector
            onFilterChange={handleLocationFilterChange}
            selectedRegion={selectedRegion}
            checkedCities={checkedCities}
            regionCounts={regionCityCounts.regionCounts}
            cityCounts={regionCityCounts.cityCounts}
          />
          <SomaliMap
            selectedRegion={selectedRegion}
            onRegionClick={setSelectedRegion}
            items={finalItems}
          />
        </div>

        <div className="md:w-3/4 w-full">
          {isFiltering ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {itemsToDisplay.length > 0 ? (
                itemsToDisplay.map((item: any, idx: number) => {
                  const itemId = getItemId(item);
                  return (
                    <UniversalCard
                      key={itemId}
                      id={itemId}
                      title={item.title}
                      description={
                        item.description
                          ? Array.isArray(item.description)
                            ? item.description
                            : [item.description]
                          : []
                      }
                      city={getLocationDisplay(item)}
                      price={item.price}
                      images={item.images}
                      category="vehicle"
                    />
                  );
                })
              ) : (
                <div className="col-span-full text-center py-10 text-gray-500">
                  Natiijo lama helin.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Farmtools;

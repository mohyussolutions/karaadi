"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PathSegmentsDisplay from "../../../(details)/historyPath/pathSegmentsDisplay";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import UniversalCard from "@/app/(storeFront)/components/Cards/UniversalCard";
import {
  GrainHarvesterNestedSub,
  TraktorSubCategoryItem,
} from "@/app/(links)/storeFrontLinks/nestedsubcategoryfortractors";
import { useGetTractorsQuery } from "@/app/(storeFront)/store/slices/tractorsSlice";
import { getGlobalSearchResults } from "@/actions/common/getGlobalSearchResults";
import SearchInput from "@/app/(storeFront)/components/shared/(search)/SearchInput";
import LocationSelector from "@/app/(storeFront)/components/shared/SomLocs/regionsandCities";
import SomaliMap from "@/app/(storeFront)/components/shared/SomLocs/page";
import { getGlobalFilteredResults } from "@/actions/categories/filterAction";

function Grainharvester() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: items = [], isLoading, error } = useGetTractorsQuery();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [checkedCities, setCheckedCities] = useState<Record<string, boolean>>(
    {},
  );
  const [isFiltering, setIsFiltering] = useState(false);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);

  const subCategoryLinks = GrainHarvesterNestedSub as TraktorSubCategoryItem[];

  const allGrainHarvesterItems = useMemo(() => {
    return Array.isArray(items)
      ? items.filter(
          (item: any) =>
            item.category &&
            Array.isArray(item.category) &&
            item.category.includes("Grain Harvester"),
        )
      : [];
  }, [items]);

  const regionCityCounts = useMemo(() => {
    const regionCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};

    allGrainHarvesterItems.forEach((item: any) => {
      if (item.region) {
        regionCounts[item.region] = (regionCounts[item.region] || 0) + 1;
      }
      if (item.city) {
        cityCounts[item.city] = (cityCounts[item.city] || 0) + 1;
      }
    });

    return { regionCounts, cityCounts };
  }, [allGrainHarvesterItems]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      const results = await getGlobalSearchResults(query);
      const filteredGrainHarvestersFromSearch = results.filter((item: any) => {
        return (
          item.category &&
          Array.isArray(item.category) &&
          item.category.includes("Grain Harvester")
        );
      });
      setSearchResults(filteredGrainHarvestersFromSearch);
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
          const allResults = [];

          for (const city of selectedCities) {
            let filterParams: any = { city: city };

            if (selectedRegion) {
              filterParams.region = selectedRegion;
            }

            if (query.trim()) {
              filterParams.q = query;
            }

            const results = await getGlobalFilteredResults(filterParams);

            const filteredByCategory = results.filter((item: any) => {
              return (
                item.category &&
                Array.isArray(item.category) &&
                item.category.includes("Grain Harvester")
              );
            });

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

          if (query.trim()) {
            filterParams.q = query;
          }

          const results = await getGlobalFilteredResults(filterParams);

          const filteredByCategory = results.filter((item: any) => {
            return (
              item.category &&
              Array.isArray(item.category) &&
              item.category.includes("Grain Harvester")
            );
          });

          setFilteredItems(filteredByCategory);
        }
      } catch (error) {
        console.error("Location filter error:", error);
        setFilteredItems([]);
      } finally {
        setIsFiltering(false);
      }
    };

    applyLocationFilter();
  }, [selectedRegion, checkedCities, query]);

  const itemsToDisplay = useMemo(() => {
    if (selectedRegion || Object.keys(checkedCities).length > 0) {
      return filteredItems;
    }

    if (query.trim()) {
      return searchResults;
    }

    if (selectedCategory) {
      const normalizedSelectedCategory = selectedCategory.toLowerCase();
      return allGrainHarvesterItems.filter((item: any) => {
        return (
          item.subcategory &&
          Array.isArray(item.subcategory) &&
          item.subcategory.some(
            (sub: string) => sub.toLowerCase() === normalizedSelectedCategory,
          )
        );
      });
    }

    return allGrainHarvesterItems;
  }, [
    query,
    searchResults,
    selectedCategory,
    allGrainHarvesterItems,
    selectedRegion,
    checkedCities,
    filteredItems,
  ]);

  const categoryFilters = useMemo(() => {
    return subCategoryLinks.map((item) => ({
      title: item.title,
      soName: item.so,
      icon: item.icon,
    }));
  }, [subCategoryLinks]);

  const currentDisplayTitle = useMemo(() => {
    if (isFiltering) return "Filtering...";

    if (selectedRegion || Object.keys(checkedCities).length > 0) {
      let locationText = "";
      if (selectedRegion) {
        locationText = selectedRegion;
      }
      if (Object.keys(checkedCities).length > 0) {
        const cityNames = Object.keys(checkedCities).join(", ");
        locationText = locationText
          ? `${locationText} - ${cityNames}`
          : cityNames;
      }
      return `Location: ${locationText}`;
    }

    if (query.trim()) {
      return `Search Results: "${query}"`;
    }

    if (!selectedCategory) {
      return "Dhamaan Makiinada Goosashada Badarka (All Grain Harvesters)";
    }

    const foundCategory = categoryFilters.find(
      (cat) => cat.title.toLowerCase() === selectedCategory,
    );
    return foundCategory
      ? `${foundCategory.soName} (${foundCategory.title})`
      : selectedCategory;
  }, [
    query,
    selectedCategory,
    categoryFilters,
    selectedRegion,
    checkedCities,
    isFiltering,
  ]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      scrollRef.current.scrollTo({
        left: scrollLeft + (direction === "left" ? -clientWidth : clientWidth),
        behavior: "smooth",
      });
    }
  };

  const handleCategoryClick = (categoryTitle: string) => {
    const normalizedTitle = categoryTitle.toLowerCase();
    setSelectedCategory((prev) =>
      prev === normalizedTitle ? null : normalizedTitle,
    );
  };

  const handleLocationFilterChange = (
    region: string | null,
    cities: Record<string, boolean>,
  ) => {
    setSelectedRegion(region);
    setCheckedCities(cities);
  };

  const handleRegionClick = (region: string | null) => {
    setSelectedRegion(region);
  };

  if (isLoading) return <Loading />;
  if (error)
    return (
      <div className="text-red-500 p-4">
        Cilad ayaa ku timid soo dejinta makiinada goosashada badarka.
      </div>
    );

  return (
    <div className="container mx-auto px-4 pb-10">
      <SearchInput onSearch={setQuery} />
      <PathSegmentsDisplay />

      <div className="relative py-6">
        <div className="flex justify-center relative">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md p-2 m-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Bidix u dhaqaaji"
          >
            <FaChevronLeft />
          </button>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto space-x-4 scrollbar-hide px-8 max-w-[calc(100%-80px)]"
          >
            {categoryFilters.map((filter) => (
              <Link
                prefetch={false}
                key={filter.title}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryClick(filter.title);
                }}
                className={`flex-shrink-0 w-40 flex flex-col items-center text-center group rounded-lg p-4 shadow transition-all duration-300 m-6 ${
                  selectedCategory === filter.title.toLowerCase()
                    ? "bg-blue-100 scale-105 shadow-md"
                    : "bg-gray-50 hover:bg-white hover:shadow-lg hover:-translate-y-1"
                }`}
              >
                <span className="text-2xl mb-2" aria-hidden="true">
                  {filter.icon}
                </span>
                <span className="text-sm font-medium text-gray-800 group-hover:text-gray-900 transition-colors">
                  {filter.soName}
                </span>
                <span className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors">
                  {filter.title}
                </span>
              </Link>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md p-2 m-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Midig u dhaqaaji"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      <div className="px-4 text-sm text-gray-700 mb-4">
        <p>
          Waxaa la soo bandhigayaa{" "}
          <span className="text-blue-600 font-semibold">
            {itemsToDisplay.length}
          </span>{" "}
          makiinad gudaha <strong>{currentDisplayTitle}</strong>
        </p>
      </div>

      <div className="flex flex-col-reverse md:flex-row gap-4 pt-2 ml-2">
        <div className="sticky top-4 space-y-4">
          <LocationSelector
            onFilterChange={handleLocationFilterChange}
            selectedRegion={selectedRegion}
            checkedCities={checkedCities}
            regionCounts={regionCityCounts.regionCounts}
            cityCounts={regionCityCounts.cityCounts}
          />
          <SomaliMap
            selectedRegion={selectedRegion}
            onRegionClick={handleRegionClick}
          />
        </div>

        <div className="md:w-3/4 w-full">
          {isFiltering ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-3 gap-6">
              {itemsToDisplay.length > 0 ? (
                itemsToDisplay.map((item: any) => (
                  <UniversalCard
                    key={item.id || item._id}
                    id={item.id || item._id}
                    title={item.title}
                    description={
                      item.description
                        ? (Array.isArray(item.description)
                            ? item.description
                            : [item.description]
                          ).filter((desc: any): desc is string => !!desc)
                        : []
                    }
                    city={item.city}
                    price={item.price}
                    images={item.images}
                    category="vehicle"
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-gray-500">
                  {selectedRegion || Object.keys(checkedCities).length > 0
                    ? `Ma jiro makiinad goosasho badar ah ${selectedRegion ? `gobolka ${selectedRegion}` : ""}${Object.keys(checkedCities).length > 0 ? ` magaalooyinka ${Object.keys(checkedCities).join(", ")}` : ""}`
                    : query.trim()
                      ? `Ma jiro wax makiinad goosasho badar ah la raadinayay "${query}"`
                      : "Ma jiro wax makiinad goosasho badar ah oo la helay"}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Grainharvester;

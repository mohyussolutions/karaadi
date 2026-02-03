"use client";
import React, { useRef, useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useGetRealEstateItemsQuery } from "@/app/(storeFront)/store/slices/realtStateSlice";
import PathSegmentsDisplay from "../../../(details)/historyPath/pathSegmentsDisplay";
import RealEstateCard from "@/app/(storeFront)/components/Cards/RealEstateCard";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import { RealEstateCommercialNestedSub } from "@/app/(links)/storeFrontLinks/nestedSubcategoryProperties";

import { getGlobalFilteredResults } from "@/actions/categories/filterAction";
import LocationSelector from "@/app/(storeFront)/components/shared/SomLocs/regionsandCities";
import SearchInput from "@/app/(storeFront)/components/shared/(search)/SearchInput";
import SomaliMap from "@/app/(storeFront)/components/shared/SomLocs/page";
import { getGlobalSearchResults } from "@/actions/common/getGlobalSearchResults";

function Commercial() {
  const subCategoryLinks = RealEstateCommercialNestedSub;
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: items = [], isLoading, error } = useGetRealEstateItemsQuery();

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

  const allCommercialItems = useMemo(() => {
    return Array.isArray(items)
      ? items.filter((item: any) => item.category.includes("Commercial"))
      : [];
  }, [items]);

  const regionCityCounts = useMemo(() => {
    const regionCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};

    allCommercialItems.forEach((item: any) => {
      if (item.region) {
        regionCounts[item.region] = (regionCounts[item.region] || 0) + 1;
      }
      if (item.city) {
        cityCounts[item.city] = (cityCounts[item.city] || 0) + 1;
      }
    });

    return { regionCounts, cityCounts };
  }, [allCommercialItems]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      const results = await getGlobalSearchResults(query);
      const filteredCommercialFromSearch = results.filter(
        (item: any) => item.category && item.category.includes("Commercial"),
      );
      setSearchResults(filteredCommercialFromSearch);
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

            const filteredByCategory = results.filter(
              (item: any) =>
                item.category && item.category.includes("Commercial"),
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

          if (query.trim()) {
            filterParams.q = query;
          }

          const results = await getGlobalFilteredResults(filterParams);

          const filteredByCategory = results.filter(
            (item: any) =>
              item.category && item.category.includes("Commercial"),
          );

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

    if (selectedSubcategory) {
      const normalizedSelectedCategory = selectedSubcategory.toLowerCase();

      return allCommercialItems.filter((item: any) => {
        return item.subcategory.some(
          (sub: string) => sub.toLowerCase() === normalizedSelectedCategory,
        );
      });
    }

    return allCommercialItems;
  }, [
    query,
    searchResults,
    selectedSubcategory,
    allCommercialItems,
    selectedRegion,
    checkedCities,
    filteredItems,
  ]);

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

    if (!selectedSubcategory) {
      return "Commercial Listings (Ganacsi)";
    }

    const foundCategory = subCategoryLinks.find(
      (cat) =>
        cat.so.toLowerCase() === selectedSubcategory ||
        cat.title.toLowerCase() === selectedSubcategory,
    );
    return foundCategory
      ? `${foundCategory.so} (${foundCategory.title})`
      : selectedSubcategory;
  }, [
    query,
    selectedSubcategory,
    subCategoryLinks,
    selectedRegion,
    checkedCities,
    isFiltering,
  ]);

  const totalFound = itemsToDisplay.length;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      scrollRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
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
    cities: Record<string, boolean>,
  ) => {
    setSelectedRegion(region);
    setCheckedCities(cities);
  };

  const handleRegionClick = (region: string | null) => {
    setSelectedRegion(region);
  };

  if (isLoading) return <Loading />;
  if (error) return <div className="text-red-500 p-4">Error loading items</div>;

  return (
    <div className="container mx-auto px-4 pb-10">
      <SearchInput onSearch={setQuery} />
      <PathSegmentsDisplay />

      <div className="relative py-6">
        <div className="flex justify-center relative">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Scroll left"
          >
            <FaChevronLeft className="hover:scale-110 transition-transform" />
          </button>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto space-x-4 scrollbar-hide px-8 max-w-[calc(100%-80px)]"
          >
            {subCategoryLinks.map((category) => (
              <Link
                prefetch={false}
                key={category.so}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryClick(category.so);
                }}
                className={`flex-shrink-0 w-40 flex flex-col items-center justify-center text-center group border rounded-lg p-4 shadow-sm transition-all duration-300 m-6
                  ${
                    selectedSubcategory === category.so.toLowerCase()
                      ? "bg-blue-100 border-blue-400 scale-[1.03] shadow-md"
                      : "bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:shadow-lg"
                  } active:scale-95`}
              >
                <div className="text-2xl text-gray-600 mb-2 group-hover:text-blue-600">
                  {category.icon}
                </div>
                <span className="text-sm font-medium text-gray-800 group-hover:text-blue-600">
                  {category.so}
                </span>
                <span className="text-xs text-gray-500">
                  ({category.title})
                </span>
              </Link>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Scroll right"
          >
            <FaChevronRight className="hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      <div className="px-4 text-sm text-gray-700 mb-4">
        <p>
          Showing
          <span className="text-blue-600 font-semibold"> {totalFound}</span>
          properties in
          <strong> {currentDisplayTitle}</strong>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {itemsToDisplay.length > 0 ? (
                itemsToDisplay.map((item: any) => (
                  <RealEstateCard
                    key={item._id}
                    id={item._id}
                    title={item.title}
                    description={item.description}
                    city={item.city}
                    price={item.price}
                    images={item.images}
                    purpose="ganacsi"
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-gray-500">
                  {selectedRegion || Object.keys(checkedCities).length > 0
                    ? `No commercial properties found ${selectedRegion ? `in ${selectedRegion} region` : ""}${Object.keys(checkedCities).length > 0 ? ` in cities ${Object.keys(checkedCities).join(", ")}` : ""}`
                    : query.trim()
                      ? `No commercial properties found for "${query}"`
                      : "No commercial properties found for this selection."}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Commercial;

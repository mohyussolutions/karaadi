"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import UniversalCard from "@/app/(storeFront)/components/Cards/UniversalCard";
import {
  TractorForSaleNestedSub,
  TraktorSubCategoryItem,
} from "@/app/(links)/storeFrontLinks/nestedsubcategoryfortractors";
import SomaliMap from "@/app/(storeFront)/components/shared/SomLocs/page";
import { useGetTractorsQuery } from "@/app/(storeFront)/store/slices/tractorsSlice";
import {
  cities,
  regions,
} from "@/app/(storeFront)/components/shared/SomLocs/SomaliaRegions";
import PathSegmentsDisplay from "../../../(details)/historyPath/pathSegmentsDisplay";
import SearchInput from "@/app/(storeFront)/components/shared/(search)/SearchInput";
import LocationSelector from "@/app/(storeFront)/components/shared/SomLocs/regionsandCities";
import { getGlobalSearchResults } from "@/actions/common/getGlobalSearchResults";

function TractorForSale() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [checkedCities, setCheckedCities] = useState<Record<string, boolean>>(
    {},
  );
  const [isFiltering, setIsFiltering] = useState(false);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);

  const { data: items = [], isLoading, error } = useGetTractorsQuery();

  const subCategoryLinks = TractorForSaleNestedSub as TraktorSubCategoryItem[];

  const allTractorSaleItems = useMemo(() => {
    return Array.isArray(items)
      ? items.filter(
          (item: any) =>
            item.category &&
            Array.isArray(item.category) &&
            item.category.includes("Tractor for Sale"),
        )
      : [];
  }, [items]);

  const normalizeCity = (name: string) =>
    name.trim().toLowerCase().replace(/\s+/g, "");
  const getRegionForCity = (cityName: string): string | null => {
    if (!cityName) return null;
    const normalizedCity = normalizeCity(cityName);
    const cityData = cities.find(
      (c: any) => normalizeCity(c.name) === normalizedCity,
    );
    if (cityData) {
      const regionData = regions.find((r: any) => r.id === cityData.regionId);
      return regionData?.name || null;
    }
    return null;
  };

  const regionCityCounts = useMemo(() => {
    const regionCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};

    allTractorSaleItems.forEach((item: any) => {
      const cityName = item.city?.trim();
      if (cityName) {
        const matchedCity = cities.find(
          (c: any) => normalizeCity(c.name) === normalizeCity(cityName),
        );
        const cityKey = matchedCity ? matchedCity.name : cityName;
        cityCounts[cityKey] = (cityCounts[cityKey] || 0) + 1;

        const itemRegion = item.region?.trim();
        const cityRegion = getRegionForCity(cityName);

        if (itemRegion) {
          regionCounts[itemRegion] = (regionCounts[itemRegion] || 0) + 1;
        } else if (cityRegion) {
          regionCounts[cityRegion] = (regionCounts[cityRegion] || 0) + 1;
        }
      } else {
        const regionName = item.region?.trim();
        if (regionName) {
          regionCounts[regionName] = (regionCounts[regionName] || 0) + 1;
        }
      }
    });

    return { regionCounts, cityCounts };
  }, [allTractorSaleItems]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      const results = await getGlobalSearchResults(query);
      const filteredTractorsFromSearch = results.filter((item: any) => {
        return (
          item.category &&
          Array.isArray(item.category) &&
          item.category.includes("Tractor for Sale")
        );
      });
      setSearchResults(filteredTractorsFromSearch);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  useEffect(() => {
    const applyLocationFilter = () => {
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

        let allResults: any[] = [];

        if (selectedRegion && selectedCities.length === 0) {
          const regionItems = allTractorSaleItems.filter((item: any) => {
            const itemRegion = item.region?.trim();
            const city = item.city?.trim();
            const cityRegion = city ? getRegionForCity(city) : null;

            return (
              itemRegion === selectedRegion || cityRegion === selectedRegion
            );
          });
          allResults = [...regionItems];
        } else if (selectedCities.length > 0) {
          const cityFilteredItems = allTractorSaleItems.filter((item: any) => {
            const city = item.city?.trim();

            if (!city) return false;

            const isCitySelected = selectedCities.includes(city);

            if (selectedRegion) {
              const itemRegion = item.region?.trim();
              const cityRegion = getRegionForCity(city);

              return (
                isCitySelected &&
                (itemRegion === selectedRegion || cityRegion === selectedRegion)
              );
            }

            return isCitySelected;
          });
          allResults = [...cityFilteredItems];
        }

        if (query.trim()) {
          allResults = allResults.filter(
            (item: any) =>
              item.title.toLowerCase().includes(query.toLowerCase()) ||
              item.description?.toLowerCase().includes(query.toLowerCase()),
          );
        }

        if (selectedCategory) {
          const normalizedSelectedCategory = selectedCategory.toLowerCase();
          allResults = allResults.filter((item: any) => {
            return (
              item.subcategory &&
              Array.isArray(item.subcategory) &&
              item.subcategory.some(
                (sub: string) =>
                  sub.toLowerCase() === normalizedSelectedCategory,
              )
            );
          });
        }

        setFilteredItems(allResults);
      } catch (error) {
        console.error("Location filter error:", error);
        setFilteredItems([]);
      } finally {
        setIsFiltering(false);
      }
    };

    applyLocationFilter();
  }, [
    selectedRegion,
    checkedCities,
    query,
    selectedCategory,
    allTractorSaleItems,
  ]);

  const itemsToDisplay = useMemo(() => {
    if (selectedRegion || Object.keys(checkedCities).length > 0) {
      return filteredItems;
    }

    if (query.trim()) {
      return searchResults;
    }

    if (selectedCategory) {
      const normalizedSelectedCategory = selectedCategory.toLowerCase();
      return allTractorSaleItems.filter((item: any) => {
        return (
          item.subcategory &&
          Array.isArray(item.subcategory) &&
          item.subcategory.some(
            (sub: string) => sub.toLowerCase() === normalizedSelectedCategory,
          )
        );
      });
    }

    return allTractorSaleItems;
  }, [
    query,
    searchResults,
    selectedCategory,
    allTractorSaleItems,
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
      return "Cagaf cagaf beec ah (Tractor for Sale)";
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

  const handleCategoryClick = (categoryTitle: string) => {
    const normalizedTitle = categoryTitle.toLowerCase();
    setSelectedCategory((prev) =>
      prev === normalizedTitle ? null : normalizedTitle,
    );
  };

  const handleLocationFilterChange = (
    region: string | null,
    citiesMap: Record<string, boolean>,
  ) => {
    setSelectedRegion(region);
    setCheckedCities(citiesMap);
  };

  const handleRegionClick = (region: string | null) => {
    setSelectedRegion(region);

    setCheckedCities({});
  };

  if (isLoading) return <Loading />;
  if (error)
    return (
      <div className="text-red-500 p-4">
        Cilad ayaa ku timid soo dejinta tractorada la iibiyo.
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
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Bidix u dhaqaaji"
          >
            <FaChevronLeft className="hover:scale-110 transition-transform" />
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
                    ? "bg-blue-100 scale-[1.03] shadow-md"
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
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Midig u dhaqaaji"
          >
            <FaChevronRight className="hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      <div className="px-4 text-sm text-gray-700 mb-4">
        <p>
          Waxaa la soo bandhigayaa{" "}
          <span className="text-blue-600 font-semibold">
            {itemsToDisplay.length}
          </span>{" "}
          tractor gudaha <strong>{currentDisplayTitle}</strong>
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
                itemsToDisplay.map((item: any, idx: number) => {
                  const itemId = getItemId(item);
                  return (
                    <UniversalCard
                      key={itemId}
                      id={itemId}
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
                  );
                })
              ) : (
                <div className="col-span-full text-center py-10 text-gray-500">
                  {selectedRegion || Object.keys(checkedCities).length > 0
                    ? `Ma jiro tractor la iibiyo ${selectedRegion ? `gobolka ${selectedRegion}` : ""}${Object.keys(checkedCities).length > 0 ? ` magaalooyinka ${Object.keys(checkedCities).join(", ")}` : ""}`
                    : query.trim()
                      ? `Ma jiro wax tractor la iibiyo la raadinayay "${query}"`
                      : "Ma jiro wax tractor la iibiyo oo la helay"}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

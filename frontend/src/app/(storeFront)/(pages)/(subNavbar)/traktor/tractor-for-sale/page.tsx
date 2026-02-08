"use client";
import React, { useRef, useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useGetTractorsQuery } from "@/app/(storeFront)/store/slices/tractorsSlice";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import PathSegmentsDisplay from "../../../(details)/historyPath/pathSegmentsDisplay";
import VehicleCard from "@/app/(storeFront)/components/Cards/VehicleCard";
import { CarsForSaleNestedSub } from "@/app/(links)/storeFrontLinks/nestedSubcategoryForCars";
import { getGlobalSearchResults } from "@/actions/common/getGlobalSearchResults";
import SearchInput from "@/app/(storeFront)/components/shared/(search)/SearchInput";
import LocationSelector from "@/app/(storeFront)/components/shared/SomLocs/regionsandCities";
import SomaliMap from "@/app/(storeFront)/components/shared/SomLocs/page";

function TractorForSale() {
  const subCategoryLinks = CarsForSaleNestedSub;
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: items = [], isLoading, isError } = useGetTractorsQuery();
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
    const allTractorItems = Array.isArray(items)
      ? items.filter((item: any) => item.subCategories?.includes("Sale"))
      : [];
    console.log("Initial Tractors loaded:", allTractorItems.length);
  }, [items]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      const results = await getGlobalSearchResults(query);
      console.log("Search results total:", results.length);

      const filteredTractorsFromSearch = results.filter((item: any) =>
        item.subCategories?.includes("Sale"),
      );

      console.log("Tractors from search:", filteredTractorsFromSearch.length);
      setSearchResults(filteredTractorsFromSearch);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const allTractorItems = useMemo(() => {
    return Array.isArray(items)
      ? items.filter((item: any) => item.subCategories?.includes("Sale"))
      : [];
  }, [items]);

  const itemsToDisplay = useMemo(() => {
    let filteredItems = [];

    if (query.trim()) {
      filteredItems = searchResults;
      console.log("Using search results:", filteredItems.length);
    } else {
      filteredItems = allTractorItems;
      console.log("Using all tractor items:", filteredItems.length);
    }

    if (selectedSubcategory) {
      const normalizedSelectedCategory = selectedSubcategory.toLowerCase();
      const filtered = filteredItems.filter((item: any) => {
        return (
          item.title?.toLowerCase().includes(normalizedSelectedCategory) ||
          (item.so &&
            item.so.toLowerCase().includes(normalizedSelectedCategory))
        );
      });
      console.log(
        `Filtered by subcategory "${selectedSubcategory}":`,
        filtered.length,
      );
      return filtered;
    }

    console.log("No subcategory filter applied");
    return filteredItems;
  }, [query, searchResults, selectedSubcategory, allTractorItems]);

  const currentDisplayTitle = useMemo(() => {
    if (query.trim()) {
      return `Search Results: "${query}"`;
    }

    if (!selectedSubcategory) {
      return "All Tractors for Sale (Dhammaan Traktorada Iibka)";
    }

    const foundCategory = subCategoryLinks.find(
      (cat: any) =>
        cat.so.toLowerCase() === selectedSubcategory ||
        cat.title.toLowerCase() === selectedSubcategory,
    );
    return foundCategory
      ? `${foundCategory.so} (${foundCategory.title})`
      : selectedSubcategory;
  }, [query, selectedSubcategory, subCategoryLinks]);

  const totalFound = itemsToDisplay.length;
  console.log("Total items to display:", totalFound);

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

  const handleCategoryClick = (categoryTitle: string) => {
    const normalizedTitle = categoryTitle.toLowerCase();
    setSelectedSubcategory((prev) =>
      prev === normalizedTitle ? null : normalizedTitle,
    );
    console.log("Subcategory clicked:", normalizedTitle);
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    console.log("Search query set:", searchQuery);
  };

  const handleLocationFilterChange = (
    region: string | null,
    cities: Record<string, boolean>,
  ) => {
    console.log("Location filter changed - Region:", region, "Cities:", cities);
    setSelectedRegion(region);
    setCheckedCities(cities);
  };

  const handleRegionClick = (region: string | null) => {
    console.log("Region clicked on map:", region);
    setSelectedRegion(region);
  };

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load tractors
      </div>
    );

  return (
    <div className="container mx-auto px-4 pb-10">
      <SearchInput onSearch={handleSearch} />
      <PathSegmentsDisplay />

      <div className="relative py-6">
        {subCategoryLinks.length > 0 && (
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
              {subCategoryLinks.map((category: any) => (
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
        )}
      </div>

      <div className="px-4 text-sm text-gray-700 mb-4">
        <p>
          Showing
          <span className="text-blue-600 font-semibold"> {totalFound}</span>
          listings in
          <strong> {currentDisplayTitle}</strong>
        </p>
      </div>

      <div className="flex flex-col-reverse md:flex-row gap-4 pt-2 ml-2">
        <div className="sticky top-4 space-y-4">
          <LocationSelector
            onFilterChange={handleLocationFilterChange}
            selectedRegion={selectedRegion}
            checkedCities={checkedCities}
          />
          <SomaliMap
            selectedRegion={selectedRegion}
            onRegionClick={handleRegionClick}
            items={itemsToDisplay}
          />
        </div>

        <div className="md:w-3/4 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {itemsToDisplay.length > 0 ? (
              itemsToDisplay.map((item: any) => (
                <VehicleCard
                  key={item._id}
                  id={item._id}
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
                  images={item.images}
                  price={item.price}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">
                {query.trim()
                  ? `No tractors found for "${query}"`
                  : "No tractors found for this selection."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TractorForSale;

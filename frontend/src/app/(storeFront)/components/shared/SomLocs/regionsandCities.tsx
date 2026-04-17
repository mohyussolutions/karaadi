"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  MdFilterList,
  MdClose,
  MdLocationOn,
  MdRefresh,
  MdCheck,
} from "react-icons/md";
import { useTranslation } from "react-i18next";
import { getAllRegions, getAllCities } from "@/actions/categories/geoAction";
import RegionItem from "./RegionItem";

interface City {
  id: string;
  name: string;
  regionId: string;
  isActive?: boolean;
}

interface Region {
  id: string;
  name: string;
}

interface LocationSelectorProps {
  onFilterChange: (
    region: string | null,
    cities: Record<string, boolean>,
  ) => void;
  selectedRegion: string | null;
  checkedCities: Record<string, boolean>;
  regionCounts?: Record<string, number>;
  cityCounts?: Record<string, number>;
}

const CACHE_KEY = "geo_data_cache";
const CACHE_DURATION = 30 * 60 * 1000;

const getCachedData = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { regions, cities, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return { regions, cities };
      }
    }
  } catch (e) {
    console.error("Cache read error:", e);
  }
  return null;
};

const setCachedData = (regions: Region[], cities: City[]) => {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        regions,
        cities,
        timestamp: Date.now(),
      }),
    );
  } catch (e) {
    console.error("Cache write error:", e);
  }
};

export default function LocationSelector({
  onFilterChange = () => {},
  selectedRegion = null,
  checkedCities = {},
  regionCounts = {},
  cityCounts = {},
}: LocationSelectorProps) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRegions, setExpandedRegions] = useState<
    Record<string, boolean>
  >({});
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const initialLoadDone = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || initialLoadDone.current) return;

    const fetchData = async () => {
      const cached = getCachedData();

      if (cached) {
        setRegions(cached.regions);
        setCities(cached.cities);
        setIsLoading(false);
        initialLoadDone.current = true;
        return;
      }

      try {
        const [regionsData, citiesData] = await Promise.all([
          getAllRegions(),
          getAllCities(),
        ]);
        setRegions(regionsData);
        setCities(citiesData.filter((city: City) => city.isActive !== false));
        setCachedData(
          regionsData,
          citiesData.filter((city: City) => city.isActive !== false),
        );
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
        initialLoadDone.current = true;
      }
    };

    fetchData();
  }, [mounted]);

  const currentRegionList = useMemo(
    () => (selectedRegion ? selectedRegion.split(",") : []),
    [selectedRegion],
  );

  const hasActiveFilters = useMemo(
    () => selectedRegion || Object.values(checkedCities).some(Boolean),
    [selectedRegion, checkedCities],
  );

  const handleRegionToggle = useCallback(
    (regionName: string) => {
      const nextRegions = currentRegionList.includes(regionName)
        ? currentRegionList.filter((r) => r !== regionName)
        : [...currentRegionList, regionName];

      setExpandedRegions((prev) => ({
        ...prev,
        [regionName]: !prev[regionName],
      }));

      onFilterChange(
        nextRegions.length > 0 ? nextRegions.join(",") : null,
        checkedCities,
      );
    },
    [currentRegionList, checkedCities, onFilterChange],
  );

  const handleCityToggle = useCallback(
    (cityName: string) => {
      onFilterChange(selectedRegion, {
        ...checkedCities,
        [cityName]: !checkedCities[cityName],
      });
    },
    [selectedRegion, checkedCities, onFilterChange],
  );

  const handleClearAll = useCallback(() => {
    onFilterChange(null, {});
    setExpandedRegions({});
  }, [onFilterChange]);

  const handleMobileOpen = useCallback(() => setIsMobileOpen(true), []);
  const handleMobileClose = useCallback(() => setIsMobileOpen(false), []);

  if (!mounted) return null;

  return (
    <div className="w-full md:w-64 lg:w-72 font-sans">
      <div className="md:hidden px-4 py-2">
        <button
          onClick={handleMobileOpen}
          className="flex items-center justify-between w-full bg-white border border-gray-200 p-4 rounded-2xl font-bold shadow-sm"
        >
          <span className="flex items-center gap-2 text-gray-800">
            <MdLocationOn className="text-blue-600 text-xl" />
            <span className="truncate text-sm">
              {t("filters.location.title")}
            </span>
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-blue-600 rounded-full" />
            )}
          </span>
          <MdFilterList className="text-xl text-gray-400" />
        </button>
      </div>

      <div
        className={`
          fixed inset-0 z-50 bg-white transform transition-transform duration-300 md:relative md:inset-auto md:translate-x-0 md:z-0 md:bg-transparent
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:block"}
        `}
      >
        <div className="flex flex-col h-full md:h-auto bg-white md:rounded-2xl md:border md:border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-50">
            <h3 className="text-xs font-black text-gray-900 flex items-center gap-2 uppercase tracking-[0.15em]">
              <MdLocationOn className="text-blue-600" />
              {t("filters.location.title")}
            </h3>
            <button
              onClick={handleMobileClose}
              className="md:hidden p-2 bg-gray-50 rounded-full"
            >
              <MdClose className="text-xl text-gray-500" />
            </button>
          </div>

          <div className="flex-1 p-2 md:p-3 overflow-y-visible">
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-12 bg-gray-50 animate-pulse rounded-xl w-full"
                  />
                ))}
              </div>
            ) : regions.length > 0 ? (
              <div className="flex flex-col gap-1">
                {regions.map((region) => {
                  const regionCities = cities.filter(
                    (c) => c.regionId === region.id,
                  );
                  if (regionCities.length === 0) return null;

                  return (
                    <RegionItem
                      key={region.id}
                      region={region}
                      isSelected={currentRegionList.includes(region.name)}
                      isExpanded={
                        expandedRegions[region.name] ||
                        currentRegionList.includes(region.name) ||
                        regionCities.some((c) => checkedCities[c.name])
                      }
                      count={regionCounts[region.name] || 0}
                      cities={regionCities}
                      checkedCities={checkedCities}
                      cityCounts={cityCounts}
                      onRegionToggle={handleRegionToggle}
                      onCityToggle={handleCityToggle}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                  No regions found. Please ensure region data is loaded.
                </p>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-gray-50 sticky bottom-0 md:relative">
            <button
              onClick={handleMobileClose}
              className="md:hidden flex items-center justify-center gap-2 w-full py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-100 active:scale-95 transition-all mb-3"
            >
              <MdCheck className="text-lg" />
              {t("common.showResults") || "Show Listings"}
            </button>

            {hasActiveFilters && (
              <button
                onClick={handleClearAll}
                className="flex items-center justify-center gap-2 w-full py-2 text-[10px] font-black text-gray-400 hover:text-red-500 transition-colors uppercase tracking-[0.2em]"
              >
                <MdRefresh className="text-sm" />
                {t("filters.location.clearAll")}
              </button>
            )}
          </div>
        </div>
      </div>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={handleMobileClose}
        />
      )}
    </div>
  );
}

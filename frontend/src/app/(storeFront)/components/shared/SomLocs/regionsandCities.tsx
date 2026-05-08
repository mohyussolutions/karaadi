"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { createPortal } from "react-dom";
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
  mobileOnly?: boolean;
  desktopOnly?: boolean;
}

const CACHE_KEY = "geo_data_cache";
const CACHE_DURATION = 30 * 60 * 1000;

const getCachedData = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const { regions, cities, timestamp } = JSON.parse(raw);
      if (Date.now() - timestamp < CACHE_DURATION) return { regions, cities };
    }
  } catch {}
  return null;
};

const setCachedData = (regions: Region[], cities: City[]) => {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ regions, cities, timestamp: Date.now() }),
    );
  } catch {}
};

export default function LocationSelector({
  onFilterChange = () => {},
  selectedRegion = null,
  checkedCities = {},
  regionCounts = {},
  cityCounts = {},
  mobileOnly = false,
  desktopOnly = false,
}: LocationSelectorProps) {
  const { t } = useTranslation();
  const initialCache = getCachedData();
  const [regions, setRegions] = useState<Region[]>(initialCache?.regions ?? []);
  const [cities, setCities] = useState<City[]>(initialCache?.cities ?? []);
  const [isLoading, setIsLoading] = useState(!initialCache);
  const [expandedRegions, setExpandedRegions] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState(false);
  const initialLoadDone = useRef(!!initialCache);

  useEffect(() => {
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;
    (async () => {
      try {
        const [regionsData, citiesData] = await Promise.all([
          getAllRegions(),
          getAllCities(),
        ]);
        const active = citiesData.filter((c: City) => c.isActive !== false);
        setRegions(regionsData);
        setCities(active);
        setCachedData(regionsData, active);
      } catch {
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!open) return;
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [open]);

  const currentRegionList = useMemo(
    () => (selectedRegion ? selectedRegion.split(",") : []),
    [selectedRegion],
  );

  const activeCount = useMemo(
    () =>
      currentRegionList.length +
      Object.values(checkedCities).filter(Boolean).length,
    [currentRegionList, checkedCities],
  );

  const hasActiveFilters = useMemo(
    () => !!(selectedRegion || Object.values(checkedCities).some(Boolean)),
    [selectedRegion, checkedCities],
  );

  const handleRegionToggle = useCallback(
    (name: string) => {
      const next = currentRegionList.includes(name)
        ? currentRegionList.filter((r) => r !== name)
        : [...currentRegionList, name];
      setExpandedRegions((p) => ({ ...p, [name]: !p[name] }));
      onFilterChange(next.length ? next.join(",") : null, checkedCities);
    },
    [currentRegionList, checkedCities, onFilterChange],
  );

  const handleCityToggle = useCallback(
    (name: string) => {
      onFilterChange(selectedRegion, {
        ...checkedCities,
        [name]: !checkedCities[name],
      });
    },
    [selectedRegion, checkedCities, onFilterChange],
  );

  const handleClearAll = useCallback(() => {
    onFilterChange(null, {});
    setExpandedRegions({});
  }, [onFilterChange]);

  const regionList = isLoading ? (
    <div className="space-y-2 px-4 py-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-10 bg-gray-100 animate-pulse rounded-xl" />
      ))}
    </div>
  ) : regions.length > 0 ? (
    <div className="flex flex-col gap-0.5 px-4 py-3">
      {regions.map((region) => {
        const regionCities = cities.filter((c) => c.regionId === region.id);
        if (!regionCities.length) return null;
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
    <p className="text-center py-8 text-[11px] font-bold text-gray-300 uppercase tracking-widest">
      No regions found
    </p>
  );

  if (desktopOnly) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-50">
          <h3 className="text-[11px] font-black text-gray-700 flex items-center gap-2 uppercase tracking-widest">
            <MdLocationOn className="text-blue-500" />
            {t("filters.location.title")}
          </h3>
          {hasActiveFilters && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors"
            >
              <MdRefresh className="text-sm" />
              {t("filters.location.clearAll")}
            </button>
          )}
        </div>
        <div className="p-3">{regionList}</div>
      </div>
    );
  }

  if (mobileOnly) {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 w-full bg-white border border-gray-200 px-4 py-3 rounded-2xl shadow-sm font-semibold text-sm text-gray-700 active:scale-[0.97] transition-all"
        >
          <MdLocationOn className="text-blue-500 text-lg flex-shrink-0" />
          <span className="flex-1 text-left">
            {t("filters.location.title")}
          </span>
          {activeCount > 0 && (
            <span className="bg-blue-600 text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
              {activeCount}
            </span>
          )}
          <MdFilterList className="text-gray-400 text-lg flex-shrink-0" />
        </button>
        {open &&
          createPortal(
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: "100%",
                height: "100%",
                zIndex: 99999,
                backgroundColor: "white",
                display: "flex",
                flexDirection: "column",
                margin: 0,
                padding: 0,
                boxSizing: "border-box",
              }}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0 bg-white">
                <h3 className="text-base font-black text-gray-800 flex items-center gap-2">
                  <MdLocationOn className="text-blue-500 text-xl" />
                  {t("filters.location.title")}
                  {activeCount > 0 && (
                    <span className="bg-blue-100 text-blue-700 text-xs font-black px-2 py-0.5 rounded-full">
                      {activeCount}
                    </span>
                  )}
                </h3>
                <button
                  onClick={() => setOpen(false)}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full active:scale-95 transition-all"
                >
                  <MdClose className="text-gray-600 text-xl" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">{regionList}</div>

              <div className="px-4 py-4 border-t border-gray-100 flex-shrink-0 bg-white space-y-3">
                {hasActiveFilters && (
                  <button
                    onClick={handleClearAll}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <MdRefresh className="text-base" />
                    {t("filters.location.clearAll")}
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 text-white rounded-xl text-base font-black active:scale-[0.98] transition-all"
                >
                  <MdCheck className="text-xl" />
                  {t("common.showResults") || "Show Results"}
                </button>
              </div>
            </div>,
            document.body,
          )}
      </>
    );
  }

  return null;
}

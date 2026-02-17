"use client";

import React, { useState, useEffect, useMemo } from "react";
import { MdFilterList, MdClose } from "react-icons/md";
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

export default function LocationSelector({
  onFilterChange = () => {},
  selectedRegion = null,
  checkedCities = {},
  regionCounts = {},
  cityCounts = {},
}: LocationSelectorProps) {
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [expandedRegions, setExpandedRegions] = useState<
    Record<string, boolean>
  >({});
  const [loading, setLoading] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        const [regionsData, citiesData] = await Promise.all([
          getAllRegions(),
          getAllCities(),
        ]);
        setRegions(
          [...regionsData].sort((a, b) => a.name.localeCompare(b.name)),
        );
        setCities(citiesData.filter((city: City) => city.isActive !== false));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGeoData();
  }, []);

  const currentRegionList = useMemo(
    () => (selectedRegion ? selectedRegion.split(",") : []),
    [selectedRegion],
  );

  const hasActiveFilters =
    selectedRegion || Object.values(checkedCities).some(Boolean);

  const handleRegionToggle = (regionName: string) => {
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
  };

  const handleCityToggle = (cityName: string) => {
    onFilterChange(selectedRegion, {
      ...checkedCities,
      [cityName]: !checkedCities[cityName],
    });
  };

  return (
    <div className="w-full md:w-72">
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden flex items-center justify-between w-full bg-blue-600 text-white p-4 rounded-xl mb-2 font-bold shadow-lg"
      >
        <span className="flex items-center gap-2">
          <MdFilterList className="text-xl" />
          Sifeeyaha Goobta
        </span>
        {isMobileOpen ? <MdClose className="text-2xl" /> : null}
      </button>

      <div
        className={`
        ${isMobileOpen ? "block" : "hidden md:block"}
        bg-white border border-gray-100 rounded-2xl shadow-xl md:shadow-sm p-5 max-h-[85vh] overflow-y-auto
      `}
      >
        <h3 className="hidden md:block text-xl font-black mb-6 text-gray-800 border-b pb-4 text-center">
          Goobta (Location)
        </h3>

        <div className="space-y-2">
          {loading
            ? // Skeleton Loader to prevent layout jump
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-2 animate-pulse"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gray-200 rounded" />
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                  </div>
                  <div className="w-8 h-4 bg-gray-100 rounded-full" />
                </div>
              ))
            : regions.map((region) => {
                const regionCities = cities
                  .filter((c) => c.regionId === region.id)
                  .sort((a, b) => a.name.localeCompare(b.name));

                if (regionCities.length === 0) return null;

                return (
                  <RegionItem
                    key={region.id}
                    region={region}
                    isSelected={currentRegionList.includes(region.name)}
                    isExpanded={
                      expandedRegions[region.name] ||
                      currentRegionList.includes(region.name)
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

        {hasActiveFilters && (
          <button
            onClick={() => onFilterChange(null, {})}
            className="w-full mt-6 py-4 text-sm font-black text-gray-400 hover:text-red-500 border-t border-dashed transition-all uppercase tracking-widest"
          >
            Nadiifi (Clear All)
          </button>
        )}
      </div>
    </div>
  );
}

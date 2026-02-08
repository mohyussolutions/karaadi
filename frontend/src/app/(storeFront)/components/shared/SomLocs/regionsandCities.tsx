"use client";

import React, { useState } from "react";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { CiSquareCheck } from "react-icons/ci";
import { cities, regions } from "./SomaliaRegions";

interface City {
  id: string;
  name: string;
  regionId: string;
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
  selectedRegion: string | null; // This will now handle "Region1,Region2"
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
  const [expandedRegions, setExpandedRegions] = useState<
    Record<string, boolean>
  >({});

  const handleRegionToggle = (regionName: string): void => {
    // Split current regions into an array
    const currentRegions = selectedRegion ? selectedRegion.split(",") : [];
    let newRegions: string[];

    if (currentRegions.includes(regionName)) {
      newRegions = currentRegions.filter((r) => r !== regionName);
    } else {
      newRegions = [...currentRegions, regionName];
    }

    const regionString = newRegions.length > 0 ? newRegions.join(",") : null;

    // Toggle expansion visually
    setExpandedRegions((prev) => ({
      ...prev,
      [regionName]: !prev[regionName],
    }));

    onFilterChange(regionString, checkedCities);
  };

  const handleCityToggle = (cityName: string): void => {
    const newState = {
      ...checkedCities,
      [cityName]: !checkedCities[cityName],
    };
    onFilterChange(selectedRegion, newState);
  };

  const handleClearAll = () => onFilterChange(null, {});

  const currentRegionList = selectedRegion ? selectedRegion.split(",") : [];

  return (
    <div className="bg-white border rounded-xl shadow-sm p-5 w-72 max-h-[85vh] overflow-y-auto">
      <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-3 text-center">
        Goobta (Location)
      </h3>

      <div className="space-y-3">
        {(regions as Region[]).map((region) => {
          const relatedCities = (cities as City[]).filter(
            (c) => c.regionId === region.id,
          );
          const isRegionSelected = currentRegionList.includes(region.name);
          const isExpanded = expandedRegions[region.name] || isRegionSelected;
          const regionItemCount = regionCounts[region.name] || 0;

          return (
            <div key={region.id} className="mb-2">
              <div
                className="flex items-center gap-3 cursor-pointer py-1 group"
                onClick={() => handleRegionToggle(region.name)}
              >
                {isRegionSelected ? (
                  <CiSquareCheck className="text-blue-600 text-2xl" />
                ) : (
                  <MdCheckBoxOutlineBlank className="text-gray-400 text-2xl group-hover:text-blue-500 transition-colors" />
                )}
                <span
                  className={`text-lg font-bold ${isRegionSelected ? "text-blue-600" : "text-gray-700"}`}
                >
                  {region.name} ({regionItemCount})
                </span>
              </div>

              {isExpanded && (
                <ul className="ml-7 mt-3 space-y-4 border-l-2 border-gray-100 pl-5">
                  {relatedCities.map((city) => {
                    const isCitySelected = !!checkedCities[city.name];
                    const cityItemCount = cityCounts[city.name] || 0;

                    return (
                      <li
                        key={city.id}
                        className="flex items-center gap-3 cursor-pointer group/city"
                        onClick={() => handleCityToggle(city.name)}
                      >
                        {isCitySelected ? (
                          <CiSquareCheck className="text-green-600 text-2xl" />
                        ) : (
                          <MdCheckBoxOutlineBlank className="text-gray-300 text-2xl group-hover/city:text-blue-400 transition-colors" />
                        )}
                        <span
                          className={`text-md ${isCitySelected ? "font-bold text-green-700" : "text-gray-600"}`}
                        >
                          {city.name} ({cityItemCount})
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {(selectedRegion || Object.values(checkedCities).some((v) => v)) && (
        <button
          onClick={handleClearAll}
          className="w-full mt-8 py-3 text-sm font-bold text-gray-400 hover:text-red-600 border-t border-dashed"
        >
          Nadiifi (Clear)
        </button>
      )}
    </div>
  );
}

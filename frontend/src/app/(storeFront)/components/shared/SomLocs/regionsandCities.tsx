"use client";

import React, { useState } from "react";
import {
  MdCheckBoxOutlineBlank,
  MdIndeterminateCheckBox,
} from "react-icons/md";
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
  const [expandedRegions, setExpandedRegions] = useState<
    Record<string, boolean>
  >({});

  const handleRegionToggle = (regionId: string, regionName: string): void => {
    const isExpanding = !expandedRegions[regionId];
    setExpandedRegions((prev) => ({ ...prev, [regionId]: isExpanding }));
    onFilterChange?.(isExpanding ? regionName : null, checkedCities || {});
  };

  const handleCityToggle = (cityName: string): void => {
    const safeChecked = checkedCities || {};
    const newState = {
      ...safeChecked,
      [cityName]: !safeChecked[cityName],
    };
    onFilterChange?.(selectedRegion, newState);
  };

  const handleClearAll = (): void => {
    onFilterChange?.(null, {});
  };

  const getRegionStatus = (relatedCities: City[]) => {
    const safeChecked = checkedCities || {};
    const regionCitiesChecked = relatedCities.filter(
      (city) => safeChecked[city.name],
    );

    const allChecked =
      relatedCities.length > 0 &&
      regionCitiesChecked.length === relatedCities.length;

    const someChecked = regionCitiesChecked.length > 0 && !allChecked;

    return { allChecked, someChecked };
  };

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
          const { allChecked, someChecked } = getRegionStatus(relatedCities);
          const isExpanded =
            !!expandedRegions[region.id] || selectedRegion === region.name;
          const regionItemCount = regionCounts[region.name] || 0;

          return (
            <div key={region.id} className="mb-2">
              <div
                className="flex items-center gap-3 cursor-pointer py-1 group"
                onClick={() => handleRegionToggle(region.id, region.name)}
              >
                {allChecked ? (
                  <CiSquareCheck className="text-blue-600 text-2xl" />
                ) : someChecked ? (
                  <MdIndeterminateCheckBox className="text-blue-400 text-2xl" />
                ) : (
                  <MdCheckBoxOutlineBlank className="text-gray-400 text-2xl group-hover:text-blue-500 transition-colors" />
                )}
                <span
                  className={`text-lg font-bold ${
                    selectedRegion === region.name
                      ? "text-blue-600"
                      : "text-gray-700"
                  }`}
                >
                  {region.name}({regionItemCount})
                </span>
              </div>

              {isExpanded && (
                <ul className="ml-7 mt-3 space-y-4 border-l-2 border-gray-100 pl-5 animate-in slide-in-from-top-1 duration-200">
                  {relatedCities.map((city) => {
                    const isCitySelected = !!checkedCities?.[city.name];
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
                          className={`text-xl transition-all ${
                            isCitySelected
                              ? "font-extrabold text-green-700 scale-105"
                              : "text-gray-600 font-medium group-hover/city:text-gray-900"
                          }`}
                        >
                          {city.name}({cityItemCount})
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

      {(selectedRegion || Object.keys(checkedCities || {}).length > 0) && (
        <button
          onClick={handleClearAll}
          className="w-full mt-8 py-3 text-sm font-bold text-gray-500 hover:text-red-600 transition-all border-t border-dashed"
        >
          Nadiifi (Clear)
        </button>
      )}
    </div>
  );
}

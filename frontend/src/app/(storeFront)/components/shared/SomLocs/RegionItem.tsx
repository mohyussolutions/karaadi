"use client";

import React from "react";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { CiSquareCheck } from "react-icons/ci";
import CityItem from "./CityItem";

interface City {
  id: string;
  name: string;
  regionId: string;
}
interface Region {
  id: string;
  name: string;
}

interface RegionItemProps {
  region: Region;
  isSelected: boolean;
  isExpanded: boolean;
  count: number;
  cities: City[];
  checkedCities: Record<string, boolean>;
  cityCounts: Record<string, number>;
  onRegionToggle: (name: string) => void;
  onCityToggle: (name: string) => void;
}

const formatName = (name: string) =>
  name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : "";

const RegionItem = ({
  region,
  isSelected,
  isExpanded,
  count,
  cities,
  checkedCities,
  cityCounts,
  onRegionToggle,
  onCityToggle,
}: RegionItemProps) => (
  <div className="mb-3">
    <div
      className="flex items-center justify-between cursor-pointer py-1 group"
      onClick={() => onRegionToggle(region.name)}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        {isSelected ? (
          <CiSquareCheck className="text-blue-600 text-2xl flex-shrink-0" />
        ) : (
          <MdCheckBoxOutlineBlank className="text-gray-400 text-2xl flex-shrink-0 group-hover:text-blue-500" />
        )}
        <span
          className={`text-lg font-bold truncate ${isSelected ? "text-blue-600" : "text-gray-700"}`}
        >
          {formatName(region.name)}
        </span>
      </div>
      <span className="bg-blue-50 text-blue-700 text-sm font-black px-3 py-1 rounded-full border border-blue-100 min-w-[38px] text-center shadow-sm flex-shrink-0 ml-2">
        {count}
      </span>
    </div>

    {isExpanded && (
      <ul className="ml-7 mt-3 space-y-3 border-l-2 border-gray-100 pl-5 transition-all">
        {cities.map((city) => (
          <CityItem
            key={city.id}
            city={city}
            isSelected={!!checkedCities[city.name]}
            count={cityCounts[city.name] || 0}
            onToggle={onCityToggle}
          />
        ))}
      </ul>
    )}
  </div>
);

export default RegionItem;

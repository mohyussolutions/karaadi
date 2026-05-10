"use client";

import React from "react";
import { MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";
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
  <div className="mb-1">
    <div
      className="flex items-center justify-between cursor-pointer py-2.5 px-1 rounded-xl group active:bg-gray-50 transition-colors"
      onClick={() => onRegionToggle(region.name)}
    >
      <div className="flex items-center gap-2.5 overflow-hidden">
        {isSelected ? (
          <MdCheckBox className="text-blue-600 text-xl flex-shrink-0" />
        ) : (
          <MdCheckBoxOutlineBlank className="text-gray-300 text-xl flex-shrink-0 group-hover:text-blue-400 transition-colors" />
        )}
        <span
          className={`text-sm font-semibold truncate ${
            isSelected ? "text-blue-600" : "text-gray-700"
          }`}
        >
          {formatName(region.name)}
        </span>
      </div>
      <span
        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex-shrink-0 ml-2 ${
          isSelected
            ? "bg-blue-100 text-blue-700"
            : "bg-gray-100 text-gray-500"
        }`}
      >
        {count}
      </span>
    </div>

    {isExpanded && (
      <ul className="ml-6 mb-1 border-l-2 border-gray-100 pl-4 space-y-0.5">
        {cities.map((city) => (
          <CityItem
            key={city.id}
            city={city}
            isSelected={!!checkedCities[city.name]}
            count={cityCounts[city.name] ?? cityCounts[city.name.toLowerCase()] ?? cityCounts[city.name.charAt(0).toUpperCase() + city.name.slice(1).toLowerCase()] ?? 0}
            onToggle={onCityToggle}
          />
        ))}
      </ul>
    )}
  </div>
);

export default RegionItem;

"use client";

import React from "react";
import { MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";

interface City {
  id: string;
  name: string;
  regionId: string;
  isActive?: boolean;
}
interface CityItemProps {
  city: City;
  isSelected: boolean;
  count: number;
  onToggle: (name: string) => void;
}

const formatName = (name: string) =>
  name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

const CityItem = ({ city, isSelected, count, onToggle }: CityItemProps) => (
  <li
    className="flex items-center justify-between cursor-pointer py-2 group/city active:bg-gray-50 rounded-lg px-1 transition-colors"
    onClick={() => onToggle(city.name)}
  >
    <div className="flex items-center gap-2">
      {isSelected ? (
        <MdCheckBox className="text-blue-600 text-lg flex-shrink-0" />
      ) : (
        <MdCheckBoxOutlineBlank className="text-gray-300 text-lg flex-shrink-0 group-hover/city:text-blue-400 transition-colors" />
      )}
      <span
        className={`text-sm ${
          isSelected ? "font-semibold text-blue-700" : "text-gray-600"
        }`}
      >
        {formatName(city.name)}
      </span>
    </div>
    <span
      className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
        isSelected ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"
      }`}
    >
      {count}
    </span>
  </li>
);

export default CityItem;

"use client";

import React from "react";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { CiSquareCheck } from "react-icons/ci";

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
    className="flex items-center justify-between cursor-pointer group/city py-1"
    onClick={() => onToggle(city.name)}
  >
    <div className="flex items-center gap-3">
      {isSelected ? (
        <CiSquareCheck className="text-green-600 text-2xl" />
      ) : (
        <MdCheckBoxOutlineBlank className="text-gray-300 text-2xl group-hover/city:text-blue-400" />
      )}
      <span
        className={`text-md ${isSelected ? "font-bold text-green-700" : "text-gray-600"}`}
      >
        {formatName(city.name)}
      </span>
    </div>
    <span className="text-gray-500 text-sm font-black bg-gray-100 px-2.5 py-0.5 rounded-md min-w-[30px] text-center">
      {count}
    </span>
  </li>
);

export default CityItem;

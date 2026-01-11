import React, { useState } from "react";
import {
  MdCheckBoxOutlineBlank,
  MdIndeterminateCheckBox,
} from "react-icons/md";
import { CiSquareCheck } from "react-icons/ci";
import { cities, regions } from "./SomaliaRegions";

export default function LocationSelector() {
  const [checkedDistricts, setCheckedDistricts] = useState<
    Record<string, boolean>
  >({});
  const [expandedRegions, setExpandedRegions] = useState<
    Record<string, boolean>
  >({});

  const toggleDistrict = (districtId: string) => {
    setCheckedDistricts((prev) => ({
      ...prev,
      [districtId]: !prev[districtId],
    }));
  };

  const toggleRegionExpand = (regionId: string) => {
    setExpandedRegions((prev) => ({
      ...prev,
      [regionId]: !prev[regionId],
    }));
  };

  return (
    <div className="bg-white border rounded-md shadow-sm p-4 max-h-[90vh] overflow-auto w-64">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Location (Goobta){" "}
      </h3>
      {regions.map((region) => {
        const relatedDistricts = cities.filter((d) => d.regionId === region.id);
        const isExpanded = !!expandedRegions[region.id];

        const allChecked = relatedDistricts.every(
          (d) => checkedDistricts[d.id]
        );
        const someChecked =
          relatedDistricts.some((d) => checkedDistricts[d.id]) && !allChecked;

        let RegionIcon = MdCheckBoxOutlineBlank;
        if (allChecked) RegionIcon = CiSquareCheck;
        else if (someChecked) RegionIcon = MdIndeterminateCheckBox;

        return (
          <div key={region.id} className="mb-3">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => toggleRegionExpand(region.id)}
            >
              <RegionIcon className="text-xl text-gray-600" />
              <span className="font-medium text-gray-700 select-none">
                {region.name} ({region.count})
              </span>
            </div>

            {isExpanded && relatedDistricts.length > 0 && (
              <ul className="ml-6 mt-2 space-y-2">
                {relatedDistricts.map((district) => (
                  <li key={district.id}>
                    <label
                      className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none"
                      onClick={() => toggleDistrict(district.id)}
                    >
                      {checkedDistricts[district.id] ? (
                        <CiSquareCheck className="text-green-600 text-lg" />
                      ) : (
                        <MdCheckBoxOutlineBlank className="text-gray-400 text-lg" />
                      )}
                      <span>{district.name}</span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

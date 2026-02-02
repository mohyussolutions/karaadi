import React, { useState } from "react";
import {
  MdCheckBoxOutlineBlank,
  MdIndeterminateCheckBox,
} from "react-icons/md";
import { CiSquareCheck } from "react-icons/ci";
import { cities as initialCities, regions } from "./SomaliaRegions";

export default function LocationSelector() {
  const [checkedDistricts, setCheckedDistricts] = useState<
    Record<string, boolean>
  >({});
  const [expandedRegions, setExpandedRegions] = useState<
    Record<string, boolean>
  >({});
  const [cities, setCities] = useState(initialCities);
  const [newCityName, setNewCityName] = useState("");
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);

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

  const addNewCity = () => {
    if (!newCityName.trim() || !selectedRegionId) return;
    const newCity = {
      id: `city-${Date.now()}`,
      name: newCityName.trim(),
      regionId: selectedRegionId,
    };
    setCities((prev) => [...prev, newCity]);
    setNewCityName("");
    setSelectedRegionId(null);
  };

  return (
    <div className="bg-white border rounded-md shadow-sm p-4 max-h-[90vh] overflow-auto w-64">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Location (Goobta)
      </h3>

      {regions.map((region) => {
        const relatedDistricts = cities.filter((d) => d.regionId === region.id);
        const isExpanded = !!expandedRegions[region.id];

        const allChecked = relatedDistricts.every(
          (d) => checkedDistricts[d.id],
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
                {region.name} ({relatedDistricts.length})
              </span>
            </div>

            {isExpanded && (
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

      <div className="mt-4 border-t pt-4">
        <p className="text-sm text-gray-600 mb-2">
          City not in the list? Add here:
        </p>
        <select
          className="w-full mb-2 p-1 border rounded"
          value={selectedRegionId || ""}
          onChange={(e) => setSelectedRegionId(e.target.value)}
        >
          <option value="" disabled>
            Select region
          </option>
          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          className="w-full mb-2 p-1 border rounded"
          placeholder="New city name"
          value={newCityName}
          onChange={(e) => setNewCityName(e.target.value)}
        />
        <button
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          onClick={addNewCity}
        >
          Add City
        </button>
      </div>
    </div>
  );
}

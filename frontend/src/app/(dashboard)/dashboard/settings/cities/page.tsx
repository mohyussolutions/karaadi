"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAllRegions,
  addCity,
  deleteCity,
} from "@/actions/categories/geoAction";
import { Region, City } from "@/app/utils/types/geoTypes";
import { FiEdit2, FiTrash2, FiArrowLeft } from "react-icons/fi";

export default function Cities() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAllRegions();
      setRegions(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleDisable = async (city: City) => {
    const currentStatus = city.isActive !== false;
    const res = await addCity({
      id: city.id,
      name: city.name,
      regionId: city.regionId,
      isActive: !currentStatus,
    });
    if (res.success) fetchData();
  };

  const handleUpdate = async (city: City) => {
    if (!editName.trim()) return;
    const res = await addCity({
      id: city.id,
      name: editName,
      regionId: city.regionId,
      isActive: city.isActive !== false,
    });
    if (res.success) {
      setEditingId(null);
      fetchData();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this city?")) {
      const res = await deleteCity(id);
      if (res.success) fetchData();
    }
  };

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-500 font-medium">Loading cities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-gray-50 overflow-hidden">
      <div className="h-full w-full overflow-y-auto">
        <div className="min-h-full w-full px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-5 md:py-6">
          <div className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900">
                  Cities Management
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                  Manage cities and their availability across regions
                </p>
              </div>
              <button
                onClick={() => router.push("/dashboard/settings")}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition flex items-center gap-1.5 w-fit"
              >
                <FiArrowLeft size={14} /> Back
              </button>
            </div>

            <div className="space-y-6 sm:space-y-8 md:space-y-10">
              {regions.map((region) => (
                <div key={region.id} className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <h2 className="text-sm sm:text-base font-black text-gray-800 whitespace-nowrap">
                      {region.name}
                    </h2>
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-gray-200 to-transparent"></div>
                    <span className="text-[10px] sm:text-xs font-bold text-gray-400 bg-gray-100 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full whitespace-nowrap">
                      {region.cities?.length || 0} cities
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                    {region.cities?.map((city) => {
                      const isActive = city.isActive !== false;

                      return (
                        <div
                          key={city.id}
                          className={`relative p-3 sm:p-4 rounded-lg sm:rounded-xl border transition-all ${
                            isActive
                              ? "bg-white border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200"
                              : "bg-gray-100 border-gray-200 opacity-60"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2 sm:mb-3">
                            <span
                              className={`text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${
                                isActive
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {isActive ? "Active" : "Disabled"}
                            </span>
                            <button
                              onClick={() => handleDelete(city.id)}
                              className="text-gray-300 hover:text-red-500 transition-colors"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>

                          {editingId === city.id ? (
                            <div className="space-y-2 sm:space-y-3">
                              <input
                                autoFocus
                                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border-2 border-blue-500 rounded-lg text-xs sm:text-sm font-medium outline-none"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                onKeyDown={(e) =>
                                  e.key === "Enter" && handleUpdate(city)
                                }
                              />
                              <div className="flex gap-1 sm:gap-2">
                                <button
                                  onClick={() => handleUpdate(city)}
                                  className="flex-1 py-1.5 sm:py-2 bg-blue-600 text-white text-[10px] sm:text-xs font-bold rounded-lg hover:bg-blue-700"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-100 text-gray-600 text-[10px] sm:text-xs font-bold rounded-lg hover:bg-gray-200"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <h3
                                className={`text-sm sm:text-base font-bold mb-2 sm:mb-3 truncate ${
                                  isActive ? "text-gray-800" : "text-gray-500"
                                }`}
                              >
                                {city.name}
                              </h3>
                              <div className="flex items-center justify-between gap-1 sm:gap-2 pt-2 sm:pt-3 border-t border-gray-100">
                                <button
                                  onClick={() => {
                                    setEditingId(city.id);
                                    setEditName(city.name);
                                  }}
                                  className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                >
                                  <FiEdit2 size={14} />
                                </button>
                                <button
                                  onClick={() => handleToggleDisable(city)}
                                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[8px] sm:text-xs font-bold transition whitespace-nowrap ${
                                    isActive
                                      ? "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                                      : "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
                                  }`}
                                >
                                  {isActive ? "Disable" : "Enable"}
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}

                    {(!region.cities || region.cities.length === 0) && (
                      <div className="col-span-full py-6 sm:py-8 text-center text-gray-400 bg-white rounded-lg sm:rounded-xl border border-gray-200 text-xs sm:text-sm">
                        No cities found in this region
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {regions.length === 0 && (
                <div className="text-center py-8 sm:py-10 text-gray-400 bg-white rounded-lg sm:rounded-xl border border-gray-200 text-xs sm:text-sm">
                  No regions found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

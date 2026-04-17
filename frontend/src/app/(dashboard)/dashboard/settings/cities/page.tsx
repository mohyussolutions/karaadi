"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getAllRegions,
  addCity,
  deleteCity,
} from "@/actions/categories/geoAction";
import type { Region, City } from "@/app/utils/types/geoTypes";
import { FiEdit2, FiTrash2, FiArrowLeft } from "react-icons/fi";

export default function Cities() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllRegions();
      setRegions(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggleDisable = async (city: City) => {
    setTogglingId(city.id);
    try {
      const currentStatus = city.isActive !== false;
      await addCity({ name: city.name, regionId: city.regionId });
      setRegions((prev) =>
        prev.map((region) => ({
          ...region,
          cities: region.cities?.map((c) =>
            c.id === city.id ? { ...c, isActive: !currentStatus } : c,
          ),
        })),
      );
    } catch (error) {
      console.error(error);
      await fetchData();
    } finally {
      setTogglingId(null);
    }
  };

  const handleUpdate = async (city: City) => {
    if (!editName.trim()) return;
    try {
      await addCity({ name: editName, regionId: city.regionId });
      setRegions((prev) =>
        prev.map((region) => ({
          ...region,
          cities: region.cities?.map((c) =>
            c.id === city.id ? { ...c, name: editName } : c,
          ),
        })),
      );
      setEditingId(null);
    } catch (error) {
      console.error(error);
      await fetchData();
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteCity(id);
      setRegions((prev) =>
        prev.map((region) => ({
          ...region,
          cities: region.cities?.filter((city) => city.id !== id),
        })),
      );
    } catch (error) {
      console.error(error);
      await fetchData();
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-4">
      <div className="max-w-6xl mx-auto py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900">
              Cities Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage cities and their availability across regions
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard/settings")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2 w-fit shadow-sm hover:shadow"
          >
            <FiArrowLeft size={16} /> Back to Settings
          </button>
        </div>

        <div className="space-y-8 md:space-y-10">
          {regions.map((region) => (
            <div key={region.id} className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg sm:text-xl font-black text-gray-800 whitespace-nowrap">
                  {region.name}
                </h2>
                <div className="h-0.5 flex-1 bg-gradient-to-r from-gray-200 to-transparent"></div>
                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {region.cities?.length || 0} cities
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {region.cities?.map((city) => {
                  const isActive = city.isActive !== false;
                  const isDeleting = deletingId === city.id;
                  const isToggling = togglingId === city.id;
                  const isEditing = editingId === city.id;

                  return (
                    <div
                      key={city.id}
                      className={`group relative p-4 rounded-xl border transition-all duration-200 ${
                        isActive
                          ? "bg-white border-gray-200 hover:shadow-lg hover:border-blue-200"
                          : "bg-gray-50 border-gray-200 opacity-70"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-full ${
                            isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {isActive ? "Active" : "Disabled"}
                        </span>
                        <button
                          onClick={() => handleDelete(city.id)}
                          disabled={isDeleting}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Delete city"
                        >
                          {isDeleting ? (
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
                          ) : (
                            <FiTrash2 size={16} />
                          )}
                        </button>
                      </div>

                      {isEditing ? (
                        <div className="space-y-3">
                          <input
                            autoFocus
                            className="w-full px-3 py-2 border-2 border-blue-500 rounded-lg text-sm font-medium outline-none"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleUpdate(city)
                            }
                            placeholder="City name"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdate(city)}
                              className="flex-1 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-4 py-2 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-200 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3
                            className={`text-base sm:text-lg font-bold mb-3 truncate ${
                              isActive ? "text-gray-800" : "text-gray-500"
                            }`}
                            title={city.name}
                          >
                            {city.name}
                          </h3>
                          <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100">
                            <button
                              onClick={() => {
                                setEditingId(city.id);
                                setEditName(city.name);
                              }}
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              aria-label="Edit city"
                            >
                              <FiEdit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleToggleDisable(city)}
                              disabled={isToggling}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                                isActive
                                  ? "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                                  : "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {isToggling ? (
                                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              ) : isActive ? (
                                "Disable"
                              ) : (
                                "Enable"
                              )}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}

                {(!region.cities || region.cities.length === 0) && (
                  <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-xl border border-gray-200">
                    <p className="text-sm">No cities found in this region</p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {regions.length === 0 && (
            <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-200">
              <p className="text-sm">No regions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

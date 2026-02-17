"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAllRegions,
  addCity,
  deleteCity,
} from "@/actions/categories/geoAction";
import { Region, City } from "@/app/utils/types/geoTypes";

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
    const res = await deleteCity(id);
    if (res.success) fetchData();
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-40 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="text-gray-400 font-medium animate-pulse">
          Syncing geographical data...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full p-8 space-y-12 bg-gray-50/30 min-h-screen">
      <header className="space-y-4">
        <button
          onClick={() => router.push("/dashboard/settings")}
          className="group text-indigo-600 text-sm font-semibold flex items-center gap-2 hover:gap-3 transition-all"
        >
          <span className="text-lg">←</span> Back to Settings
        </button>
        <div className="border-l-4 border-indigo-600 pl-4">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Geographical Status
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage city availability and records.
          </p>
        </div>
      </header>

      <div className="space-y-16">
        {regions.map((region) => (
          <section key={region.id} className="space-y-8">
            <div className="flex items-center gap-6">
              <h2 className="text-sm font-black text-indigo-900/40 uppercase tracking-[0.3em] whitespace-nowrap">
                {region.name}
              </h2>
              <div className="h-[2px] w-full bg-gradient-to-r from-gray-200 to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {region.cities?.map((city) => {
                const isCityActive = city.isActive !== false;

                return (
                  <div
                    key={city.id}
                    className={`group relative p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between min-h-[160px] ${
                      !isCityActive
                        ? "bg-gray-100/50 border-gray-200 opacity-70 grayscale shadow-inner"
                        : "bg-white border-white shadow-xl shadow-gray-200/50 hover:shadow-indigo-100 hover:border-indigo-100"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span
                          className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            isCityActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {isCityActive ? "Active" : "Disabled"}
                        </span>

                        <button
                          onClick={() => handleDelete(city.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors p-1"
                        >
                          <TrashIcon />
                        </button>
                      </div>

                      {editingId === city.id ? (
                        <input
                          autoFocus
                          className="w-full bg-white border-2 border-indigo-500 rounded-xl px-3 py-2 text-sm font-semibold outline-none ring-4 ring-indigo-50 shadow-sm"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleUpdate(city)
                          }
                        />
                      ) : (
                        <h3
                          className={`text-lg font-bold truncate tracking-tight ${
                            !isCityActive
                              ? "text-gray-400 line-through decoration-red-300"
                              : "text-gray-800"
                          }`}
                        >
                          {city.name}
                        </h3>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-gray-50 group-hover:border-gray-100 transition-colors">
                      {editingId === city.id ? (
                        <div className="flex gap-2 w-full">
                          <button
                            onClick={() => handleUpdate(city)}
                            className="flex-grow bg-indigo-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-indigo-700 transition"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 bg-gray-100 text-gray-500 text-xs font-bold py-2 rounded-lg hover:bg-gray-200 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingId(city.id);
                              setEditName(city.name);
                            }}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
                          >
                            <EditIcon />
                          </button>
                          <button
                            onClick={() => handleToggleDisable(city)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                              isCityActive
                                ? "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                                : "bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white shadow-sm"
                            }`}
                          >
                            {isCityActive ? "Disable" : "Enable"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function EditIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
  );
}

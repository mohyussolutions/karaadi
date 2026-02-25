"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllRegions, deleteRegion } from "@/actions/categories/geoAction";
import { Region } from "@/app/utils/types/geoTypes";

export default function Regions() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchRegions = async () => {
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
    fetchRegions();
  }, []);

  const handleDelete = async (id: string) => {
    const res = await deleteRegion(id);
    if (res.success) fetchRegions();
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-40 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="text-gray-400 font-medium animate-pulse">
          Syncing regions...
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
        <div className="flex justify-between items-end border-l-4 border-indigo-600 pl-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Regions
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage geographical areas and their linked city counts.
            </p>
          </div>
          <button
            onClick={fetchRegions}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-xs font-bold shadow-sm transition"
          >
            Refresh
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {regions.map((region) => (
          <div
            key={region.id}
            className="group bg-white p-6 rounded-3xl border border-white shadow-xl shadow-gray-200/50 hover:shadow-indigo-100 hover:border-indigo-100 transition-all duration-300 flex flex-col justify-between min-h-[140px]"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-gray-300 font-mono tracking-tighter uppercase">
                  #{region.id.slice(0, 8)}
                </span>
                <button
                  onClick={() => handleDelete(region.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors p-1"
                >
                  <TrashIcon />
                </button>
              </div>

              <h3 className="text-xl font-bold text-gray-800 tracking-tight">
                {region.name}
              </h3>
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-50">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-wider">
                  {region.cities?.length || 0} Cities Linked
                </span>
              </div>
              {region.cities?.length ? (
                <ul className="text-xs text-gray-500 mt-2">
                  {region.cities.map((city) => (
                    <li key={city.id}>{city.name}</li>
                  ))}
                </ul>
              ) : null}
              <button
                onClick={() => router.push(`/dashboard/settings/cities`)}
                className="text-[10px] font-bold text-gray-400 hover:text-indigo-600 transition-colors"
              >
                View Cities →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  );
}

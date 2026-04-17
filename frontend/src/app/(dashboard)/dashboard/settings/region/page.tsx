"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getAllRegions, deleteRegion } from "@/actions/categories/geoAction";
import { Region } from "@/app/utils/types/geoTypes";

export default function Regions() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const fetchRegions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllRegions();
      setRegions(data || []);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await deleteRegion(id);
      if (res.success) {
        setRegions((prev) => prev.filter((region) => region.id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full p-4 min-h-screen">
      <header className="mb-6">
        <button
          onClick={() => router.push("/dashboard/settings")}
          className="text-indigo-600 text-sm font-semibold flex items-center gap-2 hover:underline"
        >
          <span className="text-lg">←</span> Back to Settings
        </button>
        <div className="flex justify-between items-end mt-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Regions</h1>
            <p className="text-gray-500 text-xs mt-1">
              Manage geographical areas and their linked city counts.
            </p>
          </div>
          <button
            onClick={fetchRegions}
            disabled={loading}
            className="px-3 py-1 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded text-xs font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </header>

      {loading && regions.length === 0 ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {regions.map((region) => (
            <div
              key={region.id}
              className="p-4 rounded-xl border border-gray-100 shadow hover:shadow-indigo-100 transition flex flex-col justify-between min-h-[120px]"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-gray-300 font-mono uppercase">
                  #{region.id.slice(0, 8)}
                </span>
                <button
                  onClick={() => handleDelete(region.id)}
                  disabled={deletingId === region.id}
                  className="text-gray-300 hover:text-red-500 transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
                  aria-label="Delete region"
                >
                  {deletingId === region.id ? (
                    <div className="w-3 h-3 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {region.name}
              </h3>
              <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-50">
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-wider">
                  {region.cities?.length || 0} Cities Linked
                </span>
                <button
                  onClick={() => router.push(`/dashboard/settings/cities`)}
                  className="text-[10px] font-bold text-gray-400 hover:text-indigo-600 transition-colors ml-2"
                >
                  View Cities →
                </button>
              </div>
              {region.cities?.length ? (
                <ul className="text-base mt-2">
                  {region.cities.map((city) => (
                    <li
                      key={city.id}
                      className="text-green-600 font-semibold text-lg"
                    >
                      {city.name}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import {
  deleteGlobalTrending,
  fetchPopularSearches,
} from "@/actions/categories/searchHistoryAction";
import { useEffect, useState } from "react";
import { FiTrendingUp, FiTrash2, FiBarChart2 } from "react-icons/fi";

const MostSavedSearch = () => {
  const [popularSearches, setPopularSearches] = useState<any[]>([]);

  const loadData = async () => {
    const data = await fetchPopularSearches();
    setPopularSearches(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (query: string) => {
    if (!confirm(`Remove "${query}" globally?`)) return;
    const success = await deleteGlobalTrending(query);
    if (success) {
      setPopularSearches((prev) => prev.filter((item) => item.query !== query));
    }
  };

  const totalVolume = popularSearches.reduce(
    (acc, curr) => acc + (curr._count?.query || 0),
    0,
  );

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-gray-50 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <FiBarChart2 className="text-orange-500" /> Search Analytics
          </h2>
          <div className="text-right text-sm font-black text-orange-600">
            Top: {popularSearches[0]?.query || "N/A"}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-100">
            <p className="text-[9px] font-black uppercase opacity-80">
              Total Volume
            </p>
            <p className="text-2xl font-black">{totalVolume}</p>
          </div>
          <div className="bg-gray-900 p-4 rounded-2xl text-white">
            <p className="text-[9px] font-black uppercase opacity-80">
              Unique Terms
            </p>
            <p className="text-2xl font-black">{popularSearches.length}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-2">
        {popularSearches.slice(0, 10).map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-all group"
          >
            <div className="flex items-center gap-4">
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${idx === 0 ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"}`}
              >
                {idx + 1}
              </span>
              <p className="text-sm font-bold text-gray-800 capitalize flex items-center gap-2">
                {item.query}{" "}
                {idx === 0 && (
                  <FiTrendingUp className="text-green-500" size={14} />
                )}
              </p>
            </div>
            <button
              onClick={() => handleDelete(item.query)}
              className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MostSavedSearch;

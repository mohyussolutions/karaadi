"use client";

import { useEffect, useState } from "react";
import { FiTrendingUp, FiTrash2, FiBarChart2 } from "react-icons/fi";

const API_BASE = "http://localhost:8080/api/history-search";

const MostSavedSearch = () => {
  const [popularSearches, setPopularSearches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPopularData = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/popular`);
      if (res.ok) {
        const data = await res.json();
        setPopularSearches(data);
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularData();
  }, []);

  const handleDeleteTrending = async (query: string) => {
    if (!confirm(`Remove all instances of "${query}" from global trends?`))
      return;

    try {
      const res = await fetch(
        `${API_BASE}/delete-by-query?q=${encodeURIComponent(query)}`,
        {
          method: "DELETE",
        },
      );
      if (res.ok) {
        setPopularSearches((prev) =>
          prev.filter((item) => item.query !== query),
        );
      }
    } catch (error) {}
  };

  const totalSearchVolume = popularSearches.reduce(
    (acc, curr) => acc + (curr._count?.query || 0),
    0,
  );

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-gray-50 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <FiBarChart2 className="text-orange-500" /> Search Analytics
            </h2>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Top performing keywords across the platform
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase">
              Top Performer
            </p>
            <p className="text-sm font-black text-orange-600 capitalize">
              {popularSearches[0]?.query || "N/A"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-600 p-4 rounded-2xl text-white">
            <p className="text-[9px] font-black uppercase opacity-80">
              Total Volume
            </p>
            <p className="text-2xl font-black">{totalSearchVolume}</p>
          </div>
          <div className="bg-gray-900 p-4 rounded-2xl text-white">
            <p className="text-[9px] font-black uppercase opacity-80">
              Unique Terms
            </p>
            <p className="text-2xl font-black">{popularSearches.length}</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-2">
          {popularSearches.slice(0, 10).map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-all group"
            >
              <div className="flex items-center gap-4">
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black 
                  ${idx === 0 ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"}`}
                >
                  {idx + 1}
                </span>
                <div>
                  <p className="text-sm font-bold text-gray-800 capitalize flex items-center gap-2">
                    {item.query}
                    {idx === 0 && (
                      <FiTrendingUp className="text-green-500" size={14} />
                    )}
                  </p>
                  <p className="text-[10px] font-black text-gray-400 uppercase">
                    {item._count?.query} Total Hits
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden hidden md:block">
                  <div
                    className="h-full bg-orange-500"
                    style={{
                      width: `${(item._count?.query / popularSearches[0]?._count?.query) * 100}%`,
                    }}
                  />
                </div>
                <button
                  onClick={() => handleDeleteTrending(item.query)}
                  className="p-2 bg-red-50 text-red-600 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-100"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
        <button
          onClick={fetchPopularData}
          className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors"
        >
          Refresh Statistics
        </button>
      </div>
    </div>
  );
};

export default MostSavedSearch;

"use client";

import {
  deleteSearchQuery,
  getPopularSearches,
} from "@/actions/categories/searchActions";
import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  FiTrendingUp,
  FiTrash2,
  FiBarChart2,
  FiRefreshCw,
} from "react-icons/fi";

interface SearchItem {
  query: string;
  _count: { query: number };
}

interface ApiResponse {
  data?: SearchItem[];
  items?: SearchItem[];
  results?: SearchItem[];
  [key: string]: unknown;
}

const MostSavedSearch = () => {
  const { t } = useTranslation();
  const [popularSearches, setPopularSearches] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPopularData = useCallback(async () => {
    setRefreshing(true);
    setLoading(true);
    setError(null);
    try {
      const data = await getPopularSearches();

      if (Array.isArray(data)) {
        setPopularSearches(data);
      } else if (data && typeof data === "object") {
        const apiData = data as ApiResponse;
        if (apiData.data && Array.isArray(apiData.data)) {
          setPopularSearches(apiData.data);
        } else if (apiData.items && Array.isArray(apiData.items)) {
          setPopularSearches(apiData.items);
        } else if (apiData.results && Array.isArray(apiData.results)) {
          setPopularSearches(apiData.results);
        } else {
          const possibleArray = Object.values(apiData).find((val) =>
            Array.isArray(val),
          );
          if (possibleArray) {
            setPopularSearches(possibleArray as SearchItem[]);
          } else {
            setPopularSearches([]);
          }
        }
      } else {
        setPopularSearches([]);
      }
    } catch (error) {
      console.error("Failed to fetch popular searches:", error);
      setError("Failed to load search data");
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPopularData();
  }, [fetchPopularData]);

  const handleDeleteTrending = async (query: string) => {
    if (!confirm(`Remove all instances of "${query}" from global trends?`))
      return;

    try {
      await deleteSearchQuery(query);
      setPopularSearches((prev) => prev.filter((item) => item.query !== query));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const totalSearchVolume = popularSearches.reduce(
    (acc, curr) => acc + (curr._count?.query || 0),
    0,
  );

  const topQuery = popularSearches[0]?.query || "N/A";
  const topVolume = popularSearches[0]?._count?.query || 1;

  if (loading) {
    return (
      <div className="w-full bg-white rounded-2xl border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <FiRefreshCw className="animate-spin text-blue-500" size={24} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 sm:p-6 md:p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-gray-900 flex items-center gap-2">
              <FiBarChart2 className="text-orange-500" size={20} />
              {t("adminTable.searchAnalytics")}
            </h2>
            <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
              Top performing keywords across the platform
            </p>
          </div>
          <div className="text-right">
            <p className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase">
              {t("adminTable.topPerformer")}
            </p>
            <p className="text-sm sm:text-base font-black text-orange-600 capitalize truncate max-w-[150px] sm:max-w-none">
              {topQuery}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-blue-600 p-4 sm:p-5 rounded-xl sm:rounded-2xl text-white">
            <p className="text-[8px] sm:text-[9px] font-black uppercase opacity-80">
              {t("adminTable.totalVolume")}
            </p>
            <p className="text-xl sm:text-2xl font-black">
              {totalSearchVolume.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-900 p-4 sm:p-5 rounded-xl sm:rounded-2xl text-white">
            <p className="text-[8px] sm:text-[9px] font-black uppercase opacity-80">
              {t("adminTable.uniqueTerms")}
            </p>
            <p className="text-xl sm:text-2xl font-black">
              {popularSearches.length}
            </p>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4">
        <div className="space-y-1 sm:space-y-2">
          {error ? (
            <div className="text-center py-8 text-red-400 font-medium">
              {error}
            </div>
          ) : popularSearches.length === 0 ? (
            <div className="text-center py-8 text-gray-400 font-medium">
              {t("adminTable.noSearchData")}
            </div>
          ) : (
            popularSearches.slice(0, 10).map((item, idx) => {
              const percentage = (item._count?.query / topVolume) * 100;
              return (
                <div
                  key={`${item.query}-${idx}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 hover:bg-gray-50 rounded-xl sm:rounded-2xl transition-all group gap-3"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black flex-shrink-0
                      ${idx === 0 ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"}`}
                    >
                      {idx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm sm:text-base font-bold text-gray-800 capitalize truncate">
                          {item.query}
                        </p>
                        {idx === 0 && (
                          <FiTrendingUp
                            className="text-green-500 flex-shrink-0"
                            size={14}
                          />
                        )}
                      </div>
                      <p className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase">
                        {item._count?.query.toLocaleString()} {t("adminTable.totalHits")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 ml-10 sm:ml-0">
                    <div className="flex-1 sm:flex-none">
                      <div className="h-1.5 w-20 sm:w-24 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500 transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteTrending(item.query)}
                      className="p-1.5 sm:p-2 bg-red-50 text-red-600 rounded-lg sm:rounded-xl opacity-70 sm:opacity-0 group-hover:opacity-100 transition-all hover:bg-red-100 flex-shrink-0"
                      title="Delete"
                    >
                      <FiTrash2 size={14} className="sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-100 text-center">
        <button
          onClick={fetchPopularData}
          disabled={refreshing}
          className="inline-flex items-center gap-2 text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors disabled:opacity-50"
        >
          <FiRefreshCw className={refreshing ? "animate-spin" : ""} size={12} />
          {refreshing ? t("adminTable.refreshing") : t("adminTable.refreshStats")}
        </button>
      </div>
    </div>
  );
};

export default MostSavedSearch;

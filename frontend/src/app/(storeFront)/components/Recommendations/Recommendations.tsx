"use client";

import React, { useEffect, useState } from "react";
import { FaHome, FaCar, FaShoppingBag, FaEye } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { RecommendationItem } from "@/app/utils/types/recommendation";
import {
  fetchRecommendations,
  trackItemView,
} from "@/actions/categories/RecommendationActions";
import { getCategoryRoute } from "../hooks/useGetRoute";

const iconMap: Record<string, React.ElementType> = {
  guryo: FaHome,
  "real-estate": FaHome,
  baabuur: FaCar,
  cars: FaCar,
  vehicles: FaCar,
  alaabooyin: FaShoppingBag,
  marketplace: FaShoppingBag,
  default: FaShoppingBag,
};

const colorMap: Record<string, string> = {
  guryo: "bg-green-500",
  "real-estate": "bg-green-500",
  baabuur: "bg-blue-500",
  cars: "bg-blue-500",
  vehicles: "bg-blue-500",
  alaabooyin: "bg-purple-500",
  marketplace: "bg-purple-500",
  default: "bg-indigo-500",
};

interface RecommendationsProps {
  userId?: string;
  limit?: number;
}

export default function Recommendations({
  userId,
  limit = 6,
}: RecommendationsProps) {
  const [items, setItems] = useState<RecommendationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadRecommendations();
  }, [userId, limit]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const data = await fetchRecommendations(userId, limit);
      setItems(data);
      setError(null);
    } catch {
      setError("Wax qalad ayaa dhacay markii la raadinayay talooyinka");
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = async (item: RecommendationItem) => {
    try {
      if (userId) {
        await trackItemView(item.externalId, item.category, userId);
      }
    } catch {}
    router.push(`/${getCategoryRoute(item.category)}/${item.externalId}`);
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Talooyin Ku Saabsan Adiga
        </h2>
        <p className="text-sm text-gray-600 mb-6 border-b pb-2">
          Waxaan kuu talinaynaa iyadoo lagu salaynayo waxaad booqatay
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(limit)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg animate-pulse"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-5 w-5 bg-gray-300 rounded"></div>
                </div>
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-4"></div>
                <div className="flex justify-between items-center pt-3 border-t">
                  <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                  <div className="h-10 bg-gray-300 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-8 bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Talooyin Ku Saabsan Adiga
        </h2>
        <p className="text-sm text-red-600 mb-4">{error}</p>
        <button
          onClick={loadRecommendations}
          className="text-sm font-medium text-white px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition"
        >
          Isku Day Mar Kale
        </button>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="p-4 md:p-8 bg-gray-50">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-gray-800">
          Talooyin Ku Saabsan Adiga
        </h2>
        {userId && (
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <FaEye size={12} /> Ku salaysan waxaad booqatay
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-6 border-b pb-2">
        {userId
          ? "Waxaan kuu talinaynaa iyadoo lagu salaynayo waxaad danaynayso"
          : "Ku soo gal si aad u hesho talooyin shaqsiyeed"}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const IconComponent =
            iconMap[item.category.toLowerCase()] || iconMap.default;
          const bgColor =
            colorMap[item.category.toLowerCase()] || colorMap.default;

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden border border-gray-200 cursor-pointer"
              onClick={() => handleItemClick(item)}
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-white text-sm font-semibold px-3 py-1 rounded-full ${bgColor}`}
                  >
                    {item.category}
                  </span>
                  <IconComponent size={20} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {item.description || "Faahfaahin lama helin"}
                </p>
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="text-2xl font-extrabold text-indigo-600">
                    {item.price}
                  </span>
                  <div className="flex items-center gap-2">
                    {item.views && item.views > 0 && (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <FaEye size={10} /> {item.views}
                      </span>
                    )}
                    <button
                      className="text-sm font-medium text-white px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleItemClick(item);
                      }}
                    >
                      Eeg
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

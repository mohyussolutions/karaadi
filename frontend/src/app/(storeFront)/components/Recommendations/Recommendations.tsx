"use client";

import React, { useEffect, useState } from "react";
import { FaHome, FaCar, FaShoppingBag, FaEye } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { RecommendationItem } from "@/app/utils/types/recommendation";
import {
  fetchRecommendations,
  trackItemView,
} from "@/actions/categories/RecommendationActions";
import { useGetRoute } from "../hooks/useGetRoute";

const iconMap: Record<string, React.ElementType> = {
  "real-estate": FaHome,
  realestate: FaHome,
  guryo: FaHome,
  vehicles: FaCar,
  car: FaCar,
  cars: FaCar,
  motorcycle: FaCar,
  motorcycles: FaCar,
  boat: FaCar,
  boats: FaCar,
  baabuur: FaCar,
  marketplace: FaShoppingBag,
  alaabooyin: FaShoppingBag,
  default: FaShoppingBag,
};

interface RecommendationsProps {
  userId?: string;
  limit?: number;
  excludeId?: string;
  category?: string;
}

export default function Recommendations({
  userId,
  limit = 6,
  excludeId,
  category,
}: RecommendationsProps) {
  const [items, setItems] = useState<RecommendationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { t } = useTranslation();
  const { getRoute } = useGetRoute();

  useEffect(() => {
    loadRecommendations();
  }, [userId, limit, excludeId, category]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const data = await fetchRecommendations(userId, limit, excludeId, category);
      setItems(data);
      setError(null);
    } catch {
      setError(t("recommendations.error"));
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
    const route = getRoute(item.category);
    router.push(`${route}/${item.externalId}`);
  };

  if (loading) {
    return (
      <div className="mt-8 px-4 md:px-8 py-8 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-xl h-48 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 px-4 md:px-8 py-8 border-t">
        <p className="text-red-500 text-sm mb-3">{error}</p>
        <button
          onClick={loadRecommendations}
          className="text-sm font-semibold bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          {t("recommendations.retry")}
        </button>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="mt-8 border-t border-gray-100 px-4 md:px-8 py-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FaEye className="text-blue-600" />
          {t("recommendations.title")}
        </h2>
        <p className="text-sm text-gray-500">
          {userId
            ? t("recommendations.subtitleLoggedIn")
            : t("recommendations.subtitleGuest")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const IconComponent =
            iconMap[item.category.toLowerCase()] || iconMap.default;

          const rawPrice = Number(item.price);
          const formattedPrice = isNaN(rawPrice) ? "0" : rawPrice.toLocaleString();

          return (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                  <IconComponent
                    size={20}
                    className="text-gray-600 group-hover:text-blue-600"
                  />
                </div>
                <span className="text-lg font-bold text-gray-900">
                  ${formattedPrice}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                  {item.description || t("recommendations.noDescription")}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {item.category}
                </span>
                <span className="text-sm font-bold text-blue-600 group-hover:underline">
                  {t("recommendations.viewDetails")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

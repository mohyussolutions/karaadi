"use client";

import React, { useEffect, useState } from "react";
import { FaHome, FaCar, FaShoppingBag } from "react-icons/fa";

interface RecommendationItem {
  id: number;
  externalId: string;
  source: string;
  category: string;
  title: string;
  description?: string;
  price: string;
}

const iconMap: Record<string, React.ElementType> = {
  guryo: FaHome,
  baabuur: FaCar,
  cars: FaCar,
  alaabooyin: FaShoppingBag,
  default: FaShoppingBag,
};

const colorMap: Record<string, string> = {
  guryo: "bg-green-500",
  baabuur: "bg-blue-500",
  cars: "bg-blue-500",
  alaabooyin: "bg-purple-500",
  default: "bg-indigo-500",
};

function Recommendations() {
  const [items, setItems] = useState<RecommendationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch("/api/recommendations");

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      setItems(data);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
      setError("Wax qalad ayaa dhacay markii la raadinayay talooyinka");

      // Optionally, you could implement a fallback system here
      // For now, just leave items empty or show error message
    } finally {
      setLoading(false);
    }
  };

  const trackView = async (externalId: string) => {
    try {
      await fetch("/api/recommendations/track-view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ externalId }),
      });
    } catch (error) {
      console.error("Failed to track view:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Talooyin Ku Saabsan Adiga
        </h2>
        <p className="text-sm text-gray-600 mb-6 border-b pb-2">
          Waa Maxay Sababta Aan Kuu Talo-siinnay Xayeysiisyadan?
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
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
          onClick={fetchRecommendations}
          className="text-sm font-medium text-white px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition"
        >
          Isku Day Mar Kale
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="p-4 md:p-8 bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Talooyin Ku Saabsan Adiga
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Ma jiraan talooyin hadda. Ku soo noqo mar kale.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Talooyin Ku Saabsan Adiga
      </h2>
      <p className="text-sm text-gray-600 mb-6 border-b pb-2">
        Waa Maxay Sababta Aan Kuu Talo-siinnay Xayeysiisyadan?
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
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden border border-gray-200"
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

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {item.description || "Faahfaahin lama helin"}
                </p>

                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="text-2xl font-extrabold text-indigo-600">
                    {item.price}
                  </span>
                  <button
                    onClick={() => {
                      trackView(item.externalId);
                      // Navigate to item page or show details
                      window.location.href = `/item/${item.externalId}`;
                    }}
                    className="text-sm font-medium text-white px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition"
                  >
                    Eeg Faahfaahinta
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Recommendations;

"use client";

import React from "react";
import { Eye, Trash2, CheckCircle, XCircle, MapPin, Map } from "lucide-react";
import { Subscription } from "@/app/utils/types/subscription";

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  onViewDetails: (sub: Subscription) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
  formatDate: (date: string) => string;
  formatPrice: (price: number) => string;
}

const SubscriptionTable = ({
  subscriptions,
  onViewDetails,
  onDelete,
  formatDate,
  formatPrice,
}: SubscriptionTableProps) => {
  const getUserInfo = (userId: any) => {
    if (typeof userId === "object" && userId !== null) {
      return {
        username: userId.username || "Unknown",
        email: userId.email || "",
      };
    }
    return {
      username: "Unknown",
      email: "",
    };
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse text-xs md:text-sm">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-2 md:px-4 py-2 md:py-3 text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">
                User
              </th>
              <th className="px-2 md:px-4 py-2 md:py-3 text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">
                Title
              </th>
              <th className="px-2 md:px-4 py-2 md:py-3 text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">
                Category
              </th>
              <th className="px-2 md:px-4 py-2 md:py-3 text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">
                Region
              </th>
              <th className="px-2 md:px-4 py-2 md:py-3 text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">
                Cities
              </th>
              <th className="px-2 md:px-4 py-2 md:py-3 text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">
                Price Range
              </th>
              <th className="px-2 md:px-4 py-2 md:py-3 text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">
                Status
              </th>
              <th className="px-2 md:px-4 py-2 md:py-3 text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">
                Created
              </th>
              <th className="px-2 md:px-4 py-2 md:py-3 text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {subscriptions.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-6 py-20 text-center text-gray-400 font-medium"
                >
                  No subscriptions found.
                </td>
              </tr>
            ) : (
              subscriptions.map((sub) => {
                const userInfo = getUserInfo(sub.userId);
                return (
                  <tr
                    key={sub.id || sub._id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-2 md:px-4 py-2 md:py-3 max-w-[120px] truncate">
                      <div className="font-bold text-gray-900 truncate">
                        {userInfo.username}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {userInfo.email}
                      </div>
                    </td>
                    <td className="px-2 md:px-4 py-2 md:py-3 max-w-[120px] truncate">
                      <span className="text-sm font-bold text-gray-800 truncate">
                        {sub.title}
                      </span>
                    </td>
                    <td className="px-2 md:px-4 py-2 md:py-3 max-w-[100px] truncate">
                      <span className="text-[10px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded truncate">
                        {sub.category}
                      </span>
                    </td>
                    <td className="px-2 md:px-4 py-2 md:py-3 max-w-[100px] truncate">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 truncate">
                        <MapPin size={12} className="text-red-400" />
                        <span className="truncate">{sub.region}</span>
                      </div>
                    </td>
                    <td className="px-2 md:px-4 py-2 md:py-3 max-w-[120px] truncate">
                      <div className="flex items-center gap-1.5 truncate">
                        <Map size={12} className="text-emerald-400 shrink-0" />
                        <span className="text-xs font-medium text-gray-700 truncate">
                          {Array.isArray(sub.cities)
                            ? sub.cities.slice(0, 2).join(", ")
                            : ""}
                          {Array.isArray(sub.cities) &&
                            sub.cities.length > 2 &&
                            "..."}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 md:px-4 py-2 md:py-3 max-w-[90px] truncate">
                      <span className="text-xs font-bold text-gray-700 truncate">
                        ${sub.priceMin || 0} - ${sub.priceMax || "∞"}
                      </span>
                    </td>
                    <td className="px-2 md:px-4 py-2 md:py-3">
                      {sub.status === "active" || sub.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-700">
                          <CheckCircle size={10} className="mr-1" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-gray-100 text-gray-500">
                          <XCircle size={10} className="mr-1" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-2 md:px-4 py-2 md:py-3 text-xs text-gray-500">
                      {formatDate(sub.createdAt || "1970-01-01")}
                    </td>
                    <td className="px-2 md:px-4 py-2 md:py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onViewDetails(sub)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => onDelete(sub.id || sub._id || "")}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4 w-full">
        {subscriptions.length === 0 ? (
          <div className="px-4 py-12 text-center text-gray-400 font-medium bg-white rounded-xl border border-gray-100">
            No subscriptions found.
          </div>
        ) : (
          subscriptions.map((sub) => {
            const userInfo = getUserInfo(sub.userId);
            return (
              <div
                key={sub.id || sub._id}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">
                      {userInfo.username}
                    </h3>
                    <p className="text-xs text-gray-500">{userInfo.email}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => onViewDetails(sub)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(sub.id || sub._id || "")}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <span className="text-sm font-bold text-gray-800 line-clamp-2">
                    {sub.title}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-[10px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded">
                    {sub.category}
                  </span>
                  {sub.status === "active" || sub.isActive ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-700">
                      <CheckCircle size={10} className="mr-1" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-black uppercase bg-gray-100 text-gray-500">
                      <XCircle size={10} className="mr-1" /> Inactive
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                      <MapPin size={12} className="text-red-400" />
                      <span className="text-[10px] text-gray-500">Region</span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 mt-1">
                      {sub.region}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <div className="flex items-center gap-1.5">
                      <Map size={12} className="text-emerald-400" />
                      <span className="text-[10px] text-gray-500">Cities</span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 mt-1 truncate">
                      {Array.isArray(sub.cities)
                        ? sub.cities.slice(0, 2).join(", ")
                        : ""}
                      {Array.isArray(sub.cities) &&
                        sub.cities.length > 2 &&
                        "..."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <span className="text-[10px] text-gray-500 block">
                      Price Range
                    </span>
                    <span className="text-sm font-bold text-gray-800">
                      ${sub.priceMin || 0} - ${sub.priceMax || "∞"}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <span className="text-[10px] text-gray-500 block">
                      Created
                    </span>
                    <span className="text-xs font-medium text-gray-600">
                      {formatDate(sub.createdAt || "1970-01-01")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SubscriptionTable;

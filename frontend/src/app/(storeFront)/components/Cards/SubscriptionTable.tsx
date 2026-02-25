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
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 border-b border-gray-100">
            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              User
            </th>
            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Title
            </th>
            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Category
            </th>
            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Region
            </th>
            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Cities
            </th>
            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Price Range
            </th>
            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Status
            </th>
            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Created
            </th>
            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
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
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">
                      {userInfo.username}
                    </div>
                    <div className="text-xs text-gray-500 truncate max-w-[150px]">
                      {userInfo.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-gray-800 line-clamp-1">
                      {sub.title}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded">
                      {sub.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                      <MapPin size={12} className="text-red-400" />
                      {sub.region}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <Map size={12} className="text-emerald-400 shrink-0" />
                      <span className="text-xs font-medium text-gray-700 truncate max-w-[120px]">
                        {sub.cities?.slice(0, 2).join(", ")}
                        {sub.cities?.length > 2 && "..."}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-gray-700">
                      ${sub.priceMin || 0} - ${sub.priceMax || "∞"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
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
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {formatDate(sub.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onViewDetails(sub)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(sub.id || sub._id)}
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
  );
};

export default SubscriptionTable;

"use client";

import React from "react";
import { Eye, Trash2, CheckCircle, XCircle, MapPin } from "lucide-react";
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
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 border-b border-gray-100">
            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              User Info
            </th>
            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Alert Title
            </th>
            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Location
            </th>
            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Status
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
                colSpan={5}
                className="px-6 py-20 text-center text-gray-400 font-medium"
              >
                No active subscriptions found.
              </td>
            </tr>
          ) : (
            subscriptions.map((sub) => (
              <tr
                key={sub._id}
                className="hover:bg-blue-50/30 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">
                    {sub.userId?.username}
                  </div>
                  <div className="text-xs text-gray-500">
                    {sub.userId?.email}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-800 line-clamp-1">
                      {sub.title}
                    </span>
                    <span className="text-[10px] font-black text-blue-600 uppercase">
                      {sub.category}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                    <MapPin size={12} className="text-red-400" />
                    {sub.region}
                  </div>
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
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onViewDetails(sub)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(sub._id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SubscriptionTable;

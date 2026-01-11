"use client";

import React from "react";
import { Search, Eye, Trash2, User, MapPin, DollarSign } from "lucide-react";

interface Subscription {
  _id: string;
  userId: {
    _id: string;
    username: string;
    email: string;
    phone?: string;
  };
  title: string;
  category: string;
  subCategory?: string;
  region: string;
  city: string;
  priceMin?: number;
  priceMax?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastNotified?: string;
}

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  onViewDetails: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
  formatDate: (dateString: string) => string;
  formatPrice: (price?: number) => string;
}

const SubscriptionTable: React.FC<SubscriptionTableProps> = ({
  subscriptions,
  onViewDetails,
  onDelete,
  onUpdateStatus,
  formatDate,
  formatPrice,
}) => {
  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
          <Search className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No subscriptions found
        </h3>
        <p className="text-gray-500">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Subscription Details
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Price Range
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {subscriptions.map((subscription) => (
            <tr
              key={subscription._id}
              className="hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => onViewDetails(subscription)}
            >
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <div className="font-medium text-gray-900">
                      {subscription.userId?.username || "Unknown"}
                    </div>
                    <div className="text-sm text-gray-500 truncate max-w-[180px]">
                      {subscription.userId?.email || "No email"}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div>
                  <div className="font-medium text-gray-900 line-clamp-1">
                    {subscription.title}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {subscription.category}
                    </span>
                    {subscription.subCategory && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {subscription.subCategory}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <MapPin className="h-3 w-3" />
                    {subscription.city}, {subscription.region}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-gray-900">
                    {subscription.priceMin && subscription.priceMax
                      ? `${formatPrice(subscription.priceMin)} - ${formatPrice(
                          subscription.priceMax
                        )}`
                      : "Not specified"}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      subscription.isActive ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      subscription.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {subscription.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-600">
                  {formatDate(subscription.createdAt)}
                </div>
                {subscription.lastNotified && (
                  <div className="text-xs text-gray-400 mt-1">
                    Notified: {formatDate(subscription.lastNotified)}
                  </div>
                )}
              </td>
              <td className="px-6 py-4">
                <div
                  className="flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onViewDetails(subscription)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <select
                    value={subscription.isActive ? "active" : "inactive"}
                    onChange={(e) =>
                      onUpdateStatus(subscription._id, e.target.value)
                    }
                    className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <button
                    onClick={() => onDelete(subscription._id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubscriptionTable;

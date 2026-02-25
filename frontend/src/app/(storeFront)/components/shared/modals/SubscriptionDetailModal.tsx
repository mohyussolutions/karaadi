"use client";

import React from "react";
import {
  FiUser,
  FiMail,
  FiMapPin,
  FiDollarSign,
  FiBell,
  FiX,
  FiCopy,
  FiShield,
  FiHash,
  FiCheckCircle,
  FiSlash,
  FiTrash2,
  FiLayers,
  FiTag,
  FiMap,
} from "react-icons/fi";
import { Subscription } from "@/app/utils/types/subscription";

interface SubscriptionDetailModalProps {
  subscription: Subscription;
  onClose: () => void;
  onDelete: (id: string) => Promise<void> | void;
  onUpdateStatus: (id: string, status: string) => Promise<void> | void;
}

const SubscriptionDetailModal: React.FC<SubscriptionDetailModalProps> = ({
  subscription,
  onClose,
  onDelete,
  onUpdateStatus,
}) => {
  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  const handleCopy = (text: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
    }
  };

  const getUserInfo = () => {
    if (
      typeof subscription.userId === "object" &&
      subscription.userId !== null
    ) {
      return {
        id: subscription.userId._id || "",
        username: subscription.userId.username || "Unknown",
        email: subscription.userId.email || "",
        phone: subscription.userId.phone || "",
      };
    }
    return {
      id: typeof subscription.userId === "string" ? subscription.userId : "",
      username: "Unknown",
      email: "",
      phone: "",
    };
  };

  const userInfo = getUserInfo();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-hidden flex flex-col">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-100">
              <FiShield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                Subscription Control
              </h3>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                <FiHash className="h-3 w-3" />
                <span className="font-mono bg-gray-50 px-2 py-0.5 rounded text-blue-600">
                  {subscription.id || subscription._id}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 bg-white border-b md:border-b-0 md:border-r border-gray-100">
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-3">
                Owner Profile
              </p>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm shrink-0">
                  <FiUser className="h-6 w-6 text-gray-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-black text-gray-900 truncate">
                    {userInfo.username}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-black uppercase">
                    <FiCheckCircle className="h-3 w-3" />
                    <span>Verified Member</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50/50 border-b md:border-b-0 md:border-r border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">
                Contact Info
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-700 truncate">
                  <FiMail className="h-4 w-4 text-blue-500" />
                  {userInfo.email || "N/A"}
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <FiBell className="h-4 w-4 text-purple-500" />
                  {userInfo.phone || "N/A"}
                </div>
              </div>
            </div>

            <div className="p-6 bg-white">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">
                System Identity
              </p>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-500 italic">
                  User ID:
                </p>
                <div className="flex items-center gap-2 group">
                  <code className="text-sm font-mono text-gray-800 bg-white border border-gray-200 px-2 py-1 rounded block truncate flex-1">
                    {userInfo.id}
                  </code>
                  <button
                    onClick={() => handleCopy(userInfo.id)}
                    className="p-1.5 hover:bg-blue-600 hover:text-white rounded-lg transition-all text-gray-400"
                  >
                    <FiCopy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-1 w-8 bg-blue-600 rounded-full" />
                <h4 className="text-sm font-black text-gray-900 uppercase">
                  Alert Configuration
                </h4>
              </div>
              <div className="grid grid-cols-1 gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase">
                    Search Phrase
                  </label>
                  <p className="text-xl font-black text-gray-900 leading-tight">
                    {subscription.title}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg border border-blue-200">
                    <FiLayers className="h-3.5 w-3.5" />
                    <span className="text-xs font-black uppercase tracking-wider">
                      {subscription.category}
                    </span>
                  </div>
                  {subscription.subCategory && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg border border-purple-200">
                      <FiTag className="h-3.5 w-3.5" />
                      <span className="text-xs font-black uppercase tracking-wider">
                        {subscription.subCategory}
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200/50 mt-2">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase">
                      Region
                    </label>
                    <p className="flex items-center gap-1.5 text-sm font-bold text-gray-800">
                      <FiMapPin className="h-4 w-4 text-red-500" />
                      {subscription.region}
                    </p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase">
                      Cities
                    </label>
                    <p className="flex items-center gap-1.5 text-sm font-bold text-gray-800">
                      <FiMap className="h-4 w-4 text-emerald-500" />
                      {subscription.cities?.join(", ") || "All cities"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase">
                      Price Range
                    </label>
                    <p className="flex items-center gap-1.5 text-sm font-bold text-gray-800">
                      <FiDollarSign className="h-4 w-4 text-emerald-500" />$
                      {subscription.priceMin || 0} - $
                      {subscription.priceMax || "∞"}
                    </p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase">
                      Total Fee
                    </label>
                    <p className="flex items-center gap-1.5 text-sm font-bold text-gray-800">
                      <FiDollarSign className="h-4 w-4 text-emerald-500" />$
                      {subscription.totalFee || 0}
                    </p>
                  </div>
                </div>

                {(subscription.brand ||
                  subscription.model ||
                  subscription.condition) && (
                  <div className="pt-4 border-t border-gray-200/50">
                    <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">
                      Filters
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {subscription.brand && (
                        <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-bold">
                          Brand: {subscription.brand}
                        </span>
                      )}
                      {subscription.model && (
                        <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-bold">
                          Model: {subscription.model}
                        </span>
                      )}
                      {subscription.condition && (
                        <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-bold">
                          Condition: {subscription.condition}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-1 w-8 bg-emerald-500 rounded-full" />
                <h4 className="text-sm font-black text-gray-900 uppercase">
                  System Logs
                </h4>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                  <span className="text-xs font-bold text-gray-500">
                    Created
                  </span>
                  <span className="text-xs font-black text-gray-900">
                    {formatDateTime(subscription.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                  <span className="text-xs font-bold text-blue-600 flex items-center gap-2">
                    <FiBell className="h-3.5 w-3.5" />
                    Last Notification
                  </span>
                  <span className="text-xs font-black text-blue-900">
                    {subscription.lastNotified
                      ? formatDateTime(subscription.lastNotified)
                      : "NO ALERTS YET"}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                  <span className="text-xs font-bold text-gray-500">
                    Notification Count
                  </span>
                  <span className="text-xs font-black text-gray-900">
                    {subscription.notificationCount || 0}
                  </span>
                </div>
                {subscription.customCities &&
                  subscription.customCities.length > 0 && (
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                      <span className="text-xs font-bold text-amber-600 block mb-2">
                        Custom Cities
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {subscription.customCities.map((city, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs"
                          >
                            {city}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="flex items-center bg-white border border-gray-200 p-1 rounded-2xl shadow-sm">
            <button
              onClick={() =>
                onUpdateStatus(subscription.id || subscription._id, "active")
              }
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                subscription.isActive
                  ? "bg-emerald-500 text-white shadow-md"
                  : "text-gray-400 hover:text-emerald-500"
              }`}
            >
              <FiCheckCircle className="h-3.5 w-3.5" /> Active
            </button>
            <button
              onClick={() =>
                onUpdateStatus(subscription.id || subscription._id, "inactive")
              }
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                !subscription.isActive
                  ? "bg-red-500 text-white shadow-md"
                  : "text-gray-400 hover:text-red-500"
              }`}
            >
              <FiSlash className="h-3.5 w-3.5" /> Inactive
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => onDelete(subscription.id || subscription._id)}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
            >
              <FiTrash2 className="h-3.5 w-3.5" /> Delete Permanently
            </button>
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-10 py-2.5 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetailModal;

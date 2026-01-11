"use client";

import React from "react";
import {
  FiBell,
  FiTrash2,
  FiEye,
  FiMapPin,
  FiAlertTriangle,
  FiZap,
  FiDollarSign,
} from "react-icons/fi";
import Link from "next/link";

interface NotificationCardProps {
  notification: any;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  formatTime: (date: string) => string;
  getItemLink: (n: any) => string;
  isUrgent?: boolean;
  isSubscriptionAlert?: boolean;
}

const NotificationCard = ({
  notification: n,
  onMarkRead,
  onDelete,
  formatTime,
  getItemLink,
  isUrgent = false,
  isSubscriptionAlert = false,
}: NotificationCardProps) => {
  const isSubscription =
    n.category === "subscription_alert" || isSubscriptionAlert;
  const hasMetadata = n.metadata && typeof n.metadata === "object";

  return (
    <div
      className={`group relative p-5 rounded-2xl border transition-all duration-300 ${
        n.isRead
          ? "bg-white border-gray-100 opacity-90"
          : isSubscription
          ? "bg-white border-blue-100 shadow-sm ring-1 ring-blue-50/50 hover:shadow-md"
          : "bg-white border-blue-100 shadow-sm ring-1 ring-blue-50/50 hover:shadow-md"
      }`}
    >
      <div className="flex gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors relative ${
            n.isRead
              ? "bg-gray-50 text-gray-400"
              : isSubscription
              ? "bg-blue-50 text-blue-600"
              : "bg-blue-50 text-blue-600"
          }`}
        >
          {isSubscription ? (
            <FiZap className="text-xl" />
          ) : (
            <FiBell className="text-xl" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <Link
              href={getItemLink(n)}
              className={`font-bold text-base truncate pr-4 hover:text-blue-600 transition-colors ${
                n.isRead ? "text-gray-600" : "text-gray-900"
              }`}
            >
              {n.title}
            </Link>
            <span
              className={`text-[10px] font-bold whitespace-nowrap px-2 py-1 rounded-md bg-gray-50 text-gray-400`}
            >
              {formatTime(n.createdAt)}
            </span>
          </div>

          <p className={`text-sm mb-3 leading-relaxed text-gray-500`}>
            {n.message}
          </p>

          {isSubscription && hasMetadata && n.metadata.itemPrice && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-lg">
                <FiDollarSign className="h-3 w-3 text-blue-700" />
                <span className="text-xs font-black text-blue-800">
                  ${n.metadata.itemPrice.toLocaleString()}
                </span>
              </div>

              {n.metadata.subscriptionTitle && (
                <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-lg truncate max-w-[150px]">
                  {n.metadata.subscriptionTitle}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <span
                className={`text-[10px] px-2 py-0.5 rounded-md font-black uppercase tracking-tight ${
                  isSubscription
                    ? n.isRead
                      ? "bg-blue-100 text-blue-700"
                      : "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {isSubscription ? "🎯 MATCH" : n.category}
              </span>

              {isSubscription && hasMetadata && n.metadata.matchedCriteria && (
                <>
                  {n.metadata.matchedCriteria.category && (
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md font-medium">
                      {n.metadata.matchedCriteria.category}
                    </span>
                  )}
                  {n.metadata.matchedCriteria.city && (
                    <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md font-medium">
                      {n.metadata.matchedCriteria.city}
                    </span>
                  )}
                </>
              )}

              {n.city && !isSubscription && (
                <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-black bg-emerald-50 px-2 py-0.5 rounded-md uppercase">
                  <FiMapPin size={10} /> {n.city}
                </div>
              )}
            </div>

            <div className="flex gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
              {!n.isRead && (
                <button
                  onClick={() => onMarkRead(n.id)}
                  className={`text-xs font-black px-2 py-1 rounded-md uppercase text-blue-600 hover:bg-blue-50`}
                >
                  Mark Read
                </button>
              )}
              <button
                onClick={() => onDelete(n.id)}
                className={`p-1.5 rounded-md transition-colors text-gray-400 hover:text-red-600 hover:bg-red-50`}
              >
                <FiTrash2 size={16} />
              </button>
              <Link
                href={getItemLink(n)}
                className={`p-1.5 rounded-md transition-colors text-blue-600 hover:bg-blue-50`}
              >
                <FiEye size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;

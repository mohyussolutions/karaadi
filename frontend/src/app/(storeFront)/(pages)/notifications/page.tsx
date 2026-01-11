"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  FiBell,
  FiUser,
  FiFilter,
  FiRefreshCw,
  FiInbox,
  FiAlertTriangle,
  FiZap,
} from "react-icons/fi";
import Link from "next/link";
import { apiService } from "@/actions/core/authAction";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "@/actions/core/notificationsAction";
import NotificationCard from "../../components/Cards/NotificationCard";

const NotificationsComponent = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"unread" | "all">("unread");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [userId, setUserId] = useState<string | null>(null);

  const loadNotifications = useCallback(async (id: string, silent = false) => {
    if (!silent) setLoading(true);
    try {
      const response = await fetchNotifications(id);
      const notificationsData = Array.isArray(response) ? response : [];

      const enhancedNotifications = notificationsData.map((n: any) => ({
        ...n,
        isSubscriptionAlert: n.category === "subscription_alert",
        isUrgent: n.category === "subscription_alert" && !n.isRead,
        priority: n.category === "subscription_alert" ? 1 : 0,
      }));

      setNotifications(enhancedNotifications);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const user = await apiService.verifySession();
      if (user?._id) {
        setUserId(user._id);
        loadNotifications(user._id);
      } else {
        setLoading(false);
      }
    };
    init();
  }, [loadNotifications]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, isRead: true, isUrgent: false } : n
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!userId) return;
    try {
      await markAllNotificationsAsRead(userId);
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, isUrgent: false }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const getItemLink = (n: any) => {
    const type = n.itemType?.toLowerCase();
    const links: Record<string, string> = {
      marketplace: `/item-details/${n.itemId}`,
      vehicle: `/vehicles/${n.itemId}`,
      car: `/vehicles/${n.itemId}`,
      "real-estate": `/real-estate/${n.itemId}`,
      realestate: `/real-estate/${n.itemId}`,
      boat: `/boats/${n.itemId}`,
      motorcycle: `/motorcycles/${n.itemId}`,
      traktor: `/traktors/${n.itemId}`,
    };
    return links[type] || `/listings/${n.itemId}`;
  };

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(diff / 3600000);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  const filtered = notifications
    .filter((n) => (activeTab === "unread" ? !n.isRead : true))
    .filter((n) =>
      filterCategory === "all" ? true : n.category === filterCategory
    )
    .sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      if (b.isUrgent !== a.isUrgent) return b.isUrgent ? 1 : -1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const subscriptionAlertCount = notifications.filter(
    (n) => n.category === "subscription_alert" && !n.isRead
  ).length;
  const categories = [
    "all",
    ...new Set(notifications.map((n) => n.category).filter(Boolean)),
  ];

  if (!userId && !loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center p-12 bg-white rounded-3xl shadow-xl border border-gray-100 max-w-sm w-full">
          <FiUser className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Login Required
          </h2>
          <Link
            href="/login"
            className="block w-full bg-blue-600 text-white px-8 py-3 rounded-xl font-bold transition-transform active:scale-95 shadow-lg shadow-blue-100"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <header className="bg-white border-b border-gray-200 px-6 py-5 shrink-0 z-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative p-2.5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl text-white shadow-xl shadow-blue-100">
              <FiInbox size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                Notification Center
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">
                  {unreadCount} UNREAD UPDATES
                </p>
                {subscriptionAlertCount > 0 && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-br from-red-50 to-red-100 rounded-full">
                    <FiZap className="h-3 w-3 text-red-500" />
                    <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">
                      {subscriptionAlertCount} NEW MATCHES
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab("unread")}
                className={`px-5 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                  activeTab === "unread"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Unread
              </button>
              <button
                onClick={() => setActiveTab("all")}
                className={`px-5 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                  activeTab === "all"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Archive
              </button>
            </div>
            <button
              onClick={() => userId && loadNotifications(userId, true)}
              className={`p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-blue-600 ${
                refreshing ? "animate-spin" : ""
              }`}
            >
              <FiRefreshCw size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-5xl mx-auto p-4 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm">
              <FiFilter className="text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-transparent text-xs font-black text-gray-600 outline-none cursor-pointer uppercase tracking-widest"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === "subscription_alert"
                      ? "🎯 MATCHES"
                      : c.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {activeTab === "unread" && unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 text-[10px] font-black text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 transition-colors uppercase tracking-widest"
              >
                <FiBell className="h-3 w-3" />
                Mark all as read
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-12 h-12 border-[3px] border-blue-600/10 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                Synchronizing...
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-200">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiBell className="text-gray-200 text-3xl" />
              </div>
              <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">
                Empty Workspace
              </h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {filtered.map((n) => (
                <div key={n.id} className="relative">
                  {n.isSubscriptionAlert && !n.isRead && (
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 z-20">
                      <div className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-r-full shadow-lg animate-pulse">
                        <FiAlertTriangle className="h-3 w-3" />
                        <span>NEW MATCH!</span>
                      </div>
                    </div>
                  )}
                  <NotificationCard
                    notification={n}
                    formatTime={formatTime}
                    getItemLink={getItemLink}
                    onMarkRead={handleMarkAsRead}
                    onDelete={handleDelete}
                    isUrgent={n.isUrgent}
                    isSubscriptionAlert={n.isSubscriptionAlert}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NotificationsComponent;

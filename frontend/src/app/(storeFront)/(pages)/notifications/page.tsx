"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import {
  fetchNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "@/actions/core/notificationsAction";
import NotificationCard from "@/app/(storeFront)/components/Cards/NormalCards/NotificationCard";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import { useAuth } from "@/context/AuthContext";
import { getCategoryRoute } from "@/app/(storeFront)/components/hooks/useGetRoute";
import Pagination from "@/app/(storeFront)/components/shared/Pagination";

const PAGE_SIZE = 20;

const NotificationsComponent = () => {
  const { i18n } = useTranslation();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [activeTab, setActiveTab] = useState<"unread" | "all">("unread");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadNotifications = useCallback(async (userId: string) => {
    if (!userId) return;
    setIsFetching(true);
    try {
      const response = await fetchNotifications(userId);
      const data = Array.isArray(response) ? response : [];
      setNotifications(
        data.map((n: any) => ({
          ...n,
          id: n.id || n._id || "",
          isSubscriptionAlert: n.category === "subscription_alert",
          isUrgent: n.category === "subscription_alert" && !n.isRead,
          priority: n.category === "subscription_alert" ? 1 : 0,
        })),
      );
    } catch {
      setNotifications([]);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace("/login?redirect=/notifications");
      } else {
        loadNotifications(user.id || user._id || user.sub || "");
      }
    }
  }, [user, authLoading, router, loadNotifications]);

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return i18n.t("notifications.time.justNow") || "Hadda";
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(diff / 3600000);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(diff / 86400000)}d`;
  };

  const getItemLink = (n: any) => {
    if (!n.itemId || !n.itemType) return "/notifications";
    return `/${getCategoryRoute(n.itemType)}/${n.itemId}?type=${n.itemType}`;
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      window.dispatchEvent(new CustomEvent("notification-read"));
    } catch {}
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch {}
  };

  const filtered = notifications
    .filter((n) => (activeTab === "unread" ? !n.isRead : true))
    .sort(
      (a, b) =>
        (b.priority ?? 0) - (a.priority ?? 0) ||
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const visibleFiltered = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;

  const handleLoadMore = useCallback(() => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + PAGE_SIZE);
      setLoadingMore(false);
    }, 300);
  }, []);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeTab]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <header className="sticky top-0 z-20 border-b bg-white px-4 py-4 md:px-6 md:py-5 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
        <h1 className="text-lg md:text-xl font-black uppercase tracking-tighter text-zinc-900">
          Ogeysiisyo
        </h1>
        <div className="flex w-full sm:w-auto gap-2">
          <button
            onClick={() => setActiveTab("unread")}
            className={`flex-1 sm:flex-none px-4 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest rounded-full transition-all border ${
              activeTab === "unread"
                ? "shadow-md border-zinc-900 text-white bg-zinc-900"
                : "border-zinc-200 text-zinc-500 bg-white hover:bg-zinc-50"
            }`}
          >
            Aan la akhriyin ({unreadCount})
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 sm:flex-none px-4 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest rounded-full transition-all border ${
              activeTab === "all"
                ? "shadow-md border-zinc-900 text-white bg-zinc-900"
                : "border-zinc-200 text-zinc-500 bg-white hover:bg-zinc-50"
            }`}
          >
            Dhamaan
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
        <div className="max-w-4xl mx-auto">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loading />
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                Loading...
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-zinc-100 shadow-sm">
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest px-4">
                {activeTab === "unread"
                  ? "Ma jiraan ogeysiisyo cusub"
                  : "Ma jiraan wax ogeysiisyo ah"}
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-3">
                {visibleFiltered.map((n) => (
                  <NotificationCard
                    key={n.id || n._id}
                    notification={n}
                    formatTime={formatTime}
                    getItemLink={getItemLink}
                    onMarkRead={handleMarkAsRead}
                    onDelete={handleDelete}
                    isSubscriptionAlert={n.isSubscriptionAlert}
                    isUrgent={n.isUrgent}
                  />
                ))}
              </div>
              <Pagination
                hasMore={hasMore}
                loading={loadingMore}
                onSeeMore={handleLoadMore}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default NotificationsComponent;

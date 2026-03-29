"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FiRefreshCw } from "react-icons/fi";
import {
  fetchNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "@/actions/core/notificationsAction";
import { verifySession } from "@/actions/core/authAction";
import NotificationCard from "../../components/Cards/NotificationCard";

const NotificationsComponent = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"unread" | "all">("unread");
  const [userId, setUserId] = useState<string | null>(null);

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const { t } = i18nRef.current;
    if (mins < 1)
      return t("notifications.time.justNow", { defaultValue: "Just now" });
    if (mins < 60)
      return `${mins}${t("notifications.time.minutesSuffix", { defaultValue: "m ago" })}`;
    const hours = Math.floor(diff / 3600000);
    if (hours < 24)
      return `${hours}${t("notifications.time.hoursSuffix", { defaultValue: "h ago" })}`;
    return `${Math.floor(diff / 86400000)}${t("notifications.time.daysSuffix", { defaultValue: "d ago" })}`;
  };

  const i18nRef = React.useRef<any>({ t: (k: string, o?: any) => k });
  const { t, i18n } = useTranslation();
  React.useEffect(() => {
    i18nRef.current = { t: i18n.t.bind(i18n) };
  }, [i18n]);

  const getItemLink = (n: any) => {
    const type = n.itemType?.toLowerCase();
    const links: Record<string, string> = {
      marketplace: `/item-details/${n.itemId}`,
      car: `/vehicles/${n.itemId}`,
      realestate: `/real-estate/${n.itemId}`,
      boat: `/vehicles/${n.itemId}`,
      motorcycle: `/vehicles/${n.itemId}`,
    };
    return links[type] || `/listings/${n.itemId}`;
  };

  const loadNotifications = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await fetchNotifications(id);
      const data = Array.isArray(response) ? response : [];
      setNotifications(
        data.map((n: any) => ({
          ...n,
          id: n.id || n._id,
          isSubscriptionAlert: n.category === "subscription_alert",
          isUrgent: n.category === "subscription_alert" && !n.isRead,
          priority: n.category === "subscription_alert" ? 1 : 0,
        })),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    verifySession().then((user) => {
      if (user?._id) {
        setUserId(user._id);
        loadNotifications(user._id);
      } else {
        setLoading(false);
      }
    });
  }, [loadNotifications]);

  const handleMarkAsRead = async (id: string) => {
    if (!id) return;
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id || n._id === id
            ? { ...n, isRead: true, isUrgent: false }
            : n,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    try {
      await deleteNotification(id);
      setNotifications((prev) =>
        prev.filter((n) => n.id !== id && n._id !== id),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = notifications
    .filter((n) => (activeTab === "unread" ? !n.isRead : true))
    .sort(
      (a, b) =>
        b.priority - a.priority ||
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const allCount = notifications.length;

  if (!userId && !loading) return null;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="border-b px-6 py-5 shrink-0 flex justify-between items-center">
        <h1 className="text-xl font-black uppercase tracking-tight">
          {t("notifications.title", { defaultValue: "Notifications" })}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("unread")}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 ${activeTab === "unread" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"}`}
          >
            {t("notifications.tabs.unread", { defaultValue: "Unread" })}{" "}
            {unreadCount > 0 && `(${unreadCount})`}
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 ${activeTab === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"}`}
          >
            {t("notifications.tabs.all", { defaultValue: "All" })}{" "}
            {allCount > 0 && `(${allCount})`}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-sm font-medium">
                {activeTab === "unread"
                  ? t("notifications.empty.unread", {
                      defaultValue: "No unread notifications",
                    })
                  : t("notifications.empty.all", {
                      defaultValue: "No notifications yet",
                    })}
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {filtered.map((n) => (
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
          )}
        </div>
      </main>
    </div>
  );
};

export default NotificationsComponent;

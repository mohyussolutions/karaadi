"use server";

import { API_ENDPOINTS } from "../constant/sockets";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";

export async function fetchNotifications(
  userId: string,
  options?: {
    limit?: number;
    page?: number;
    unreadOnly?: boolean;
    category?: string;
  },
) {
  const p = new URLSearchParams();
  if (options?.limit) p.set("limit", String(options.limit));
  if (options?.page) p.set("page", String(options.page));
  if (options?.unreadOnly) p.set("unreadOnly", "true");
  if (options?.category) p.set("category", options.category);

  const qs = p.toString();
  const url = `${API_ENDPOINTS.NOTIFICATIONS.GET_NOTIFICATIONS_BY_USER(userId)}${qs ? `?${qs}` : ""}`;

  try {
    const headers = await getAuthHeaders();
    const res = await fetch(url, {
      credentials: "include",
      headers,
      cache: "no-store",
    });

    if (!res.ok) return [];
    const data = await res.json();
    return data.notifications || [];
  } catch {
    return [];
  }
}

export async function markNotificationAsRead(id: string) {
  if (!id) return;
  const headers = await getAuthHeaders();
  const res = await fetch(
    API_ENDPOINTS.NOTIFICATIONS.MARK_NOTIFICATION_READ(id),
    {
      method: "PATCH",
      credentials: "include",
      headers: { ...headers, "Content-Type": "application/json" },
    },
  );
  return res.ok ? res.json() : null;
}

export async function deleteNotification(id: string) {
  if (!id) return;
  const res = await fetch(API_ENDPOINTS.NOTIFICATIONS.DELETE_NOTIFICATION(id), {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  return res.ok ? res.json() : null;
}

export async function markAllNotificationsAsRead(
  userId: string,
  category?: string,
) {
  const url = `${API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_NOTIFICATIONS_READ(userId)}${category ? `?category=${category}` : ""}`;
  const res = await fetch(url, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  return res.ok ? res.json() : null;
}

export async function clearAllNotifications(userId: string, category?: string) {
  const url = `${API_ENDPOINTS.NOTIFICATIONS.CLEAR_ALL_NOTIFICATIONS(userId)}${category ? `?category=${category}` : ""}`;
  const res = await fetch(url, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  return res.ok ? res.json() : null;
}

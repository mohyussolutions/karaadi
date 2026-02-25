import { API_ENDPOINTS } from "../constant/sockets";

export async function fetchNotifications(
  userId: string,
  options?: {
    limit?: number;
    page?: number;
    unreadOnly?: boolean;
    category?: string;
  },
) {
  const params = new URLSearchParams();
  if (options?.limit) params.append("limit", String(options.limit));
  if (options?.page) params.append("page", String(options.page));
  if (options?.unreadOnly) params.append("unreadOnly", "true");
  if (options?.category) params.append("category", options.category);

  const url = `${API_ENDPOINTS.NOTIFICATIONS.GET_NOTIFICATIONS_BY_USER(userId)}${params.toString() ? `?${params.toString()}` : ""}`;

  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch notifications");

  const data = await res.json();
  return data.notifications || [];
}

export async function markNotificationAsRead(id: string) {
  if (!id) throw new Error("Notification ID is required");

  const res = await fetch(
    API_ENDPOINTS.NOTIFICATIONS.MARK_NOTIFICATION_READ(id),
    {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    },
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to mark as read");
  }

  return res.json();
}

export async function deleteNotification(id: string) {
  if (!id) throw new Error("Notification ID is required");

  const res = await fetch(API_ENDPOINTS.NOTIFICATIONS.DELETE_NOTIFICATION(id), {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete notification");
  }

  return res.json();
}

export async function markAllNotificationsAsRead(
  userId: string,
  category?: string,
) {
  const params = category ? `?category=${category}` : "";
  const res = await fetch(
    `${API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_NOTIFICATIONS_READ(userId)}${params}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    },
  );
  if (!res.ok) throw new Error("Failed to mark all as read");
  return res.json();
}

export async function clearAllNotifications(userId: string, category?: string) {
  const params = category ? `?category=${category}` : "";
  const res = await fetch(
    `${API_ENDPOINTS.NOTIFICATIONS.CLEAR_ALL_NOTIFICATIONS(userId)}${params}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    },
  );
  if (!res.ok) throw new Error("Failed to clear notifications");
  return res.json();
}

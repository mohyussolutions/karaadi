import { API_ENDPOINTS } from "../constant/sockets";

export async function fetchNotifications(userId: string) {
  const res = await fetch(
    API_ENDPOINTS.NOTIFICATIONS.GET_NOTIFICATIONS_BY_USER(userId),
    {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!res.ok)
    throw new Error(`Failed to fetch notifications: ${await res.text()}`);
  const data = await res.json();
  return data.notifications;
}

export async function markNotificationAsRead(id: string) {
  const res = await fetch(
    API_ENDPOINTS.NOTIFICATIONS.MARK_NOTIFICATION_READ(id),
    {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!res.ok)
    throw new Error(`Failed to mark notification as read: ${await res.text()}`);
  return res.json();
}

export async function markAllNotificationsAsRead(userId: string) {
  const res = await fetch(
    API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_NOTIFICATIONS_READ(userId),
    {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!res.ok)
    throw new Error(
      `Failed to mark all notifications as read: ${await res.text()}`
    );
  return res.json();
}

export async function deleteNotification(id: string) {
  const res = await fetch(API_ENDPOINTS.NOTIFICATIONS.DELETE_NOTIFICATION(id), {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok)
    throw new Error(`Failed to delete notification: ${await res.text()}`);
  return res.json();
}

export async function clearAllNotifications(userId: string) {
  const res = await fetch(
    API_ENDPOINTS.NOTIFICATIONS.CLEAR_ALL_NOTIFICATIONS(userId),
    {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!res.ok)
    throw new Error(`Failed to clear all notifications: ${await res.text()}`);
  return res.json();
}

export async function getNotificationStats(userId: string) {
  const res = await fetch(
    API_ENDPOINTS.NOTIFICATIONS.GET_NOTIFICATION_STATS(userId),
    {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!res.ok)
    throw new Error(`Failed to fetch notification stats: ${await res.text()}`);
  const data = await res.json();
  return data.stats;
}

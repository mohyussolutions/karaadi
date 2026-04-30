"use client";

import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "@/actions/constant/sockets";
import { useAppDispatch } from "@/store/slices/hooks/hooks";
import {
  setUnreadCount,
  decrementUnread,
} from "@/store/slices/reducers/notificationsSlice";
import { socketService } from "@/actions/sockets/socketServiceAction";

export function useNavNotificationCount(userId: string | undefined) {
  const [notificationCount, setNotificationCount] = useState(0);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handler = () => {
      setNotificationCount((prev) => Math.max(0, prev - 1));
      dispatch(decrementUnread());
    };
    window.addEventListener("notification-read", handler);
    return () => window.removeEventListener("notification-read", handler);
  }, []);

  useEffect(() => {
    if (!userId) return;

    let active = true;

    const load = async () => {
      try {
        const res = await fetch(
          API_ENDPOINTS.NOTIFICATIONS.GET_NOTIFICATIONS_BY_USER(userId),
          { credentials: "include" },
        );
        if (!res.ok) return;
        const data = await res.json();
        const list = data.notifications || data || [];
        if (active && Array.isArray(list)) {
          const unread = list.filter((n: any) => !n.isRead).length;
          setNotificationCount(unread);
          dispatch(setUnreadCount(unread));
        }
      } catch {
        if (active) setNotificationCount(0);
      }
    };

    load();

    const offNotifRead = socketService.on("notificationRead", () => {
      if (active) {
        setNotificationCount((prev) => Math.max(0, prev - 1));
        dispatch(decrementUnread());
      }
    });

    const offNewNotifs = socketService.on(
      "newNotifications",
      (data: unknown) => {
        const arr = Array.isArray(data) ? data : [data];
        if (active) {
          setNotificationCount((prev) => {
            const next = prev + arr.length;
            dispatch(setUnreadCount(next));
            return next;
          });
        }
      },
    );

    return () => {
      active = false;
      offNotifRead();
      offNewNotifs();
    };
  }, [userId]);

  return { notificationCount };
}

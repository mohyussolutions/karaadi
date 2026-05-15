"use client";

import { useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";
import { useAppDispatch, useAppSelector } from "@/store/slices/hooks/hooks";
import { setEnabled, setSubscribed, setPermission, setLoading } from "@/store/slices/reducers/pushNotificationSlice";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const SW_KEY = "karaadi:push:enabled";

async function getVapidKey(): Promise<string> {
  const res = await fetch(`${API}/api/push/vapid-public-key`);
  const { publicKey } = await res.json();
  return publicKey;
}

function urlB64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export function usePushNotifications() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { enabled, subscribed, permission, loading } = useAppSelector((s) => s.pushNotification);

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    const perm = Notification.permission;
    dispatch(setPermission(perm));

    if (localStorage.getItem(SW_KEY) === "false") {
      dispatch(setEnabled(false));
      dispatch(setSubscribed(false));
      return;
    }

    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

    navigator.serviceWorker.getRegistration("/sw.js").then((reg) => {
      reg?.pushManager.getSubscription().then((sub) => {
        const active = !!sub && perm === "granted";
        dispatch(setSubscribed(active));
        if (active) dispatch(setEnabled(true));
      });
    });
  }, [dispatch]);

  const subscribe = useCallback(async () => {
    const userId = user?._id || user?.id;
    if (!userId || !("serviceWorker" in navigator) || !("PushManager" in window)) return;
    dispatch(setLoading(true));
    try {
      const perm = await Notification.requestPermission();
      dispatch(setPermission(perm));
      if (perm !== "granted") return;

      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      const vapidKey = await getVapidKey();
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(vapidKey),
      });

      const headers = await getAuthHeaders();
      await fetch(`${API}/api/push/subscribe`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, subscription: sub.toJSON() }),
      });

      localStorage.setItem(SW_KEY, "true");
      dispatch(setEnabled(true));
      dispatch(setSubscribed(true));
    } catch {
      dispatch(setSubscribed(false));
      localStorage.setItem(SW_KEY, "false");
    } finally {
      dispatch(setLoading(false));
    }
  }, [user, dispatch]);

  const unsubscribe = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      if ("serviceWorker" in navigator) {
        const reg = await navigator.serviceWorker.getRegistration("/sw.js");
        const sub = await reg?.pushManager?.getSubscription();
        if (sub) {
          const headers = await getAuthHeaders();
          await fetch(`${API}/api/push/unsubscribe`, {
            method: "POST",
            headers: { ...headers, "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ endpoint: sub.endpoint }),
          });
          await sub.unsubscribe();
        }
      }
      localStorage.setItem(SW_KEY, "false");
      dispatch(setEnabled(false));
      dispatch(setSubscribed(false));
    } catch {
      dispatch(setEnabled(true));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return { enabled, subscribed, permission, loading, subscribe, unsubscribe };
}

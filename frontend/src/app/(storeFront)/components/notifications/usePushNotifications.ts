"use client";

import { useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";
import { useAppDispatch, useAppSelector } from "@/store/slices/hooks/hooks";
import { setEnabled, setSubscribed, setPermission, setLoading } from "@/store/slices/reducers/pushNotificationSlice";
import { toast } from "react-toastify";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export function browserSupportsPush() {
  return (
    typeof window !== "undefined" &&
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  );
}

export function isIOSSafariWithoutPWA() {
  if (typeof window === "undefined") return false;
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (!ios) return false;
  return !(window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone === true);
}

async function getVapidKey(): Promise<string> {
  const res = await fetch(`${API}/api/push/vapid-public-key`);
  const data = await res.json();
  if (!data.publicKey) throw new Error("No VAPID key returned from server");
  return data.publicKey;
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
    if (!browserSupportsPush()) return;
    dispatch(setPermission(Notification.permission));
    navigator.serviceWorker.getRegistration("/sw.js").then((reg) => {
      reg?.pushManager.getSubscription().then((sub) => {
        const active = !!sub && Notification.permission === "granted";
        dispatch(setSubscribed(active));
        if (active) dispatch(setEnabled(true));
      });
    });
  }, [dispatch]);

  const subscribe = useCallback(async () => {
    const userId = user?._id || user?.id;
    if (!userId) { toast.error("Please log in first."); return; }
    if (!browserSupportsPush()) { toast.error("Your browser does not support push notifications."); return; }
    dispatch(setLoading(true));
    try {
      const perm = await Notification.requestPermission();
      dispatch(setPermission(perm));
      if (perm !== "granted") {
        toast.info("Notification permission was not granted.");
        return;
      }
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;
      const vapidKey = await getVapidKey();
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(vapidKey),
      });
      const headers = await getAuthHeaders();
      const res = await fetch(`${API}/api/push/subscribe`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, subscription: sub.toJSON() }),
      });
      if (!res.ok) throw new Error("Server rejected subscription");
      dispatch(setEnabled(true));
      dispatch(setSubscribed(true));
      toast.success("Notifications enabled!");
    } catch {
      dispatch(setSubscribed(false));
      toast.error("Could not enable notifications. Please try again.");
    } finally {
      dispatch(setLoading(false));
    }
  }, [user, dispatch]);

  const unsubscribe = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      if (browserSupportsPush()) {
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
      dispatch(setEnabled(false));
      dispatch(setSubscribed(false));
      toast.success("Notifications turned off.");
    } catch {
      dispatch(setEnabled(true));
      toast.error("Could not turn off notifications. Please try again.");
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return { enabled, subscribed, permission, loading, subscribe, unsubscribe };
}

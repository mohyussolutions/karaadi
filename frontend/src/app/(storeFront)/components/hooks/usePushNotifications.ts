"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";

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
  const [enabled, setEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    setPermission(Notification.permission);

    const stored = localStorage.getItem(SW_KEY);
    if (stored !== "true" || Notification.permission !== "granted") return;

    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

    navigator.serviceWorker.getRegistration("/sw.js").then((reg) => {
      reg?.pushManager.getSubscription().then((sub) => {
        if (sub) {
          setEnabled(true);
        } else {
          localStorage.setItem(SW_KEY, "false");
        }
      });
    });
  }, []);

  const subscribe = useCallback(async () => {
    const userId = user?._id || user?.id;
    if (!userId) return;

    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

    setLoading(true);
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
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
      setEnabled(true);
    } catch {
      setEnabled(false);
      localStorage.setItem(SW_KEY, "false");
    } finally {
      setLoading(false);
    }
  }, [user]);

  const unsubscribe = useCallback(async () => {
    setLoading(true);
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
      setEnabled(false);
    } catch {
      setEnabled(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggle = useCallback(() => {
    if (enabled) unsubscribe();
    else subscribe();
  }, [enabled, subscribe, unsubscribe]);

  return { enabled, permission, loading, toggle, subscribe, unsubscribe };
}

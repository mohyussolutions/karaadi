"use client";

import { useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";
import { useAppDispatch, useAppSelector } from "@/store/slices/hooks/hooks";
import { setEnabled, setSubscribed, setPermission, setLoading } from "@/store/slices/reducers/pushNotificationSlice";
import { toast } from "react-toastify";
import { BASE_API_URL as API } from "@/actions/constant/BASE_API_URL";
import { browserSupportsPush, needsIOSInstallPrompt } from "./mobile/platforms";
import { registerSW, resubscribeOnRenewal } from "./config/sw-registration";

export { browserSupportsPush, needsIOSInstallPrompt as isIOSSafariWithoutPWA };

async function getVapidKey(): Promise<string> {
  const res = await fetch(`${API}/api/push/vapid-public-key`);
  if (!res.ok) throw new Error(`VAPID fetch failed: ${res.status}`);
  const data = await res.json();
  if (!data.publicKey) throw new Error("Server returned no VAPID key");
  return data.publicKey;
}

function urlB64ToUint8Array(base64String: string): Uint8Array {
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
    registerSW().then((reg) => {
      reg?.pushManager.getSubscription().then((sub) => {
        const active = !!sub && Notification.permission === "granted";
        dispatch(setSubscribed(active));
        dispatch(setEnabled(active));
      });
    });
  }, [dispatch]);

  const subscribe = useCallback(async () => {
    const userId = user?._id || user?.id;
    const userToken = (user as any)?.token || (user as any)?.accessToken;
    if (!userId) { toast.error("Please log in first."); return; }
    if (!browserSupportsPush()) { toast.error("Push notifications are not supported in this browser."); return; }
    dispatch(setLoading(true));
    try {
      const perm = await Notification.requestPermission();
      dispatch(setPermission(perm));
      if (perm !== "granted") {
        toast.info("Notification permission was not granted.");
        return;
      }

      await registerSW();
      const reg = await navigator.serviceWorker.ready;
      const existingSub = await reg.pushManager.getSubscription();
      if (existingSub) await existingSub.unsubscribe();

      const vapidKey = await getVapidKey();
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(vapidKey),
      });

      const headers = await getAuthHeaders(userToken);
      const res = await fetch(`${API}/api/push/subscribe`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, subscription: sub.toJSON() }),
      });
      if (!res.ok) throw new Error(`Subscribe API failed: ${res.status}`);
      dispatch(setEnabled(true));
      dispatch(setSubscribed(true));
      toast.success("Notifications enabled!");
      resubscribeOnRenewal(String(userId), headers as Record<string, string>);
    } catch (err) {
      dispatch(setSubscribed(false));
      dispatch(setEnabled(false));
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("permission") || msg.includes("denied")) {
        toast.error("Notification permission was blocked. Please allow it in your browser settings.");
      } else if (msg.includes("VAPID") || msg.includes("vapid") || msg.includes("key")) {
        toast.error("Push service configuration error. Please contact support.");
      } else if (msg.includes("fetch") || msg.includes("network") || msg.includes("Failed")) {
        toast.error("Network error. Please check your connection and try again.");
      } else if (msg.includes("401")) {
        toast.error("Session expired. Please log in again, then enable notifications.");
      } else {
        toast.error(`Could not enable notifications: ${msg}`);
      }
    } finally {
      dispatch(setLoading(false));
    }
  }, [user, dispatch]);

  const unsubscribe = useCallback(async () => {
    const userToken = (user as any)?.token || (user as any)?.accessToken;
    dispatch(setLoading(true));
    try {
      if (browserSupportsPush()) {
        const reg = await navigator.serviceWorker.getRegistration();
        const sub = await reg?.pushManager?.getSubscription();
        if (sub) {
          const headers = await getAuthHeaders(userToken);
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

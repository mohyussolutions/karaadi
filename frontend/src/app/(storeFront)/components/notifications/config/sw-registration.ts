import { BASE_API_URL as API } from "@/actions/constant/BASE_API_URL";

async function getVapidKey(): Promise<string> {
  const res = await fetch(`${API}/api/push/vapid-public-key`);
  if (!res.ok) throw new Error("VAPID fetch failed");
  const data = await res.json();
  if (!data.publicKey) throw new Error("No VAPID key returned");
  return data.publicKey;
}

function urlB64ToUint8Array(b64: string): Uint8Array {
  const pad = "=".repeat((4 - (b64.length % 4)) % 4);
  const base64 = (b64 + pad).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export async function registerSW(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
    return reg;
  } catch {
    return null;
  }
}

export async function resubscribeOnRenewal(userId: string, authHeaders: Record<string, string>) {
  if (!("serviceWorker" in navigator)) return;
  const reg = await navigator.serviceWorker.getRegistration();
  if (!reg) return;

  reg.addEventListener("pushsubscriptionchange", async () => {
    try {
      const vapidKey = await getVapidKey();
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(vapidKey),
      });
      await fetch(`${API}/api/push/subscribe`, {
        method: "POST",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, subscription: sub.toJSON() }),
      });
    } catch {}
  });
}

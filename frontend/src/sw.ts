/// <reference lib="webworker" />

type PushData = {
  title?: string;
  body?: string;
  icon?: string;
  url?: string;
  tag?: string;
};

const sw = self as ServiceWorkerGlobalScope;

sw.addEventListener("install", () => sw.skipWaiting());

sw.addEventListener("activate", (event) =>
  (event as ExtendableEvent).waitUntil(sw.clients.claim()),
);

sw.addEventListener("push", (event) => {
  const e = event as PushEvent;
  if (!e.data) return;
  const data = e.data.json() as PushData;

  (e as ExtendableEvent).waitUntil(
    sw.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      clients.forEach((c) => c.postMessage({ type: "push", data }));
      return sw.registration.showNotification(data.title || "Karaadi", {
        body: data.body || "",
        icon: data.icon || "/logo.jpg",
        badge: "/logo.jpg",
        data: { url: data.url || "/messages" },
        tag: data.tag || "karaadi",
        renotify: true,
        vibrate: [200, 100, 200],
        requireInteraction: false,
      } as NotificationOptions & { vibrate: number[]; badge: string; renotify: boolean });
    }),
  );
});

sw.addEventListener("notificationclick", (event) => {
  const e = event as NotificationEvent;
  e.notification.close();
  const url = (e.notification.data as { url: string })?.url || "/messages";
  e.waitUntil(
    sw.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((list) => {
        const existing = list.find((c) => {
          try {
            const clientUrl = new URL(c.url);
            return clientUrl.pathname.startsWith(url.split("?")[0]);
          } catch {
            return c.url.includes(url);
          }
        });
        if (existing) {
          existing.focus();
          existing.navigate?.(url);
          return;
        }
        return sw.clients.openWindow(url);
      }),
  );
});

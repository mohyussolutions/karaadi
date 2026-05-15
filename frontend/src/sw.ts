/// <reference lib="webworker" />

type PushData = {
  title?: string;
  body?: string;
  icon?: string;
  url?: string;
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
        data: { url: data.url || "/messages" },
        vibrate: [200, 100, 200],
        requireInteraction: false,
      } as NotificationOptions & { vibrate: number[] });
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
        const existing = list.find((c) => c.url.includes(url));
        if (existing) return existing.focus();
        return sw.clients.openWindow(url);
      }),
  );
});

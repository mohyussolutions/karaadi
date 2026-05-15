/// <reference lib="webworker" />

type PushData = {
  title?: string;
  body?: string;
  icon?: string;
  url?: string;
};

(self as ServiceWorkerGlobalScope).addEventListener("install", () =>
  (self as ServiceWorkerGlobalScope).skipWaiting(),
);

(self as ServiceWorkerGlobalScope).addEventListener("activate", (event) =>
  (event as ExtendableEvent).waitUntil(
    (self as ServiceWorkerGlobalScope).clients.claim(),
  ),
);

(self as ServiceWorkerGlobalScope).addEventListener("push", (event) => {
  const e = event as PushEvent;
  if (!e.data) return;
  const data = e.data.json() as PushData;
  (e as ExtendableEvent).waitUntil(
    (self as ServiceWorkerGlobalScope).registration.showNotification(
      data.title || "Karaadi",
      {
        body: data.body || "",
        icon: data.icon || "/logo.jpg",
        data: { url: data.url || "/messages" },
        vibrate: [200, 100, 200],
        requireInteraction: false,
      } as NotificationOptions & { vibrate: number[] },
    ),
  );
});

(self as ServiceWorkerGlobalScope).addEventListener(
  "notificationclick",
  (event) => {
    const e = event as NotificationEvent;
    e.notification.close();
    const url = (e.notification.data as { url: string })?.url || "/messages";
    e.waitUntil(
      (self as ServiceWorkerGlobalScope).clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((list) => {
          const existing = list.find((c) => c.url.includes(url));
          if (existing) return existing.focus();
          return (self as ServiceWorkerGlobalScope).clients.openWindow(url);
        }),
    );
  },
);

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

  let data: PushData = {};
  try {
    data = e.data.json() as PushData;
  } catch {
    data = { title: "Karaadi", body: e.data.text() };
  }

  const options: NotificationOptions = {
    body: data.body || "",
    icon: data.icon || "/logo.jpg",
    data: { url: data.url || "/messages" },
    tag: data.tag || "karaadi",
  };

  (e as ExtendableEvent).waitUntil(
    sw.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      clients.forEach((c) => c.postMessage({ type: "push", data }));
      return sw.registration.showNotification(data.title || "Karaadi", options);
    }),
  );
});

sw.addEventListener("pushsubscriptionchange", (event) => {
  const e = event as ExtendableEvent & {
    oldSubscription?: PushSubscription;
    newSubscription?: PushSubscription;
  };
  e.waitUntil(
    sw.registration.pushManager
      .subscribe({ userVisibleOnly: true, applicationServerKey: e.oldSubscription?.options?.applicationServerKey })
      .catch(() => {}),
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
            return new URL(c.url).pathname.startsWith(url.split("?")[0]);
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

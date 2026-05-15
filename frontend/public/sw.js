/// <reference lib="webworker" />
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("push", (event) => {
    const e = event;
    if (!e.data)
        return;
    const data = e.data.json();
    e.waitUntil(self.registration.showNotification(data.title || "Karaadi", {
        body: data.body || "",
        icon: data.icon || "/logo.jpg",
        data: { url: data.url || "/messages" },
        vibrate: [200, 100, 200],
        requireInteraction: false,
    }));
});
self.addEventListener("notificationclick", (event) => {
    var _a;
    const e = event;
    e.notification.close();
    const url = ((_a = e.notification.data) === null || _a === void 0 ? void 0 : _a.url) || "/messages";
    e.waitUntil(self.clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((list) => {
        const existing = list.find((c) => c.url.includes(url));
        if (existing)
            return existing.focus();
        return self.clients.openWindow(url);
    }));
});

import webpush from "web-push";
import prisma from "src/core/utils/db.ts";

let vapidReady = false;

function ensureVapid(): boolean {
  if (vapidReady) return true;
  const email = process.env.VAPID_EMAIL;
  const pub = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!email || !pub || !priv) {
    console.warn("[push] VAPID env vars not set — push notifications disabled");
    return false;
  }
  webpush.setVapidDetails(`mailto:${email.replace(/^mailto:/, "")}`, pub, priv);
  vapidReady = true;
  return true;
}

export async function sendPushToUser(
  userId: string,
  payload: { title: string; body: string; icon?: string; url?: string; tag?: string },
) {
  if (!ensureVapid()) return;

  const subs = await prisma.pushSubscription.findMany({
    where: { userId, enabled: true },
  });

  if (!subs.length) return;

  const data = JSON.stringify({
    title: payload.title,
    body: payload.body,
    icon: payload.icon ?? "/logo.jpg",
    url: payload.url ?? "/messages",
    tag: payload.tag ?? "karaadi",
  });

  await Promise.allSettled(
    subs.map((sub) =>
      webpush
        .sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          data,
        )
        .catch(async (err: webpush.WebPushError) => {
          if (err.statusCode === 410 || err.statusCode === 404) {
            await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
          } else {
            console.error("[push] send error:", err.statusCode, err.message);
          }
        }),
    ),
  );
}

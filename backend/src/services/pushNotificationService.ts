import webpush from "web-push";
import prisma from "src/core/utils/db.ts";

let vapidReady = false;

function ensureVapid() {
  if (vapidReady) return true;
  const email = process.env.VAPID_EMAIL;
  const pub = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!email || !pub || !priv) return false;
  webpush.setVapidDetails(email, pub, priv);
  vapidReady = true;
  return true;
}

export async function sendPushToUser(
  userId: string,
  payload: { title: string; body: string; icon?: string; url?: string },
) {
  if (!ensureVapid()) return;

  const subs = await prisma.pushSubscription.findMany({
    where: { userId, enabled: true },
  });

  await Promise.allSettled(
    subs.map((sub) =>
      webpush
        .sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify(payload),
        )
        .catch(async (err: webpush.WebPushError) => {
          if (err.statusCode === 410 || err.statusCode === 404) {
            await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
          }
        }),
    ),
  );
}

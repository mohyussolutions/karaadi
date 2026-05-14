import webpush from "web-push";
import prisma from "src/core/utils/db.ts";

webpush.setVapidDetails(
  process.env.VAPID_EMAIL || "mailto:admin@karaadi.com",
  process.env.VAPID_PUBLIC_KEY || "",
  process.env.VAPID_PRIVATE_KEY || "",
);

export async function sendPushToUser(
  userId: string,
  payload: { title: string; body: string; icon?: string; url?: string },
) {
  const subs = await prisma.pushSubscription.findMany({
    where: { userId, enabled: true },
  });

  const results = await Promise.allSettled(
    subs.map((sub) =>
      webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        JSON.stringify(payload),
      ).catch(async (err: webpush.WebPushError) => {
        if (err.statusCode === 410 || err.statusCode === 404) {
          await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
        }
        throw err;
      }),
    ),
  );

  return results;
}

import type { Request, Response } from "express";
import prisma from "src/core/utils/db.ts";

export const getVapidPublicKey = (_req: Request, res: Response) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY || "" });
};

export const subscribe = async (req: Request, res: Response) => {
  const { userId, subscription } = req.body as {
    userId: string;
    subscription: { endpoint: string; keys: { p256dh: string; auth: string } };
  };

  if (!userId || !subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    await prisma.pushSubscription.upsert({
      where: { endpoint: subscription.endpoint },
      update: { userId, p256dh: subscription.keys.p256dh, auth: subscription.keys.auth, enabled: true },
      create: { userId, endpoint: subscription.endpoint, p256dh: subscription.keys.p256dh, auth: subscription.keys.auth },
    });
    return res.json({ ok: true });
  } catch (err: any) {
    if (err?.code === "P2003") {
      return res.status(422).json({ error: "User account not found in database" });
    }
    console.error("[push] subscribe error:", err?.message ?? err);
    return res.status(500).json({ error: "Failed to save subscription" });
  }
};

export const unsubscribe = async (req: Request, res: Response) => {
  const { endpoint } = req.body as { endpoint: string };
  if (!endpoint) return res.status(400).json({ error: "Missing endpoint" });
  try {
    await prisma.pushSubscription.deleteMany({ where: { endpoint } });
  } catch {}
  res.json({ ok: true });
};

export const toggleNotifications = async (req: Request, res: Response) => {
  const { userId, enabled } = req.body as { userId: string; enabled: boolean };
  if (!userId) return res.status(400).json({ error: "Missing userId" });
  try {
    await prisma.pushSubscription.updateMany({ where: { userId }, data: { enabled } });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to toggle notifications" });
  }
};

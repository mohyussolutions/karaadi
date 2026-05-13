import { Request, Response } from "express";
import prisma from "src/core/utils/db.ts";
import { WaafiService } from "src/config/waafiConfig.ts";
import { validateAccountNumber } from "src/core/utils/payment.utils.ts";
import {
  payRef,
  toAccountNo,
  isWaafiApproved,
  PAYMENT_CACHE_TTL,
  DEV_AUTO_SUCCEED_MS,
} from "src/config/payment.constants.ts";
import {
  calculateExpiryDate,
  getDefaultExpiryDate,
} from "src/hooks/useExpire.ts";
import cacheManager from "src/services/redis/cacheManager.ts";

const isDev = process.env.USE_WAAFIPAY_PROD !== "true";

if (isDev) {
  console.warn(
    "[PAYMENT] Running in DEV mode — payments are simulated. Set USE_WAAFIPAY_PROD=true to enable real payments.",
  );
} else {
  console.log(
    "[PAYMENT] Running in PRODUCTION mode — real Waafi API calls will be made.",
  );
}

const AD_MODELS = [
  { name: "boat", fk: "boatId" },
  { name: "car", fk: "carId" },
  { name: "marketplace", fk: "marketplaceId" },
  { name: "realEstate", fk: "realEstateId" },
  { name: "motorcycle", fk: "motorcycleId" },
  { name: "farmequipment", fk: "farmequipmentId" },
  { name: "job", fk: "jobId" },
] as const;

async function markAdPaid(
  adId: string,
  planId: string | undefined,
  amount: number,
  paymentRef: string,
  paymentMethod: string,
  payerPhone?: string,
) {
  for (const { name, fk } of AD_MODELS) {
    const ad = await (prisma as any)[name].findFirst({
      where: { id: adId },
      select: { id: true, userId: true, planAmount: true, planId: true },
    });
    if (!ad) continue;

    console.log(
      `[PAYMENT] markAdPaid found adId=${adId} model=${name} userId=${ad.userId}`,
    );

    const subPlan = await prisma.subPlan.findFirst({
      where: { isActive: true },
    });

    const effectivePlanId = planId || ad.planId;
    let validPlanId: string | undefined;
    if (effectivePlanId) {
      const exists = await prisma.subPlan
        .findUnique({ where: { id: effectivePlanId }, select: { id: true } })
        .catch(() => null);
      validPlanId = exists ? effectivePlanId : undefined;
      if (!exists)
        console.warn(
          `[PAYMENT] planId=${effectivePlanId} not in SubPlan — skipping`,
        );
    }

    const planAmount: number = ad.planAmount ?? 0;
    const expiryDate =
      subPlan && planAmount > 0
        ? calculateExpiryDate(subPlan, planAmount)
        : getDefaultExpiryDate();

    const isBasic30 = subPlan ? planAmount === subPlan.basic30 : false;
    const isStandard60 = subPlan ? planAmount === subPlan.standard60 : false;
    const isPremium90 = subPlan ? planAmount === subPlan.premium90 : false;

    await (prisma as any)[name].update({
      where: { id: adId },
      data: {
        isPaid: true,
        expiryDate,
        isBasic30,
        isStandard60,
        isPremium90,
        ...(planAmount > 0 ? { planAmount } : {}),
        ...(validPlanId ? { planId: validPlanId } : {}),
        updatedAt: new Date(),
      },
    });

    console.log(
      `[PAYMENT] markAdPaid isPaid=true expiryDate=${expiryDate?.toISOString()} for adId=${adId}`,
    );

    await Promise.all([
      cacheManager.delete(`user:ads:${ad.userId}`),
      cacheManager.deletePattern(`${name}:*`),
    ]).catch(() => {});

    await prisma.payment
      .create({
        data: {
          userId: ad.userId,
          transactionId: paymentRef,
          paymentMethod,
          payerPhone: payerPhone || null,
          totalAmount: amount,
          planAmount: planAmount || undefined,
          status: "COMPLETED",
          paidAt: new Date(),
          [fk]: adId,
        },
      })
      .catch((err: any) => {
        console.warn(
          `[PAYMENT] payment.create failed (ad already updated):`,
          err?.message,
        );
      });

    return true;
  }
  console.warn(`[PAYMENT] markAdPaid: adId=${adId} not found in any model`);
  return false;
}

function logWaafiError(label: string, ref: string, err: unknown) {
  let detail: string;
  try {
    detail =
      typeof (err as any)?.message === "string"
        ? (err as any).message
        : JSON.stringify(err);
  } catch {
    detail = String(err);
  }
  console.error(`[PAYMENT] ${label} ref=${ref} error:`, detail);
}

export async function waafiInitiate(req: Request, res: Response) {
  try {
    const { phone, amount, adId, planId } = req.body;

    if (!phone || !amount || !adId) {
      return res
        .status(400)
        .json({ error: "phone, amount and adId are required" });
    }

    const accountNo = toAccountNo(phone);
    if (!validateAccountNumber(accountNo)) {
      return res.status(400).json({
        error:
          "Invalid phone number. Enter your 9-digit Waafi number (e.g. 61XXXXXXX)",
      });
    }

    const ref = payRef();
    console.log(
      `[PAYMENT] waafiInitiate ref=${ref} accountNo=${accountNo} amount=${amount}`,
    );

    if (isDev) {
      await cacheManager.set(
        `payment:${ref}`,
        { status: "pending", adId, planId },
        PAYMENT_CACHE_TTL,
      );
      setTimeout(async () => {
        await markAdPaid(
          adId,
          planId,
          Number(amount),
          ref,
          "waafi",
          phone,
        ).catch((err) => logWaafiError("markAdPaid dev waafi", ref, err));
        await cacheManager.set(
          `payment:${ref}`,
          { status: "success", adId, planId },
          PAYMENT_CACHE_TTL,
        );
      }, DEV_AUTO_SUCCEED_MS);
      return res.status(201).json({ paymentRef: ref });
    }

    await cacheManager.set(
      `payment:${ref}`,
      { status: "pending", adId, planId },
      PAYMENT_CACHE_TTL,
    );
    res.status(201).json({ paymentRef: ref });

    const waafi = new WaafiService();
    waafi
      .processPayment(accountNo, Number(amount), "Karaadi listing payment", ref)
      .then(async (result) => {
        const approved = isWaafiApproved(result);
        const status = approved ? "success" : "failed";
        console.log(
          `[PAYMENT] waafiInitiate ref=${ref} responseCode=${result?.responseCode} state=${result?.params?.state} status=${status}`,
        );
        if (approved) {
          await markAdPaid(
            adId,
            planId,
            Number(amount),
            ref,
            "waafi",
            phone,
          ).catch((err) => logWaafiError("markAdPaid waafi", ref, err));
        }
        await cacheManager.set(
          `payment:${ref}`,
          { status, adId, planId },
          PAYMENT_CACHE_TTL,
        );
      })
      .catch(async (err) => {
        logWaafiError("waafiInitiate processPayment failed", ref, err);
        await cacheManager.set(
          `payment:${ref}`,
          { status: "failed", adId, planId },
          PAYMENT_CACHE_TTL,
        );
      });
  } catch (err: any) {
    let msg = "Failed to initiate payment";
    try {
      msg = JSON.parse(err.message)?.message || msg;
    } catch {}
    logWaafiError("waafiInitiate caught", "unknown", err);
    if (!res.headersSent) res.status(500).json({ error: msg });
  }
}

export async function waafiStatus(req: Request, res: Response) {
  try {
    const { ref } = req.params;
    const cached = await cacheManager.get(`payment:${ref}`);
    if (cached) return res.json(cached);

    const payment = await prisma.payment.findFirst({
      where: { transactionId: String(ref) },
      select: { status: true },
    }).catch(() => null);

    if (payment) {
      return res.json({ status: payment.status === "COMPLETED" ? "success" : "failed" });
    }
    return res.json({ status: "pending" });
  } catch {
    return res.json({ status: "pending" });
  }
}

export async function mobileInitiate(req: Request, res: Response) {
  try {
    const { phone, amount, adId, planId, provider } = req.body;

    if (!phone || !amount || !adId) {
      return res
        .status(400)
        .json({ error: "phone, amount and adId are required" });
    }

    const accountNo = toAccountNo(phone);
    if (!validateAccountNumber(accountNo)) {
      return res.status(400).json({
        error:
          "Invalid phone number. Enter your 9-digit number (e.g. 61XXXXXXX for EVC, 63XXXXXXX for Zaad)",
      });
    }

    const ref = payRef();
    console.log(
      `[PAYMENT] mobileInitiate ref=${ref} provider=${provider} accountNo=${accountNo} amount=${amount}`,
    );

    if (isDev) {
      await cacheManager.set(
        `payment:${ref}`,
        { status: "pending", adId, planId, provider },
        PAYMENT_CACHE_TTL,
      );
      setTimeout(async () => {
        await markAdPaid(
          adId,
          planId,
          Number(amount),
          ref,
          provider || "mobile",
          phone,
        ).catch((err) => logWaafiError("markAdPaid dev mobile", ref, err));
        await cacheManager.set(
          `payment:${ref}`,
          { status: "success", adId, planId },
          PAYMENT_CACHE_TTL,
        );
      }, DEV_AUTO_SUCCEED_MS);
      return res.status(201).json({ paymentRef: ref });
    }

    await cacheManager.set(
      `payment:${ref}`,
      { status: "pending", adId, planId, provider },
      PAYMENT_CACHE_TTL,
    );
    res.status(201).json({ paymentRef: ref });

    const waafi = new WaafiService();
    waafi
      .processPayment(accountNo, Number(amount), "Karaadi listing payment", ref)
      .then(async (result) => {
        const approved = isWaafiApproved(result);
        const status = approved ? "success" : "failed";
        console.log(
          `[PAYMENT] mobileInitiate ref=${ref} provider=${provider} responseCode=${result?.responseCode} state=${result?.params?.state} status=${status}`,
        );
        if (approved) {
          await markAdPaid(
            adId,
            planId,
            Number(amount),
            ref,
            provider || "mobile",
            phone,
          ).catch((err) => logWaafiError("markAdPaid mobile", ref, err));
        }
        await cacheManager.set(
          `payment:${ref}`,
          { status, adId, planId, provider },
          PAYMENT_CACHE_TTL,
        );
      })
      .catch(async (err) => {
        logWaafiError(
          `mobileInitiate processPayment failed provider=${provider}`,
          ref,
          err,
        );
        await cacheManager.set(
          `payment:${ref}`,
          { status: "failed", adId, planId, provider },
          PAYMENT_CACHE_TTL,
        );
      });
  } catch (err) {
    logWaafiError("mobileInitiate caught", "unknown", err);
    if (!res.headersSent)
      res.status(500).json({ error: "Failed to initiate mobile payment" });
  }
}

export async function mobileStatus(req: Request, res: Response) {
  try {
    const { ref } = req.params;
    const cached = await cacheManager.get(`payment:${ref}`);
    if (cached) return res.json(cached);

    const payment = await prisma.payment.findFirst({
      where: { transactionId: String(ref) },
      select: { status: true },
    }).catch(() => null);

    if (payment) {
      return res.json({ status: payment.status === "COMPLETED" ? "success" : "failed" });
    }
    return res.json({ status: "pending" });
  } catch {
    return res.json({ status: "pending" });
  }
}

"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/store/slices/hooks/hooks";
import { resetFlow } from "@/store/slices/reducers/listingDraftSlice";
import { postToFacebook, postToTikTok } from "@/actions/categories/socialPostAction";
import { useIsValidPhone } from "@/app/(storeFront)/components/hooks/useIsValidPhone";
import {
  MAX_POLL_ATTEMPTS,
  POLL_INTERVAL_MS,
  WAAFI_INITIATE_URL,
  WAAFI_STATUS_URL,
  MOBILE_INITIATE_URL,
  MOBILE_STATUS_URL,
  AD_PATCH_URL,
} from "./constants";
import type { PaymentStatus } from "./constants";
import { getDetailRoute } from "@/app/utils/getDetailRoute";
import type { UsePaymentProps } from "@/app/utils/types/payment.types";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";

export function usePayment({
  item,
  plan,
  paymentMethod,
  phoneNumber,
  setPhoneError,
}: UsePaymentProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [processing, setProcessing] = useState(false);
  const [pollAttempt, setPollAttempt] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [shareUrl, setShareUrl] = useState("");
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const planPrice = plan?.price || 0;
  const itemFee = item.feeAmount || 0;
  const total = itemFee + planPrice;

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  const handleRetry = useCallback(() => {
    stopPolling();
    setPollAttempt(0);
    setPaymentStatus("idle");
    setProcessing(false);
  }, [stopPolling]);

  const handlePayment = async () => {
    if (total === 0) {
      setProcessing(true);
      try {
        const headers = await getAuthHeaders();
        const res = await fetch(AD_PATCH_URL(item.id), {
          method: "PATCH",
          headers: { ...(headers as any), "Content-Type": "application/json" },
          body: JSON.stringify({ isPaid: true, planId: plan?.id }),
        });
        if (!res.ok) throw new Error();
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        const itemPath = getDetailRoute({ mainCategory: item.mainCategory, id: item.id || "", category: item.category || "" } as any);
        const listingUrl = `${origin}${itemPath}`;
        setShareUrl(listingUrl);
        setPaymentStatus("success");
        toast.success(t("payment.success", "Payment successful! Your listing is now live."));
        const socialPayload = {
          title: item.title || "",
          description: item.description || "",
          price: item.price || 0,
          imageUrl: Array.isArray(item.images) && item.images[0] ? item.images[0] : undefined,
          listingUrl,
          category: item.mainCategory || item.category || "",
        };
        postToFacebook(socialPayload);
        postToTikTok(socialPayload);
        setTimeout(() => { dispatch(resetFlow()); router.push("/"); }, 25000);
      } catch {
        setProcessing(false);
        setPaymentStatus("failed");
        toast.error(t("payment.error", "Payment failed. Please try again."));
      }
      return;
    }

    if (!useIsValidPhone(phoneNumber)) {
      setPhoneError(
        t(
          "payment.phoneError",
          "Enter your number as +252 61XXXXXXX (Waafi/EVC), +252 63XXXXXXX (Zaad), or +252 68XXXXXXX (E-Dahab)",
        ),
      );
      return;
    }
    setPhoneError("");
    setProcessing(true);
    setPollAttempt(0);
    setPaymentStatus("polling");

    try {
      const isWaafi = paymentMethod === "waafi";
      const initiateEndpoint = isWaafi
        ? WAAFI_INITIATE_URL
        : MOBILE_INITIATE_URL;
      const initiateBody = isWaafi
        ? { adId: item.id, planId: plan?.id, amount: total, phone: phoneNumber }
        : {
            provider: paymentMethod,
            phone: phoneNumber,
            amount: total,
            adId: item.id,
            planId: plan?.id,
          };

      const authHeaders = await getAuthHeaders();
      const initiateRes = await fetch(initiateEndpoint, {
        method: "POST",
        headers: { ...(authHeaders as any), "Content-Type": "application/json" },
        body: JSON.stringify(initiateBody),
      });

      if (!initiateRes.ok) {
        let errMsg = t(
          "payment.initiateError",
          "Failed to initiate payment. Please try again.",
        );
        try {
          const errData = await initiateRes.json();
          if (errData?.message) errMsg = errData.message;
          else if (errData?.error) errMsg = errData.error;
        } catch {}
        setProcessing(false);
        setPaymentStatus("failed");
        toast.error(errMsg);
        return;
      }

      const initiateData = await initiateRes.json();
      const ref: string = initiateData.paymentRef;
      let attempts = 0;

      pollIntervalRef.current = setInterval(async () => {
        attempts += 1;
        setPollAttempt(attempts);

        if (attempts > MAX_POLL_ATTEMPTS) {
          stopPolling();
          setProcessing(false);
          setPaymentStatus("failed");
          toast.error(
            t(
              "payment.timeout",
              "Payment confirmation timed out. Please try again.",
            ),
          );
          return;
        }

        try {
          const statusUrl = isWaafi
            ? WAAFI_STATUS_URL(ref)
            : MOBILE_STATUS_URL(ref);
          const statusRes = await fetch(statusUrl);
          const statusData = await statusRes.json();

          if (statusData.status === "success") {
            stopPolling();
            setProcessing(false);
            const origin =
              typeof window !== "undefined" ? window.location.origin : "";
            const itemPath2 = getDetailRoute({ mainCategory: item.mainCategory, id: item.id || "", category: item.category || "" } as any);
            const listingUrl2 = `${origin}${itemPath2}`;
            setShareUrl(listingUrl2);
            setPaymentStatus("success");
            toast.success(
              t(
                "payment.success",
                "Payment successful! Your listing is now live.",
              ),
            );
            const socialPayload2 = {
              title: item.title || "",
              description: item.description || "",
              price: item.price || 0,
              imageUrl:
                Array.isArray(item.images) && item.images[0]
                  ? item.images[0]
                  : undefined,
              listingUrl: listingUrl2,
              category: item.mainCategory || item.category || "",
            };
            postToFacebook(socialPayload2);
            postToTikTok(socialPayload2);
            setTimeout(() => { dispatch(resetFlow()); router.push("/"); }, 25000);
          } else if (statusData.status === "failed") {
            stopPolling();
            setPaymentStatus("failed");
            setProcessing(false);
            toast.error(
              t("payment.declined", "Payment was declined. Please try again."),
            );
          }
        } catch {
          stopPolling();
          setProcessing(false);
          setPaymentStatus("failed");
          toast.error(t("payment.error", "Payment failed. Please try again."));
        }
      }, POLL_INTERVAL_MS);
    } catch {
      setProcessing(false);
      setPaymentStatus("failed");
      toast.error(t("payment.error", "Payment failed. Please try again."));
    }
  };

  return {
    processing,
    pollAttempt,
    paymentStatus,
    shareUrl,
    total,
    planPrice,
    itemFee,
    stopPolling,
    handleRetry,
    handlePayment,
  };
}

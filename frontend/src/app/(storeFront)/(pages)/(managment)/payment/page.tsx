"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useAppSelector, useAppDispatch } from "@/store/slices/hooks/hooks";
import { clearDraft } from "@/store/slices/reducers/listingDraftSlice";
import CheckoutSteps from "@/app/(storeFront)/components/checkout/CheckoutSteps";
import Image from "next/image";
import {
  FaListAlt,
  FaMapMarkerAlt,
  FaCar,
  FaPalette,
  FaCalendarAlt,
  FaTachometerAlt,
  FaTag,
  FaFileAlt,
  FaMobileAlt,
  FaCheckCircle,
  FaImage,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import {
  PAYMENT_METHODS,
  PHONE_PREFIX,
  MAX_POLL_ATTEMPTS,
  POLL_INTERVAL_MS,
  SUCCESS_REDIRECT_DELAY_MS,
  WAAFI_INITIATE_URL,
  WAAFI_STATUS_URL,
  MOBILE_INITIATE_URL,
  MOBILE_STATUS_URL,
  AD_PATCH_URL,
} from "./constants";
import type { PaymentMethod, PaymentStatus } from "./constants";

const isValidPhone = (phone: string): boolean => {
  if (!phone.startsWith(PHONE_PREFIX)) return false;
  const afterPlus = phone.slice(1);
  return afterPlus.length === 12 && /^\d+$/.test(afterPlus);
};

export default function SummaryPaymentPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { item, plan } = useAppSelector((state) => state.listingDraft);
  const { user, loading: authLoading } = useAuth
    ? useAuth()
    : { user: null, loading: false };

  useEffect(() => {
    if (authLoading) return;
    if (!user || !plan) {
      router.push("/login");
    }
  }, [user, plan, authLoading, router]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const images: string[] = Array.isArray(item.images)
    ? item.images.slice(0, 10)
    : [];
  const [slideIndex, setSlideIndex] = useState(0);
  const prevSlide = () =>
    setSlideIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextSlide = () =>
    setSlideIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("waafi");
  const [phoneNumber, setPhoneNumber] = useState(PHONE_PREFIX);
  const [phoneError, setPhoneError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [pollAttempt, setPollAttempt] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");

  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      setPhoneNumber("");
      stopPolling();
    };
  }, [stopPolling]);

  const planPrice = plan?.price || 0;
  const itemFee = item.feeAmount || 0;
  const total = itemFee + planPrice;

  const handleRetry = () => {
    stopPolling();
    setPollAttempt(0);
    setPaymentStatus("idle");
    setProcessing(false);
  };

  const handlePayment = async () => {
    if (!isValidPhone(phoneNumber)) {
      setPhoneError(
        t(
          "payment.phoneError",
          "Phone must start with +252 and contain 12 digits (e.g. +252XXXXXXXXX)",
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

      const initiateRes = await fetch(initiateEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
            const patchRes = await fetch(AD_PATCH_URL(item.id), {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                isPaid: true,
                planId: plan?.id,
                waafiPaymentRef: ref,
              }),
            });

            if (patchRes.ok) {
              setPaymentStatus("success");
              setProcessing(false);
              toast.success(
                t(
                  "payment.success",
                  "Payment successful! Your listing is now live.",
                ),
              );
              dispatch(clearDraft());
              setTimeout(() => router.push("/"), SUCCESS_REDIRECT_DELAY_MS);
            } else {
              setPaymentStatus("failed");
              setProcessing(false);
              toast.error(
                t(
                  "payment.patchError",
                  "Payment confirmed but listing update failed. Contact support.",
                ),
              );
            }
          } else if (statusData.status === "failed") {
            stopPolling();
            setPaymentStatus("failed");
            setProcessing(false);
            toast.error(
              t("payment.declined", "Payment was declined. Please try again."),
            );
          }
        } catch {}
      }, POLL_INTERVAL_MS);
    } catch {
      setProcessing(false);
      setPaymentStatus("failed");
      toast.error(t("payment.error", "Payment failed. Please try again."));
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="w-full max-w-7xl mx-auto">
        <CheckoutSteps step1 step2 step3 step4 />

        <header className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
            <FaListAlt
              className="inline-block mr-2 mb-1 text-blue-500"
              size={40}
            />
            {t("summary.review", "Review")} & {t("payment.payment", "Payment")}
          </h1>
          <p className="text-gray-500 mt-1 text-lg">
            {t(
              "summary.verifyDetails",
              "Verify your listing and complete payment",
            )}
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/3 rounded-2xl border border-gray-200 overflow-hidden h-fit bg-gray-50">
            <div className="p-5 border-b border-gray-200 bg-white">
              <h2 className="font-black text-xl text-gray-900 flex items-center gap-2">
                <FaListAlt className="text-blue-600" size={20} />
                {t("summary.listingSummary", "Listing Summary")}
              </h2>
            </div>

            <div className="border-b border-gray-200">
              {images.length > 0 ? (
                <>
                  <div className="relative w-full h-64 bg-black select-none">
                    <Image
                      key={slideIndex}
                      src={images[slideIndex]}
                      alt={`Photo ${slideIndex + 1}`}
                      fill
                      className="object-contain"
                    />
                    {images.length > 1 && (
                      <button
                        onClick={prevSlide}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition z-10"
                      >
                        <FaChevronLeft size={14} />
                      </button>
                    )}
                    {images.length > 1 && (
                      <button
                        onClick={nextSlide}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition z-10"
                      >
                        <FaChevronRight size={14} />
                      </button>
                    )}
                    <span className="absolute top-3 right-3 bg-black/60 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                      {slideIndex + 1} / {images.length}
                    </span>
                  </div>
                  {images.length > 1 && (
                    <div className="flex gap-2 p-3 overflow-x-auto bg-gray-50 scrollbar-hide">
                      {images.map((src, i) => (
                        <button
                          key={i}
                          onClick={() => setSlideIndex(i)}
                          className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                            i === slideIndex
                              ? "border-blue-500 ring-2 ring-blue-100"
                              : "border-gray-200 opacity-60 hover:opacity-100"
                          }`}
                        >
                          <Image
                            src={src}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-48 bg-gray-100 flex flex-col items-center justify-center text-gray-300 gap-2">
                  <FaImage size={32} />
                  <span className="text-xs font-medium text-gray-400">
                    No images uploaded
                  </span>
                </div>
              )}

              <div className="px-5 py-4">
                <h3 className="font-black text-lg text-gray-900 leading-snug">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm mt-0.5">
                  {item.category}{" "}
                  {item.subCategory ? `• ${item.subCategory}` : ""}
                </p>
              </div>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {item.make && (
                  <div className="bg-gray-100 p-3 rounded-xl flex items-center gap-2">
                    <FaTag className="text-blue-400" size={14} />
                    <div>
                      <span className="text-gray-500 block text-xs uppercase tracking-wider">
                        {t("summary.make", "Make")}
                      </span>
                      <span className="font-bold text-gray-900">
                        {item.make}
                      </span>
                    </div>
                  </div>
                )}
                {(item.modelName || item.boatModel || item.model) && (
                  <div className="bg-gray-100 p-3 rounded-xl flex items-center gap-2">
                    <FaCar className="text-blue-400" size={14} />
                    <div>
                      <span className="text-gray-500 block text-xs uppercase tracking-wider">
                        {t("summary.model", "Model")}
                      </span>
                      <span className="font-bold text-gray-900">
                        {item.modelName || item.boatModel || item.model}
                      </span>
                    </div>
                  </div>
                )}
                {item.year && (
                  <div className="bg-gray-100 p-3 rounded-xl flex items-center gap-2">
                    <FaCalendarAlt className="text-blue-400" size={14} />
                    <div>
                      <span className="text-gray-500 block text-xs uppercase tracking-wider">
                        {t("summary.year", "Year")}
                      </span>
                      <span className="font-bold text-gray-900">
                        {item.year}
                      </span>
                    </div>
                  </div>
                )}
                {item.mileage && (
                  <div className="bg-gray-100 p-3 rounded-xl flex items-center gap-2">
                    <FaTachometerAlt className="text-blue-400" size={14} />
                    <div>
                      <span className="text-gray-500 block text-xs uppercase tracking-wider">
                        {t("summary.mileage", "Mileage")}
                      </span>
                      <span className="font-bold text-gray-900">
                        {item.mileage} km
                      </span>
                    </div>
                  </div>
                )}
                {item.type && (
                  <div className="bg-gray-100 p-3 rounded-xl flex items-center gap-2">
                    <FaFileAlt className="text-blue-400" size={14} />
                    <div>
                      <span className="text-gray-500 block text-xs uppercase tracking-wider">
                        {t("summary.type", "Type")}
                      </span>
                      <span className="font-bold text-gray-900">
                        {item.type}
                      </span>
                    </div>
                  </div>
                )}
                {item.color && (
                  <div className="bg-gray-100 p-3 rounded-xl flex items-center gap-2">
                    <FaPalette className="text-blue-400" size={14} />
                    <div>
                      <span className="text-gray-500 block text-xs uppercase tracking-wider">
                        {t("summary.color", "Color")}
                      </span>
                      <span className="font-bold text-gray-900">
                        {item.color}
                      </span>
                    </div>
                  </div>
                )}
                <div className="bg-gray-100 p-3 rounded-xl flex items-center gap-2">
                  <FaMapMarkerAlt className="text-blue-400" size={14} />
                  <div>
                    <span className="text-gray-500 block text-xs uppercase tracking-wider">
                      {t("summary.location", "Location")}
                    </span>
                    <span className="font-bold text-gray-900">{item.city}</span>
                  </div>
                </div>
                <div className="bg-gray-100 p-3 rounded-xl flex items-center gap-2">
                  <FaTag className="text-blue-400" size={14} />
                  <div>
                    <span className="text-gray-500 block text-xs uppercase tracking-wider">
                      {t("summary.price", "Price")}
                    </span>
                    <span className="font-bold text-gray-900">
                      ${Number(item.price || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {item.description && (
                <div className="bg-gray-100 p-4 rounded-xl mt-4">
                  <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">
                    {t("summary.description", "Description")}
                  </span>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              )}
            </div>

            <div className="p-5 bg-white border-t border-gray-200">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {t("summary.itemPrice", "Item Price")}
                  </span>
                  <span className="font-bold">
                    ${Number(item.price || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {t("summary.listingFee", "Listing Fee")}
                  </span>
                  <span className="font-bold">${itemFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {t("summary.planPrice", "Plan Price")} ({plan?.days || 30}{" "}
                    days)
                  </span>
                  <span className="font-bold">
                    ${planPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-300">
                  <span className="font-black text-lg">
                    {t("summary.total", "Total")}
                  </span>
                  <span className="font-black text-2xl text-blue-600">
                    ${total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/3 rounded-2xl border border-gray-200 overflow-hidden h-fit bg-white relative">
            {processing && paymentStatus === "polling" && (
              <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center rounded-2xl z-50">
                <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full" />
                <p className="mt-5 font-black text-gray-800 text-base">
                  {t(
                    "payment.waitingConfirmation",
                    "Waiting for confirmation...",
                  )}
                </p>
                <p className="mt-1 text-sm font-medium text-gray-500">
                  {t("payment.attempt", "Attempt")} {pollAttempt}{" "}
                  {t("payment.of", "of")} {MAX_POLL_ATTEMPTS}
                </p>
              </div>
            )}

            {paymentStatus === "success" && (
              <div className="absolute inset-0 bg-white flex flex-col items-center justify-center rounded-2xl z-50">
                <FaCheckCircle
                  className="text-green-500 animate-bounce"
                  size={64}
                />
                <p className="mt-4 font-black text-green-600 text-xl">
                  {t("payment.successTitle", "Payment Successful!")}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {t("payment.redirecting", "Redirecting...")}
                </p>
              </div>
            )}

            <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h2 className="font-black text-lg text-gray-900 flex items-center gap-2">
                <FaMobileAlt className="text-blue-600" size={18} />
                {t("payment.paymentDetails", "Payment Details")}
              </h2>
            </div>

            <div className="p-5">
              <div className="text-center mb-5 p-4 bg-blue-50 rounded-xl">
                <p className="text-gray-500 text-sm mb-1">
                  {t("payment.totalAmount", "Total Amount")}
                </p>
                <p className="text-3xl font-black text-blue-600">
                  ${total.toLocaleString()}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-3">
                    {t("payment.selectMethod", "Payment Method")}
                  </label>
                  <div className="space-y-2">
                    {PAYMENT_METHODS.map((method) => (
                      <label
                        key={method.key}
                        className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${
                          paymentMethod === method.key
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.key}
                          checked={paymentMethod === method.key}
                          onChange={() => setPaymentMethod(method.key)}
                          className="w-4 h-4 accent-blue-600"
                        />
                        <FaMobileAlt
                          className={
                            paymentMethod === method.key
                              ? "text-blue-600"
                              : "text-gray-400"
                          }
                          size={16}
                        />
                        <span
                          className={`font-bold text-sm flex-1 ${
                            paymentMethod === method.key
                              ? "text-gray-900"
                              : "text-gray-600"
                          }`}
                        >
                          {method.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider">
                    {t("payment.phoneNumber", "Phone Number")}
                  </label>
                  <input
                    type="tel"
                    placeholder="+252XXXXXXXXX"
                    value={phoneNumber}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val.startsWith(PHONE_PREFIX)) return;
                      setPhoneNumber(val);
                      if (phoneError && isValidPhone(val)) setPhoneError("");
                    }}
                    className={`w-full px-3 py-2.5 border-2 rounded-lg text-sm font-medium outline-none transition-all ${
                      phoneError
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                  />
                  {phoneError && (
                    <p className="text-red-500 text-xs font-bold mt-1">
                      {phoneError}
                    </p>
                  )}
                </div>

                {paymentStatus === "failed" && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-red-700 font-bold text-sm mb-3">
                      {t(
                        "payment.failedMessage",
                        "Payment failed. Please check your phone and try again.",
                      )}
                    </p>
                    <button
                      onClick={handleRetry}
                      className="w-full py-2 bg-red-600 text-white font-black text-sm rounded-lg hover:bg-red-700 transition"
                    >
                      {t("payment.retry", "Retry Payment")}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 border-t border-gray-200">
              <div className="flex gap-2 mb-3">
                <button
                  onClick={handleBack}
                  className="px-4 py-2.5 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition text-sm"
                >
                  ← {t("common.back", "Back")}
                </button>
                <button
                  onClick={handlePayment}
                  disabled={processing || paymentStatus === "success"}
                  className="flex-1 py-2.5 bg-blue-600 text-white font-black rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-md shadow-blue-100"
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      {t("payment.processing", "Processing...")}
                    </span>
                  ) : (
                    `${t("payment.pay", "Pay")} $${total.toLocaleString()}`
                  )}
                </button>
              </div>
              <p className="text-xs text-center text-gray-400 font-medium">
                🔒{" "}
                {t(
                  "payment.secureNotice",
                  "Your payment information is encrypted and secure.",
                )}
                ure{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

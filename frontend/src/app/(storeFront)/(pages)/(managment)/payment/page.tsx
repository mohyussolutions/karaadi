"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useAppSelector, useAppDispatch } from "@/store/slices/hooks/hooks";
import { resetFlow } from "@/store/slices/reducers/listingDraftSlice";
import CheckoutSteps from "@/app/(storeFront)/components/checkout/CheckoutSteps";
import SocialShareModal from "./SocialShareModal";
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
  FaLock,
} from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import {
  PAYMENT_METHODS,
  MAX_POLL_ATTEMPTS,
  POLL_INTERVAL_MS,
  WAAFI_INITIATE_URL,
  WAAFI_STATUS_URL,
  MOBILE_INITIATE_URL,
  MOBILE_STATUS_URL,
} from "./constants";
import type { PaymentMethod, PaymentStatus } from "./constants";

const isValidPhone = (phone: string): boolean => {
  const clean = phone.replace(/\s/g, "");
  if (clean.startsWith("+252")) return /^\+252\d{9}$/.test(clean);
  if (clean.startsWith("6")) return /^6\d{8}$/.test(clean);
  return false;
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
    if (!user || !plan || !item.id) router.push("/");
  }, [user, plan, item.id, authLoading, router]);

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

  const [showSocialModal, setShowSocialModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("waafi");
  const userPhone: string = (user as any)?.phone || "";
  const [phoneNumber, setPhoneNumber] = useState(
    userPhone && (userPhone.startsWith("+252") || userPhone.startsWith("6")) ? userPhone : "",
  );
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
            setPaymentStatus("success");
            setProcessing(false);
            toast.success(
              t("payment.success", "Payment successful! Your listing is now live."),
            );
            setShowSocialModal(true);
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

  const handleSocialDone = () => {
    setShowSocialModal(false);
    dispatch(resetFlow());
    router.push("/");
  };

  const handleBack = () => router.back();

  if (!mounted) return null;

  return (
    <>
      {showSocialModal && (
        <SocialShareModal
          itemId={item.id || ""}
          itemTitle={item.title || ""}
          onDone={handleSocialDone}
        />
      )}

      <div className="min-h-screen bg-gray-50/60 py-8 px-4">
        <div className="w-full max-w-6xl mx-auto">
          <CheckoutSteps step1 step2 step3 step4 />

          <header className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 flex items-center justify-center gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white">
                <FaListAlt size={18} />
              </span>
              {t("summary.review", "Review")} &amp;{" "}
              {t("payment.payment", "Payment")}
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              {t(
                "summary.verifyDetails",
                "Verify your listing and complete payment",
              )}
            </p>
          </header>

          <div className="flex flex-col lg:flex-row gap-5 items-start">
            <div className="lg:w-2/3 bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-bold text-base text-gray-900 flex items-center gap-2">
                  <FaListAlt className="text-blue-500" size={15} />
                  {t("summary.listingSummary", "Listing Summary")}
                </h2>
              </div>

              {images.length > 0 ? (
                <>
                  <div className="relative w-full h-64 bg-gray-900 select-none">
                    <Image
                      key={slideIndex}
                      src={images[slideIndex]}
                      alt={`Photo ${slideIndex + 1}`}
                      fill
                      className="object-contain"
                    />
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevSlide}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition z-10"
                        >
                          <FaChevronLeft size={12} />
                        </button>
                        <button
                          onClick={nextSlide}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition z-10"
                        >
                          <FaChevronRight size={12} />
                        </button>
                      </>
                    )}
                    <span className="absolute top-3 right-3 bg-black/55 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      {slideIndex + 1} / {images.length}
                    </span>
                  </div>
                  {images.length > 1 && (
                    <div className="flex gap-2 px-4 py-3 overflow-x-auto bg-gray-50 border-b border-gray-100 scrollbar-hide">
                      {images.map((src, i) => (
                        <button
                          key={i}
                          onClick={() => setSlideIndex(i)}
                          className={`relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                            i === slideIndex
                              ? "border-blue-500 ring-2 ring-blue-100"
                              : "border-transparent opacity-50 hover:opacity-80"
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
                <div className="w-full h-44 bg-gray-50 border-b border-gray-100 flex flex-col items-center justify-center text-gray-300 gap-2">
                  <FaImage size={28} />
                  <span className="text-xs text-gray-400">
                    No images uploaded
                  </span>
                </div>
              )}

              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="font-bold text-lg text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-xs mt-0.5 uppercase tracking-wide">
                  {item.category}
                  {item.subCategory ? ` · ${item.subCategory}` : ""}
                </p>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                  {item.make && (
                    <AttrCard
                      icon={<FaTag className="text-blue-400" size={12} />}
                      label={t("summary.make", "Make")}
                      value={item.make}
                    />
                  )}
                  {(item.modelName || item.boatModel || item.model) && (
                    <AttrCard
                      icon={<FaCar className="text-blue-400" size={12} />}
                      label={t("summary.model", "Model")}
                      value={item.modelName || item.boatModel || item.model}
                    />
                  )}
                  {item.year && (
                    <AttrCard
                      icon={
                        <FaCalendarAlt className="text-blue-400" size={12} />
                      }
                      label={t("summary.year", "Year")}
                      value={item.year}
                    />
                  )}
                  {item.mileage && (
                    <AttrCard
                      icon={
                        <FaTachometerAlt className="text-blue-400" size={12} />
                      }
                      label={t("summary.mileage", "Mileage")}
                      value={`${item.mileage} km`}
                    />
                  )}
                  {item.type && (
                    <AttrCard
                      icon={<FaFileAlt className="text-blue-400" size={12} />}
                      label={t("summary.type", "Type")}
                      value={item.type}
                    />
                  )}
                  {item.color && (
                    <AttrCard
                      icon={<FaPalette className="text-blue-400" size={12} />}
                      label={t("summary.color", "Color")}
                      value={item.color}
                    />
                  )}
                  <AttrCard
                    icon={
                      <FaMapMarkerAlt className="text-blue-400" size={12} />
                    }
                    label={t("summary.location", "Location")}
                    value={item.city}
                  />
                  <AttrCard
                    icon={<FaTag className="text-blue-400" size={12} />}
                    label={t("summary.price", "Price")}
                    value={`$${Number(item.price || 0).toLocaleString()}`}
                  />
                </div>

                {item.description && (
                  <div className="mt-3 bg-gray-50 border border-gray-100 rounded-xl p-4">
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold block mb-1">
                      {t("summary.description", "Description")}
                    </span>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                )}
              </div>

              <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
                <div className="space-y-1.5">
                  <PriceRow
                    label={t("summary.itemPrice", "Item Price")}
                    value={`$${Number(item.price || 0).toLocaleString()}`}
                  />
                  <PriceRow
                    label={t("summary.listingFee", "Listing Fee")}
                    value={`$${itemFee.toLocaleString()}`}
                  />
                  <PriceRow
                    label={`${t("summary.planPrice", "Plan Price")} (${plan?.days || 30} days)`}
                    value={`$${planPrice.toLocaleString()}`}
                  />
                  <div className="flex justify-between items-center pt-3 mt-1 border-t border-gray-200">
                    <span className="font-bold text-gray-900 text-base">
                      {t("summary.total", "Total")}
                    </span>
                    <span className="font-extrabold text-xl text-blue-600">
                      ${total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/3 bg-white border border-gray-200 rounded-2xl overflow-hidden relative">
              {processing && paymentStatus === "polling" && (
                <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center rounded-2xl z-50">
                  <div className="animate-spin h-10 w-10 border-[3px] border-blue-600 border-t-transparent rounded-full" />
                  <p className="mt-4 font-bold text-gray-800 text-sm">
                    {t("payment.waitingConfirmation", "Waiting for confirmation...")}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {t("payment.attempt", "Attempt")} {pollAttempt}{" "}
                    {t("payment.of", "of")} {MAX_POLL_ATTEMPTS}
                  </p>
                  <button
                    onClick={handleRetry}
                    className="mt-5 px-5 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition"
                  >
                    {t("payment.cancel", "Cancel")}
                  </button>
                </div>
              )}

              {paymentStatus === "success" && (
                <div className="absolute inset-0 bg-white flex flex-col items-center justify-center rounded-2xl z-50">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-3">
                    <FaCheckCircle className="text-green-500" size={36} />
                  </div>
                  <p className="font-bold text-green-600 text-lg">
                    {t("payment.successTitle", "Payment Successful!")}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {t("payment.redirecting", "Redirecting...")}
                  </p>
                </div>
              )}

              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-bold text-base text-gray-900 flex items-center gap-2">
                  <FaMobileAlt className="text-blue-500" size={15} />
                  {t("payment.paymentDetails", "Payment Details")}
                </h2>
              </div>

              <div className="p-5 space-y-5">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                  <p className="text-xs text-blue-400 uppercase tracking-widest font-semibold mb-1">
                    {t("payment.totalAmount", "Total Amount")}
                  </p>
                  <p className="text-3xl font-extrabold text-blue-600">
                    ${total.toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
                    {t("payment.selectMethod", "Payment Method")}
                  </label>
                  <div className="space-y-2">
                    {PAYMENT_METHODS.map((method) => (
                      <label
                        key={method.key}
                        className={`flex items-center gap-3 px-3 py-2.5 border rounded-xl cursor-pointer transition-all ${
                          paymentMethod === method.key
                            ? "border-blue-500 bg-blue-50 border-[1.5px]"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
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
                              ? "text-blue-500"
                              : "text-gray-300"
                          }
                          size={14}
                        />
                        <span
                          className={`text-sm font-semibold flex-1 ${paymentMethod === method.key ? "text-gray-900" : "text-gray-500"}`}
                        >
                          {method.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                    {t("payment.phoneNumber", "Phone Number")}
                  </label>
                  <input
                    type="tel"
                    placeholder="61XXXXXXX"
                    value={phoneNumber}
                    maxLength={13}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\s/g, "");
                      setPhoneNumber(val);
                      if (phoneError && isValidPhone(val)) setPhoneError("");
                    }}
                    className={`w-full px-3 py-2.5 border rounded-lg text-sm font-medium outline-none transition-all bg-white ${
                      phoneError
                        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                        : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }`}
                  />
                  <p className="text-[10px] text-gray-400 mt-1.5 leading-relaxed">
                    Waafi / EVC: <strong className="text-gray-500">61</strong>XXXXXXX
                    &nbsp;·&nbsp; Zaad: <strong className="text-gray-500">63</strong>XXXXXXX
                    &nbsp;·&nbsp; E-Dahab: <strong className="text-gray-500">68</strong>XXXXXXX
                  </p>
                  {phoneError && (
                    <p className="text-red-500 text-xs font-medium mt-1.5">
                      {phoneError}
                    </p>
                  )}
                </div>

                {paymentStatus === "failed" && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-red-700 font-semibold text-sm mb-3">
                      {t(
                        "payment.failedMessage",
                        "Payment failed. Please check your phone and try again.",
                      )}
                    </p>
                    <button
                      onClick={handleRetry}
                      className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-lg transition"
                    >
                      {t("payment.retry", "Retry Payment")}
                    </button>
                  </div>
                )}
              </div>

              <div className="px-5 py-4 border-t border-gray-100 space-y-3">
                <div className="flex gap-2">
                  <button
                    onClick={handleBack}
                    className="px-4 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition text-sm"
                  >
                    ← {t("common.back", "Back")}
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={processing || paymentStatus === "success"}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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
                <p className="text-[11px] text-center text-gray-400 flex items-center justify-center gap-1.5">
                  <FaLock size={9} />
                  {t(
                    "payment.secureNotice",
                    "Your payment information is encrypted and secure.",
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function AttrCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex items-start gap-2.5">
      <span className="mt-0.5">{icon}</span>
      <div>
        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold block mb-0.5">
          {label}
        </span>
        <span className="font-semibold text-gray-800 text-sm">{value}</span>
      </div>
    </div>
  );
}

function PriceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold text-gray-700">{value}</span>
    </div>
  );
}

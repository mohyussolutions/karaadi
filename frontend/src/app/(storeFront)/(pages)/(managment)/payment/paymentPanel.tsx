"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { FaCheckCircle, FaMobileAlt } from "react-icons/fa";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { PAYMENT_METHODS, MAX_POLL_ATTEMPTS } from "./constants";
import type { PaymentMethod, PaymentStatus } from "./constants";
import { useIsFree } from "@/app/(storeFront)/components/hooks/useIsFree";
import { postToFacebook, postToTikTok } from "@/actions/categories/socialPostAction";

interface ItemDetails {
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
}

interface Props {
  processing: boolean;
  paymentStatus: PaymentStatus;
  pollAttempt: number;
  total: number;
  shareUrl: string;
  itemDetails: ItemDetails;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (m: PaymentMethod) => void;
  phoneNumber: string;
  setPhoneNumber: (v: string) => void;
  phoneError: string;
  setPhoneError: (e: string) => void;
  handleRetry: () => void;
  handleBack: () => void;
  handlePayment: () => void;
}

export default function PaymentPanel({
  processing,
  paymentStatus,
  pollAttempt,
  total,
  shareUrl,
  itemDetails,
  paymentMethod,
  setPaymentMethod,
  phoneNumber,
  setPhoneNumber,
  phoneError,
  setPhoneError,
  handleRetry,
  handleBack,
  handlePayment,
}: Props) {
  const isFree = useIsFree(total);
  return (
    <div className="w-full lg:w-1/3 bg-white border border-gray-200 rounded-2xl overflow-hidden relative">
      <PollingOverlay processing={processing} paymentStatus={paymentStatus} pollAttempt={pollAttempt} handleRetry={handleRetry} />
      <SuccessOverlay paymentStatus={paymentStatus} isFree={isFree} shareUrl={shareUrl} itemDetails={itemDetails} />
      <PanelHeader isFree={isFree} />
      <div className="p-5 space-y-5">
        <TotalDisplay total={total} />
        {!isFree && (
          <>
            <PaymentMethodSelector paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
            <PhoneInput phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} phoneError={phoneError} setPhoneError={setPhoneError} />
          </>
        )}
        <FailedRetry paymentStatus={paymentStatus} isFree={isFree} handleRetry={handleRetry} />
      </div>
      <PaymentActions processing={processing} paymentStatus={paymentStatus} total={total} handleBack={handleBack} handlePayment={handlePayment} />
    </div>
  );
}

function PollingOverlay({ processing, paymentStatus, pollAttempt, handleRetry }: {
  processing: boolean;
  paymentStatus: PaymentStatus;
  pollAttempt: number;
  handleRetry: () => void;
}) {
  const { t } = useTranslation();
  if (!processing || paymentStatus !== "polling") return null;
  return (
    <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center rounded-2xl z-50">
      <div className="animate-spin h-10 w-10 border-[3px] border-blue-600 border-t-transparent rounded-full" />
      <p className="mt-4 font-bold text-gray-800 text-sm">
        {t("payment.waitingConfirmation", "Waiting for confirmation...")}
      </p>
      <p className="mt-1 text-xs text-gray-400">
        {t("payment.attempt", "Attempt")} {pollAttempt} {t("payment.of", "of")} {MAX_POLL_ATTEMPTS}
      </p>
      <button
        onClick={handleRetry}
        className="mt-5 px-5 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition touch-manipulation"
      >
        {t("payment.cancel", "Cancel")}
      </button>
    </div>
  );
}

type PostState = "idle" | "loading" | "done" | "error";

function SuccessOverlay({ paymentStatus, isFree, shareUrl, itemDetails }: {
  paymentStatus: PaymentStatus;
  isFree: boolean;
  shareUrl: string;
  itemDetails: ItemDetails;
}) {
  const { t } = useTranslation();
  const [fbState, setFbState] = React.useState<PostState>("idle");
  const [ttState, setTtState] = React.useState<PostState>("idle");

  if (paymentStatus !== "success") return null;

  const payload = {
    title: itemDetails.title,
    description: itemDetails.description,
    price: itemDetails.price,
    imageUrl: itemDetails.imageUrl,
    listingUrl: shareUrl,
  };

  const handleFacebook = async () => {
    if (fbState !== "idle") return;
    setFbState("loading");
    const result = await postToFacebook(payload);
    setFbState(result.success ? "done" : "error");
  };

  const handleTikTok = async () => {
    if (ttState !== "idle") return;
    setTtState("loading");
    const result = await postToTikTok(payload);
    setTtState(result.success ? "done" : "error");
  };

  return (
    <div className="absolute inset-0 bg-white flex flex-col items-center justify-center rounded-2xl z-50 px-5 py-6">
      <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-3">
        <FaCheckCircle className="text-green-500" size={36} />
      </div>

      <p className="font-bold text-green-600 text-lg text-center mb-1">
        {isFree
          ? t("payment.confirmedTitle", "Listing Confirmed!")
          : t("payment.successTitle", "Payment Successful!")}
      </p>
      <p className="text-xs text-gray-500 text-center mb-6">
        {t("payment.sharePrompt", "Would you like to post your listing on social media?")}
      </p>

      <div className="w-full space-y-3 mb-5">
        <PlatformCard
          name="Facebook"
          color="#1877F2"
          state={fbState}
          onPost={handleFacebook}
          icon={
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
              <path d="M24 12.073C24 5.445 18.627 0 12 0S0 5.445 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
            </svg>
          }
          doneLabel={t("payment.postedFb", "Posted to Facebook page!")}
          note={t("payment.fbNote", "Viewers can click to see the full listing")}
        />

        <PlatformCard
          name="TikTok"
          color="#010101"
          state={ttState}
          onPost={handleTikTok}
          icon={
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.12 8.12 0 0 0 4.74 1.51V6.75a4.85 4.85 0 0 1-.97-.06z" />
            </svg>
          }
          doneLabel={t("payment.postedTt", "Posted to TikTok!")}
          note={itemDetails.imageUrl ? undefined : t("payment.ttNoImage", "Image required for TikTok post")}
        />
      </div>

      <p className="text-[10px] text-gray-400 text-center">
        {t("payment.redirecting", "Redirecting in a few seconds…")}
      </p>
    </div>
  );
}

function PlatformCard({ name, color, state, onPost, icon, doneLabel, note }: {
  name: string;
  color: string;
  state: PostState;
  onPost: () => void;
  icon: React.ReactNode;
  doneLabel: string;
  note?: string;
}) {
  const { t } = useTranslation();

  return (
    <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-900 text-sm">{name}</p>
        {state === "done" ? (
          <p className="text-xs text-green-600 font-medium">{doneLabel}</p>
        ) : state === "error" ? (
          <p className="text-xs text-red-500 font-medium">{t("payment.postError", "Failed. Try again later.")}</p>
        ) : note ? (
          <p className="text-xs text-gray-400">{note}</p>
        ) : (
          <p className="text-xs text-gray-400">{t("payment.postToPage", "Post to page with item details & link")}</p>
        )}
      </div>

      <button
        type="button"
        onClick={onPost}
        disabled={state !== "idle"}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition touch-manipulation flex-shrink-0"
        style={{
          backgroundColor: state === "done" ? "#dcfce7" : state === "error" ? "#fef2f2" : color,
          color: state === "done" ? "#16a34a" : state === "error" ? "#dc2626" : "white",
          opacity: state === "loading" ? 0.7 : 1,
          cursor: state !== "idle" ? "default" : "pointer",
        }}
      >
        {state === "loading" ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : state === "done" ? (
          <CheckCircle2 className="w-3.5 h-3.5" />
        ) : state === "error" ? (
          <XCircle className="w-3.5 h-3.5" />
        ) : (
          t("payment.postYes", "Post")
        )}
      </button>
    </div>
  );
}

function PanelHeader({ isFree }: { isFree: boolean }) {
  const { t } = useTranslation();
  return (
    <div className="px-5 py-4 border-b border-gray-100">
      <h2 className="font-bold text-base text-gray-900 flex items-center gap-2">
        <FaMobileAlt className="text-blue-500" size={15} />
        {isFree
          ? t("payment.confirmDetails", "Confirm Listing")
          : t("payment.paymentDetails", "Payment Details")}
      </h2>
    </div>
  );
}

function TotalDisplay({ total }: { total: number }) {
  const { t } = useTranslation();
  const isFree = useIsFree(total);
  return (
    <div className={`border rounded-xl p-4 text-center ${isFree ? "bg-green-50 border-green-100" : "bg-blue-50 border-blue-100"}`}>
      <p className={`text-xs uppercase tracking-widest font-semibold mb-1 ${isFree ? "text-green-500" : "text-blue-400"}`}>
        {t("payment.totalAmount", "Total Amount")}
      </p>
      {isFree ? (
        <p className="text-3xl font-extrabold text-green-600">{t("payment.free", "Free")}</p>
      ) : (
        <p className="text-3xl font-extrabold text-blue-600">${total.toLocaleString()}</p>
      )}
    </div>
  );
}

function PaymentMethodSelector({ paymentMethod, setPaymentMethod }: {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (m: PaymentMethod) => void;
}) {
  const { t } = useTranslation();
  return (
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
            <FaMobileAlt className={paymentMethod === method.key ? "text-blue-500" : "text-gray-300"} size={14} />
            <span className={`text-sm font-semibold flex-1 ${paymentMethod === method.key ? "text-gray-900" : "text-gray-500"}`}>
              {method.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

function PhoneInput({ phoneNumber, setPhoneNumber, phoneError, setPhoneError }: {
  phoneNumber: string;
  setPhoneNumber: (v: string) => void;
  phoneError: string;
  setPhoneError: (e: string) => void;
}) {
  const { t } = useTranslation();
  return (
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
          if (phoneError) setPhoneError("");
        }}
        className={`w-full px-3 py-2.5 border rounded-lg text-sm font-medium outline-none transition-all bg-white ${
          phoneError
            ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        }`}
      />
      <p className="text-[10px] text-gray-400 mt-1.5 leading-relaxed">
        Waafi / EVC: <strong className="text-gray-500">61</strong>XXXXXXX &nbsp;·&nbsp;
        Zaad: <strong className="text-gray-500">63</strong>XXXXXXX &nbsp;·&nbsp;
        E-Dahab: <strong className="text-gray-500">68</strong>XXXXXXX
      </p>
      {phoneError && <p className="text-red-500 text-xs font-medium mt-1.5">{phoneError}</p>}
    </div>
  );
}

function FailedRetry({ paymentStatus, isFree, handleRetry }: {
  paymentStatus: PaymentStatus;
  isFree: boolean;
  handleRetry: () => void;
}) {
  const { t } = useTranslation();
  if (paymentStatus !== "failed") return null;
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
      <p className="text-red-700 font-semibold text-sm mb-3">
        {isFree
          ? t("payment.freeFailedMessage", "Failed to confirm your listing. Please try again.")
          : t("payment.failedMessage", "Payment failed. Please check your phone and try again.")}
      </p>
      <button
        onClick={handleRetry}
        className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-lg transition touch-manipulation"
      >
        {isFree ? t("payment.tryAgain", "Try Again") : t("payment.retry", "Retry Payment")}
      </button>
    </div>
  );
}

function PaymentActions({ processing, paymentStatus, total, handleBack, handlePayment }: {
  processing: boolean;
  paymentStatus: PaymentStatus;
  total: number;
  handleBack: () => void;
  handlePayment: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="px-5 py-4 border-t border-gray-100 space-y-3">
      <div className="flex gap-2">
        <button
          onClick={handleBack}
          className="px-4 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition text-sm touch-manipulation"
        >
          ← {t("common.back", "Back")}
        </button>
        <button
          onClick={handlePayment}
          disabled={processing || paymentStatus === "success"}
          className={`flex-1 py-2.5 active:scale-[0.98] text-white font-bold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed text-sm touch-manipulation ${
            total === 0 ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {processing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              {t("payment.processing", "Processing...")}
            </span>
          ) : total === 0 ? (
            t("payment.confirmListing", "Confirm Free Listing")
          ) : (
            `${t("payment.pay", "Pay")} $${total.toLocaleString()}`
          )}
        </button>
      </div>
    </div>
  );
}

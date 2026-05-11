"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { FaCheckCircle, FaMobileAlt, FaLock } from "react-icons/fa";
import { PAYMENT_METHODS, MAX_POLL_ATTEMPTS } from "./constants";
import type { PaymentMethod, PaymentStatus } from "./constants";
import { useIsFree } from "@/app/(storeFront)/components/hooks/useIsFree";

interface Props {
  processing: boolean;
  paymentStatus: PaymentStatus;
  pollAttempt: number;
  total: number;
  shareUrl: string;
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
      <SuccessOverlay paymentStatus={paymentStatus} isFree={isFree} shareUrl={shareUrl} />
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
        className="mt-5 px-5 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition"
      >
        {t("payment.cancel", "Cancel")}
      </button>
    </div>
  );
}

function SuccessOverlay({ paymentStatus, isFree, shareUrl }: { paymentStatus: PaymentStatus; isFree: boolean; shareUrl: string }) {
  const { t } = useTranslation();
  const [copied, setCopied] = React.useState(false);

  if (paymentStatus !== "success") return null;

  const text = encodeURIComponent(t("payment.shareText", "Check out my listing on Karaadi!"));
  const url = encodeURIComponent(shareUrl);

  const socials = [
    {
      label: "WhatsApp",
      bg: "bg-[#25D366]",
      href: `https://wa.me/?text=${text}%20${url}`,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.121 1.532 5.853L.057 23.786a.5.5 0 0 0 .619.633l6.102-1.598A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.878 0-3.638-.512-5.145-1.402l-.36-.214-3.827 1.002 1.025-3.735-.234-.374A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
      ),
    },
    {
      label: "Telegram",
      bg: "bg-[#2AABEE]",
      href: `https://t.me/share/url?url=${url}&text=${text}`,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.43 13.885 4.46 12.95c-.658-.204-.672-.658.136-.977l10.57-4.075c.548-.197 1.027.12.728.323z"/></svg>
      ),
    },
    {
      label: "Facebook",
      bg: "bg-[#1877F2]",
      href: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M24 12.073C24 5.445 18.627 0 12 0S0 5.445 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
      ),
    },
    {
      label: "X",
      bg: "bg-black",
      href: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      ),
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="absolute inset-0 bg-white flex flex-col items-center justify-center rounded-2xl z-50 px-5">
      <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-3">
        <FaCheckCircle className="text-green-500" size={36} />
      </div>
      <p className="font-bold text-green-600 text-lg text-center">
        {isFree
          ? t("payment.confirmedTitle", "Listing Confirmed!")
          : t("payment.successTitle", "Payment Successful!")}
      </p>
      <p className="mt-1 text-xs text-gray-400 mb-5">
        {t("payment.sharePrompt", "Share your listing on social media")}
      </p>

      <div className="flex gap-3 mb-4">
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className={`${s.bg} w-11 h-11 rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-transform touch-manipulation`}
          >
            {s.icon}
          </a>
        ))}
      </div>

      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 active:scale-95 transition-all touch-manipulation mb-4"
      >
        <FaLock size={10} />
        {copied ? t("payment.copied", "Copied!") : t("payment.copyLink", "Copy Link")}
      </button>

      <p className="text-[10px] text-gray-400">{t("payment.redirecting", "Redirecting in a few seconds...")}</p>
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
        <p className="text-3xl font-extrabold text-green-600">
          {t("payment.free", "Free")}
        </p>
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
            <FaMobileAlt
              className={paymentMethod === method.key ? "text-blue-500" : "text-gray-300"}
              size={14}
            />
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

function FailedRetry({ paymentStatus, isFree, handleRetry }: { paymentStatus: PaymentStatus; isFree: boolean; handleRetry: () => void }) {
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
        className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-lg transition"
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
          className="px-4 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition text-sm"
        >
          ← {t("common.back", "Back")}
        </button>
        <button
          onClick={handlePayment}
          disabled={processing || paymentStatus === "success"}
          className={`flex-1 py-2.5 active:scale-[0.98] text-white font-bold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed text-sm ${
            total === 0
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
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
      <p className="text-[11px] text-center text-gray-400 flex items-center justify-center gap-1.5">
        <FaLock size={9} />
        {t("payment.secureNotice", "Your payment information is encrypted and secure.")}
      </p>
    </div>
  );
}

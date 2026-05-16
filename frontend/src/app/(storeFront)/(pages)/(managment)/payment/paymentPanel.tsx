"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { FaMobileAlt } from "react-icons/fa";
import { PAYMENT_METHODS, MAX_POLL_ATTEMPTS } from "./constants";
import type { PaymentMethod, PaymentStatus } from "./constants";
import { useIsFree } from "@/app/(storeFront)/components/hooks/useIsFree";

interface Props {
  processing: boolean;
  paymentStatus: PaymentStatus;
  pollAttempt: number;
  total: number;
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
      <PollingOverlay
        processing={processing}
        paymentStatus={paymentStatus}
        pollAttempt={pollAttempt}
        handleRetry={handleRetry}
      />
      <PanelHeader isFree={isFree} />
      <div className="p-5 space-y-5">
        <TotalDisplay total={total} />
        {!isFree && (
          <>
            <PaymentMethodSelector
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
            <PhoneInput
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              phoneError={phoneError}
              setPhoneError={setPhoneError}
            />
          </>
        )}
        <FailedRetry
          paymentStatus={paymentStatus}
          isFree={isFree}
          handleRetry={handleRetry}
        />
      </div>
      <PaymentActions
        processing={processing}
        paymentStatus={paymentStatus}
        total={total}
        handleBack={handleBack}
        handlePayment={handlePayment}
      />
    </div>
  );
}

function PollingOverlay({
  processing,
  paymentStatus,
  pollAttempt,
  handleRetry,
}: {
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
        {t("payment.attempt", "Attempt")} {pollAttempt} {t("payment.of", "of")}{" "}
        {MAX_POLL_ATTEMPTS}
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
    <div
      className={`border rounded-xl p-4 text-center ${isFree ? "bg-green-50 border-green-100" : "bg-blue-50 border-blue-100"}`}
    >
      <p
        className={`text-xs uppercase tracking-widest font-semibold mb-1 ${isFree ? "text-green-500" : "text-blue-400"}`}
      >
        {t("payment.totalAmount", "Total Amount")}
      </p>
      {isFree ? (
        <p className="text-3xl font-extrabold text-green-600">
          {t("payment.free", "Free")}
        </p>
      ) : (
        <p className="text-3xl font-extrabold text-blue-600">
          ${total.toLocaleString()}
        </p>
      )}
    </div>
  );
}

function PaymentMethodSelector({
  paymentMethod,
  setPaymentMethod,
}: {
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
            <span
              className={`text-sm font-semibold flex-1 ${paymentMethod === method.key ? "text-gray-900" : "text-gray-500"}`}
            >
              {method.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

function PhoneInput({
  phoneNumber,
  setPhoneNumber,
  phoneError,
  setPhoneError,
}: {
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
        Waafi / EVC: <strong className="text-gray-500">61</strong>XXXXXXX
        &nbsp;·&nbsp; Zaad: <strong className="text-gray-500">63</strong>XXXXXXX
        &nbsp;·&nbsp; E-Dahab: <strong className="text-gray-500">68</strong>XXXXXXX
      </p>
      {phoneError && (
        <p className="text-red-500 text-xs font-medium mt-1.5">{phoneError}</p>
      )}
    </div>
  );
}

function FailedRetry({
  paymentStatus,
  isFree,
  handleRetry,
}: {
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

function PaymentActions({
  processing,
  paymentStatus,
  total,
  handleBack,
  handlePayment,
}: {
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

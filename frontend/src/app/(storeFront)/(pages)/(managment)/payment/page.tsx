"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/store/slices/hooks/hooks";
import CheckoutSteps from "@/app/(storeFront)/components/checkout/CheckoutSteps";
import { FaListAlt } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import type { PaymentMethod } from "./constants";
import { usePayment } from "./usePayment";
import ListingSummaryPanel from "./paymentSumary";
import PaymentPanel from "./paymentPanel";

export default function SummaryPaymentPage() {
  const router = useRouter();
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

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("waafi");
  const userPhone: string = (user as any)?.phone || "";
  const [phoneNumber, setPhoneNumber] = useState(
    userPhone && (userPhone.startsWith("+252") || userPhone.startsWith("6"))
      ? userPhone
      : "",
  );
  const [phoneError, setPhoneError] = useState("");

  const {
    processing,
    pollAttempt,
    paymentStatus,
    total,
    planPrice,
    itemFee,
    stopPolling,
    handleRetry,
    handlePayment,
  } = usePayment({ item, plan, paymentMethod, phoneNumber, setPhoneError });

  useEffect(() => {
    return () => {
      setPhoneNumber("");
      stopPolling();
    };
  }, [stopPolling]);

  if (!mounted) return null;

  return (
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
          <ListingSummaryPanel
            item={item}
            plan={plan}
            itemFee={itemFee}
            planPrice={planPrice}
            total={total}
          />
          <PaymentPanel
            processing={processing}
            paymentStatus={paymentStatus}
            pollAttempt={pollAttempt}
            total={total}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            phoneError={phoneError}
            setPhoneError={setPhoneError}
            handleRetry={handleRetry}
            handleBack={() => router.back()}
            handlePayment={handlePayment}
          />
        </div>
      </div>
    </div>
  );
}

//

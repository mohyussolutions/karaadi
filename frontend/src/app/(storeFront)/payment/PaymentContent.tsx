"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PaymentForm from "./PaymentForm";
import PaymentSuccess from "./PaymentSuccess";
import { usePayment } from "./testForMock";

export default function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Price Constants
  const serviceFee = 10;
  const amountParam = searchParams.get("amount") || "0";
  const subscriptionId = searchParams.get("subscriptionId");
  const safeAmount = parseFloat(amountParam);
  const total = safeAmount + serviceFee;

  // Logic Hook
  const {
    status,
    accountNo,
    setAccountNo,
    error,
    transactionDetails,
    handlePayment,
  } = usePayment(subscriptionId, safeAmount, serviceFee);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full h-screen md:h-auto md:max-w-xl">
        {status === "success" && transactionDetails ? (
          <PaymentSuccess
            id={transactionDetails.id}
            msg={transactionDetails.msg}
            onNavigate={() => router.push("/mine")}
          />
        ) : (
          <PaymentForm
            accountNo={accountNo}
            setAccountNo={setAccountNo}
            onSubmit={handlePayment}
            status={status}
            error={error}
            total={total}
            safeAmount={safeAmount}
            serviceFee={serviceFee}
          />
        )}
      </div>
    </div>
  );
}

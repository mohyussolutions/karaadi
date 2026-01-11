"use client";

import { useState } from "react";

export const usePayment = (
  subscriptionId: string | null,
  safeAmount: number,
  serviceFee: number
) => {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [accountNo, setAccountNo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [transactionDetails, setTransactionDetails] = useState<{
    id: string;
    msg: string;
  } | null>(null);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment: {
            userId: "64d4a43c9a8b0e6e8c4a5678",
            itemCategory: "MARKETPLACE",
            itemId: subscriptionId || "cmjylo3ao0016wxlwzwkpd6az",
            listingType: "FEE",
            paymentMethod: "EVC",
            accountNo,
            description: "Payment for Activation (Test Mode)",
            feeAmount: serviceFee,
            baseFee: safeAmount,
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
        setTransactionDetails({ id: data.transactionId, msg: data.message });
        setStatus("success");
      } else {
        setError(data.message || "Payment failed.");
        setStatus("idle");
      }
    } catch (err) {
      setError("Server connection error (Check localhost:8080).");
      setStatus("idle");
    }
  };

  return {
    status,
    accountNo,
    setAccountNo,
    error,
    transactionDetails,
    handlePayment,
  };
};

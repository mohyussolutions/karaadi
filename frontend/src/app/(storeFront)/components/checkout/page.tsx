"use client";

import { useSearchParams } from "next/navigation";
import React from "react";

export default function Checkout() {
  const params = useSearchParams();
  const subscriptionId = params.get("subscriptionId");
  const plan = params.get("plan");

  return (
    <div className="p-20 max-w-4xl mx-auto">
      <h1 className="text-3xl font-black mb-6">Checkout</h1>
      <p className="text-lg">
        Subscription ID: <strong>{subscriptionId}</strong>
      </p>
      <p className="text-lg">
        Selected Plan: <strong>{plan}</strong>
      </p>
    </div>
  );
}

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import PlanCards from "./PlanCards";
import { getActiveFee, FeeConfig } from "@/actions/categories/feeAction";
import Loading from "../shared/Loading/Loading";

export default function PlanSelector() {
  const router = useRouter();
  const params = useSearchParams();
  const subscriptionId = params.get("subscriptionId");

  const [selectedPlan, setSelectedPlan] = useState("subStandard");
  const [fees, setFees] = useState<FeeConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActiveFee()
      .then((f) => setFees(f))
      .finally(() => setLoading(false));
  }, []);

  if (!subscriptionId) {
    router.replace("/subscriptions/create");
    return null;
  }

  if (loading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto p-10">
      <h1 className="text-3xl font-black mb-8 text-center">Choose your Plan</h1>

      <PlanCards
        selectedPlan={selectedPlan}
        onPlanSelect={setSelectedPlan}
        dynamicFees={fees}
      />

      <div className="text-center mt-10">
        <button
          onClick={() =>
            router.push(
              `/subscriptions/checkout?subscriptionId=${subscriptionId}&plan=${selectedPlan}`
            )
          }
          className="bg-blue-700 text-white px-8 py-3 rounded-xl font-black"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { HiCheckCircle, HiOutlineRocketLaunch } from "react-icons/hi2";
import { HiOutlineAcademicCap, HiOutlineLightningBolt } from "react-icons/hi";
import { getSubPlans } from "@/actions/categories/feeAction";
import { SUBSCRIPTION_PLANS } from "@/actions/common/FEE_CATEGORIES";
import { useAppDispatch, useAppSelector } from "@/store/slices/hooks/hooks";
import { setPlan } from "@/store/slices/reducers/listingDraftSlice";
import { useRouter } from "next/navigation";
import CheckoutSteps from "@/app/(storeFront)/components/checkout/CheckoutSteps";

const IconMap: Record<string, any> = {
  zap: HiOutlineLightningBolt,
  rocket: HiOutlineRocketLaunch,
  crown: HiOutlineAcademicCap,
};

interface PlanSelectProps {
  onNext: () => void;
  onBack: () => void;
}

export function PlanSelect({ onNext, onBack }: PlanSelectProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const savedPlan = useAppSelector((state) => state.listingDraft.plan);
  const savedItem = useAppSelector((state) => state.listingDraft.item) ?? {};

  const initialPlans = SUBSCRIPTION_PLANS.map((item) => ({
    ...item,
    id: item.key,
    price: 0,
  }));

  const [plans, setPlans] = useState<any[]>(initialPlans);
  const [selectedPlan, setSelectedPlan] = useState<any>(() => {
    if (savedPlan) {
      const found = initialPlans.find((p) => p.id === savedPlan.id);
      return found ?? null;
    }
    return null;
  });

  useEffect(() => {
    let cancelled = false;
    getSubPlans()
      .then((res) => {
        if (cancelled) return;
        const config = Array.isArray(res) ? res[0] : res;
        if (!config) return;
        setPlans((prev) =>
          prev.map((p) => ({ ...p, price: Number(config[p.key]) || 0 })),
        );
        if (savedPlan) {
          setSelectedPlan((prev: any) =>
            prev ? { ...prev, price: Number(config[prev.key]) || 0 } : prev,
          );
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSelect = (p: any) => {
    setSelectedPlan(p);
    dispatch(setPlan(p));
  };

  const handleContinue = () => {
    if (selectedPlan) onNext();
  };

  const itemFeeAmount = savedItem.feeAmount || 0;
  const planPrice = selectedPlan?.price || 0;
  const totalCost = itemFeeAmount + planPrice;
  const maxPrice = plans.length > 0 ? Math.max(...plans.map((p) => p.price)) : 0;

  return (
    <div className="py-6 sm:py-8 px-4 sm:px-0">
      <CheckoutSteps step1 step2 step3 />

      <header className="text-center mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase">
          {t("plan.selectHeading", "Choose Your ")}{" "}
          <span className="text-blue-600">{t("plan.plan", "Plan")}</span>
        </h1>
        <p className="text-gray-500 mt-2 text-sm font-medium">
          {t("plan.subtitle", "Select the best visibility for your listing")}
        </p>
      </header>

      <div className="flex md:grid md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10 overflow-x-auto pb-4 md:pb-0 snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
        {plans.map((p) => {
          const Icon = IconMap[p.iconName] || HiOutlineLightningBolt;
          const isSelected = selectedPlan?.id === p.id;
          const isBestValue = maxPrice > 0 && p.price === maxPrice;

          return (
            <div
              key={p.id}
              onClick={() => handleSelect(p)}
              className={`relative cursor-pointer rounded-2xl border-2 p-5 sm:p-6 bg-white transition-all flex-shrink-0 snap-start w-[78vw] sm:w-[56vw] md:w-auto ${
                isSelected
                  ? "border-blue-500 ring-2 ring-blue-100 shadow-lg"
                  : "border-gray-200 hover:border-blue-200 hover:shadow-md"
              }`}
            >
              {isBestValue && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow whitespace-nowrap">
                  Best Value
                </span>
              )}
              {p.popular && !isBestValue && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow whitespace-nowrap">
                  Popular
                </span>
              )}

              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${isSelected ? "bg-blue-100" : "bg-gray-100"}`}>
                <Icon className={isSelected ? "text-blue-600" : "text-gray-500"} size={20} />
              </div>

              <h3 className="font-black text-lg text-gray-900">{p.label}</h3>
              <p className={`text-xs font-bold mt-1 ${isSelected ? "text-blue-600" : "text-gray-400"}`}>
                {p.days} {t("plan.days", "days")}
              </p>

              <div className={`text-3xl font-black mt-4 ${isSelected ? "text-blue-600" : "text-gray-900"}`}>
                ${p.price}{" "}
                <span className="text-sm font-bold text-gray-400">{t("plan.currency", "USD")}</span>
              </div>

              <ul className="mt-5 space-y-2">
                {p.features.map((f: string, i: number) => (
                  <li key={i} className="flex gap-2 items-start">
                    <HiCheckCircle
                      className={`flex-shrink-0 mt-0.5 ${isSelected ? "text-blue-500" : "text-gray-300"}`}
                      size={16}
                    />
                    <span className="text-sm text-gray-600 font-medium">{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 text-center">
                {isSelected ? (
                  <span className="inline-block bg-blue-600 text-white text-xs font-black uppercase tracking-wide px-4 py-1.5 rounded-full">
                    {t("plan.selected", "Selected")}
                  </span>
                ) : (
                  <span className="inline-block border border-gray-200 text-gray-400 text-xs font-bold px-4 py-1.5 rounded-full">
                    {t("plan.clickToSelect", "Select")}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-[11px] text-gray-400 -mt-2 mb-6 md:hidden">
        ← {t("plan.swipeHint", "Swipe to see all plans")} →
      </p>

      {selectedPlan && (
        <div className="border border-gray-200 rounded-2xl overflow-hidden mb-6">
          <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
            <h3 className="font-black text-gray-900 text-sm uppercase tracking-wide">
              {t("plan.costSummary", "Cost Summary")}
            </h3>
          </div>
          <div className="px-5 py-4 space-y-3 bg-white">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 font-medium">{t("plan.itemFee", "Listing Fee")}</span>
              <span className="font-black text-gray-900">${itemFeeAmount} {t("plan.currency", "USD")}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 font-medium">
                {t("plan.planPrice", "Plan Price")} ({selectedPlan.label})
              </span>
              <span className="font-black text-gray-900">${planPrice} {t("plan.currency", "USD")}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <span className="font-black text-gray-900 text-base">{t("plan.total", "Total")}</span>
              <span className="font-black text-2xl text-blue-600">${totalCost} {t("plan.currency", "USD")}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 sm:gap-4">
        <button
          onClick={onBack}
          className="flex-1 py-3.5 sm:py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition text-sm sm:text-base"
        >
          ← {t("common.back", "Back")}
        </button>
        <button
          onClick={handleContinue}
          disabled={!selectedPlan}
          className="flex-1 py-3.5 sm:py-4 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-100 text-sm sm:text-base"
        >
          {t("common.continue", "Continue")} →
        </button>
      </div>
    </div>
  );
}

const PlanPage = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth
    ? useAuth()
    : { user: null, loading: false };
  const itemId = useAppSelector((state) => state.listingDraft.item?.id);

  useEffect(() => {
    if (authLoading) return;
    if (!user) router.push("/login");
    else if (!itemId) router.push("/");
  }, [user, authLoading, itemId, router]);

  if (authLoading || !user || !itemId) return null;

  return (
    <PlanSelect
      onNext={() => router.push("/payment")}
      onBack={() => router.back()}
    />
  );
};

export default PlanPage;

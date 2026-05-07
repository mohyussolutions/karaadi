"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { IoBusiness } from "react-icons/io5";
import { ChevronLeft, CheckCircle, Zap, Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  getMyBusinesses,
  selectBusinessPlan,
  extendBusinessPlan,
  getAllBusinessPlans,
} from "@/actions/categories/businessActions";
import type { Business } from "@/actions/categories/businessActions";

import { BusinessPlan } from "@/app/utils/types/business";
import BusinesscheckupSteps from "@/app/(storeFront)/components/checkout/BusinesscheckupSteps";

const TIER: Record<
  string,
  { border: string; badge: string; icon: React.ReactNode }
> = {
  premium: {
    border: "border-amber-400",
    badge: "bg-amber-100 text-amber-700",
    icon: <Star className="w-3 h-3" />,
  },
  standard: {
    border: "border-blue-400",
    badge: "bg-blue-100 text-blue-700",
    icon: <Zap className="w-3 h-3" />,
  },
  basic: {
    border: "border-gray-300",
    badge: "bg-gray-100 text-gray-600",
    icon: null,
  },
};

function getTier(plan: BusinessPlan): "premium" | "standard" | "basic" {
  if (plan.durationDays >= 90) return "premium";
  if (plan.durationDays >= 60) return "standard";
  return "basic";
}

export default function PlanPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const businessId = searchParams.get("businessId") ?? "";
  const isExtend = searchParams.get("extend") === "1";

  const [business, setBusiness] = useState<Business | null>(null);
  const [plans, setPlans] = useState<BusinessPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    Promise.all([getMyBusinesses(), getAllBusinessPlans()]).then(
      ([bizData, planData]) => {
        const businesses: Business[] = (bizData as any)?.businesses ?? [];
        const found = businessId
          ? businesses.find((b) => b.id === businessId)
          : businesses.find(
              (b) => b.status === "active" && b.isVerified && !b.planId,
            );
        setBusiness(found ?? null);
        setPlans(
          ((planData as any)?.plans ?? []).filter(
            (p: BusinessPlan) => p.isActive,
          ),
        );
        setLoading(false);
      },
    );
  }, [user, authLoading, businessId]);

  const handleSelect = async (planId: string) => {
    if (!business) return;
    setSelecting(planId);
    try {
      const action =
        isExtend || business.planId
          ? extendBusinessPlan(business.id, planId)
          : selectBusinessPlan(business.id, planId);
      const res = (await action) as any;

      if (res?.success) {
        toast.success(t("mine.businesses.planSelected", "Plan activated!"));
        router.push(`/business/post?businessId=${business.id}`);
      } else {
        toast.error(
          res?.error ??
            t("mine.businesses.planError", "Plan selection failed."),
        );
      }
    } catch {
      toast.error(t("mine.businesses.genericError", "Something went wrong."));
    } finally {
      setSelecting(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4 animate-pulse space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-200 rounded-xl" />
          <div className="w-12 h-12 bg-gray-200 rounded-2xl" />
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-gray-200 rounded w-40" />
            <div className="h-3 bg-gray-100 rounded w-32" />
          </div>
        </div>
        <div className="h-12 bg-gray-200 rounded-2xl" />
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-48 bg-gray-200 rounded-3xl" />
        ))}
      </div>
    );
  }

  if (!business) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4 text-center space-y-4">
        <p className="text-gray-500">
          {t(
            "mine.businesses.noPlanBusiness",
            "No approved business found. Please complete the Apply step first.",
          )}
        </p>
        <button
          onClick={() => router.push("/business/Apply")}
          className="text-blue-600 text-sm font-semibold hover:underline"
        >
          {t("mine.businesses.goApply", "← Go to Apply")}
        </button>
      </div>
    );
  }

  const currentPlan = business.planId
    ? plans.find((p) => p.id === business.planId)
    : null;
  const expiry = business.expiryDate ? new Date(business.expiryDate) : null;
  const isExpired = expiry ? expiry < new Date() : false;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4" suppressHydrationWarning>
      <div className="flex items-center gap-4 mb-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
          <IoBusiness className="text-2xl text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {isExtend || currentPlan
              ? t("mine.businesses.renewPlan", "Renew Plan")
              : t("mine.businesses.selectPlanTitle", "Choose a Plan")}
          </h1>
          <p className="text-sm text-gray-500">{business.name}</p>
        </div>
      </div>

      <BusinesscheckupSteps active={3} businessId={business.id} />

      {currentPlan && (
        <div className="mb-6 bg-white border border-gray-200 rounded-2xl px-5 py-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            {t("mine.businesses.currentPlan", "Current Plan")}
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-900">{currentPlan.name}</p>
              <p className="text-sm text-gray-500">
                {currentPlan.durationDays} {t("mine.businesses.days", "days")} ·{" "}
                {currentPlan.maxListings}{" "}
                {t("mine.businesses.listings", "listings")}
              </p>
            </div>
            {expiry && (
              <div className="text-right">
                <p
                  className={`text-xs font-semibold ${isExpired ? "text-red-500" : "text-gray-500"}`}
                >
                  {isExpired
                    ? t("mine.businesses.expired", "Expired")
                    : t("mine.businesses.expires", "Expires")}
                </p>
                <p className="text-xs text-gray-400">
                  {expiry.toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {plans.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          {t("mine.businesses.noPlans", "No plans available.")}
        </div>
      ) : (
        <div className="space-y-4">
          {plans.map((plan) => {
            const tier = getTier(plan);
            const style = TIER[tier];
            const isCurrent = plan.id === business.planId && !isExpired;
            const isLoading = selecting === plan.id;

            return (
              <div
                key={plan.id}
                className={`bg-white border-2 rounded-3xl overflow-hidden transition-shadow hover:shadow-md ${
                  isCurrent ? "border-green-400" : style.border
                }`}
              >
                <div className="px-6 pt-6 pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {plan.name}
                        </h3>
                        {isCurrent ? (
                          <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">
                            {t("mine.businesses.activePlan", "Active")}
                          </span>
                        ) : (
                          tier !== "basic" && (
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${style.badge}`}
                            >
                              {style.icon}
                              {tier.charAt(0).toUpperCase() + tier.slice(1)}
                            </span>
                          )
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {plan.durationDays} {t("mine.businesses.days", "days")}{" "}
                        · {plan.maxListings}{" "}
                        {t("mine.businesses.maxListings", "max listings")}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="text-2xl font-bold text-gray-900">
                        ${plan.price}
                      </p>
                      <p className="text-xs text-gray-400">
                        / {plan.durationDays}{" "}
                        {t("mine.businesses.days", "days")}
                      </p>
                    </div>
                  </div>

                  {plan.features?.length > 0 && (
                    <ul className="space-y-1.5 mb-1">
                      {plan.features.map((f, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm text-gray-600"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="px-6 pb-5">
                  <button
                    onClick={() => handleSelect(plan.id)}
                    disabled={isCurrent || !!selecting}
                    className={`w-full py-3 rounded-2xl font-bold text-sm transition-colors disabled:opacity-50 ${
                      isCurrent
                        ? "bg-green-50 text-green-700 cursor-default"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isLoading
                      ? t("mine.businesses.selecting", "Selecting…")
                      : isCurrent
                        ? t("mine.businesses.currentPlanBtn", "Current Plan")
                        : isExtend || business.planId
                          ? t("mine.businesses.renewWith", "Renew with") +
                            " " +
                            plan.name
                          : t("mine.businesses.selectPlanBtn", "Select") +
                            " " +
                            plan.name}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

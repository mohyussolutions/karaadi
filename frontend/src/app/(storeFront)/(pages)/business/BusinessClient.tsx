"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { IoBusiness } from "react-icons/io5";
import { Plus } from "lucide-react";
import {
  deleteBusiness,
  selectBusinessPlan,
  type Business,
} from "@/actions/categories/businessActions";
import type { BusinessPlan } from "@/actions/categories/businessPlanActions";

const CATEGORIES = [
  { id: "realestate",  labelKey: "mine.businesses.categories.realestate",  descKey: "mine.businesses.categories.realestateDesc" },
  { id: "schools",     labelKey: "mine.businesses.categories.schools",      descKey: "mine.businesses.categories.schoolsDesc" },
  { id: "motor",       labelKey: "mine.businesses.categories.motor",        descKey: "mine.businesses.categories.motorDesc" },
  { id: "marketplace", labelKey: "mine.businesses.categories.marketplace",  descKey: "mine.businesses.categories.marketplaceDesc" },
];

const STATUS_BADGE: Record<string, string> = {
  pending:   "bg-yellow-100 text-yellow-800",
  active:    "bg-green-100 text-green-800",
  inactive:  "bg-gray-100 text-gray-700",
  suspended: "bg-red-100 text-red-800",
};

export default function BusinessClient({
  businesses: initial,
  plans,
}: {
  businesses: Business[];
  plans: BusinessPlan[];
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const [businesses, setBusinesses] = useState(initial);
  const [selectingPlan, setSelectingPlan] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm(t("mine.businesses.delete") + "?")) return;
    const res = (await deleteBusiness(id)) as any;
    if (res?.success) setBusinesses((prev) => prev.filter((b) => b.id !== id));
  };

  const handleSelectPlan = async (businessId: string, planId: string) => {
    setSelectingPlan(planId);
    const res = (await selectBusinessPlan(businessId, planId)) as any;
    if (res?.success && res?.business)
      setBusinesses((prev) => prev.map((b) => (b.id === businessId ? res.business : b)));
    setSelectingPlan(null);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-6 space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <IoBusiness className="text-gray-700 text-4xl flex-shrink-0" />
          <h1 className="text-2xl font-bold text-gray-900 truncate">{t("mine.businesses.title")}</h1>
        </div>
        {businesses.length > 0 && (
          <button
            onClick={() => router.push("/business/register")}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 text-sm transition-colors flex-shrink-0"
          >
            <span className="hidden sm:inline">{t("mine.businesses.newBusiness")}</span>
            <span className="sm:hidden">+ New</span>
          </button>
        )}
      </div>

      {/* Business cards */}
      {businesses.length > 0 && (
        <div className="space-y-4">
          {businesses.map((b) => (
            <BusinessCard
              key={b.id}
              business={b}
              plans={plans}
              selectingPlan={selectingPlan}
              onDelete={handleDelete}
              onSelectPlan={handleSelectPlan}
              t={t}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {businesses.length === 0 && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div className="flex items-start gap-4 mb-4">
              <IoBusiness className="text-2xl text-gray-500 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{t("mine.businesses.noBusinessConnected")}</h2>
                <p className="text-base text-gray-600 mt-1">{t("mine.businesses.registerDesc")}</p>
              </div>
            </div>
            <button
              onClick={() => router.push("/business/register")}
              className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors text-base text-center"
            >
              {t("mine.businesses.registerBusiness")}
            </button>
          </div>

          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">{t("mine.businesses.benefits")}</h2>
            <ul className="space-y-3 mb-6">
              {(["benefit1", "benefit2", "benefit3", "benefit4"] as const).map((k) => (
                <li key={k} className="flex items-start gap-3 text-base text-gray-700">
                  <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">✓</span>
                  {t(`mine.businesses.${k}`)}
                </li>
              ))}
            </ul>
            <h3 className="font-semibold mb-4 text-base text-gray-900">{t("mine.businesses.advertiseIn")}</h3>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((cat) => (
                <div key={cat.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="font-medium text-sm text-gray-900">{t(cat.labelKey)}</div>
                  <div className="text-sm text-gray-500 mt-1 leading-snug">{t(cat.descKey)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BusinessCard({
  business: b,
  plans,
  selectingPlan,
  onDelete,
  onSelectPlan,
  t,
}: {
  business: Business;
  plans: BusinessPlan[];
  selectingPlan: string | null;
  onDelete: (id: string) => void;
  onSelectPlan: (businessId: string, planId: string) => void;
  t: (key: string) => string;
}) {
  const isActive    = b.status === "active";
  const hasPlan     = !!b.planId && !!b.expiryDate;
  const planExpired = hasPlan && new Date(b.expiryDate!) < new Date();
  const canPost     = isActive && hasPlan && !planExpired;
  const [showCats, setShowCats] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setShowCats(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="border rounded-xl bg-white shadow-sm overflow-hidden">

      <div className="p-6">
        <div className="flex items-start gap-4">
          <IoBusiness className="text-gray-500 text-4xl flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{b.name}</h3>
                <p className="text-sm text-gray-500 truncate">{b.email} · {b.phone}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {canPost && (
                  <div ref={dropRef} className="relative">
                    <button
                      onClick={() => setShowCats((v) => !v)}
                      className="flex items-center gap-1.5 bg-blue-600 text-white text-sm px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      New Listing
                    </button>
                    {showCats && (
                      <div className="absolute right-0 top-full mt-1 bg-white border rounded-xl shadow-lg z-20 min-w-[160px] overflow-hidden">
                        {b.categories.map((cat) => (
                          <Link
                            key={cat}
                            href={`/business/post/${cat}?businessId=${b.id}`}
                            onClick={() => setShowCats(false)}
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 capitalize"
                          >
                            {cat}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <button
                  onClick={() => onDelete(b.id)}
                  className="text-red-400 hover:text-red-600 text-sm px-3 py-1.5 rounded hover:bg-red-50 transition-colors"
                >
                  {t("mine.businesses.delete")}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-3">
              <span className={`text-sm px-3 py-1 rounded-full font-medium ${STATUS_BADGE[b.status] ?? "bg-gray-100 text-gray-700"}`}>
                {b.status}
              </span>
              {b.categories.map((cat) => (
                <span key={cat} className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{cat}</span>
              ))}
            </div>

            {b.website && (
              <a href={b.website} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline mt-2 block truncate">
                {b.website}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Progress steps */}
      <div className="border-t bg-gray-50 px-6 py-3">
        <div className="flex items-center gap-3 overflow-x-auto">
          <Step done label="Registered" />
          <div className="flex-shrink-0 w-8 h-px bg-gray-300" />
          <Step done={isActive && hasPlan && !planExpired} label="Plan active" />
          <div className="flex-shrink-0 w-8 h-px bg-gray-300" />
          <Step done={canPost} label="Can post" />
        </div>
      </div>

      <div className="p-6 pt-4">

        {/* Pending */}
        {b.status === "pending" && (
          <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <span className="text-yellow-500 text-lg flex-shrink-0">⏳</span>
            <p className="text-sm text-yellow-800">{t("mine.businesses.pendingVerification")}</p>
          </div>
        )}

        {/* Choose / renew plan */}
        {isActive && (!hasPlan || planExpired) && plans.length > 0 && (
          <div>
            <p className="text-base font-semibold text-gray-800 mb-4">
              {planExpired ? "Plan expired — choose a new one to keep posting." : t("mine.businesses.choosePlan")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div key={plan.id} className="border rounded-xl p-5 bg-white hover:border-blue-400 hover:shadow-sm transition-all flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-base text-gray-900">{plan.name}</span>
                    <span className="text-sm text-gray-400">{plan.durationDays}d</span>
                  </div>
                  <div className="text-sm text-gray-500 mb-4">{plan.maxListings} listings max</div>
                  <button
                    onClick={() => onSelectPlan(b.id, plan.id)}
                    disabled={selectingPlan === plan.id}
                    className="mt-auto w-full bg-blue-600 text-white py-2.5 rounded-lg text-base font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {selectingPlan === plan.id ? "Selecting…" : "Select"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Can post — category links */}
        {canPost && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-base text-green-700 font-medium flex items-center gap-2">
                <span>✓</span> {t("mine.businesses.canPostDesc")}
              </p>
              {b.expiryDate && (
                <span className="text-sm text-gray-400 flex-shrink-0">
                  Exp. {new Date(b.expiryDate).toLocaleDateString()}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {b.categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/business/post/${cat}?businessId=${b.id}`}
                  className="text-sm bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-center"
                >
                  <span className="truncate">{t("mine.businesses.postIn")} {cat}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {isActive && !hasPlan && plans.length === 0 && (
          <p className="text-sm text-gray-500">No plans available. Contact support.</p>
        )}
      </div>
    </div>
  );
}

function Step({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${done ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"}`}>
        {done ? "✓" : "·"}
      </span>
      <span className={`text-sm whitespace-nowrap ${done ? "text-green-700 font-medium" : "text-gray-400"}`}>{label}</span>
    </div>
  );
}

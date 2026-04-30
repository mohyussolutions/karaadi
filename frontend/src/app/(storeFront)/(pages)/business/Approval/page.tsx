"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { IoBusiness } from "react-icons/io5";
import { ChevronLeft, Clock, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getMyBusinesses } from "@/actions/categories/businessActions";
import type { Business } from "@/actions/categories/businessActions";
import BusinessStepper from "../steps/BusinessStepper";

export default function ApprovalPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const businessId = searchParams.get("businessId");
  const { user, loading: authLoading } = useAuth();

  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    const poll = async () => {
      try {
        const data = (await getMyBusinesses()) as any;
        const businesses: Business[] = data?.businesses ?? [];
        const found = businessId
          ? businesses.find((b) => b.id === businessId)
          : businesses[0];

        setBusiness(found ?? null);
        setLoading(false);

        if (found?.status === "active" && found.isVerified) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          toast.success(t("mine.businesses.approvedToast", "Business approved!"));
          router.push(
            found.planId
              ? `/business/post?businessId=${found.id}`
              : `/business/plan?businessId=${found.id}`,
          );
        }
      } catch {
        setLoading(false);
      }
    };

    poll();
    intervalRef.current = setInterval(poll, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [user, authLoading, businessId]);

  if (authLoading || loading) {
    return (
      <div className="max-w-xl mx-auto py-10 px-4 animate-pulse space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-200 rounded-xl" />
          <div className="w-12 h-12 bg-gray-200 rounded-2xl" />
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-gray-200 rounded w-40" />
            <div className="h-3 bg-gray-100 rounded w-32" />
          </div>
        </div>
        <div className="h-12 bg-gray-200 rounded-2xl" />
        <div className="h-72 bg-gray-200 rounded-3xl" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="max-w-xl mx-auto py-10 px-4 text-center space-y-4">
        <p className="text-gray-500">
          {t("mine.businesses.notFound", "Business not found.")}
        </p>
        <Link
          href="/business/Apply"
          className="inline-block text-blue-600 text-sm font-semibold hover:underline"
        >
          {t("mine.businesses.applyNew", "← Apply for a new business")}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/business/Apply"
          className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
          <IoBusiness className="text-2xl text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {t("mine.businesses.approvalTitle", "Application Status")}
          </h1>
          <p className="text-sm text-gray-500">{business.name}</p>
        </div>
      </div>

      <BusinessStepper active={2} businessId={business.id} />

      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="px-8 py-10 text-center space-y-4">
          {business.status === "pending" && (
            <>
              <div className="relative w-fit mx-auto">
                <Clock className="w-16 h-16 text-yellow-400" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping opacity-75" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {t("mine.businesses.pendingTitle", "Under Review")}
                </h2>
                <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">
                  {t(
                    "mine.businesses.pendingMessage",
                    "Your application is being reviewed. You will be notified once approved.",
                  )}
                </p>
                <p className="text-xs text-blue-500 mt-3 animate-pulse">
                  {t(
                    "mine.businesses.autoRefresh",
                    "Auto-checking every 5 seconds…",
                  )}
                </p>
              </div>
            </>
          )}

          {business.status === "rejected" && (
            <>
              <XCircle className="w-16 h-16 text-red-400 mx-auto" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {t("mine.businesses.rejectedTitle", "Application Rejected")}
                </h2>
                <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">
                  {t(
                    "mine.businesses.rejectedMessage",
                    "Your application was not approved. Please contact support or apply again.",
                  )}
                </p>
              </div>
            </>
          )}

          {business.status === "active" && business.isVerified && (
            <>
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {t("mine.businesses.approvedTitle", "Approved!")}
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  {t(
                    "mine.businesses.approvedMessage",
                    "Redirecting to plan selection…",
                  )}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="border-t border-gray-100 px-6 py-4 space-y-0">
          <DetailRow
            label={t("mine.businesses.companyName", "Company")}
            value={business.name}
          />
          <DetailRow
            label={t("mine.businesses.businessEmail", "Email")}
            value={business.email}
          />
          <DetailRow
            label={t("mine.businesses.phone", "Phone")}
            value={business.phone}
          />
          {business.address && (
            <DetailRow
              label={t("mine.businesses.address", "Address")}
              value={business.address}
            />
          )}
          {business.categories?.length > 0 && (
            <DetailRow
              label={t("mine.businesses.categories", "Categories")}
              value={business.categories.join(", ")}
            />
          )}
          <DetailRow
            label={t("mine.businesses.status", "Status")}
            value={
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  business.status === "active"
                    ? "bg-green-100 text-green-700"
                    : business.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {business.status}
              </span>
            }
          />
        </div>

        <div className="px-6 pb-6 pt-2 space-y-3">
          {business.status === "rejected" && (
            <Link
              href="/business/Apply"
              className="flex items-center justify-center w-full bg-blue-600 text-white py-3 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-colors"
            >
              {t("mine.businesses.applyAgain", "Apply Again")}
            </Link>
          )}
          {business.status === "active" &&
            business.isVerified &&
            !business.planId && (
              <Link
                href={`/business/plan?businessId=${business.id}`}
                className="flex items-center justify-center w-full bg-blue-600 text-white py-3 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-colors"
              >
                {t("mine.businesses.selectPlan", "Select a Plan →")}
              </Link>
            )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-900 text-right max-w-[55%] truncate">
        {value}
      </span>
    </div>
  );
}

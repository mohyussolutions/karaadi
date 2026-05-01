"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { IoBusiness } from "react-icons/io5";
import { AlertTriangle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getMyBusinesses } from "@/actions/categories/businessActions";
import type { Business } from "@/actions/categories/businessActions";
import BusinessStepper from "../steps/BusinessStepper";
import RealEstateForm from "./forms/RealEstateForm";
import MotorForm from "./forms/MotorForm";
import MotorcycleForm from "./forms/MotorcycleForm";
import MarketplaceForm from "./forms/MarketplaceForm";
import BoatForm from "./forms/BoatForm";
import FarmEquipmentForm from "./forms/FarmEquipmentForm";
import { toast } from "react-toastify";
import {
  CategoryKey,
  CategoryNavbar,
} from "@/app/(storeFront)/components/navbar/categories/BusinessCategoryNavbar";

export default function PostPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const businessId = searchParams.get("businessId") ?? "";

  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(
    null,
  );
  const [isExpired, setIsExpired] = useState(false);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    getMyBusinesses().then((data: any) => {
      const businesses: Business[] = data?.businesses ?? [];
      const found = businessId
        ? businesses.find((b) => b.id === businessId)
        : businesses.find(
            (b) => b.status === "active" && b.isVerified && b.planId,
          );
      if (found?.expiryDate)
        setIsExpired(new Date(found.expiryDate) < new Date());
      setBusiness(found ?? null);
      setSelectedCategory("realestate");
      setLoading(false);
    });
  }, [user, authLoading, businessId]);

  const userId = (user as any)?._id || (user as any)?.id || "";

  const handleCategorySelect = (category: CategoryKey) => {
    setSelectedCategory(category);
    setFormKey((k) => k + 1);
  };

  const handleSuccess = () => {
    toast.success("Ad posted successfully!");
    setFormKey((k) => k + 1);
  };

  const renderFormContent = () => {
    if (authLoading || loading) {
      return (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent" />
          <p className="text-sm text-gray-400">Loading…</p>
        </div>
      );
    }

    if (!business) {
      return (
        <div className="text-center space-y-4 py-8">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
          <div>
            <p className="font-semibold text-gray-700">
              {t(
                "mine.businesses.noActiveBusiness",
                "No active business with a plan found.",
              )}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {t(
                "mine.businesses.completeSteps",
                "Complete the previous steps to get here.",
              )}
            </p>
          </div>
          <button
            onClick={() => router.push("/business/Apply")}
            className="text-blue-600 text-sm font-semibold hover:underline"
          >
            {t("mine.businesses.goApply", "← Go to Apply")}
          </button>
        </div>
      );
    }

    if (isExpired) {
      return (
        <div className="text-center space-y-4 py-8">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto" />
          <div>
            <p className="font-semibold text-gray-700">
              {t("mine.businesses.planExpired", "Your plan has expired.")}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {t(
                "mine.businesses.renewToPost",
                "Renew your plan to continue posting ads.",
              )}
            </p>
          </div>
          <button
            onClick={() =>
              router.push(`/business/plan?businessId=${business.id}&extend=1`)
            }
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
          >
            {t("mine.businesses.renewPlan", "Renew Plan →")}
          </button>
        </div>
      );
    }

    if (!selectedCategory || !userId) return null;

    const props = {
      businessId: business.id,
      userId,
      onSuccess: handleSuccess,
    };

    switch (selectedCategory) {
      case "realestate":
        return <RealEstateForm key={formKey} {...props} />;
      case "motor":
        return <MotorForm key={formKey} {...props} />;
      case "motorcycles":
        return <MotorcycleForm key={formKey} {...props} />;
      case "boats":
        return <BoatForm key={formKey} {...props} />;
      case "farmequipment":
        return <FarmEquipmentForm key={formKey} {...props} />;
      case "marketplace":
        return (
          <MarketplaceForm
            key={formKey}
            {...props}
            mainCategory="Marketplace"
          />
        );
      case "schools":
        return (
          <MarketplaceForm key={formKey} {...props} mainCategory="Schools" />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      {/* Page header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
          <IoBusiness className="text-2xl text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {t("mine.businesses.postTitle", "Post an Ad")}
          </h1>
          <p className="text-sm text-gray-500">
            {loading || authLoading ? "…" : (business?.name ?? "")}
          </p>
        </div>
      </div>

      {/* Step 4 indicator — always visible */}
      <BusinessStepper active={4} businessId={business?.id} />

      {/* Category navbar — always visible */}
      <CategoryNavbar
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />

      {/* Form area */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm px-6 py-6">
        {renderFormContent()}
      </div>
    </div>
  );
}

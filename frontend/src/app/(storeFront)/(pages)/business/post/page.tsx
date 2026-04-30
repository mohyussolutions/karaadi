"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { IoBusiness } from "react-icons/io5";
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

  if (authLoading || loading) {
    return (
      <div className="max-w-xl mx-auto py-10 px-4 animate-pulse space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-2xl" />
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-gray-200 rounded w-40" />
            <div className="h-3 bg-gray-100 rounded w-32" />
          </div>
        </div>
        <div className="h-12 bg-gray-200 rounded-2xl" />
        <div className="h-24 bg-gray-200 rounded-3xl" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="max-w-xl mx-auto py-10 px-4 text-center space-y-4">
        <p className="text-gray-500">
          {t(
            "mine.businesses.noActiveBusiness",
            "No active business with a plan found.",
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

  const userId = (user as any)?._id || (user as any)?.id || "";

  const renderForm = () => {
    if (!selectedCategory || !userId || isExpired) return null;
    const props = {
      businessId: business.id,
      userId,
      onSuccess: () => {
        toast.success("Ad posted successfully!");
        setFormKey((k) => k + 1);
      },
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
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
          <IoBusiness className="text-2xl text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {t("mine.businesses.postTitle", "Post an Ad")}
          </h1>
          <p className="text-sm text-gray-500">{business.name}</p>
        </div>
      </div>

      <BusinessStepper active={4} businessId={business.id} />

      <CategoryNavbar
        selectedCategory={selectedCategory}
        onSelectCategory={(category) => {
          setSelectedCategory(category);
          setFormKey((k) => k + 1);
        }}
      />

      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm px-6 py-6">
        {renderForm()}
      </div>
    </div>
  );
}

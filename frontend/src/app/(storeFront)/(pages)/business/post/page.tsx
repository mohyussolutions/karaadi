"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { AlertTriangle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getMyBusinesses } from "@/actions/categories/businessActions";
import type { Business } from "@/actions/categories/businessActions";
import { CategoryKey } from "@/app/(links)/storeFrontLinks/businessCategoriesConfig";
import { BusinessCategoryGrid } from "@/app/(storeFront)/components/navbar/categories/BusinessCategoryNavbar";
import BusinesscheckupSteps from "@/app/(storeFront)/components/checkout/BusinesscheckupSteps";
import { Loading } from "@/app/ui/loading";
import RealEstateForm from "@/app/(storeFront)/components/forms/RealEstateForm";
import CarsForm from "@/app/(storeFront)/components/forms/CarsForm";
import BoatsForm from "@/app/(storeFront)/components/forms/BoatsForm";
import MotorcyclesForm from "@/app/(storeFront)/components/forms/MotorcyclesForm";
import FarmEquipmentForm from "@/app/(storeFront)/components/forms/FarmEquipmentForm";
import MarketplaceForm from "@/app/(storeFront)/components/forms/marketplaceForm";

export default function PostPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const businessIdParam = searchParams.get("businessId") ?? "";
  const categoryParam = searchParams.get("category") as CategoryKey | null;

  const VALID_CATEGORIES: CategoryKey[] = ["realestate", "motor", "motorcycles", "boats", "farmequipment", "marketplace", "schools"];

  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [listingCount, setListingCount] = useState({ current: 0, max: 0 });
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace("/login"); return; }
    getMyBusinesses().then((data: any) => {
      const businesses: Business[] = data?.businesses ?? [];
      const found = businessIdParam
        ? businesses.find((b) => b.id === businessIdParam)
        : businesses.find((b) => b.status === "active" && b.isVerified && b.planId);
      if (found?.expiryDate) setIsExpired(new Date(found.expiryDate) < new Date());
      setBusiness(found ?? null);
      if (found) {
        const max: number = (found as any).maxListingsOverride ?? (found as any).plan?.maxListings ?? Infinity;
        const current: number = (found as any).currentListings ?? 0;
        setListingCount({ current, max: isFinite(max) ? max : 0 });
        setIsLimitReached(isFinite(max) && current >= max);
      }
      const initial = categoryParam && VALID_CATEGORIES.includes(categoryParam) ? categoryParam : "realestate";
      setSelectedCategory(initial);
      setLoading(false);
    });
  }, [user, authLoading, businessIdParam]);

  const handleCategorySelect = (category: CategoryKey) => {
    setSelectedCategory(category);
    setFormKey((k) => k + 1);
  };

  const handleSuccess = () => {
    setFormKey((k) => k + 1);
    setListingCount((prev) => {
      const next = { ...prev, current: prev.current + 1 };
      if (prev.max > 0) setIsLimitReached(next.current >= next.max);
      return next;
    });
  };

  const renderForm = () => {
    if (authLoading || loading) return <Loading />;

    if (!business) {
      return (
        <div className="text-center space-y-4 py-8">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
          <p className="font-semibold text-gray-700">
            {t("mine.businesses.noActiveBusiness", "No active business with a plan found.")}
          </p>
          <p className="text-sm text-gray-400">
            {t("mine.businesses.completeSteps", "Complete the previous steps to get here.")}
          </p>
          <button onClick={() => router.push("/business/Apply")} className="text-blue-600 text-sm font-semibold hover:underline">
            {t("mine.businesses.goApply", "← Go to Apply")}
          </button>
        </div>
      );
    }

    if (isExpired) {
      return (
        <div className="text-center space-y-4 py-8">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto" />
          <p className="font-semibold text-gray-700">{t("mine.businesses.planExpired", "Your plan has expired.")}</p>
          <p className="text-sm text-gray-400">{t("mine.businesses.renewToPost", "Renew your plan to continue posting ads.")}</p>
          <button
            onClick={() => router.push(`/business/plan?businessId=${business.id}&extend=1`)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
          >
            {t("mine.businesses.renewPlan", "Renew Plan →")}
          </button>
        </div>
      );
    }

    if (isLimitReached) {
      return (
        <div className="text-center space-y-4 py-8">
          <AlertTriangle className="w-12 h-12 text-orange-400 mx-auto" />
          <p className="font-semibold text-gray-700">
            {t("mine.businesses.limitReached", "You have reached your listing limit.")}
          </p>
          <p className="text-sm text-gray-400">
            {listingCount.current} / {listingCount.max} {t("mine.businesses.listingsUsed", "listings used")}
          </p>
          <button
            onClick={() => router.push(`/business/plan?businessId=${business.id}&extend=1`)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
          >
            {t("mine.businesses.upgradePlan", "Upgrade Plan →")}
          </button>
        </div>
      );
    }

    if (!selectedCategory) return null;

    const shared = { businessId: business.id, onNext: handleSuccess };

    switch (selectedCategory) {
      case "realestate":    return <RealEstateForm key={formKey} {...shared} />;
      case "motor":         return <CarsForm key={formKey} {...shared} />;
      case "motorcycles":   return <MotorcyclesForm key={formKey} {...shared} />;
      case "boats":         return <BoatsForm key={formKey} {...shared} />;
      case "farmequipment": return <FarmEquipmentForm key={formKey} {...shared} />;
      case "marketplace":   return <MarketplaceForm key={formKey} {...shared} mainCategory="Marketplace" />;
      case "schools":       return <MarketplaceForm key={formKey} {...shared} mainCategory="Schools" />;
      default:              return null;
    }
  };

  return (
    <div className="py-10 flex flex-col gap-6" suppressHydrationWarning>
      <BusinesscheckupSteps active={4} businessId={business?.id} />

      {business && listingCount.max > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-black text-gray-400 uppercase tracking-wider">Listings</span>
              <span className={`text-xs font-black ${isLimitReached ? "text-red-500" : "text-gray-600"}`}>
                {listingCount.current} / {listingCount.max}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${isLimitReached ? "bg-red-500" : listingCount.current / listingCount.max >= 0.8 ? "bg-amber-400" : "bg-blue-500"}`}
                style={{ width: `${Math.min(100, (listingCount.current / listingCount.max) * 100)}%` }}
              />
            </div>
          </div>
          {isLimitReached && (
            <span className="text-[10px] font-black text-red-500 uppercase bg-red-50 px-2 py-1 rounded-full whitespace-nowrap">Limit Reached</span>
          )}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm px-2 py-2">
        <BusinessCategoryGrid
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm px-6 py-6">
        {renderForm()}
      </div>
    </div>
  );
}

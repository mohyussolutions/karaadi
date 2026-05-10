"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdAttachMoney } from "@/app/utils/icons";
import { useImageUpload } from "@/app/(storeFront)/components/shared/ImageUpload/useImageUpload";
import ImageUpload from "@/app/(storeFront)/components/shared/ImageUpload/ImageUpload";
import { FaShoppingBag } from "react-icons/fa";
import Loading from "@/app/ui/loading/Loading";
import { createMarketplaceItem } from "@/actions/categories/marketplaceActions";
import { getAllRegions, getAllCities } from "@/actions/categories/geoAction";
import CitySelect from "@/app/(storeFront)/components/shared/CitySelect/CitySelect";
import { categories as nesCategories } from "@/app/(links)/storeFrontLinks/mainCategotyCategorySubCategory";
import { useAuth } from "@/context/AuthContext";
import { useAppDispatch, useAppSelector } from "@/store/slices/hooks/hooks";
import { updateItem } from "@/store/slices/reducers/listingDraftSlice";
import { getMarketplaceFees } from "@/actions/categories/feeAction";
import CheckoutSteps from "@/app/(storeFront)/components/checkout/CheckoutSteps";
import SelectField from "./SelectField";

const MARKETPLACE_CATEGORIES = [
  { key: "antiques", label: "Antiques & Art" },
  { key: "electronics", label: "Electronics" },
  { key: "animalAndSupplies", label: "Animals & Supplies" },
  { key: "sportsAndOutdoors", label: "Sports & Outdoors" },
  { key: "furniture", label: "Furniture" },
  { key: "fashion", label: "Fashion" },
];
const SCHOOL_CATEGORIES = [
  { key: "primarySchool", label: "Primary School" },
  { key: "secondarySchool", label: "Secondary School" },
  { key: "university", label: "University / College" },
  { key: "vocationalTraining", label: "Vocational Training" },
  { key: "onlineCourses", label: "Online Courses" },
  { key: "tuition", label: "Tutoring / Tuition" },
  { key: "other", label: "Other" },
];
const MARKETPLACE_FEE_MAPPING: Record<string, string> = { antiques: "art", electronics: "electronics", animalAndSupplies: "animal", sportsAndOutdoors: "sports", furniture: "furniture", fashion: "fashion" };
const CONDITION_OPTIONS = ["New", "Used – Like New", "Used – Good", "Used – Fair"];

export default function MarketplaceForm({ onNext, businessId, mainCategory = "Marketplace" }: { onNext: () => void; businessId?: string; mainCategory?: "Marketplace" | "Schools" }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const savedItem = useAppSelector((state) => state.listingDraft.item) ?? {};

  const [isLoading, setIsLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [regions, setRegions] = useState<any[]>([]);
  const [allCities, setAllCities] = useState<any[]>([]);
  const { images, addImages, removeImage, toBase64 } = useImageUpload();
  const [activeFeeConfig, setActiveFeeConfig] = useState<any>(null);

  const [formData, setFormData] = useState({
    mainCategory: "Marketplace",
    category: typeof savedItem.category === "string" ? savedItem.category : Array.isArray(savedItem.category) && savedItem.category.length > 0 ? savedItem.category[0] : "",
    subCategory: typeof savedItem.subCategory === "string" ? savedItem.subCategory : Array.isArray(savedItem.subCategory) && savedItem.subCategory.length > 0 ? savedItem.subCategory[0] : "",
    title: savedItem.title || "",
    description: savedItem.description || "",
    price: savedItem.price || "",
    region: savedItem.region || "",
    city: savedItem.city || "",
    condition: savedItem.condition || "",
    website: (savedItem as any).website || "",
  });

  useEffect(() => { if (!authLoading && !user) router.push("/login"); }, [user, authLoading, router]);

  useEffect(() => {
    const load = async () => {
      try {
        const [regs, cits, feeRes] = await Promise.all([getAllRegions(), getAllCities(), getMarketplaceFees()]);
        setRegions(regs || []);
        setAllCities(cits || []);
        setActiveFeeConfig(Array.isArray(feeRes) ? feeRes[0] || {} : feeRes || {});
      } catch {} finally { setDataLoading(false); }
    };
    load();
  }, []);

  const getFee = useCallback((cat: string) => activeFeeConfig ? Number(activeFeeConfig[MARKETPLACE_FEE_MAPPING[cat]] || 0) : 0, [activeFeeConfig]);
  const getNestedSubcategories = () => formData.category ? (nesCategories.marketplaceNestedMap as any)[formData.category] || [] : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isLoading) return;
    if (["category", "subCategory", "price", "title", "description", "condition", "region", "city"].some((k) => !(formData as any)[k]) || images.length === 0) {
      return toast.error(t("createMotorcycle.fillRequired"));
    }
    setIsLoading(true);
    const toastId = toast.loading(t("createMotorcycle.registering"));
    try {
      const imagesBase64 = await toBase64();
      const fee = getFee(formData.category);
      const payload = {
        userId: user._id || user.id, title: formData.title,
        description: formData.description, price: Number(formData.price), mainCategory,
        category: formData.category ? [formData.category] : [],
        subcategory: formData.subCategory ? [formData.subCategory] : [],
        categoryTag: formData.category, condition: formData.condition,
        region: formData.region, city: formData.city, images: imagesBase64, isPaid: false, feeAmount: fee, businessId: businessId || undefined, website: formData.website || undefined,
      };
      const result: any = await createMarketplaceItem(payload, user.token || (user as any).accessToken);
      const createdId = result.id || result._id;
      if (result.success && createdId) {
        toast.update(toastId, { render: t("createMotorcycle.successMessage"), type: "success", isLoading: false, autoClose: 2000 });
        dispatch(updateItem({ ...payload, id: String(createdId) }));
        setTimeout(() => onNext(), 1200);
      } else {
        toast.update(toastId, { render: result.error || result.message || t("createMotorcycle.errorMessage"), type: "error", isLoading: false, autoClose: 3000 });
      }
    } catch {
      toast.update(toastId, { render: t("createMotorcycle.errorMessage"), type: "error", isLoading: false, autoClose: 3000 });
    } finally { setIsLoading(false); }
  };

  if (authLoading || dataLoading) return <div className="h-screen flex items-center justify-center"><Loading /></div>;

  const catOptions = (mainCategory === "Schools" ? SCHOOL_CATEGORIES : MARKETPLACE_CATEGORIES).map((c) => ({ value: c.key, label: c.label }));
  const subCatOptions = getNestedSubcategories().map((s: any) => ({ value: s.labelKey || s.key || s, label: t(s.labelKey || s.name || s) }));
  const conditionOptions = CONDITION_OPTIONS.map((c) => ({ value: c, label: c }));
  const regionOptions = regions.map((r) => ({ value: r.id, label: r.name }));

  return (
    <div className="rounded-3xl border border-gray-100 shadow-sm p-6 md:p-10">
      {!businessId && <CheckoutSteps step1 step2 />}
      <div className="text-center mb-10">
        <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"><FaShoppingBag className="text-4xl text-blue-600" /></div>
        <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">Create Marketplace Listing</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">Main Category</label>
          <div className="flex items-center gap-3 w-full border-2 border-blue-100 bg-blue-50/30 p-4 rounded-2xl">
            <FaShoppingBag className="text-blue-500" />
            <input type="text" readOnly value={formData.mainCategory} className="bg-transparent outline-none font-black text-blue-700 w-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">Category Tag</label>
            <SelectField value={formData.category} onChange={(v) => setFormData({ ...formData, category: v, subCategory: "" })} options={catOptions} placeholder="Select Category" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">Subcategory</label>
            <SelectField value={formData.subCategory} onChange={(v) => setFormData({ ...formData, subCategory: v })} options={subCatOptions} placeholder="Select Subcategory" disabled={!formData.category} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">Title</label>
          <input placeholder="e.g. Samsung Galaxy S23 – Excellent Condition" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} maxLength={200} className="w-full border-2 border-gray-100 bg-gray-50 p-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold" required />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">Condition</label>
          <SelectField value={formData.condition} onChange={(v) => setFormData({ ...formData, condition: v })} options={conditionOptions} placeholder="Select Condition" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">Description</label>
            <textarea placeholder="Describe your item in detail..." rows={5} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} maxLength={5000} className="w-full border-2 border-gray-100 bg-gray-50 p-4 rounded-2xl outline-none font-bold" required />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">Region</label>
            <SelectField value={formData.region} onChange={(v) => setFormData({ ...formData, region: v, city: "" })} options={regionOptions} placeholder="Select Region" />
          </div>
        </div>

        <CitySelect regionId={formData.region} cities={allCities} value={formData.city} onChange={(name) => setFormData({ ...formData, city: name })} onCitiesUpdate={(u) => setAllCities(u)} disabled={!formData.region} />

        {businessId && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">Website</label>
              <span className="text-[10px] font-black text-blue-400 uppercase bg-blue-50 px-2 py-0.5 rounded-full">Optional</span>
            </div>
            <input type="url" placeholder="https://yourwebsite.com" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} maxLength={512} className="w-full border-2 border-gray-100 bg-gray-50 p-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold" />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Price ($)</label>
          <div className="relative">
            <MdAttachMoney className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 text-xl" />
            <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} min={0} max={100000000} className="w-full border-2 border-gray-100 bg-gray-50 pl-12 pr-4 py-4 rounded-2xl font-bold text-blue-600 outline-none focus:border-blue-500" required />
          </div>
        </div>

        <div className="p-6 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50">
          <ImageUpload images={images} onAdd={addImages} onRemove={removeImage} label={t("createMotorcycle.upload")} />
        </div>

        <button type="submit" disabled={isLoading} className="w-full py-5 rounded-2xl bg-blue-600 text-white font-black text-xl shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:bg-gray-200 flex items-center justify-center">
          {isLoading ? <div className="animate-spin h-6 w-6 border-4 border-white border-t-transparent rounded-full" /> : t("createMotorcycle.submit")}
        </button>
      </form>
    </div>
  );
}

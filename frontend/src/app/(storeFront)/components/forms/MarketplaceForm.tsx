"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { BASE_API_URL } from "@/actions/constant/BASE_API_URL";
import { useLanguage } from "@/app/(storeFront)/components/hooks/useLanguage";
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
  { key: "antiques", labelKey: "subcategories.marketplace.antiques" },
  { key: "electronics", labelKey: "subcategories.marketplace.electronics" },
  { key: "animalAndSupplies", labelKey: "subcategories.marketplace.animalAndSupplies" },
  { key: "sportsAndOutdoors", labelKey: "subcategories.marketplace.sportsAndOutdoors" },
  { key: "furniture", labelKey: "subcategories.marketplace.furniture" },
  { key: "fashion", labelKey: "subcategories.marketplace.fashion" },
];
const SCHOOL_CATEGORIES = [
  { key: "primarySchool", labelKey: "school.primarySchool" },
  { key: "secondarySchool", labelKey: "school.secondarySchool" },
  { key: "university", labelKey: "school.university" },
  { key: "vocationalTraining", labelKey: "school.vocationalTraining" },
  { key: "onlineCourses", labelKey: "school.onlineCourses" },
  { key: "tuition", labelKey: "school.tuition" },
  { key: "other", labelKey: "school.other" },
];
const MARKETPLACE_FEE_MAPPING: Record<string, string> = { antiques: "art", electronics: "electronics", animalAndSupplies: "animal", sportsAndOutdoors: "sports", furniture: "furniture", fashion: "fashion" };

const CONDITION_KEYS = [
  { value: "New", key: "createMarketplace.conditions.new" },
  { value: "Used – Like New", key: "createMarketplace.conditions.usedLikeNew" },
  { value: "Used – Good", key: "createMarketplace.conditions.usedGood" },
  { value: "Used – Fair", key: "createMarketplace.conditions.usedFair" },
];

export default function MarketplaceForm({ onNext, businessId, mainCategory = "Marketplace" }: { onNext: () => void; businessId?: string; mainCategory?: "Marketplace" | "Schools" }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { activeLanguage } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const savedItem = useAppSelector((state) => state.listingDraft.item) ?? {};

  const [isLoading, setIsLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [descTouched, setDescTouched] = useState(false);
  const [regions, setRegions] = useState<any[]>([]);
  const [allCities, setAllCities] = useState<any[]>([]);
  const [customCats, setCustomCats] = useState<{ key: string; nameEn: string; nameSo: string; subcategories: { key: string; nameEn: string; nameSo: string }[] }[]>([]);
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
        const [regs, cits, feeRes, catsRes] = await Promise.all([
          getAllRegions(),
          getAllCities(),
          getMarketplaceFees(),
          fetch(`${BASE_API_URL}/api/marketplace-categories`).then(r => r.ok ? r.json() : []).catch(() => []),
        ]);
        setRegions(regs || []);
        setAllCities(cits || []);
        setActiveFeeConfig(Array.isArray(feeRes) ? feeRes[0] || {} : feeRes || {});
        setCustomCats(Array.isArray(catsRes) ? catsRes : []);
      } catch {} finally { setDataLoading(false); }
    };
    load();
  }, []);

  const descHasLink = /https?:\/\/|www\./i.test(formData.description);
  const descError = descTouched
    ? formData.description.length < 10
      ? t("createMarketplace.descTooShort", "Description must be at least 10 characters")
      : descHasLink
      ? t("createMarketplace.descNoLinks", "Links are not allowed in the description")
      : null
    : null;

  const getFee = useCallback((cat: string) => activeFeeConfig ? Number(activeFeeConfig[MARKETPLACE_FEE_MAPPING[cat]] || 0) : 0, [activeFeeConfig]);
  const isSo = activeLanguage === "so";
  const getNestedSubcategories = (): { value: string; label: string }[] => {
    if (!formData.category) return [];
    const dbCat = customCats.find(c => c.key === formData.category);
    if (dbCat?.subcategories.length) {
      return dbCat.subcategories.map(s => ({ value: s.key, label: isSo ? s.nameSo : s.nameEn }));
    }
    const hardcoded = (nesCategories.marketplaceNestedMap as any)[formData.category];
    return (hardcoded || []).map((s: any) => ({ value: s.key, label: t(s.labelKey, { defaultValue: s.name || s.key }) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isLoading) return;
    setDescTouched(true);
    if (formData.description.length < 10) return toast.error(t("createMarketplace.descTooShort", "Description must be at least 10 characters"));
    if (descHasLink) return toast.error(t("createMarketplace.descNoLinks", "Links are not allowed in the description"));
    if (["category", "subCategory", "price", "title", "description", "condition", "region", "city"].some((k) => !(formData as any)[k]) || images.length === 0) {
      return toast.error(t("createMarketplace.fillRequired"));
    }
    setIsLoading(true);
    const toastId = toast.loading(t("createMarketplace.registering"));
    try {
      const imagesBase64 = await toBase64();
      const fee = getFee(formData.category);
      const payload = {
        userId: user._id || user.id, title: formData.title,
        description: formData.description, price: Number(formData.price), mainCategory,
        category: formData.category ? [formData.category] : [],
        subcategory: formData.subCategory ? [formData.subCategory] : [],
        categoryTag: formData.category, condition: formData.condition,
        region: regions.find((r) => r.id === formData.region)?.name || formData.region,
        city: formData.city, images: imagesBase64, isPaid: false, feeAmount: fee, businessId: businessId || undefined, website: formData.website || undefined,
      };
      const result: any = await createMarketplaceItem(payload, user.token || (user as any).accessToken);
      const createdId = result.id || result._id;
      if (result.success && createdId) {
        toast.update(toastId, { render: t("createMarketplace.successMessage"), type: "success", isLoading: false, autoClose: 2000 });
        dispatch(updateItem({ ...payload, id: String(createdId) }));
        setTimeout(() => onNext(), 1200);
      } else {
        toast.update(toastId, { render: result.error || result.message || t("createMarketplace.errorMessage"), type: "error", isLoading: false, autoClose: 3000 });
      }
    } catch {
      toast.update(toastId, { render: t("createMarketplace.errorMessage"), type: "error", isLoading: false, autoClose: 3000 });
    } finally { setIsLoading(false); }
  };

  if (authLoading || dataLoading) return <div className="h-screen flex items-center justify-center"><Loading /></div>;

  const catOptions = mainCategory === "Schools"
    ? SCHOOL_CATEGORIES.map(c => ({ value: c.key, label: t(c.labelKey, { defaultValue: c.key }) }))
    : customCats.length > 0
      ? customCats.map(c => ({ value: c.key, label: isSo ? c.nameSo : c.nameEn }))
      : MARKETPLACE_CATEGORIES.map(c => ({ value: c.key, label: t(c.labelKey, { defaultValue: c.key }) }));
  const subCatOptions = getNestedSubcategories();
  const conditionOptions = CONDITION_KEYS.map((c) => ({ value: c.value, label: t(c.key, { defaultValue: c.value }) }));
  const regionOptions = regions.map((r) => ({ value: r.id, label: r.name }));

  return (
    <div className="rounded-3xl border border-gray-100 shadow-sm p-6 md:p-10">
      {!businessId && <CheckoutSteps step1 step2 />}
      <div className="text-center mb-10">
        <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"><FaShoppingBag className="text-4xl text-blue-600" /></div>
        <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">{t("createMarketplace.heading")}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">{t("createMarketplace.mainCategoryLabel")}</label>
          <div className="flex items-center gap-3 w-full border-2 border-blue-100 bg-blue-50/30 p-4 rounded-2xl">
            <FaShoppingBag className="text-blue-500" />
            <input type="text" readOnly value={formData.mainCategory} className="bg-transparent outline-none font-black text-blue-700 w-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">{t("createMarketplace.categoryLabel")}</label>
            <SelectField value={formData.category} onChange={(v) => setFormData({ ...formData, category: v, subCategory: "" })} options={catOptions} placeholder={t("createMarketplace.selectCategory")} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">{t("createMarketplace.subCategoryLabel")}</label>
            <SelectField value={formData.subCategory} onChange={(v) => setFormData({ ...formData, subCategory: v })} options={subCatOptions} placeholder={t("createMarketplace.selectSubcategory")} disabled={!formData.category} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">{t("createMarketplace.titleLabel")}</label>
          <input placeholder={t("createMarketplace.titlePlaceholder")} value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} maxLength={200} className="w-full border-2 border-gray-100 bg-gray-50 p-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold" required />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">{t("createMarketplace.conditionLabel")}</label>
          <SelectField value={formData.condition} onChange={(v) => setFormData({ ...formData, condition: v })} options={conditionOptions} placeholder={t("createMarketplace.selectCondition")} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">{t("createMarketplace.descriptionLabel")}</label>
            <textarea
              placeholder={t("createMarketplace.descriptionPlaceholder")}
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              onBlur={() => setDescTouched(true)}
              maxLength={5000}
              className={`w-full border-2 p-4 rounded-2xl outline-none font-bold transition-colors ${
                descError
                  ? "border-red-400 bg-red-50 focus:border-red-500"
                  : "border-gray-100 bg-gray-50 focus:border-blue-500"
              }`}
              required
            />
            {descError && <p className="text-xs font-bold text-red-500 ml-1">{descError}</p>}
            <p className="text-[11px] text-gray-400 ml-1">{formData.description.length}/5000</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">{t("createMarketplace.regionLabel")}</label>
            <SelectField value={formData.region} onChange={(v) => setFormData({ ...formData, region: v, city: "" })} options={regionOptions} placeholder={t("createMarketplace.selectRegion")} />
          </div>
        </div>

        <CitySelect regionId={formData.region} cities={allCities} value={formData.city} onChange={(name) => setFormData({ ...formData, city: name })} onCitiesUpdate={(u) => setAllCities(u)} disabled={!formData.region} />

        {businessId && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">{t("createMarketplace.websiteLabel")}</label>
              <span className="text-[10px] font-black text-blue-400 uppercase bg-blue-50 px-2 py-0.5 rounded-full">{t("createMarketplace.optional")}</span>
            </div>
            <input type="url" placeholder={t("createMarketplace.websitePlaceholder")} value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} maxLength={512} className="w-full border-2 border-gray-100 bg-gray-50 p-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold" />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{t("createMarketplace.priceLabel")}</label>
          <div className="relative">
            <MdAttachMoney className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 text-xl" />
            <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} min={0} max={100000000} className="w-full border-2 border-gray-100 bg-gray-50 pl-12 pr-4 py-4 rounded-2xl font-bold text-blue-600 outline-none focus:border-blue-500" required />
          </div>
        </div>

        <div className="p-6 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50">
          <ImageUpload images={images} onAdd={addImages} onRemove={removeImage} label={t("createMarketplace.upload")} />
        </div>

        <button type="submit" disabled={isLoading} className="w-full py-5 rounded-2xl bg-blue-600 text-white font-black text-xl shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:bg-gray-200 flex items-center justify-center">
          {isLoading ? <div className="animate-spin h-6 w-6 border-4 border-white border-t-transparent rounded-full" /> : t("createMarketplace.submit")}
        </button>
      </form>
    </div>
  );
}

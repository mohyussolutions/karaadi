"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdAttachMoney } from "@/app/utils/icons";
import { useImageUpload } from "@/app/(storeFront)/components/shared/ImageUpload/useImageUpload";
import ImageUpload from "@/app/(storeFront)/components/shared/ImageUpload/ImageUpload";
import { FaShip } from "@/app/utils/icons";
import Loading from "@/app/ui/loading/Loading";
import { createBoat } from "@/actions/categories/boatActions";
import { getAllRegions, getAllCities } from "@/actions/categories/geoAction";
import CitySelect from "@/app/(storeFront)/components/shared/CitySelect/CitySelect";
import { categories as nesCategories } from "@/app/(links)/storeFrontLinks/mainCategotyCategorySubCategory";
import { useAuth } from "@/context/AuthContext";
import { useAppDispatch, useAppSelector } from "@/store/slices/hooks/hooks";
import { updateItem } from "@/store/slices/reducers/listingDraftSlice";
import { CreateBoatPayload } from "@/app/utils/types/boats.types";
import { getBoatFees } from "@/actions/categories/feeAction";
import CheckoutSteps from "@/app/(storeFront)/components/checkout/CheckoutSteps";
import SelectField from "./SelectField";

const BOAT_CATEGORIES = [
  { key: "boatsForSale", labelKey: "boatsForSale" },
  { key: "boatsForRent", labelKey: "boatsForRent" },
  { key: "boatEnginesForSale", labelKey: "boatEnginesForSale" },
  { key: "boatParts", labelKey: "boatParts" },
];
const BOAT_FEE_MAPPING: Record<string, string> = { boatsForSale: "boatSale", boatsForRent: "boatRent", boatEnginesForSale: "boatEngine", boatParts: "boatParts" };
const CATEGORY_TO_NESTED_KEY: Record<string, keyof typeof nesCategories.boatsNestedMap> = { boatsForSale: "forSale", boatsForRent: "forRent", boatEnginesForSale: "engines", boatParts: "parts" };
const GEARBOX_OPTIONS = ["Manual", "Automatic"];

export default function BoatsForm({ onNext, businessId }: { onNext: () => void; businessId?: string }) {
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
    mainCategory: "Boats",
    category: typeof savedItem.category === "string" ? savedItem.category : Array.isArray(savedItem.category) && savedItem.category.length > 0 ? savedItem.category[0] : "",
    subCategory: typeof savedItem.subCategory === "string" ? savedItem.subCategory : Array.isArray(savedItem.subCategory) && savedItem.subCategory.length > 0 ? savedItem.subCategory[0] : "",
    title: savedItem.title || "",
    description: savedItem.description || "",
    price: savedItem.price || "",
    region: savedItem.region || "",
    city: savedItem.city || "",
    type: savedItem.type || "",
    boatModel: savedItem.boatModel || "",
    transmission: savedItem.transmission || "",
    color: savedItem.color || "",
    website: (savedItem as any).website || "",
  });

  useEffect(() => { if (!authLoading && !user) router.push("/login"); }, [user, authLoading, router]);

  useEffect(() => {
    const load = async () => {
      try {
        const [regs, cits, feeRes] = await Promise.all([getAllRegions(), getAllCities(), getBoatFees()]);
        setRegions(regs || []);
        setAllCities(cits || []);
        setActiveFeeConfig(feeRes);
      } catch {} finally { setDataLoading(false); }
    };
    load();
  }, []);

  const getFee = useCallback((cat: string) => activeFeeConfig ? Number(activeFeeConfig[BOAT_FEE_MAPPING[cat]] || 0) : 0, [activeFeeConfig]);
  const getNestedSubcategories = () => {
    if (!formData.category) return [];
    const k = CATEGORY_TO_NESTED_KEY[formData.category];
    return k && nesCategories.boatsNestedMap ? nesCategories.boatsNestedMap[k] || [] : [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isLoading) return;
    if (["category", "subCategory", "price", "title", "description", "type", "boatModel", "color", "region", "city"].some((k) => !(formData as any)[k]) || images.length === 0) {
      return toast.error(t("createMotorcycle.fillRequired"));
    }
    setIsLoading(true);
    const toastId = toast.loading(t("createMotorcycle.registering"));
    try {
      const imagesBase64 = await toBase64();
      const fee = getFee(formData.category);
      const payload = {
        userId: user._id || user.id, name: formData.title, title: formData.title,
        description: formData.description, price: Number(formData.price), mainCategory: "Boats",
        category: formData.category ? [formData.category] : [],
        subcategory: formData.subCategory ? [formData.subCategory] : [],
        type: formData.type, boatModel: formData.boatModel, transmission: formData.transmission,
        color: formData.color, region: formData.region, city: formData.city,
        images: imagesBase64, isPaid: false, feeAmount: fee, businessId: businessId || undefined, website: formData.website || undefined,
      };
      const result: any = await createBoat(payload as CreateBoatPayload, user.token || (user as any).accessToken);
      const createdId = result.boatId || result.id || result._id;
      if (result.success && createdId) {
        toast.update(toastId, { render: t("createMotorcycle.successMessage"), type: "success", isLoading: false, autoClose: 2000 });
        dispatch(updateItem({ ...payload, id: String(createdId) }));
        setTimeout(() => onNext(), 1200);
      } else {
        toast.update(toastId, { render: result.message || t("createMotorcycle.errorMessage"), type: "error", isLoading: false, autoClose: 3000 });
      }
    } catch {
      toast.update(toastId, { render: t("createMotorcycle.errorMessage"), type: "error", isLoading: false, autoClose: 3000 });
    } finally { setIsLoading(false); }
  };

  if (authLoading || dataLoading) return <div className="h-screen flex items-center justify-center"><Loading /></div>;

  const catOptions = BOAT_CATEGORIES.map((c) => ({ value: c.key, label: t(c.labelKey) }));
  const subCatOptions = getNestedSubcategories().map((s: any) => ({ value: s.labelKey || s, label: t(s.labelKey || s) }));
  const gearboxOptions = GEARBOX_OPTIONS.map((o) => ({ value: o, label: o }));
  const regionOptions = regions.map((r) => ({ value: r.id, label: r.name }));

  return (
    <div className="rounded-3xl border border-gray-100 shadow-sm p-6 md:p-10">
      {!businessId && <CheckoutSteps step1 step2 />}
      <div className="text-center mb-10">
        <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"><FaShip className="text-4xl text-blue-600" /></div>
        <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">{t("createBoats.title")}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">Main Category</label>
          <div className="flex items-center gap-3 w-full border-2 border-blue-100 bg-blue-50/30 p-4 rounded-2xl">
            <FaShip className="text-blue-500" />
            <input type="text" readOnly value={formData.mainCategory} className="bg-transparent outline-none font-black text-blue-700 w-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">Category</label>
            <SelectField value={formData.category} onChange={(v) => setFormData({ ...formData, category: v, subCategory: "" })} options={catOptions} placeholder="Select Category" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">Subcategory</label>
            <SelectField value={formData.subCategory} onChange={(v) => setFormData({ ...formData, subCategory: v })} options={subCatOptions} placeholder="Select Subcategory" disabled={!formData.category} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">Title</label>
          <input placeholder="e.g. Yamaha Speedboat 2023" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} maxLength={200} className="w-full border-2 border-gray-100 bg-gray-50 p-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold" required />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {([["type", "Type", "e.g. Speedboat", true], ["boatModel", "Model", "e.g. 2023", true], ["color", "Color", "e.g. Blue", true]] as [string, string, string, boolean][]).map(([k, label, ph, req]) => (
            <div key={k} className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase">{label}</label>
              <input placeholder={ph} value={(formData as any)[k]} onChange={(e) => setFormData({ ...formData, [k]: e.target.value })} maxLength={100} className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold" required={req} />
            </div>
          ))}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase">Gearbox</label>
            <SelectField value={formData.transmission} onChange={(v) => setFormData({ ...formData, transmission: v })} options={gearboxOptions} placeholder="Select" className="text-xs" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">Description</label>
            <textarea placeholder="Describe your boat..." rows={5} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} maxLength={5000} className="w-full border-2 border-gray-100 bg-gray-50 p-4 rounded-2xl outline-none font-bold" required />
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

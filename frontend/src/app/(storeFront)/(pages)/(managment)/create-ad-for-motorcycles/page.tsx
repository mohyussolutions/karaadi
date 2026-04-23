"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdAttachMoney } from "@/app/utils/icons";
import { useImageUpload } from "@/app/(storeFront)/components/shared/ImageUpload/useImageUpload";
import ImageUpload from "@/app/(storeFront)/components/shared/ImageUpload/ImageUpload";
import { FaMotorcycle } from "react-icons/fa";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import { createMotorcycle } from "@/actions/categories/motorcycleActions";
import { clientGetAllRegions, clientGetAllCities, clientAddCity } from "@/services/geoService";
import { categories as nesCategories } from "@/app/(links)/storeFrontLinks/nesSubCategoryLinks";
import { useAuth } from "@/context/AuthContext";
import { useAppDispatch, useAppSelector } from "@/store/slices/hooks/hooks";
import { updateItem } from "@/store/slices/reducers/listingDraftSlice";
import { getMotorcycleFees } from "@/actions/categories/feeAction";
import CheckoutSteps from "@/app/(storeFront)/components/checkout/CheckoutSteps";

const MOTO_CATEGORY_KEYS = ["forSale", "forRent", "parts", "other"] as const;

const MOTO_FEE_MAPPING: Record<string, string> = {
  forSale: "motoSale",
  forRent: "motoRent",
  parts: "motoParts",
  other: "motoOther",
};

const FUEL_TYPE_KEYS = ["petrol", "electric", "other"] as const;
const GEARBOX_KEYS = ["manual", "automatic", "semiAutomatic"] as const;
const CONDITION_KEYS = ["new", "used"] as const;

export default function CreateAdForMotorcyclesPage() {
  const router = useRouter();
  return <MotorcycleForm onNext={() => router.push("/plan")} />;
}

function MotorcycleForm({ onNext }: { onNext: () => void }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const savedItem = useAppSelector((state) => state.listingDraft.item) ?? {};

  const [isLoading, setIsLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [regions, setRegions] = useState<any[]>([]);
  const [allCities, setAllCities] = useState<any[]>([]);
  const [filteredCities, setFilteredCities] = useState<any[]>([]);
  const { images, addImages, removeImage, toBase64 } = useImageUpload();
  const [newCity, setNewCity] = useState("");
  const [showNewCityInputs, setShowNewCityInputs] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [activeFeeConfig, setActiveFeeConfig] = useState<any>(null);

  const [formData, setFormData] = useState({
    mainCategory: "Motorcycles",
    category:
      typeof savedItem.category === "string"
        ? savedItem.category
        : Array.isArray(savedItem.category) && savedItem.category.length > 0
          ? savedItem.category[0]
          : "",
    subCategory:
      typeof savedItem.subCategory === "string"
        ? savedItem.subCategory
        : Array.isArray(savedItem.subCategory) && savedItem.subCategory.length > 0
          ? savedItem.subCategory[0]
          : "",
    title: savedItem.title || "",
    description: savedItem.description || "",
    price: savedItem.price || "",
    region: savedItem.region || "",
    city: savedItem.city || "",
    year: savedItem.year || "",
    make: savedItem.make || "",
    model: savedItem.model || "",
    engineCc: savedItem.engineCc || "",
    mileage: savedItem.mileage || "",
    fuelType: savedItem.fuelType || "",
    gearbox: savedItem.gearbox || "",
    condition: savedItem.condition || "",
    color: savedItem.color || "",
  });

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [regs, cits, feeRes] = await Promise.all([
          clientGetAllRegions(),
          clientGetAllCities(),
          getMotorcycleFees(),
        ]);
        setRegions(regs || []);
        setAllCities(cits || []);
        setActiveFeeConfig(Array.isArray(feeRes) ? feeRes[0] || {} : feeRes || {});
      } catch {
      } finally {
        setDataLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (formData.region) {
      setFilteredCities(allCities.filter((c) => c.regionId === formData.region));
    } else {
      setFilteredCities([]);
    }
  }, [formData.region, allCities]);

  const getFeeForCategory = useCallback(
    (categoryKey: string): number => {
      if (!activeFeeConfig) return 0;
      const feeKey = MOTO_FEE_MAPPING[categoryKey];
      return Number(activeFeeConfig[feeKey] || 0);
    },
    [activeFeeConfig],
  );

  const getNestedSubcategories = () => {
    if (!formData.category) return [];
    const map = nesCategories.motorcyclesNestedMap as any;
    return map[formData.category] || [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isLoading) return;

    const requiredFields = [
      "category",
      "subCategory",
      "price",
      "title",
      "description",
      "year",
      "make",
      "model",
      "condition",
      "region",
      "city",
    ];
    const isMissing =
      requiredFields.some((key) => !(formData as any)[key]) || images.length === 0;

    if (isMissing) {
      return toast.error(t("createMotorcycle.fillRequired"));
    }

    setIsLoading(true);
    const toastId = toast.loading(t("createMotorcycle.registering"));

    try {
      let finalCity = formData.city;
      if (showNewCityInputs && newCity.trim()) {
        const res: any = await clientAddCity({ name: newCity.trim(), regionId: formData.region });
        if (res?.success) {
          finalCity = res.data?.name || newCity.trim();
          setAllCities((prev) => [...prev, { id: res.data?.id, name: finalCity, regionId: formData.region }]);
        }
      }

      const imagesBase64 = await toBase64();
      const fee = getFeeForCategory(formData.category);

      const payload = {
        userId: user._id || user.id,
        name: formData.title,
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        so: formData.title,
        mainCategory: "Motorcycles",
        category: formData.category ? [formData.category] : [],
        subcategory: formData.subCategory ? [formData.subCategory] : [],
        year: formData.year,
        make: formData.make,
        model: formData.model,
        engineCc: formData.engineCc,
        mileage: formData.mileage,
        fuelType: formData.fuelType,
        gearbox: formData.gearbox,
        condition: formData.condition,
        color: formData.color,
        region: formData.region,
        city: finalCity,
        images: imagesBase64,
        isPaid: false,
        feeAmount: fee,
      };

      const result: any = await createMotorcycle(
        payload as Record<string, unknown>,
        user.token || (user as any).accessToken,
      );

      if (result.success) {
        toast.update(toastId, {
          render: t("createMotorcycle.successMessage"),
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        const createdId = result.motorcycleId || result.id || result._id;
        dispatch(updateItem({ ...payload, id: String(createdId) }));
        setTimeout(() => onNext(), 1200);
      } else {
        toast.update(toastId, {
          render: result.message || t("createMotorcycle.errorMessage"),
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch {
      toast.update(toastId, {
        render: t("createMotorcycle.errorMessage"),
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || dataLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-gray-100 shadow-sm p-6 md:p-10">
      <CheckoutSteps step1 step2 />

      <div className="text-center mb-10">
        <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FaMotorcycle className="text-4xl text-blue-600" />
        </div>
        <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">
          {t("createMotorcycle.pageTitle")}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
            {t("createMotorcycle.mainCategoryLabel")}
          </label>
          <div className="flex items-center gap-3 w-full border-2 border-blue-100 bg-blue-50/30 p-4 rounded-2xl">
            <FaMotorcycle className="text-blue-500" />
            <input
              type="text"
              readOnly
              value={formData.mainCategory}
              className="bg-transparent outline-none font-black text-blue-700 w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
              {t("createMotorcycle.categoryLabel")}
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value, subCategory: "" })
              }
              className="w-full border-2 border-gray-100 bg-gray-50 p-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold"
              required
            >
              <option value="">{t("createMotorcycle.selectCategory")}</option>
              {MOTO_CATEGORY_KEYS.map((key) => (
                <option key={key} value={key}>
                  {t(`createMotorcycle.categories.${key}`)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
              {t("createMotorcycle.subCategoryLabel")}
            </label>
            <select
              value={formData.subCategory}
              onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
              disabled={!formData.category}
              className="w-full border-2 border-gray-100 bg-gray-50 p-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold disabled:opacity-50"
              required
            >
              <option value="">{t("createMotorcycle.selectSubcategory")}</option>
              {getNestedSubcategories().map((sub: any, idx: number) => (
                <option key={idx} value={sub.labelKey || sub.key || sub}>
                  {t(sub.labelKey || sub.name || sub)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
            {t("createMotorcycle.titleLabel")}
          </label>
          <input
            placeholder={t("createMotorcycle.titlePlaceholder")}
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full border-2 border-gray-100 bg-gray-50 p-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold"
            required
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase">
              {t("createMotorcycle.yearLabel")}
            </label>
            <input
              placeholder={t("createMotorcycle.yearPlaceholder")}
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase">
              {t("createMotorcycle.makeLabel")}
            </label>
            <input
              placeholder={t("createMotorcycle.makePlaceholder")}
              value={formData.make}
              onChange={(e) => setFormData({ ...formData, make: e.target.value })}
              className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase">
              {t("createMotorcycle.modelLabel")}
            </label>
            <input
              placeholder={t("createMotorcycle.modelPlaceholder")}
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase">
              {t("createMotorcycle.engineCcLabel")}
            </label>
            <input
              type="number"
              placeholder={t("createMotorcycle.engineCcPlaceholder")}
              value={formData.engineCc}
              onChange={(e) => setFormData({ ...formData, engineCc: e.target.value })}
              className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase">
              {t("createMotorcycle.mileageLabel")}
            </label>
            <input
              type="number"
              placeholder={t("createMotorcycle.mileagePlaceholder")}
              value={formData.mileage}
              onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
              className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold outline-none focus:border-blue-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase">
              {t("createMotorcycle.fuelTypeLabel")}
            </label>
            <select
              value={formData.fuelType}
              onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
              className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold outline-none focus:border-blue-500"
            >
              <option value="">{t("createMotorcycle.selectFuelType")}</option>
              {FUEL_TYPE_KEYS.map((key) => (
                <option key={key} value={key}>
                  {t(`createMotorcycle.fuelTypes.${key}`)}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase">
              {t("createMotorcycle.gearboxLabel")}
            </label>
            <select
              value={formData.gearbox}
              onChange={(e) => setFormData({ ...formData, gearbox: e.target.value })}
              className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold outline-none focus:border-blue-500"
            >
              <option value="">{t("createMotorcycle.selectGearbox")}</option>
              {GEARBOX_KEYS.map((key) => (
                <option key={key} value={key}>
                  {t(`createMotorcycle.gearboxOptions.${key}`)}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase">
              {t("createMotorcycle.conditionLabel")}
            </label>
            <select
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold outline-none focus:border-blue-500"
              required
            >
              <option value="">{t("createMotorcycle.selectCondition")}</option>
              {CONDITION_KEYS.map((key) => (
                <option key={key} value={key}>
                  {t(`createMotorcycle.conditions.${key}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-400 uppercase">
            {t("createMotorcycle.colorLabel")}
          </label>
          <input
            placeholder={t("createMotorcycle.colorPlaceholder")}
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
              {t("createMotorcycle.descriptionLabel")}
            </label>
            <textarea
              placeholder={t("createMotorcycle.descriptionPlaceholder")}
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border-2 border-gray-100 bg-gray-50 p-4 rounded-2xl outline-none font-bold"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
              {t("createMotorcycle.regionLabel")}
            </label>
            <select
              value={formData.region}
              onChange={(e) =>
                setFormData({ ...formData, region: e.target.value, city: "" })
              }
              className="w-full border-2 border-gray-100 bg-gray-50 p-4 rounded-2xl outline-none font-bold"
              required
            >
              <option value="">{t("createMotorcycle.selectRegion")}</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {i18n.language === "so" ? r.so || r.name : r.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
            {t("createMotorcycle.cityLabel")}
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCityDropdown(!showCityDropdown)}
              disabled={!formData.region}
              className="w-full text-left border-2 border-gray-100 bg-gray-50 p-4 rounded-2xl font-bold flex justify-between items-center disabled:opacity-50"
            >
              {showNewCityInputs
                ? t("createMotorcycle.addingCity")
                : formData.city || t("createMotorcycle.selectCity")}
              <span>▾</span>
            </button>
            {showCityDropdown && (
              <div className="absolute z-30 left-0 right-0 mt-2 bg-white border rounded-2xl shadow-xl max-h-56 overflow-auto">
                {filteredCities.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, city: c.name });
                      setShowCityDropdown(false);
                      setShowNewCityInputs(false);
                    }}
                    className="w-full text-left p-4 hover:bg-blue-50 font-bold border-b last:border-0"
                  >
                    {i18n.language === "so" ? c.so || c.name : c.name}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setShowNewCityInputs(true);
                    setShowCityDropdown(false);
                  }}
                  className="w-full text-left p-4 text-blue-600 font-black text-xs"
                >
                  {t("createMotorcycle.addNewCity")}
                </button>
              </div>
            )}
          </div>
        </div>

        {showNewCityInputs && (
          <div className="space-y-2">
            <input
              placeholder={t("createMotorcycle.newCityPlaceholder")}
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              className="w-full border-2 border-blue-200 bg-blue-50 p-4 rounded-2xl font-bold outline-none"
            />
            <p className="text-xs text-blue-500 font-medium ml-1">
              {t("createMotorcycle.newCityNote")}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
            {t("createMotorcycle.priceLabel")}
          </label>
          <div className="relative">
            <MdAttachMoney className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 text-xl" />
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full border-2 border-gray-100 bg-gray-50 pl-12 pr-4 py-4 rounded-2xl font-bold text-blue-600 outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div className="p-6 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50">
          <ImageUpload
            images={images}
            onAdd={addImages}
            onRemove={removeImage}
            maxImages={10}
            label={t("createMotorcycle.upload")}
          />
          <p className="text-xs text-gray-400 mt-3 text-center">
            {t("createMotorcycle.imageNote")}
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-5 rounded-2xl bg-[#0063fb] text-white font-black text-xl shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:bg-gray-200 flex items-center justify-center"
        >
          {isLoading ? (
            <div className="animate-spin h-6 w-6 border-4 border-white border-t-transparent rounded-full" />
          ) : (
            t("createMotorcycle.submit")
          )}
        </button>
      </form>
    </div>
  );
}

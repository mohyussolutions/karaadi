"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { MdAttachMoney } from "@/app/utils/icons";
import { useImageUpload } from "@/app/(storeFront)/components/shared/ImageUpload/useImageUpload";
import ImageUpload from "@/app/(storeFront)/components/shared/ImageUpload/ImageUpload";
import CitySelect from "@/app/(storeFront)/components/shared/CitySelect/CitySelect";
import { useGeoData } from "@/app/(storeFront)/components/hooks/useGeoData";
import { createMotorcycle } from "@/actions/categories/motorcycleActions";

const MOTO_CATEGORIES = [
  { key: "MotorcyclesForSale", label: "Motorcycles for Sale" },
  { key: "ScootersForSale", label: "Scooters for Sale" },
  { key: "MotorcyclesForRent", label: "Motorcycles for Rent" },
  { key: "MotorcycleParts", label: "Motorcycle Parts" },
];

const FUEL_TYPES = ["Petrol", "Electric", "Other"];
const GEARBOX_TYPES = ["Manual", "Automatic"];
const CONDITIONS = ["New", "Used"];

type Props = {
  businessId: string;
  userId: string;
  onSuccess: () => void;
};

export default function MotorcycleForm({ businessId, userId, onSuccess }: Props) {
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const { regions, cities: allCities, loading: dataLoading, updateCities } = useGeoData();
  const { images, addImages, removeImage, toBase64 } = useImageUpload();

  const [form, setForm] = useState({
    category: "",
    title: "",
    description: "",
    price: "",
    brand: "",
    modelName: "",
    year: "",
    mileage: "",
    engineSize: "",
    color: "",
    fuelType: "",
    transmission: "",
    condition: "",
    region: "",
    city: "",
  });


  const set = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!form.category || !form.title || !form.region || !form.city) {
      toast.error(t("createMotorcycle.fillRequired", "Please fill all required fields"));
      return;
    }
    if (images.length === 0) {
      toast.error(t("createMotorcycle.fillRequired", "Please add at least one image"));
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading(t("createMotorcycle.registering", "Submitting…"));

    try {
      const imagesBase64 = await toBase64();
      const result: any = await createMotorcycle({
        userId,
        title: form.title,
        description: form.description || undefined,
        price: form.price ? Number(form.price) : 0,
        mainCategory: "Motorcycles",
        category: [form.category],
        subcategory: [],
        region: form.region,
        city: form.city,
        make: form.brand || undefined,
        brand: form.brand || undefined,
        modelName: form.modelName || undefined,
        year: form.year ? Number(form.year) : undefined,
        mileage: form.mileage ? Number(form.mileage) : undefined,
        engineSize: form.engineSize || undefined,
        color: form.color || undefined,
        fuelType: form.fuelType || undefined,
        transmission: form.transmission || undefined,
        condition: form.condition || undefined,
        images: imagesBase64,
        businessId: businessId || undefined,
        isPaid: false,
      });

      if (result.success) {
        toast.update(toastId, { render: t("createMotorcycle.successMessage", "Listing created!"), type: "success", isLoading: false, autoClose: 2000 });
        onSuccess();
      } else {
        toast.update(toastId, { render: result.message || t("createMotorcycle.errorMessage", "Failed"), type: "error", isLoading: false, autoClose: 3000 });
      }
    } catch {
      toast.update(toastId, { render: t("createMotorcycle.errorMessage", "Something went wrong"), type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      setSubmitting(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((n) => <div key={n} className="h-12 bg-gray-200 rounded-2xl" />)}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold mb-1.5 text-gray-700">
          {t("createRealEstate.category", "Category")} *
        </label>
        <select value={form.category} onChange={(e) => set("category", e.target.value)} required
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">{t("createRealEstate.selectCategory", "Select category")}</option>
          {MOTO_CATEGORIES.map((cat) => <option key={cat.key} value={cat.key}>{cat.label}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5 text-gray-700">
          {t("createRealEstate.titleLabel", "Title")} *
        </label>
        <input value={form.title} onChange={(e) => set("title", e.target.value)} required maxLength={200}
          placeholder="e.g. Honda CB500 2022 – Low Mileage"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-gray-700">{t("createCar.brandLabel", "Brand / Make")}</label>
          <input value={form.brand} onChange={(e) => set("brand", e.target.value)} placeholder="e.g. Honda"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-gray-700">{t("createCar.modelLabel", "Model")}</label>
          <input value={form.modelName} onChange={(e) => set("modelName", e.target.value)} placeholder="e.g. CB500"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-gray-700">{t("createCar.yearLabel", "Year")}</label>
          <input type="number" value={form.year} onChange={(e) => set("year", e.target.value)}
            min={1950} max={new Date().getFullYear() + 1} placeholder="2022"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-gray-700">{t("createCar.mileageLabel", "Mileage")}</label>
          <input type="number" value={form.mileage} onChange={(e) => set("mileage", e.target.value)} min={0}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-gray-700">Engine (cc)</label>
          <input value={form.engineSize} onChange={(e) => set("engineSize", e.target.value)} placeholder="e.g. 500"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-gray-700">{t("createCar.fuelTypeLabel", "Fuel")}</label>
          <select value={form.fuelType} onChange={(e) => set("fuelType", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select</option>
            {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-gray-700">{t("createCar.transmissionLabel", "Gearbox")}</label>
          <select value={form.transmission} onChange={(e) => set("transmission", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select</option>
            {GEARBOX_TYPES.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-gray-700">{t("createCar.conditionLabel", "Condition")}</label>
          <select value={form.condition} onChange={(e) => set("condition", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select</option>
            {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-gray-700">{t("createCar.colorLabel", "Color")}</label>
          <input value={form.color} onChange={(e) => set("color", e.target.value)} placeholder="e.g. Red"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-gray-700">{t("createRealEstate.priceLabel", "Price ($)")}</label>
          <div className="relative">
            <MdAttachMoney className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600" />
            <input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} min={0}
              className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5 text-gray-700">{t("createRealEstate.descriptionLabel", "Description")}</label>
        <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} maxLength={5000}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5 text-gray-700">{t("createRealEstate.regionLabel", "Region")} *</label>
        <select value={form.region} onChange={(e) => { set("region", e.target.value); set("city", ""); }} required
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">{t("createRealEstate.selectRegion", "Select region")}</option>
          {regions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
      </div>

      <CitySelect regionId={form.region} cities={allCities} value={form.city}
        onChange={(name) => set("city", name)} onCitiesUpdate={updateCities}
        disabled={!form.region} label={t("createRealEstate.cityLabel", "City")} />

      <ImageUpload images={images} onAdd={addImages} onRemove={removeImage} label={t("createMotorcycle.upload", "Upload images")} />

      <button type="submit" disabled={submitting}
        className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold text-base hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center">
        {submitting
          ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
          : t("createMotorcycle.submit", "Post Listing")}
      </button>
    </form>
  );
}

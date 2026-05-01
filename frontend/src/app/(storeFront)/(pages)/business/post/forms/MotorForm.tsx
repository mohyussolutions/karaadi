"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { MdAttachMoney } from "@/app/utils/icons";
import { useImageUpload } from "@/app/(storeFront)/components/shared/ImageUpload/useImageUpload";
import ImageUpload from "@/app/(storeFront)/components/shared/ImageUpload/ImageUpload";
import CitySelect from "@/app/(storeFront)/components/shared/CitySelect/CitySelect";
import { useGeoData } from "@/app/(storeFront)/components/hooks/useGeoData";
import { createCar } from "@/actions/categories/carActions";

const CAR_CATEGORIES = [
  { key: "CarsForSaleNestedSub", label: "Cars for Sale" },
  { key: "LeaseCarsNestedSub", label: "Cars for Lease" },
  { key: "BusSubLinks", label: "Buses" },
  { key: "TrailerNestedSub", label: "Trailers" },
  { key: "TruckNestedSub", label: "Trucks" },
  { key: "ElectricCarsNestedSub", label: "Electric Cars" },
  { key: "CarPartsNestedSub", label: "Car Parts" },
];

const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric", "Other"];
const GEARBOX_TYPES = ["Manual", "Automatic"];
const CONDITIONS = ["New", "Used", "Certified Pre-Owned"];

type Props = {
  businessId: string;
  userId: string;
  onSuccess: () => void;
};

export default function MotorForm({ businessId, userId, onSuccess }: Props) {
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
    vehicleModel: "",
    year: "",
    mileage: "",
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
      const result: any = await createCar({
        userId,
        title: form.title,
        description: form.description || undefined,
        price: form.price ? Number(form.price) : 0,
        mainCategory: "Cars",
        category: form.category,
        subcategory: [],
        brand: form.brand || undefined,
        make: form.brand || undefined,
        vehicleModel: form.vehicleModel || undefined,
        year: form.year ? Number(form.year) : undefined,
        mileage: form.mileage ? Number(form.mileage) : undefined,
        color: form.color || undefined,
        fuelType: form.fuelType || undefined,
        transmission: form.transmission || undefined,
        condition: form.condition || undefined,
        region: form.region,
        city: form.city,
        images: imagesBase64,
        businessId: businessId || undefined,
        isPaid: false,
      } as any);

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
          {CAR_CATEGORIES.map((cat) => <option key={cat.key} value={cat.key}>{cat.label}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5 text-gray-700">
          {t("createRealEstate.titleLabel", "Title")} *
        </label>
        <input value={form.title} onChange={(e) => set("title", e.target.value)} required maxLength={200}
          placeholder="e.g. Toyota Corolla 2020 – Excellent Condition"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-gray-700">{t("createCar.brandLabel", "Brand")}</label>
          <input value={form.brand} onChange={(e) => set("brand", e.target.value)} placeholder="e.g. Toyota"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-gray-700">{t("createCar.modelLabel", "Model")}</label>
          <input value={form.vehicleModel} onChange={(e) => set("vehicleModel", e.target.value)} placeholder="e.g. Corolla"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-gray-700">{t("createCar.yearLabel", "Year")}</label>
          <input type="number" value={form.year} onChange={(e) => set("year", e.target.value)}
            min={1900} max={new Date().getFullYear() + 1} placeholder="2020"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-gray-700">{t("createCar.mileageLabel", "Mileage (km)")}</label>
          <input type="number" value={form.mileage} onChange={(e) => set("mileage", e.target.value)} min={0}
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
          <input value={form.color} onChange={(e) => set("color", e.target.value)} placeholder="e.g. White"
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

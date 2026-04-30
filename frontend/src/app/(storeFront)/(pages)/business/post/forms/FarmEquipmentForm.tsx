"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { MdAttachMoney } from "@/app/utils/icons";
import { useImageUpload } from "@/app/(storeFront)/components/shared/ImageUpload/useImageUpload";
import ImageUpload from "@/app/(storeFront)/components/shared/ImageUpload/ImageUpload";
import CitySelect from "@/app/(storeFront)/components/shared/CitySelect/CitySelect";
import { getAllRegions, getAllCities } from "@/actions/categories/geoAction";
import { createTraktor } from "@/actions/categories/FarmequipmentAction";

const FARM_CATEGORIES = [
  { key: "tractor", label: "Tractor" },
  { key: "harvester", label: "Harvester / Combine" },
  { key: "plough", label: "Plough" },
  { key: "irrigation", label: "Irrigation Equipment" },
  { key: "sprayer", label: "Sprayer" },
  { key: "trailer", label: "Farm Trailer" },
  { key: "other", label: "Other" },
];

const CONDITIONS = ["New", "Used – Good", "Used – Fair"];

type Props = { businessId: string; userId: string; onSuccess: () => void };

export default function FarmEquipmentForm({
  businessId,
  userId,
  onSuccess,
}: Props) {
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const [regions, setRegions] = useState<any[]>([]);
  const [allCities, setAllCities] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const { images, addImages, removeImage, toBase64 } = useImageUpload();

  const [form, setForm] = useState({
    category: "",
    title: "",
    description: "",
    price: "",
    brand: "",
    year: "",
    condition: "",
    region: "",
    city: "",
  });

  useEffect(() => {
    Promise.all([getAllRegions(), getAllCities()])
      .then(([regs, cits]) => {
        setRegions(regs || []);
        setAllCities(cits || []);
      })
      .finally(() => setDataLoading(false));
  }, []);

  const set = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!form.category || !form.title || !form.region || !form.city) {
      toast.error(
        t("createMotorcycle.fillRequired", "Please fill all required fields"),
      );
      return;
    }
    if (images.length === 0) {
      toast.error(
        t("createMotorcycle.fillRequired", "Please add at least one image"),
      );
      return;
    }
    setSubmitting(true);
    const toastId = toast.loading(
      t("createMotorcycle.registering", "Submitting…"),
    );
    try {
      const imagesBase64 = await toBase64();
      const result: any = await createTraktor({
        userId,
        title: form.title,
        description: form.description || undefined,
        price: Number(form.price) || 0,
        mainCategory: "Farm Equipment",
        category: [form.category],
        brand: form.brand || undefined,
        make: form.brand || undefined,
        year: form.year ? Number(form.year) : undefined,
        condition: form.condition || undefined,
        region: form.region,
        city: form.city,
        images: imagesBase64,
        businessId: businessId || undefined,
        isPaid: false,
      } as any);
      if (result.success) {
        toast.update(toastId, {
          render: t("createMotorcycle.successMessage", "Listing created!"),
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        onSuccess();
      } else {
        toast.update(toastId, {
          render:
            result.message || t("createMotorcycle.errorMessage", "Failed"),
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch {
      toast.update(toastId, {
        render: t("createMotorcycle.errorMessage", "Something went wrong"),
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-12 bg-gray-200 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold mb-1.5 text-gray-700">
          {t("createRealEstate.category", "Category")} *
        </label>
        <select
          value={form.category}
          onChange={(e) => set("category", e.target.value)}
          required
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">
            {t("createRealEstate.selectCategory", "Select category")}
          </option>
          {FARM_CATEGORIES.map((c) => (
            <option key={c.key} value={c.key}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5 text-gray-700">
          {t("createRealEstate.titleLabel", "Title")} *
        </label>
        <input
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          required
          maxLength={200}
          placeholder="e.g. John Deere Tractor 2019"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <label className="block text-sm font-semibold mb-1.5 text-gray-700">
            {t("createCar.brandLabel", "Brand / Make")}
          </label>
          <input
            value={form.brand}
            onChange={(e) => set("brand", e.target.value)}
            placeholder="e.g. John Deere"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-gray-700">
            {t("createCar.yearLabel", "Year")}
          </label>
          <input
            type="number"
            value={form.year}
            onChange={(e) => set("year", e.target.value)}
            min={1950}
            max={new Date().getFullYear() + 1}
            placeholder="2019"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-gray-700">
            {t("createCar.conditionLabel", "Condition")}
          </label>
          <select
            value={form.condition}
            onChange={(e) => set("condition", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select</option>
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-gray-700">
            {t("createRealEstate.priceLabel", "Price ($)")}
          </label>
          <div className="relative">
            <MdAttachMoney className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600" />
            <input
              type="number"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              min={0}
              className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5 text-gray-700">
          {t("createRealEstate.descriptionLabel", "Description")}
        </label>
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          maxLength={5000}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5 text-gray-700">
          {t("createRealEstate.regionLabel", "Region")} *
        </label>
        <select
          value={form.region}
          onChange={(e) => {
            set("region", e.target.value);
            set("city", "");
          }}
          required
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">
            {t("createRealEstate.selectRegion", "Select region")}
          </option>
          {regions.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      <CitySelect
        regionId={form.region}
        cities={allCities}
        value={form.city}
        onChange={(name) => set("city", name)}
        onCitiesUpdate={setAllCities}
        disabled={!form.region}
        label={t("createRealEstate.cityLabel", "City")}
      />

      <ImageUpload
        images={images}
        onAdd={addImages}
        onRemove={removeImage}
        label={t("createMotorcycle.upload", "Upload images")}
      />

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold text-base hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
      >
        {submitting ? (
          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
        ) : (
          t("createMotorcycle.submit", "Post Listing")
        )}
      </button>
    </form>
  );
}

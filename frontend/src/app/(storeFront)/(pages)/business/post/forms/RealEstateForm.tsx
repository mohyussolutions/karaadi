"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { MdAttachMoney } from "@/app/utils/icons";
import { useImageUpload } from "@/app/(storeFront)/components/shared/ImageUpload/useImageUpload";
import ImageUpload from "@/app/(storeFront)/components/shared/ImageUpload/ImageUpload";
import CitySelect from "@/app/(storeFront)/components/shared/CitySelect/CitySelect";
import { getAllRegions, getAllCities } from "@/actions/categories/geoAction";
import { createRealEstate } from "@/actions/categories/realEstateActions";

const RE_CATEGORIES = [
  { key: "forRent", tKey: "createRealEstate.categories.forRent" },
  { key: "forSale", tKey: "createRealEstate.categories.forSale" },
  { key: "landForSale", tKey: "createRealEstate.categories.landForSale" },
  { key: "farmForSale", tKey: "createRealEstate.categories.farmForSale" },
  { key: "commercial", tKey: "createRealEstate.categories.commercial" },
];

type Props = {
  businessId: string;
  userId: string;
  onSuccess: () => void;
};

export default function RealEstateForm({ businessId, userId, onSuccess }: Props) {
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
    region: "",
    city: "",
    bedrooms: "",
    bathrooms: "",
    squareFeet: "",
    address: "",
    hasGarage: false,
    hasGarden: false,
  });

  useEffect(() => {
    Promise.all([getAllRegions(), getAllCities()])
      .then(([regs, cits]) => {
        setRegions(regs || []);
        setAllCities(cits || []);
      })
      .finally(() => setDataLoading(false));
  }, []);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!form.category || !form.title || !form.price || !form.region || !form.city || !form.description) {
      toast.error(t("createRealEstate.fillRequired", "Please fill all required fields"));
      return;
    }
    if (images.length === 0) {
      toast.error(t("createRealEstate.fillRequired", "Please add at least one image"));
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading(t("createRealEstate.submitting", "Submitting…"));

    try {
      const imagesBase64 = await toBase64();
      const result: any = await createRealEstate({
        userId,
        title: form.title,
        description: form.description,
        price: Number(form.price),
        mainCategory: "Real Estate",
        category: [form.category],
        region: form.region,
        city: form.city,
        county: form.region,
        bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
        squareFeet: form.squareFeet ? Number(form.squareFeet) : undefined,
        address: form.address || undefined,
        hasGarage: form.hasGarage,
        hasGarden: form.hasGarden,
        images: imagesBase64,
        businessId: businessId || undefined,
        isPaid: false,
      } as any);

      if (result.success) {
        toast.update(toastId, {
          render: t("createRealEstate.submittedSuccess", "Listing created!"),
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        onSuccess();
      } else {
        toast.update(toastId, {
          render: result.message || t("createRealEstate.submitError", "Failed"),
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch {
      toast.update(toastId, {
        render: t("createRealEstate.submitError", "Something went wrong"),
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
        <select
          value={form.category}
          onChange={(e) => set("category", e.target.value)}
          required
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">{t("createRealEstate.selectCategory", "Select category")}</option>
          {RE_CATEGORIES.map((cat) => (
            <option key={cat.key} value={cat.key}>{t(cat.tKey, cat.key)}</option>
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
          placeholder={t("createRealEstate.titleInputPlaceholder", "e.g. 3-bedroom apartment for rent")}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5 text-gray-700">
          {t("createRealEstate.descriptionLabel", "Description")} *
        </label>
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          required
          rows={3}
          maxLength={5000}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-gray-700">
            {t("createRealEstate.priceLabel", "Price ($)")} *
          </label>
          <div className="relative">
            <MdAttachMoney className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600" />
            <input
              type="number"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              required
              min={0}
              className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-gray-700">
            {t("createRealEstate.sizeSqmLabel", "Size (sqm)")}
          </label>
          <input
            type="number"
            value={form.squareFeet}
            onChange={(e) => set("squareFeet", e.target.value)}
            min={0}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-gray-700">
            {t("createRealEstate.bedroomsLabel", "Bedrooms")}
          </label>
          <input
            type="number"
            value={form.bedrooms}
            onChange={(e) => set("bedrooms", e.target.value)}
            min={0}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-gray-700">
            {t("createRealEstate.bathroomsLabel", "Bathrooms")}
          </label>
          <input
            type="number"
            value={form.bathrooms}
            onChange={(e) => set("bathrooms", e.target.value)}
            min={0}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-gray-700">
            {t("createRealEstate.regionLabel", "Region")} *
          </label>
          <select
            value={form.region}
            onChange={(e) => { set("region", e.target.value); set("city", ""); }}
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t("createRealEstate.selectRegion", "Select region")}</option>
            {regions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-gray-700">
            {t("createRealEstate.addressLabel", "Address")}
          </label>
          <input
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
            maxLength={100}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
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

      <div className="flex flex-wrap gap-4">
        {(["hasGarage", "hasGarden"] as const).map((key) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form[key]}
              onChange={(e) => set(key, e.target.checked)}
              className="w-4 h-4 accent-blue-600"
            />
            <span className="text-sm font-semibold text-gray-700">
              {t(`createRealEstate.${key === "hasGarage" ? "garageLabel" : "gardenLabel"}`, key)}
            </span>
          </label>
        ))}
      </div>

      <ImageUpload images={images} onAdd={addImages} onRemove={removeImage} label={t("createRealEstate.upload", "Upload images")} />

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold text-base hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
      >
        {submitting
          ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
          : t("createRealEstate.submit", "Post Listing")}
      </button>
    </form>
  );
}

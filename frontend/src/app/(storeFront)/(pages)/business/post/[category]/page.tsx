"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoBusiness } from "react-icons/io5";
import { useAuth } from "@/context/AuthContext";
import { createBusinessPost } from "@/actions/categories/businessActions";
import { BASE_API_URL } from "@/actions/constant/BASE_API_URL";
import type { Region, City } from "@/app/utils/types/geoTypes";
import { useImageUpload } from "@/app/(storeFront)/components/shared/ImageUpload/useImageUpload";
import ImageUpload from "@/app/(storeFront)/components/shared/ImageUpload/ImageUpload";

// ─── Category config ──────────────────────────────────────────────────────────

const CATEGORY_META: Record<string, { label: string; icon: string; color: string }> = {
  realestate:  { label: "Real Estate",  icon: "🏠", color: "bg-blue-600" },
  schools:     { label: "Schools",      icon: "🎓", color: "bg-purple-600" },
  motor:       { label: "Motor",        icon: "🚗", color: "bg-red-600" },
  marketplace: { label: "Marketplace",  icon: "🛒", color: "bg-green-600" },
};

const RE_CATEGORIES   = ["sale", "rent", "land", "commercial"];
const SCH_CATEGORIES  = ["primary", "secondary", "university", "training_center", "language_school"];
const MOT_TYPES       = ["car", "motorcycle", "truck"];
const MKT_CATEGORIES  = ["electronics", "fashion", "furniture", "sports", "animals", "art", "other"];
const CONDITIONS      = ["new", "used", "like_new"];
const TRANSMISSIONS   = ["automatic", "manual"];
const FUEL_TYPES      = ["petrol", "diesel", "electric", "hybrid"];

// ─── Main page ────────────────────────────────────────────────────────────────

export default function BusinessPostPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const category = params.category as string;
  const businessId = searchParams.get("businessId") ?? "";
  const meta = CATEGORY_META[category];

  const [regions, setRegions] = useState<Region[]>([]);
  const [allCities, setAllCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const { images, addImages, removeImage, toBase64 } = useImageUpload();

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    Promise.all([
      fetch(`${BASE_API_URL}/api/locations/regions`).then((r) => r.json()),
      fetch(`${BASE_API_URL}/api/locations/cities`).then((r) => r.json()),
    ]).then(([regs, cits]) => {
      setRegions(Array.isArray(regs) ? regs : []);
      setAllCities(Array.isArray(cits) ? cits : []);
    });
  }, []);

  useEffect(() => {
    setFilteredCities(region ? allCities.filter((c) => c.regionId === region) : []);
    setCity("");
  }, [region, allCities]);

  if (!meta) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center text-gray-500">
        <p className="text-lg">Unknown category: <strong>{category}</strong></p>
        <button onClick={() => router.back()} className="mt-4 text-blue-600 underline">Go back</button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const fd = new FormData(e.currentTarget);
    const raw = Object.fromEntries(fd.entries());
    const userId = user.id ?? user.sub ?? user._id;

    // build category-specific payload
    const imagesBase64 = await toBase64();
    let payload: Record<string, unknown> = { userId, businessId, region, city };

    if (category === "realestate") {
      payload = {
        ...payload,
        title:       raw.title,
        description: raw.description,
        price:       Number(raw.price),
        mainCategory:"realestate",
        category:    [raw.category],
        subcategory: [],
        bedrooms:    raw.bedrooms ? Number(raw.bedrooms) : undefined,
        bathrooms:   raw.bathrooms ? Number(raw.bathrooms) : undefined,
        squareFeet:  raw.squareFeet ? Number(raw.squareFeet) : undefined,
        address:     raw.address || undefined,
        images:      imagesBase64,
      };
    } else if (category === "schools") {
      payload = {
        ...payload,
        title:       raw.title,
        description: raw.description,
        price:       0,
        mainCategory:"schools",
        category:    [raw.schoolType],
        subcategory: [],
        images:      imagesBase64,
      };
    } else if (category === "motor") {
      payload = {
        ...payload,
        title:       raw.title,
        description: raw.description,
        price:       Number(raw.price),
        mainCategory:"motor",
        category:    [raw.vehicleType],
        subcategory: [],
        brand:       raw.brand,
        vehicleModel:raw.vehicleModel,
        year:        raw.year ? Number(raw.year) : undefined,
        color:       raw.color || "N/A",
        transmission:raw.transmission || undefined,
        fuelType:    raw.fuelType || undefined,
        mileage:     raw.mileage ? Number(raw.mileage) : undefined,
        images:      imagesBase64,
      };
    } else {
      // marketplace
      payload = {
        ...payload,
        title:       raw.title,
        description: raw.description,
        price:       Number(raw.price),
        mainCategory:"marketplace",
        category:    [raw.category],
        subcategory: [],
        images:      imagesBase64,
      };
    }

    setSubmitting(true);
    try {
      const res = await createBusinessPost(category, payload) as any;
      if (res?.id || res?.success) {
        toast.success("Listing posted successfully!");
        router.push("/business");
      } else {
        toast.error(res?.message ?? "Failed to post listing.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600 transition-colors text-lg">←</button>
        <div className={`w-10 h-10 ${meta.color} rounded-xl flex items-center justify-center text-xl`}>{meta.icon}</div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Post in {meta.label}</h1>
          <p className="text-sm text-gray-500">Create a listing for your business</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Common: Title */}
        <div className="bg-white border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-gray-800">Listing Details</h2>

          <Field label="Title *" name="title" required placeholder={`e.g. ${category === "realestate" ? "3-bedroom apartment for rent" : category === "schools" ? "Green Valley School" : category === "motor" ? "Toyota Corolla 2020" : "iPhone 14 Pro"}`} />

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
            <textarea name="description" rows={3} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* Category-specific fields */}
          {category === "realestate" && <RealEstateFields />}
          {category === "schools"    && <SchoolsFields />}
          {category === "motor"      && <MotorFields />}
          {category === "marketplace"&& <MarketplaceFields />}
        </div>

        {/* Images */}
        <div className="bg-white border rounded-xl p-5">
          <ImageUpload
            images={images}
            onAdd={addImages}
            onRemove={removeImage}
            maxImages={10}
            label="Add Photos (up to 10)"
          />
        </div>

        {/* Location */}
        <div className="bg-white border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-gray-800">Location *</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Region</label>
              <select required value={region} onChange={(e) => setRegion(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select region…</option>
                {regions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">City</label>
              <select required value={city} onChange={(e) => setCity(e.target.value)} disabled={!region} className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50">
                <option value="">{region ? "Select city…" : "Select region first"}</option>
                {filteredCities.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className={`flex-1 ${meta.color} text-white py-3 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2`}
          >
            <IoBusiness />
            {submitting ? "Posting…" : "Post Listing"}
          </button>
          <button type="button" onClick={() => router.back()} className="px-5 py-3 rounded-xl border text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Reusable field ───────────────────────────────────────────────────────────

function Field({ label, name, type = "text", required, placeholder, min }: {
  label: string; name: string; type?: string; required?: boolean; placeholder?: string; min?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1 text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        min={min}
        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function SelectField({ label, name, options, required }: {
  label: string; name: string; options: string[]; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1 text-gray-700">{label}</label>
      <select name={name} required={required} className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="">Select…</option>
        {options.map((o) => <option key={o} value={o}>{o.replace(/_/g, " ")}</option>)}
      </select>
    </div>
  );
}

// ─── Category-specific field groups ──────────────────────────────────────────

function RealEstateFields() {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Price (USD) *" name="price" type="number" required min="0" />
        <SelectField label="Listing Type *" name="category" options={RE_CATEGORIES} required />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Bedrooms" name="bedrooms" type="number" min="0" />
        <Field label="Bathrooms" name="bathrooms" type="number" min="0" />
        <Field label="Size (m²)" name="squareFeet" type="number" min="0" />
      </div>
      <Field label="Address" name="address" placeholder="Street address (optional)" />
    </>
  );
}

function SchoolsFields() {
  return (
    <SelectField label="Institution Type *" name="schoolType" options={SCH_CATEGORIES} required />
  );
}

function MotorFields() {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Price (USD) *" name="price" type="number" required min="0" />
        <SelectField label="Vehicle Type *" name="vehicleType" options={MOT_TYPES} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Brand *" name="brand" required placeholder="e.g. Toyota" />
        <Field label="Model *" name="vehicleModel" required placeholder="e.g. Corolla" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Year" name="year" type="number" min="1900" placeholder="2020" />
        <Field label="Mileage (km)" name="mileage" type="number" min="0" />
        <Field label="Color" name="color" placeholder="White" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <SelectField label="Transmission" name="transmission" options={TRANSMISSIONS} />
        <SelectField label="Fuel Type" name="fuelType" options={FUEL_TYPES} />
      </div>
    </>
  );
}

function MarketplaceFields() {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Price (USD) *" name="price" type="number" required min="0" />
        <SelectField label="Category *" name="category" options={MKT_CATEGORIES} required />
      </div>
      <SelectField label="Condition" name="condition" options={CONDITIONS} />
    </>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/(storeFront)/store/hooks";
import { addCar } from "@/app/(storeFront)/store/slices/carsSlice";
import { v4 as uuidv4 } from "uuid";
import {
  regions,
  cities,
} from "@/app/(storeFront)/components/shared/SomLocs/SomaliaRegions";
import { verifySession } from "@/actions/core/authAction";
import {
  getCarActiveFee,
  calculateCarFee,
  FeeConfig,
  CalculatedFee,
} from "@/actions/categories/feeAction";
import {
  Car as CarIcon,
  Settings,
  MapPin,
  DollarSign,
  Image as ImageIcon,
  ChevronRight,
  Info,
  Tag,
} from "lucide-react";
import { Car } from "@/app/utils/types/store/carTypes";

const LISTING_OPTIONS = [
  { value: "carSale", label: "Gawaari Iib ah" },
  { value: "carRent", label: "Gawaari Kireyn" },
  { value: "trailer", label: "Rimoor (Trailers)" },
  { value: "carParts", label: "Qaybaha Gawaarida" },
  { value: "truck", label: "Baabuur Xamuul" },
];

export default function CarCreate() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [filteredCities, setFilteredCities] = useState<any[]>([]);
  const [feeConfig, setFeeConfig] = useState<FeeConfig | null>(null);
  const [calculatedFee, setCalculatedFee] = useState<CalculatedFee | null>(
    null,
  );

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    brand: "",
    vehicleModel: "",
    year: "",
    transmission: "",
    fuelType: "",
    color: "",
    region: "",
    city: "",
    district: "",
    images: [] as File[],
    listingType: "carSale" as
      | "carSale"
      | "carRent"
      | "truck"
      | "trailer"
      | "carParts",
  });

  useEffect(() => {
    const initData = async () => {
      try {
        const [u, config] = await Promise.all([
          verifySession(),
          getCarActiveFee(),
        ]);
        if (u?._id) setCurrentUserId(u._id);
        if (config) setFeeConfig(config);
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };
    initData();
  }, []);

  useEffect(() => {
    if (form.region) {
      setFilteredCities(cities.filter((c) => c.regionId === form.region));
    } else {
      setFilteredCities([]);
    }
  }, [form.region]);

  useEffect(() => {
    if (feeConfig && form.listingType) {
      const fee = calculateCarFee(feeConfig, form.listingType);
      setCalculatedFee(fee);
    }
  }, [form.listingType, feeConfig]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const files = (e.target as HTMLInputElement).files;
      if (files) setForm((prev) => ({ ...prev, images: Array.from(files) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUserId) return alert("Fadlan soo gal marka hore");
    setLoading(true);

    const carData: Car = {
      id: uuidv4(),
      userId: currentUserId,
      ...form,
      price: parseFloat(form.price) || 0,
      year: parseInt(form.year) || 0,
      images: form.images.map((f) => URL.createObjectURL(f)),
      category: ["Vehicles"],
      subcategory: [form.listingType],
      maGaday: false,
      isPaid: false,
      fee: calculatedFee,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      mainCategory: "Cars",
      subDistrict: "",
    };

    try {
      dispatch(addCar(carData));
      router.push(`/Backoffice/summary/summaryCar/${carData.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="py-10 max-w-5xl mx-auto px-4 text-slate-900">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-200">
          <CarIcon className="text-white w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight">
            Gawaari Liis
          </h2>
          <p className="text-indigo-600 text-sm font-bold uppercase tracking-widest">
            Suuqa Baabuurta
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 mb-1 block tracking-widest">
                Magaca Gaariga
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Tusaale: Toyota Land Cruiser V8..."
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 mb-1 block tracking-widest">
                Nooca Liiska
              </label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  name="listingType"
                  value={form.listingType}
                  onChange={handleChange}
                  className="w-full p-4 pl-10 bg-slate-50 rounded-2xl border-none font-bold focus:ring-2 focus:ring-indigo-500 appearance-none"
                >
                  {LISTING_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 mb-1 block tracking-widest">
                Qiimo (USD)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full p-4 pl-10 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 font-bold"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Settings className="w-4 h-4 text-indigo-500" /> Sifooyinka
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="Brand (Toyota)"
                className="p-4 bg-slate-50 rounded-2xl border-none text-sm font-medium"
              />
              <input
                name="vehicleModel"
                value={form.vehicleModel}
                onChange={handleChange}
                placeholder="Model (V8)"
                className="p-4 bg-slate-50 rounded-2xl border-none text-sm font-medium"
              />
              <input
                name="year"
                value={form.year}
                onChange={handleChange}
                placeholder="Sanadka"
                className="p-4 bg-slate-50 rounded-2xl border-none text-sm font-medium"
              />
              <input
                name="transmission"
                value={form.transmission}
                onChange={handleChange}
                placeholder="Gear (Auto/Manual)"
                className="p-4 bg-slate-50 rounded-2xl border-none text-sm font-medium"
              />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-indigo-500" /> Goobta
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <select
                name="region"
                value={form.region}
                onChange={handleChange}
                className="p-4 bg-slate-50 rounded-2xl border-none text-sm font-medium focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Gobol</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <select
                name="city"
                value={form.city}
                onChange={handleChange}
                className="p-4 bg-slate-50 rounded-2xl border-none text-sm font-medium focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                disabled={!form.region}
                required
              >
                <option value="">Magaalo</option>
                {filteredCities.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input
                name="district"
                value={form.district}
                onChange={handleChange}
                placeholder="Degmo"
                className="p-4 bg-slate-50 rounded-2xl border-none text-sm font-medium col-span-2 focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <label className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-500" /> Sharaxaad & Sawirro
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Sharaxaada gaariga..."
            className="w-full p-6 bg-slate-50 rounded-3xl border-none min-h-[120px] focus:ring-2 focus:ring-indigo-500"
          />
          <div className="relative">
            <ImageIcon className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
            <input
              name="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleChange}
              className="w-full p-4 pl-10 bg-slate-50 rounded-2xl border-none text-sm"
              required
            />
            <div className="mt-4 flex flex-wrap gap-2">
              {form.images.map((file, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-16 h-16 object-cover rounded-lg border"
                />
              ))}
            </div>
          </div>
        </div>

        {calculatedFee && (
          <div
            className={`p-8 rounded-[2.5rem] text-white flex items-center justify-between shadow-xl ${calculatedFee.isFree ? "bg-green-600" : "bg-indigo-600"}`}
          >
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-90">
                {calculatedFee.isFree ? "Bilaash 🎉" : "Lacagta Liiska"}
              </p>
              <h4 className="text-2xl font-black uppercase">
                {
                  LISTING_OPTIONS.find((o) => o.value === form.listingType)
                    ?.label
                }
              </h4>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black">
                {calculatedFee.currency} {calculatedFee.totalAmount.toFixed(2)}
              </p>
              <p className="text-[10px] font-bold uppercase opacity-90">
                WADARTA LACAGTA
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-center w-full">
          <button
            type="submit"
            disabled={loading}
            className="w-64 py-4 bg-green-500 text-white rounded-full font-bold hover:bg-green-600 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? "Sug..." : "Review Summary"}{" "}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}

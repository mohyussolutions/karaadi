"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/(storeFront)/store/hooks";
import { addBoat } from "@/app/(storeFront)/store/slices/boatsSlice";
import { v4 as uuidv4 } from "uuid";
import {
  regions,
  cities,
} from "@/app/(storeFront)/components/shared/SomLocs/SomaliaRegions";
import {
  BoatEnginesForSaleNestedSub,
  BoatPartsNestedSub,
  BoatsForRentNestedSub,
  BoatsForSaleNestedSub,
} from "@/app/(links)/storeFrontLinks/nestedSubcategoryForBoats";
import { verifySession } from "@/actions/core/authAction";
import {
  getBoatActiveFee,
  calculateBoatFee,
  FeeConfig,
  CalculatedFee,
} from "@/actions/categories/feeAction";
import {
  Anchor,
  MapPin,
  DollarSign,
  Image as ImageIcon,
  Info,
  ChevronRight,
  Compass,
  Layers,
  Tag,
} from "lucide-react";
import { Boat } from "@/app/utils/types/store/boatTypes";

const LISTING_TYPE_OPTIONS = [
  { value: "boatSale", label: "Doomo Iib", data: BoatsForSaleNestedSub },
  { value: "boatRent", label: "Doomo Kireysi", data: BoatsForRentNestedSub },
  {
    value: "boatEngine",
    label: "Matoor Doomo",
    data: BoatEnginesForSaleNestedSub,
  },
  { value: "boatParts", label: "Qaybaha Doomo", data: BoatPartsNestedSub },
];

export default function BoatCreate() {
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
    typeVal: "",
    boatModel: "",
    transmission: "",
    color: "",
    region: "",
    city: "",
    district: "",
    subDistrict: "",
    images: [] as File[],
    mainCategory: "Boats",
    listingType: "boatSale" as
      | "boatSale"
      | "boatRent"
      | "boatEngine"
      | "boatParts",
    subCategoryKey: "",
  });

  useEffect(() => {
    const initData = async () => {
      try {
        const [u, config] = await Promise.all([
          verifySession(),
          getBoatActiveFee(),
        ]);
        if (u?._id) setCurrentUserId(u._id);
        if (config) setFeeConfig(config);
      } catch (error) {}
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
      const fee = calculateBoatFee(feeConfig, form.listingType);
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

    const boatData: Boat = {
      id: uuidv4(),
      userId: currentUserId,
      title: form.title,
      description: form.description,
      mainCategory: form.mainCategory,
      category: ["Marine"],
      subcategory: [form.listingType],
      subCategoryKey: form.subCategoryKey,
      region: form.region,
      city: form.city,
      district: form.district,
      subDistrict: form.subDistrict,
      price: parseFloat(form.price) || 0,
      images: form.images.map((file) => URL.createObjectURL(file)),
      type: form.typeVal,
      boatModel: form.boatModel,
      transmission: form.transmission,
      color: form.color,
      listingType: form.listingType,
      maGaday: false,
      isPaid: false,
      fee: calculatedFee,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      dispatch(addBoat(boatData));
      router.push(`/Backoffice/summary/summaryBoat/${boatData.id}`);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const currentSubOptions =
    LISTING_TYPE_OPTIONS.find((opt) => opt.value === form.listingType)?.data ||
    [];

  return (
    <div className="py-10 max-w-5xl mx-auto px-4 text-slate-900">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
          <Anchor className="text-white w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight">
            Marine Heavy
          </h2>
          <p className="text-blue-600 text-sm font-bold uppercase tracking-widest">
            Abuur Xayeysiis Cusub
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 mb-1 block tracking-widest">
                Cinwaanka
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Yamaha WaveRunner, Industrial Boat..."
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
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
                    className="w-full p-4 pl-10 bg-slate-50 rounded-2xl border-none appearance-none font-bold focus:ring-2 focus:ring-blue-500"
                  >
                    {LISTING_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 mb-1 block tracking-widest">
                  Nooca Gaarka ah
                </label>
                <div className="relative">
                  <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    name="subCategoryKey"
                    value={form.subCategoryKey}
                    onChange={handleChange}
                    className="w-full p-4 pl-10 bg-slate-50 rounded-2xl border-none appearance-none font-bold focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Dooro Nooc</option>
                    {currentSubOptions.map((sub: any) => (
                      <option key={sub.title} value={sub.title}>
                        {sub.title}
                      </option>
                    ))}
                  </select>
                </div>
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
                  className="w-full p-4 pl-10 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 font-bold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 mb-1 block tracking-widest">
                Sumad/Nooca
              </label>
              <input
                name="boatModel"
                value={form.boatModel}
                onChange={handleChange}
                placeholder="Tusaale: Yamaha 2024"
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Compass className="w-4 h-4 text-blue-500" /> Faahfaahin
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                name="typeVal"
                value={form.typeVal}
                onChange={handleChange}
                placeholder="Nooca Doomada"
                className="p-4 w-full bg-slate-50 rounded-2xl border-none text-sm font-medium"
              />
              <input
                name="transmission"
                value={form.transmission}
                onChange={handleChange}
                placeholder="Matoorka"
                className="p-4 w-full bg-slate-50 rounded-2xl border-none text-sm font-medium"
              />
              <input
                name="color"
                value={form.color}
                onChange={handleChange}
                placeholder="Midabka"
                className="p-4 w-full bg-slate-50 rounded-2xl border-none text-sm font-medium col-span-2"
              />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-blue-500" /> Goobta
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <select
                name="region"
                value={form.region}
                onChange={handleChange}
                className="p-4 bg-slate-50 rounded-2xl border-none text-sm font-medium focus:ring-2 focus:ring-blue-500"
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
                className="p-4 bg-slate-50 rounded-2xl border-none text-sm font-medium focus:ring-2 focus:ring-blue-500"
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
                placeholder="Degmada"
                className="p-4 bg-slate-50 rounded-2xl border-none text-sm font-medium col-span-2"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <label className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-500" /> Sharaxaad & Sawirro
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Sharaxaad dheeraad ah..."
            className="w-full p-6 bg-slate-50 rounded-3xl border-none min-h-[120px] focus:ring-2 focus:ring-blue-500"
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
            className={`p-8 rounded-[2.5rem] text-white flex items-center justify-between shadow-xl ${calculatedFee.isFree ? "bg-green-600" : "bg-blue-600"}`}
          >
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-90">
                {calculatedFee.isFree ? "Bilaash 🎉" : "Lacagta Liiska"}
              </p>
              <h4 className="text-2xl font-black uppercase">
                {
                  LISTING_TYPE_OPTIONS.find((o) => o.value === form.listingType)
                    ?.label
                }
              </h4>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black">
                {calculatedFee.currency} {calculatedFee.totalAmount.toFixed(2)}
              </p>
              <p className="text-[10px] font-bold uppercase opacity-90 tracking-widest">
                Wadarta Guud
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

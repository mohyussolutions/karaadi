"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdAttachMoney } from "@/app/utils/icons";
import { useImageUpload } from "@/app/(storeFront)/components/shared/ImageUpload/useImageUpload";
import ImageUpload from "@/app/(storeFront)/components/shared/ImageUpload/ImageUpload";
import { FaHome } from "react-icons/fa";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import { createRealEstate } from "@/actions/categories/realEstateActions";
import { getAllRegions, getAllCities, addCity } from "@/actions/categories/geoAction";
import { categories as nesCategories } from "@/app/(links)/storeFrontLinks/nesSubCategoryLinks";
import { useAuth } from "@/context/AuthContext";
import { useAppDispatch, useAppSelector } from "@/store/slices/hooks/hooks";
import { updateItem } from "@/store/slices/reducers/listingDraftSlice";
import { getRealEstateFees } from "@/actions/categories/feeAction";
import CheckoutSteps from "@/app/(storeFront)/components/checkout/CheckoutSteps";

const RE_CATEGORIES = [
  { key: "forRent", label: "For Rent" },
  { key: "forSale", label: "For Sale" },
  { key: "landForSale", label: "Land For Sale" },
  { key: "farmForSale", label: "Farm For Sale" },
  { key: "commercial", label: "Commercial" },
];

const RE_FEE_MAPPING: Record<string, string> = {
  forRent: "rent",
  forSale: "sale",
  landForSale: "land",
  farmForSale: "farm",
  commercial: "business",
};

const PROPERTY_TYPES = [
  "Apartment",
  "House / Villa",
  "Commercial Space",
  "Land",
  "Warehouse",
  "Farm",
  "Other",
];

const AMENITIES_LIST = [
  "Swimming Pool",
  "Gym",
  "Security",
  "Elevator",
  "Generator",
  "Water Supply",
  "Air Conditioning",
  "Garden",
  "Balcony",
  "Parking",
];

export default function CreateAdForRealEstatePage() {
  const router = useRouter();
  return <RealEstateForm onNext={() => router.push("/plan")} />;
}

function RealEstateForm({ onNext }: { onNext: () => void }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const savedItem = useAppSelector((state) => state.listingDraft.item);

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
    mainCategory: "Real Estate",
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
    propertyType: savedItem.propertyType || "",
    sizeSqm: savedItem.sizeSqm || "",
    bedrooms: savedItem.bedrooms || "",
    bathrooms: savedItem.bathrooms || "",
    floor: savedItem.floor || "",
    totalFloors: savedItem.totalFloors || "",
    furnished: savedItem.furnished || false,
    parking: savedItem.parking || false,
    hasGarage: (savedItem as any).hasGarage || false,
    hasGarden: (savedItem as any).hasGarden || false,
    amenities: (savedItem.amenities as string[]) || [],
    address: (savedItem as any).address || "",
  });

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [regs, cits, feeRes] = await Promise.all([
          getAllRegions(),
          getAllCities(),
          getRealEstateFees(),
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
      const feeKey = RE_FEE_MAPPING[categoryKey];
      return Number(activeFeeConfig[feeKey] || 0);
    },
    [activeFeeConfig],
  );

  const getNestedSubcategories = () => {
    if (!formData.category) return [];
    const map = nesCategories.categoryNestedMap as any;
    return map[formData.category] || [];
  };

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isLoading) return;

    const requiredFields = [
      "category",
      "title",
      "description",
      "price",
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
        const res: any = await addCity({ name: newCity.trim(), regionId: formData.region });
        if (res?.success) finalCity = res.data.name;
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
        mainCategory: "Real Estate",
        category: formData.category ? [formData.category] : [],
        subcategory: formData.subCategory ? [formData.subCategory] : [],
        propertyType: formData.propertyType,
        squareFeet: formData.sizeSqm ? Number(formData.sizeSqm) : undefined,
        sizeSqm: formData.sizeSqm ? Number(formData.sizeSqm) : undefined,
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : undefined,
        floor: formData.floor ? Number(formData.floor) : undefined,
        totalFloors: formData.totalFloors ? Number(formData.totalFloors) : undefined,
        furnished: formData.furnished,
        parking: formData.parking,
        hasGarage: formData.hasGarage,
        hasGarden: formData.hasGarden,
        amenities: formData.amenities,
        address: formData.address,
        county: formData.region,
        region: formData.region,
        city: finalCity,
        images: imagesBase64,
        isPaid: false,
        feeAmount: fee,
      };

      const result: any = await createRealEstate(
        payload as any,
        user.token || (user as any).accessToken,
      );

      if (result.success) {
        toast.update(toastId, {
          render: t("createMotorcycle.successMessage"),
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        const createdId = result.id || result._id;
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
          <FaHome className="text-4xl text-blue-600" />
        </div>
        <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">
          Create Real Estate Listing
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
            Main Category
          </label>
          <div className="flex items-center gap-3 w-full border-2 border-blue-100 bg-blue-50/30 p-4 rounded-2xl">
            <FaHome className="text-blue-500" />
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
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value, subCategory: "" })
              }
              className="w-full border-2 border-gray-100 bg-gray-50 p-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold"
              required
            >
              <option value="">Select Category</option>
              {RE_CATEGORIES.map((cat) => (
                <option key={cat.key} value={cat.key}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
              Subcategory
            </label>
            <select
              value={formData.subCategory}
              onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
              disabled={!formData.category}
              className="w-full border-2 border-gray-100 bg-gray-50 p-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold disabled:opacity-50"
              required
            >
              <option value="">Select Subcategory</option>
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
            Title
          </label>
          <input
            placeholder="e.g. Spacious 3BR Apartment in Mogadishu"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full border-2 border-gray-100 bg-gray-50 p-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
              Property Type
            </label>
            <select
              value={formData.propertyType}
              onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
              className="w-full border-2 border-gray-100 bg-gray-50 p-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold"
              required
            >
              <option value="">Select Property Type</option>
              {PROPERTY_TYPES.map((pt) => (
                <option key={pt} value={pt}>
                  {pt}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
              Size (sqm)
            </label>
            <input
              type="number"
              placeholder="e.g. 120"
              value={formData.sizeSqm}
              onChange={(e) => setFormData({ ...formData, sizeSqm: e.target.value })}
              className="w-full border-2 border-gray-100 bg-gray-50 p-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase">Bedrooms</label>
            <input
              type="number"
              placeholder="e.g. 3"
              value={formData.bedrooms}
              onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
              className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold outline-none focus:border-blue-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase">Bathrooms</label>
            <input
              type="number"
              placeholder="e.g. 2"
              value={formData.bathrooms}
              onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
              className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold outline-none focus:border-blue-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase">Floor</label>
            <input
              type="number"
              placeholder="e.g. 3"
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
              className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold outline-none focus:border-blue-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase">
              Total Floors
            </label>
            <input
              type="number"
              placeholder="e.g. 10"
              value={formData.totalFloors}
              onChange={(e) => setFormData({ ...formData, totalFloors: e.target.value })}
              className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          {[
            { key: "furnished", label: "Furnished" },
            { key: "parking", label: "Parking" },
            { key: "hasGarage", label: "Garage" },
            { key: "hasGarden", label: "Garden" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={(formData as any)[key]}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                className="w-5 h-5 accent-blue-600"
              />
              <span className="font-black text-gray-700 text-sm uppercase tracking-wide">
                {label}
              </span>
            </label>
          ))}
        </div>

        <div className="space-y-3">
          <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
            Amenities
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {AMENITIES_LIST.map((amenity) => (
              <label
                key={amenity}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.amenities.includes(amenity)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-100 bg-gray-50 hover:border-blue-200"
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => toggleAmenity(amenity)}
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-xs font-bold text-gray-700">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
              Description
            </label>
            <textarea
              placeholder="Describe the property, neighborhood, key features..."
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border-2 border-gray-100 bg-gray-50 p-4 rounded-2xl outline-none font-bold"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
              Region
            </label>
            <select
              value={formData.region}
              onChange={(e) =>
                setFormData({ ...formData, region: e.target.value, city: "" })
              }
              className="w-full border-2 border-gray-100 bg-gray-50 p-4 rounded-2xl outline-none font-bold"
              required
            >
              <option value="">Select Region</option>
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
            City
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCityDropdown(!showCityDropdown)}
              disabled={!formData.region}
              className="w-full text-left border-2 border-gray-100 bg-gray-50 p-4 rounded-2xl font-bold flex justify-between items-center disabled:opacity-50"
            >
              {showNewCityInputs ? "Adding city..." : formData.city || "Select City"}
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
                  + ADD NEW CITY
                </button>
              </div>
            )}
          </div>
        </div>

        {showNewCityInputs && (
          <input
            placeholder="Enter new city name"
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            className="w-full border-2 border-blue-200 bg-blue-50 p-4 rounded-2xl font-bold outline-none"
          />
        )}

        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
            Address
          </label>
          <input
            placeholder="e.g. KM4, Hodan District"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full border-2 border-gray-100 bg-gray-50 p-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
            Price ($)
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
            label={t("createMotorcycle.upload")}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-5 rounded-2xl bg-blue-600 text-white font-black text-xl shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:bg-gray-200 flex items-center justify-center"
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

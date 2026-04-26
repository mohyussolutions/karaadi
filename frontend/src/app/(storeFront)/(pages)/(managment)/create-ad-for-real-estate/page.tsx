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
import Loading from "@/app/ui/loading/Loading";
import { createRealEstate } from "@/actions/categories/realEstateActions";
import { getAllRegions, getAllCities } from "@/actions/categories/geoAction";
import CitySelect from "@/app/(storeFront)/components/shared/CitySelect/CitySelect";
import { categories as nesCategories } from "@/app/(links)/storeFrontLinks/mainCategotyCategorySubCategory";
import { useAuth } from "@/context/AuthContext";
import { useAppDispatch, useAppSelector } from "@/store/slices/hooks/hooks";
import { updateItem } from "@/store/slices/reducers/listingDraftSlice";
import { getRealEstateFees } from "@/actions/categories/feeAction";
import CheckoutSteps from "@/app/(storeFront)/components/checkout/CheckoutSteps";

const RE_CATEGORIES = [
  { key: "forRent", tKey: "createRealEstate.categories.forRent" },
  { key: "forSale", tKey: "createRealEstate.categories.forSale" },
  { key: "landForSale", tKey: "createRealEstate.categories.landForSale" },
  { key: "farmForSale", tKey: "createRealEstate.categories.farmForSale" },
  { key: "commercial", tKey: "createRealEstate.categories.commercial" },
];

const RE_FEE_MAPPING: Record<string, string> = {
  forRent: "rent",
  forSale: "sale",
  landForSale: "land",
  farmForSale: "farm",
  commercial: "business",
};

const PROPERTY_TYPES = [
  { key: "apartment", tKey: "createRealEstate.propertyTypes.apartment" },
  { key: "houseVilla", tKey: "createRealEstate.propertyTypes.houseVilla" },
  {
    key: "commercialSpace",
    tKey: "createRealEstate.propertyTypes.commercialSpace",
  },
  { key: "land", tKey: "createRealEstate.propertyTypes.land" },
  { key: "warehouse", tKey: "createRealEstate.propertyTypes.warehouse" },
  { key: "farm", tKey: "createRealEstate.propertyTypes.farm" },
  { key: "other", tKey: "createRealEstate.propertyTypes.other" },
];

const AMENITIES_LIST = [
  { key: "Swimming Pool", tKey: "createRealEstate.swimmingPoolLabel" },
  { key: "Gym", tKey: "createRealEstate.gymLabel" },
  { key: "Security", tKey: "createRealEstate.securityLabel" },
  { key: "Elevator", tKey: "createRealEstate.elevatorLabel" },
  { key: "Generator", tKey: "createRealEstate.generatorLabel" },
  { key: "Water Supply", tKey: "createRealEstate.waterSupplyLabel" },
  { key: "Air Conditioning", tKey: "createRealEstate.airConditioningLabel" },
  { key: "Garden", tKey: "createRealEstate.gardenLabel" },
  { key: "Balcony", tKey: "createRealEstate.balconyLabel" },
  { key: "Parking", tKey: "createRealEstate.parkingLabel" },
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
  const savedItem = useAppSelector((state) => state.listingDraft?.item ?? {});

  const [isLoading, setIsLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [regions, setRegions] = useState<any[]>([]);
  const [allCities, setAllCities] = useState<any[]>([]);
  const { images, addImages, removeImage, toBase64 } = useImageUpload();
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
        : Array.isArray(savedItem.subCategory) &&
            savedItem.subCategory.length > 0
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
        setActiveFeeConfig(
          Array.isArray(feeRes) ? feeRes[0] || {} : feeRes || {},
        );
      } catch {
      } finally {
        setDataLoading(false);
      }
    };
    loadData();
  }, []);


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
      requiredFields.some((key) => !(formData as any)[key]) ||
      images.length === 0;

    if (isMissing) {
      return toast.error(t("createRealEstate.fillRequired"));
    }

    setIsLoading(true);
    const toastId = toast.loading(t("createRealEstate.submitting"));

    try {
      const imagesBase64 = await toBase64();
      const fee = getFeeForCategory(formData.category);

      const payload = {
        userId: user._id || user.id,
        name: formData.title,
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        mainCategory: "Real Estate",
        category: formData.category ? [formData.category] : [],
        subcategory: formData.subCategory ? [formData.subCategory] : [],
        propertyType: formData.propertyType,
        squareFeet: formData.sizeSqm ? Number(formData.sizeSqm) : undefined,
        sizeSqm: formData.sizeSqm ? Number(formData.sizeSqm) : undefined,
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : undefined,
        floor: formData.floor ? Number(formData.floor) : undefined,
        totalFloors: formData.totalFloors
          ? Number(formData.totalFloors)
          : undefined,
        furnished: formData.furnished,
        parking: formData.parking,
        hasGarage: formData.hasGarage,
        hasGarden: formData.hasGarden,
        amenities: formData.amenities,
        address: formData.address,
        county: formData.region,
        region: formData.region,
        city: formData.city,
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
          render: t("createRealEstate.submittedSuccess"),
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        const createdId = result.id || result._id;
        dispatch(updateItem({ ...payload, id: String(createdId) }));
        setTimeout(() => onNext(), 1200);
      } else {
        toast.update(toastId, {
          render: result.message || t("createRealEstate.submitError"),
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch {
      toast.update(toastId, {
        render: t("createRealEstate.submitError"),
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
          {t("createRealEstate.pageTitle")}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
            {t("createRealEstate.mainCategory")}
          </label>
          <div className="flex items-center gap-3 w-full border-2 border-blue-100 bg-blue-50/30 p-4 rounded-2xl">
            <FaHome className="text-blue-500" />
            <input
              type="text"
              readOnly
              value={t("createRealEstate.title")}
              className="bg-transparent outline-none font-black text-blue-700 w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
              {t("createRealEstate.category")}
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value,
                  subCategory: "",
                })
              }
              className="w-full border-2 border-gray-100 bg-gray-50 p-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold"
              required
            >
              <option value="">{t("createRealEstate.selectCategory")}</option>
              {RE_CATEGORIES.map((cat) => (
                <option key={cat.key} value={cat.key}>
                  {t(cat.tKey)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
              {t("createRealEstate.subcategoryLabel")}
            </label>
            <select
              value={formData.subCategory}
              onChange={(e) =>
                setFormData({ ...formData, subCategory: e.target.value })
              }
              disabled={!formData.category}
              className="w-full border-2 border-gray-100 bg-gray-50 p-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold disabled:opacity-50"
            >
              <option value="">{t("createRealEstate.selectSubcategory")}</option>
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
            {t("createRealEstate.titleLabel")}
          </label>
          <input
            placeholder={t("createRealEstate.titleInputPlaceholder")}
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            maxLength={200}
            className="w-full border-2 border-gray-100 bg-gray-50 p-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
              {t("createRealEstate.propertyTypeLabel")}
            </label>
            <select
              value={formData.propertyType}
              onChange={(e) =>
                setFormData({ ...formData, propertyType: e.target.value })
              }
              className="w-full border-2 border-gray-100 bg-gray-50 p-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold"
            >
              <option value="">{t("createRealEstate.selectPropertyType")}</option>
              {PROPERTY_TYPES.map((pt) => (
                <option key={pt.key} value={pt.key}>
                  {t(pt.tKey)}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
              {t("createRealEstate.sizeSqmLabel")}
            </label>
            <input
              type="number"
              placeholder={t("createRealEstate.sizeSqmPlaceholder")}
              value={formData.sizeSqm}
              onChange={(e) =>
                setFormData({ ...formData, sizeSqm: e.target.value })
              }
              className="w-full border-2 border-gray-100 bg-gray-50 p-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase">
              {t("createRealEstate.bedroomsLabel")}
            </label>
            <input
              type="number"
              placeholder={t("createRealEstate.bedroomsPlaceholder")}
              value={formData.bedrooms}
              onChange={(e) =>
                setFormData({ ...formData, bedrooms: e.target.value })
              }
              className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold outline-none focus:border-blue-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase">
              {t("createRealEstate.bathroomsLabel")}
            </label>
            <input
              type="number"
              placeholder={t("createRealEstate.bathroomsPlaceholder")}
              value={formData.bathrooms}
              onChange={(e) =>
                setFormData({ ...formData, bathrooms: e.target.value })
              }
              className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold outline-none focus:border-blue-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase">
              {t("createRealEstate.floorLabel")}
            </label>
            <input
              type="number"
              placeholder={t("createRealEstate.floorPlaceholder")}
              value={formData.floor}
              onChange={(e) =>
                setFormData({ ...formData, floor: e.target.value })
              }
              className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold outline-none focus:border-blue-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase">
              {t("createRealEstate.totalFloorsLabel")}
            </label>
            <input
              type="number"
              placeholder={t("createRealEstate.totalFloorsPlaceholder")}
              value={formData.totalFloors}
              onChange={(e) =>
                setFormData({ ...formData, totalFloors: e.target.value })
              }
              className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-gray-400 uppercase tracking-wider">
              {t("createRealEstate.furnishedLabel")} ·{" "}
              {t("createRealEstate.parkingLabel")} ·{" "}
              {t("createRealEstate.garageLabel")} ·{" "}
              {t("createRealEstate.gardenLabel")}
            </span>
            <span className="text-[10px] font-black text-blue-400 uppercase bg-blue-50 px-2 py-0.5 rounded-full">
              {t("createRealEstate.optional")}
            </span>
          </div>
          <div className="flex flex-wrap gap-6">
            {[
              { key: "furnished", tKey: "createRealEstate.furnishedLabel" },
              { key: "parking", tKey: "createRealEstate.parkingLabel" },
              { key: "hasGarage", tKey: "createRealEstate.garageLabel" },
              { key: "hasGarden", tKey: "createRealEstate.gardenLabel" },
            ].map(({ key, tKey }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(formData as any)[key]}
                  onChange={(e) =>
                    setFormData({ ...formData, [key]: e.target.checked })
                  }
                  className="w-5 h-5 accent-blue-600"
                />
                <span className="font-black text-gray-700 text-sm uppercase tracking-wide">
                  {t(tKey)}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider">
              {t("createRealEstate.amenitiesLabel")}
            </label>
            <span className="text-[10px] font-black text-blue-400 uppercase bg-blue-50 px-2 py-0.5 rounded-full">
              {t("createRealEstate.optional")}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {AMENITIES_LIST.map(({ key, tKey }) => (
              <label
                key={key}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.amenities.includes(key)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-100 bg-gray-50 hover:border-blue-200"
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(key)}
                  onChange={() => toggleAmenity(key)}
                  maxLength={100}
            className="w-4 h-4 accent-blue-600"
                />
                <span className="text-xs font-bold text-gray-700">
                  {t(tKey)}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
              {t("createRealEstate.descriptionLabel")}
            </label>
            <textarea
              placeholder={t("createRealEstate.descriptionPlaceholder")}
              rows={5}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              maxLength={5000}
            className="w-full border-2 border-gray-100 bg-gray-50 p-4 rounded-2xl outline-none font-bold"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
              {t("createRealEstate.regionLabel")}
            </label>
            <select
              value={formData.region}
              onChange={(e) =>
                setFormData({ ...formData, region: e.target.value, city: "" })
              }
              className="w-full border-2 border-gray-100 bg-gray-50 p-4 rounded-2xl outline-none font-bold"
              required
            >
              <option value="">{t("createRealEstate.selectRegion")}</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <CitySelect
          regionId={formData.region}
          cities={allCities}
          value={formData.city}
          onChange={(name) => setFormData({ ...formData, city: name })}
          onCitiesUpdate={(updated) => setAllCities(updated)}
          disabled={!formData.region}
          label={t("createRealEstate.cityLabel")}
        />

        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
            {t("createRealEstate.addressLabel")}
          </label>
          <input
            placeholder={t("createRealEstate.addressPlaceholder")}
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            maxLength={100}
            className="w-full border-2 border-gray-100 bg-gray-50 p-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
            {t("createRealEstate.priceLabel")}
          </label>
          <div className="relative">
            <MdAttachMoney className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 text-xl" />
            <input
              type="number"
              placeholder={t("createRealEstate.pricePlaceholder")}
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              min={0}
              max={100000000}
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
            label={t("createRealEstate.upload")}
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
            t("createRealEstate.submit")
          )}
        </button>
      </form>
    </div>
  );
}

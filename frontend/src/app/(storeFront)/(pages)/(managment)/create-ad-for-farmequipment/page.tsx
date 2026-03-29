"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  MdCategory,
  MdOutlineDescription,
  MdAttachMoney,
  MdLocationOn,
  MdAddPhotoAlternate,
  MdSettings,
  MdLocationCity,
} from "react-icons/md";
import { HiOutlineTag } from "react-icons/hi";
import { GiFarmTractor } from "react-icons/gi";

import { verifySession } from "@/actions/core/authAction";
import {
  getAllRegions,
  getAllCities,
  addCity,
} from "@/actions/categories/geoAction";
import { createTraktor } from "@/actions/categories/FarmequipmentAction";

import { allCategories } from "@/app/(links)/storeFrontLinks/categories";
import { traktorSubCategories } from "@/app/(links)/storeFrontLinks/subCategories";
import {
  TractorForSaleNestedSub,
  FarmToolsNestedSub,
  FertilizerSpreaderNestedSub,
  GrainHarvesterNestedSub,
} from "@/app/(links)/storeFrontLinks/nestedsubcategoryfortractors";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";

const TraktorNestedSubCategoryMap: Record<string, any[]> = {
  "Tractor for Sale": TractorForSaleNestedSub,
  "Farm Tools": FarmToolsNestedSub,
  "Fertilizer Spreader": FertilizerSpreaderNestedSub,
  "Grain Harvester": GrainHarvesterNestedSub,
};
type User = { _id?: string; id?: string; token?: string; accessToken?: string };
type Region = { id: string; name: string };
type City = { id: string; name: string; regionId?: string };

type FormDataState = {
  mainCategory: string;
  category: string;
  subcategory: string;
  title: string;
  make: string;
  farmequipmentModel: string;
  type: string;
  year: string;
  condition: string;
  hours: string;
  enginePower: string;
  fuelType: string;
  price: string;
  region: string;
  city: string;
  description: string;
};

const CreateFarmEquipment = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [allCities, setAllCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [showNewCityInputs, setShowNewCityInputs] = useState(false);
  const [newCity, setNewCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const defaultMain =
    allCategories.find((c) => c.key === "farmequipment")?.name ||
    "Farmequipment";
  const [mainCategory, setMainCategory] = useState<string>(defaultMain);

  const [formData, setFormData] = useState<FormDataState>({
    mainCategory: defaultMain,
    category: "",
    subcategory: "",
    title: "",
    make: "",
    farmequipmentModel: "",
    type: "",
    year: "",
    condition: "",
    hours: "",
    enginePower: "",
    fuelType: "",
    price: "",
    region: "",
    city: "",
    description: "",
  });

  useEffect(() => {
    async function init() {
      try {
        const sessionUser = await verifySession();
        if (sessionUser) {
          setCurrentUser({ id: sessionUser._id });
        }
        const [regs, cities] = await Promise.all([
          getAllRegions(),
          getAllCities(),
        ]);
        setRegions(regs || []);
        setAllCities(cities || []);
      } catch (error) {
        console.error(error);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (formData.region) {
      const filtered = allCities.filter((c) => c.regionId === formData.region);
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  }, [formData.region, allCities]);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || isLoading) return;

    try {
      setIsLoading(true);

      let finalCityName = formData.city.trim();

      if (showNewCityInputs && newCity.trim()) {
        const cityPayload = {
          id: newCity.trim().toLowerCase().replace(/\s+/g, "-"),
          name: newCity.trim(),
          regionId: formData.region,
          isActive: true,
        };

        const cityResult = await addCity(cityPayload);

        if (cityResult.success) {
          finalCityName = cityResult.data.name;
          setAllCities((prev) => [...prev, cityResult.data]);
        } else {
          toast.error("Waa lagu guul daraystay in la kaydiyo magaalada");
          setIsLoading(false);
          return;
        }
      }

      const imagesBase64 = await Promise.all(
        images.map((img) => convertToBase64(img)),
      );

      const selectedRegion = regions.find((r) => r.id === formData.region);

      const payload = {
        userId: currentUser.id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        mainCategory: mainCategory,
        category: [formData.category.trim()],
        subcategory: [formData.subcategory.trim()],
        region: selectedRegion ? selectedRegion.name : formData.region.trim(),
        city: finalCityName,
        images: imagesBase64,
        make: formData.make.trim(),
        farmequipmentModel: formData.farmequipmentModel.trim(),
        type: formData.type.trim(),
        year: Number(formData.year),
        condition: formData.condition.trim(),
        hours: Number(formData.hours),
        enginePower: formData.enginePower.trim(),
        fuelType: formData.fuelType.trim(),
      };

      const result = await createTraktor(payload as any);

      if (result?.success) {
        toast.success("Waa lagu guuleystay!");
        router.push(`/(summary)/vehicles-summary?id=${result._id}`);
      } else {
        toast.error(result?.message || "Cillad ayaa dhacday");
      }
    } catch (err) {
      toast.error("Cillad farsamo ayaa dhacday");
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser)
    return (
      <div className="p-10 text-center font-bold text-gray-400">
        <Loading />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-6 p-4 md:p-8 bg-white rounded-2xl border border-gray-100">
      <ToastContainer />
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-gray-800 flex items-center justify-center gap-3">
          <GiFarmTractor className="text-blue-600" />
          {t("createFarmequipment.title")}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <MdCategory className="text-blue-600 text-lg" />{" "}
            {t("createFarmequipment.mainCategory")}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select
              value={mainCategory}
              onChange={(e) => setMainCategory(e.target.value)}
              className="w-full border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none"
              required
            >
              {allCategories
                .filter((cat) => cat.key === "farmequipment")
                .map((cat) => (
                  <option key={cat.key} value={cat.name}>
                    {i18n.language && i18n.language.startsWith("so")
                      ? cat.so || cat.name
                      : cat.name}
                  </option>
                ))}
            </select>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value,
                  subcategory: "",
                })
              }
              className="w-full border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none"
              required
            >
              <option value="">{t("createFarmequipment.category")}</option>
              {traktorSubCategories.map((cat: any) => (
                <option key={cat.title} value={cat.title}>
                  {i18n.language && i18n.language.startsWith("so")
                    ? cat.so || cat.title
                    : cat.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select
              value={formData.subcategory}
              onChange={(e) =>
                setFormData({ ...formData, subcategory: e.target.value })
              }
              className="w-full border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none"
              disabled={!formData.category}
              required
            >
              <option value="">{t("createFarmequipment.subcategory")}</option>
              {(TraktorNestedSubCategoryMap[formData.category] || []).map(
                (sub: any) => (
                  <option key={sub.title} value={sub.title}>
                    {i18n.language && i18n.language.startsWith("so")
                      ? sub.so || sub.title
                      : sub.title}
                  </option>
                ),
              )}
            </select>
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                {t("createFarmequipment.pricePlaceholder")}
              </label>
              <div className="relative">
                <MdAttachMoney className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 text-xl" />
                <input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full border-2 border-gray-100 bg-gray-50 pl-11 pr-4 py-3 rounded-xl outline-none"
                  placeholder={t("createFarmequipment.pricePlaceholder")}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              {t("createFarmequipment.titlePlaceholder")}
            </label>
            <div className="relative">
              <HiOutlineTag className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 text-xl" />
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full border-2 border-gray-100 bg-gray-50 pl-11 pr-4 py-3 rounded-xl outline-none"
                placeholder={t("createFarmequipment.titlePlaceholder")}
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <MdSettings className="text-blue-600 text-lg" />{" "}
            {t("createFarmequipment.technicalDetails")}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="make" className="">
                {t("createFarmequipment.makePlaceholder")}
              </label>
              <input
                id="make"
                type="text"
                placeholder={t("createFarmequipment.makePlaceholder")}
                className="w-full border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none"
                value={formData.make}
                onChange={(e) =>
                  setFormData({ ...formData, make: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label htmlFor="model" className="">
                {t("createFarmequipment.modelPlaceholder")}
              </label>
              <input
                id="model"
                type="text"
                placeholder={t("createFarmequipment.modelPlaceholder")}
                className="w-full border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none"
                value={formData.farmequipmentModel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    farmequipmentModel: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <label htmlFor="type" className="">
                {t("createFarmequipment.typePlaceholder")}
              </label>
              <input
                id="type"
                type="text"
                placeholder={t("createFarmequipment.typePlaceholder")}
                className="w-full border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label htmlFor="year" className="">
                {t("createFarmequipment.yearPlaceholder")}
              </label>
              <input
                id="year"
                type="number"
                placeholder={t("createFarmequipment.yearPlaceholder")}
                className="w-full border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label htmlFor="condition" className="">
                {t("createFarmequipment.conditionPlaceholder")}
              </label>
              <input
                id="condition"
                type="text"
                placeholder={t("createFarmequipment.conditionPlaceholder")}
                className="w-full border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none"
                value={formData.condition}
                onChange={(e) =>
                  setFormData({ ...formData, condition: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label htmlFor="hours" className="">
                {t("createFarmequipment.hoursPlaceholder")}
              </label>
              <input
                id="hours"
                type="number"
                placeholder={t("createFarmequipment.hoursPlaceholder")}
                className="w-full border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none"
                value={formData.hours}
                onChange={(e) =>
                  setFormData({ ...formData, hours: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label htmlFor="enginePower" className="">
                {t("createFarmequipment.enginePowerPlaceholder")}
              </label>
              <input
                id="enginePower"
                type="text"
                placeholder={t("createFarmequipment.enginePowerPlaceholder")}
                className="w-full border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none"
                value={formData.enginePower}
                onChange={(e) =>
                  setFormData({ ...formData, enginePower: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label htmlFor="fuelType" className="">
                {t("createFarmequipment.fuelTypePlaceholder")}
              </label>
              <select
                id="fuelType"
                value={formData.fuelType}
                onChange={(e) =>
                  setFormData({ ...formData, fuelType: e.target.value })
                }
                className="w-full border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none"
                required
              >
                <option value="">
                  {t("createFarmequipment.fuelTypePlaceholder")}
                </option>
                <option value="Diesel">Diesel</option>
                <option value="Gasoline">Gasoline</option>
                <option value="Electric">Electric</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <MdLocationOn className="text-blue-600 text-lg" />{" "}
            {t("createFarmequipment.locationLabel")}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="region"
                className="text-xs font-bold text-gray-400 ml-2 uppercase"
              >
                {t("createFarmequipment.regionLabel")}
              </label>
              <select
                id="region"
                value={formData.region}
                onChange={(e) =>
                  setFormData({ ...formData, region: e.target.value, city: "" })
                }
                className="border-2 border-gray-100 bg-gray-50 p-3 rounded-xl outline-none"
                required
              >
                <option value="">{t("createAd.selectRegion")}</option>
                {regions.map((reg) => (
                  <option key={reg.id} value={reg.id}>
                    {i18n.language === "so"
                      ? (reg as any).so || reg.name
                      : reg.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="city"
                className="text-xs font-bold text-gray-400 ml-2 uppercase"
              >
                {t("createFarmequipment.cityLabel")}
              </label>
              <select
                id="city"
                value={formData.city}
                onChange={(e) => {
                  const val = e.target.value;
                  setShowNewCityInputs(val === "custom");
                  setFormData({ ...formData, city: val });
                  if (val !== "custom") setNewCity("");
                }}
                className="border-2 border-gray-100 bg-gray-50 p-3 rounded-xl outline-none"
                required={!showNewCityInputs}
                disabled={!formData.region}
              >
                <option value="">{t("createAd.selectCity")}</option>
                {filteredCities.map((c) => (
                  <option key={c.id} value={c.name}>
                    {i18n.language === "so" ? (c as any).so || c.name : c.name}
                  </option>
                ))}
                <option value="custom" className="text-blue-600 font-black">
                  {t("createFarmequipment.addCity")}
                </option>
              </select>
            </div>
          </div>
        </div>

        {showNewCityInputs && (
          <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
            <label
              htmlFor="newCity"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              {t("createFarmequipment.newCityLabel")}
            </label>
            <div className="flex items-center gap-4">
              <MdLocationCity className="text-blue-500 text-2xl" />
              <input
                id="newCity"
                type="text"
                placeholder={t("createFarmequipment.newCityPlaceholder")}
                className="w-full border-2 border-white bg-white px-4 py-3 rounded-xl outline-none"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        <div className="space-y-4">
          <label
            htmlFor="description"
            className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"
          >
            <MdOutlineDescription className="text-blue-600 text-lg" />{" "}
            {t("createFarmequipment.descriptionPlaceholder")}
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            className="w-full border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none resize-none"
            placeholder={t("createFarmequipment.descriptionPlaceholder")}
            required
          />
        </div>

        <div className="space-y-4">
          <label
            htmlFor="images"
            className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"
          >
            <MdAddPhotoAlternate className="text-blue-600 text-lg" />{" "}
            {t("createFarmequipment.imagesLabel")}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="w-24 h-24 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center hover:bg-blue-50 transition-colors">
              <label
                htmlFor="images"
                className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
              >
                <GiFarmTractor className="text-3xl text-gray-300" />
                <span className="sr-only">
                  {t("createFarmequipment.uploadImagesAria", {
                    defaultValue: "Upload images",
                  })}
                </span>
              </label>
              <input
                id="images"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) =>
                  e.target.files &&
                  setImages(Array.from(e.target.files).slice(0, 10))
                }
              />
            </div>
            {images.map((img, i) => (
              <div
                key={i}
                className="relative w-24 h-24 flex items-center justify-center"
              >
                <div className="w-full h-full flex items-center justify-center rounded-2xl bg-gray-50 text-blue-600">
                  <GiFarmTractor size={28} />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setImages(images.filter((_, idx) => idx !== i))
                  }
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`relative w-full py-4 rounded-2xl text-white font-black text-lg transition-all ${
            isLoading
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:scale-95"
          }`}
        >
          <span className={isLoading ? "invisible block" : "block"}>
            {t("createFarmequipment.submit", {
              defaultValue: "Submit Listing",
            })}
          </span>
          {isLoading && (
            <span className="absolute inset-0 flex items-center justify-center">
              {t("createFarmequipment.submitting", {
                defaultValue: <Loading />,
              })}
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateFarmEquipment;

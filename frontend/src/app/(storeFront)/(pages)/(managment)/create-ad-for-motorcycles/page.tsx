"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Region, City } from "@/app/utils/types/geoTypes";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  MdCategory,
  MdAttachMoney,
  MdCloudUpload,
  MdSettings,
  MdDirectionsBike,
  MdOutlinePlaylistRemove,
} from "react-icons/md";
import { FaMotorcycle } from "react-icons/fa";

import { verifySession } from "@/actions/core/authAction";
import { createMotorcycle } from "@/actions/categories/motorcycleActions";
import {
  getAllRegions,
  getAllCities,
  addCity,
} from "@/actions/categories/geoAction";

import { allCategories } from "@/app/(links)/storeFrontLinks/categories";
import { motorcyclesSubCategories } from "@/app/(links)/storeFrontLinks/subCategories";
import {
  MotorcyclesForNestedSub,
  MotorcycleRentNestedSub,
  MCPartsNestedSub,
  OtherNestedSub,
  MotorcycleSubCategoryItem,
} from "@/app/(links)/storeFrontLinks/nestedSubcategoryForMotorcycles";

interface User {
  id: string;
  token: string;
}

const categoryNestedMap: Record<string, MotorcycleSubCategoryItem[]> = {
  "for Sale": MotorcyclesForNestedSub,
  "for Rent": MotorcycleRentNestedSub,
  "Spare Parts": MCPartsNestedSub,
  Other: OtherNestedSub,
};

export default function MotorcycleAdForm() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [allCities, setAllCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [newCity, setNewCity] = useState("");
  const [showNewCityInputs, setShowNewCityInputs] = useState(false);

  const [formData, setFormData] = useState({
    mainCategory:
      allCategories.find((cat) => cat.key === "Motorcycles")?.name ||
      "Motorcycles",
    category: "",
    subCategory: "",
    title: "",
    description: "",
    price: "",
    region: "",
    city: "",
    make: "",
    modelName: "",
    year: "",
    mileage: "",
    engineSize: "",
    color: "",
    transmission: "",
    fuelType: "",
    type: "",
  });

  useEffect(() => {
    async function init() {
      const sessionUser = await verifySession();
      if (!sessionUser) return router.push("/login");
      setCurrentUser({ id: sessionUser._id, token: sessionUser.token });

      const [regs, cities] = await Promise.all([
        getAllRegions(),
        getAllCities(),
      ]);
      setRegions(regs || []);
      setAllCities(cities || []);
    }
    init();
  }, [router]);

  useEffect(() => {
    if (formData.region) {
      setFilteredCities(
        allCities.filter((c) => c.regionId === formData.region),
      );
    }
  }, [formData.region, allCities]);

  useEffect(() => {
    const nestedSubs = categoryNestedMap[formData.category] || [];
    if (formData.subCategory) {
      const selected = nestedSubs.find((s) => s.title === formData.subCategory);
      if (selected) setFormData((prev) => ({ ...prev, title: selected.so }));
    }
  }, [formData.category, formData.subCategory]);

  const motorCat = allCategories.find((cat) => cat.key === "Motorcycles");
  const mainCategoryDisplay = i18n?.language?.startsWith("so")
    ? motorCat?.so || motorCat?.name || formData.mainCategory
    : motorCat?.name || motorCat?.so || formData.mainCategory;

  const onHandleSubmit = async () => {
    if (!currentUser || isLoading) return;

    if (
      !formData.category ||
      !formData.subCategory ||
      !formData.price ||
      !formData.region ||
      (showNewCityInputs ? !newCity : !formData.city)
    ) {
      return toast.error(t("createMotorcycle.fillRequired"));
    }

    if (images.length === 0)
      return toast.error(t("createMotorcycle.uploadAtLeastOneImage"));

    setIsLoading(true);
    const toastId = toast.loading(t("createMotorcycle.registering"));

    try {
      let finalCityName = formData.city;

      if (showNewCityInputs && newCity.trim()) {
        const cityResult = await addCity({
          id: `mc-city-${Date.now()}`,
          name: newCity.trim(),
          regionId: formData.region,
          isActive: true,
        });
        if (cityResult.success) {
          finalCityName = cityResult.data.name;
        } else {
          setIsLoading(false);
          return toast.error(t("createMotorcycle.cityAddFailed"));
        }
      }

      const imagesBase64 = await Promise.all(
        images.map(
          (img) =>
            new Promise((resolve) => {
              const r = new FileReader();
              r.readAsDataURL(img);
              r.onload = () => resolve(r.result);
            }),
        ),
      );

      const payload = {
        userId: currentUser.id,
        title: formData.title,
        so: formData.title,
        description: formData.description,
        price: Number(formData.price),
        mainCategory: formData.mainCategory,
        category: [formData.category],
        subcategory: [formData.subCategory],
        region: formData.region,
        city: finalCityName,
        images: imagesBase64,
        isPaid: false,
        extra: {
          make: formData.make,
          modelName: formData.modelName,
          year: Number(formData.year),
          mileage: Number(formData.mileage) || 0,
          engineSize: formData.engineSize,
          fuelType: formData.fuelType,
          color: formData.color,
          transmission: formData.transmission,
          type: formData.type,
        },
      };

      const result = await createMotorcycle(payload, currentUser.token);

      if (result.success) {
        toast.update(toastId, {
          render: t("createMotorcycle.successMessage"),
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        router.push(`/(summary)/vehicles-summary?id=${result.motorcycleId}`);
      } else {
        toast.update(toastId, {
          render: result.message || t("createMotorcycle.errorMessage"),
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.update(toastId, {
        render: t("createMotorcycle.errorMessage"),
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto mt-10 p-4 md:p-8 bg-white rounded-2xl border border-gray-100">
      <ToastContainer position="top-center" autoClose={3000} />

      <h1 className="text-3xl font-black text-center mb-10 text-gray-800 flex items-center justify-center gap-2">
        {t("createMotorcycle.heading")}{" "}
        <FaMotorcycle className="text-blue-600" />
      </h1>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="mainCategory"
              className="text-sm font-bold text-gray-700 ml-2 block"
            >
              {t("createMotorcycle.mainCategoryLabel")}
            </label>
            <select
              id="mainCategory"
              className="border-2 border-gray-100 bg-white px-4 py-3 rounded-xl outline-none cursor-not-allowed text-base text-black"
              style={{ color: "#111827" }}
              disabled
            >
              <option className="text-black">{mainCategoryDisplay}</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="category"
              className="text-sm font-bold text-gray-700 ml-2 block"
            >
              {t("createMotorcycle.categoryLabel")}
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value,
                  subCategory: "",
                })
              }
              className="border-2 border-gray-100 bg-white px-4 py-3 rounded-xl outline-none focus:border-blue-400 text-base text-black"
              style={{ color: "#111827" }}
            >
              <option value="" className="text-black">
                {t("createMotorcycle.selectCategory")}
              </option>
              {motorcyclesSubCategories.map((cat) => (
                <option
                  key={cat.title}
                  value={cat.title}
                  className="text-black"
                >
                  {i18n?.language?.startsWith("so")
                    ? cat.so || cat.title
                    : cat.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="subCategory"
              className="text-sm font-bold text-gray-700 ml-2 block"
            >
              {t("createMotorcycle.subCategoryLabel")}
            </label>
            <select
              id="subCategory"
              value={formData.subCategory}
              onChange={(e) =>
                setFormData({ ...formData, subCategory: e.target.value })
              }
              className="border-2 border-gray-100 bg-white px-4 py-3 rounded-xl outline-none focus:border-blue-400 text-base text-black"
              style={{ color: "#111827" }}
              disabled={!formData.category}
            >
              <option value="" className="text-black">
                {t("createMotorcycle.selectSubcategory")}
              </option>
              {formData.category &&
                categoryNestedMap[formData.category]?.map((sub) => (
                  <option
                    key={sub.title}
                    value={sub.title}
                    className="text-black"
                  >
                    {i18n?.language?.startsWith("so")
                      ? sub.so || sub.title
                      : sub.title}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <label
          htmlFor="title"
          className="text-sm font-bold text-gray-700 ml-2 block"
        >
          {t("createMotorcycle.titleLabel")}
        </label>
        <input
          id="title"
          type="text"
          placeholder={t("createMotorcycle.titlePlaceholder")}
          className="w-full border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none font-bold focus:border-blue-400"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative flex items-center">
            <MdDirectionsBike className="absolute left-4 text-blue-500 text-xl" />
            <input
              id="make"
              type="text"
              placeholder={t("createMotorcycle.makePlaceholder")}
              className="w-full border-2 border-gray-100 bg-gray-50 pl-11 pr-4 py-3 rounded-xl outline-none focus:border-blue-400"
              value={formData.make}
              onChange={(e) =>
                setFormData({ ...formData, make: e.target.value })
              }
            />
          </div>
          <div className="relative flex items-center">
            <MdSettings className="absolute left-4 text-gray-400 text-xl" />
            <input
              id="model"
              type="text"
              placeholder={t("createMotorcycle.modelPlaceholder")}
              className="w-full border-2 border-gray-100 bg-gray-50 pl-11 pr-4 py-3 rounded-xl outline-none focus:border-blue-400"
              value={formData.modelName}
              onChange={(e) =>
                setFormData({ ...formData, modelName: e.target.value })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input
            id="year"
            type="number"
            placeholder={t("createMotorcycle.yearPlaceholder")}
            className="border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:border-blue-400"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          />
          <input
            id="mileage"
            type="number"
            placeholder={t("createMotorcycle.mileagePlaceholder")}
            className="border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:border-blue-400"
            value={formData.mileage}
            onChange={(e) =>
              setFormData({ ...formData, mileage: e.target.value })
            }
          />
          <div className="relative flex items-center">
            <MdAttachMoney className="absolute left-4 text-green-600 text-xl" />
            <input
              id="price"
              type="number"
              placeholder={t("createMotorcycle.pricePlaceholder")}
              className="w-full border-2 border-gray-100 bg-gray-50 pl-11 py-3 rounded-xl outline-none focus:border-blue-400"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="region"
              className="text-sm font-bold text-gray-700 ml-2 block"
            >
              {t("createMotorcycle.regionLabel")}
            </label>
            <select
              id="region"
              value={formData.region}
              onChange={(e) =>
                setFormData({ ...formData, region: e.target.value, city: "" })
              }
              className="border-2 border-gray-100 bg-white px-4 py-4 md:py-3 rounded-xl outline-none focus:border-blue-400 text-base text-black appearance-none transition-transform transform-gpu focus:scale-105 md:focus:scale-100 focus:text-lg md:focus:text-base"
              style={{
                color: "#111827",
                backgroundColor: "#ffffff",
                WebkitTextFillColor: "#111827",
              }}
            >
              <option value="" className="text-black">
                {t("createMotorcycle.selectRegion")}
              </option>
              {regions.map((r) => (
                <option
                  key={r.id}
                  value={r.id}
                  className="text-black"
                  style={{ color: "#111827", fontSize: "16px" }}
                >
                  {i18n?.language?.startsWith("so") ? r.so || r.name : r.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="city"
              className="text-sm font-bold text-gray-700 ml-2 block"
            >
              {t("createMotorcycle.cityLabel")}
            </label>
            <select
              id="city"
              value={showNewCityInputs ? "custom" : formData.city}
              onChange={(e) => {
                setShowNewCityInputs(e.target.value === "custom");
                setFormData({
                  ...formData,
                  city: e.target.value === "custom" ? "" : e.target.value,
                });
              }}
              className="border-2 border-gray-100 bg-white px-4 py-4 md:py-3 rounded-xl outline-none focus:border-blue-400 text-base text-black appearance-none transition-transform transform-gpu focus:scale-105 md:focus:scale-100 focus:text-lg md:focus:text-base"
              style={{
                color: "#111827",
                backgroundColor: "#ffffff",
                WebkitTextFillColor: "#111827",
              }}
              disabled={!formData.region}
            >
              <option value="" className="text-black">
                {t("createMotorcycle.selectCity")}
              </option>
              {filteredCities.map((c) => (
                <option
                  key={c.id}
                  value={c.name}
                  className="text-black"
                  style={{ color: "#111827", fontSize: "16px" }}
                >
                  {i18n?.language?.startsWith("so") ? c.so || c.name : c.name}
                </option>
              ))}
              <option
                value="custom"
                className="font-bold"
                style={{ color: "#111827", fontSize: "16px" }}
              >
                {t("createMotorcycle.addCity")}
              </option>
            </select>
          </div>
        </div>

        {showNewCityInputs && (
          <input
            id="newCity"
            type="text"
            placeholder={t("createMotorcycle.newCityPlaceholder")}
            className="w-full border-2 border-blue-200 bg-blue-50 px-4 py-3 rounded-xl animate-pulse outline-none"
            onChange={(e) => setNewCity(e.target.value)}
          />
        )}

        <label
          htmlFor="description"
          className="text-sm font-bold text-gray-700 ml-2 block"
        >
          {t("createMotorcycle.descriptionLabel")}
        </label>
        <textarea
          id="description"
          rows={4}
          placeholder={t("createMotorcycle.descriptionPlaceholder")}
          className="w-full border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:border-blue-400"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        <div className="p-4 border-2 border-dashed border-gray-100 rounded-2xl">
          <div className="flex flex-wrap gap-4">
            <label
              htmlFor="images"
              className="w-24 h-24 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <MdCloudUpload className="text-3xl text-gray-300" />
              <span className="text-[10px] text-gray-400 font-bold">
                {t("createMotorcycle.upload")}
              </span>
              <input
                id="images"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  e.target.files &&
                  setImages([...images, ...Array.from(e.target.files)])
                }
              />
            </label>
            {images.map((img, i) => (
              <div key={i} className="relative w-24 h-24 group">
                <img
                  src={URL.createObjectURL(img)}
                  className="w-full h-full object-cover rounded-2xl"
                  alt={t("createMotorcycle.imagePreviewAlt")}
                />
                <button
                  type="button"
                  onClick={() =>
                    setImages(images.filter((_, idx) => idx !== i))
                  }
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                >
                  <MdOutlinePlaylistRemove />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onHandleSubmit}
          disabled={isLoading}
          className={`w-full py-4 rounded-2xl text-white font-black text-lg transition-all ${
            isLoading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
          }`}
        >
          {isLoading
            ? t("createMotorcycle.submitting")
            : t("createMotorcycle.submit")}
        </button>
      </div>
    </div>
  );
}

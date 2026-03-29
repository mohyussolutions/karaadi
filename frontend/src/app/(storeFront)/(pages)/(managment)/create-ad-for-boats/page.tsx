"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdInfo } from "react-icons/md";
import { FaShip } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { verifySession } from "@/actions/core/authAction";
import {
  getAllRegions,
  getAllCities,
  addCity,
} from "@/actions/categories/geoAction";
import { useTranslation } from "react-i18next";
import {
  BoatsForSaleNestedSub,
  BoatsForRentNestedSub,
  BoatEnginesNestedSub,
  BoatPartsNestedSub,
} from "@/app/(links)/storeFrontLinks/nestedSubcategoryForBoats";
import { boatsSubCategories } from "@/app/(links)/storeFrontLinks/subCategories";
import { allCategories } from "@/app/(links)/storeFrontLinks/categories";
import { createBoat } from "@/actions/categories/boatActions";
import { getBoatFees } from "@/actions/categories/feeAction";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";

type User = { _id?: string; id?: string; token?: string; accessToken?: string };
type Region = { id: string; name: string };
type City = {
  id: string;
  name: string;
  regionId?: string;
  so?: string;
  nameSo?: string;
};

type FormDataState = {
  mainCategory: string;
  category: string;
  subCategory: string;
  title: string;
  type: string;
  boatModel: string;
  transmission: string;
  color: string;
  price: string;
  region: string;
  city: string;
  description: string;
  planId?: string;
};

const boatsNestedCategoriesMap: Record<string, any[]> = {
  "Boats for Sale": BoatsForSaleNestedSub,
  "Boats for Rent": BoatsForRentNestedSub,
  "Boat Engines for Sale": BoatEnginesNestedSub,
  "Boat Parts": BoatPartsNestedSub,
};

const BoatForSellAndBuy = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [showNewCityInputs, setShowNewCityInputs] = useState(false);
  const [newCity, setNewCity] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [activeFeeConfig, setActiveFeeConfig] = useState<Record<
    string,
    string
  > | null>(null);
  const [selectedFee, setSelectedFee] = useState<string>("0");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormDataState>({
    mainCategory: "Boats",
    category: "",
    subCategory: "",
    title: "",
    type: "",
    boatModel: "",
    transmission: "",
    color: "",
    price: "",
    region: "",
    city: "",
    description: "",
  });

  useEffect(() => {
    async function init() {
      const sessionUser = await verifySession();
      if (!sessionUser) return router.push("/login");
      setUser(sessionUser);

      const [regs, cits, feeRes] = await Promise.all([
        getAllRegions(),
        getAllCities(),
        getBoatFees(),
      ]);
      setRegions(regs || []);
      setCities(cits || []);
      setActiveFeeConfig(feeRes);
    }
    init();
  }, [router]);

  useEffect(() => {
    if (formData.region)
      setFilteredCities(cities.filter((c) => c.regionId === formData.region));
  }, [formData.region, cities]);

  useEffect(() => {
    if (formData.category && formData.subCategory) {
      const nested = boatsNestedCategoriesMap[formData.category] || [];
      const selected = nested.find((s) => s.title === formData.subCategory);
      if (selected)
        setFormData((prev) => ({
          ...prev,
          title:
            i18n.language === "so"
              ? selected.so || selected.title
              : selected.title,
        }));

      let feeKey = "";
      if (formData.category === "Boats for Rent") feeKey = "boatRent";
      else if (formData.category === "Boats for Sale") feeKey = "boatSale";
      else if (formData.category === "Boat Engines for Sale")
        feeKey = "boatEngine";
      else if (formData.category === "Boat Parts") feeKey = "boatParts";

      if (feeKey && activeFeeConfig)
        setSelectedFee(activeFeeConfig[feeKey] || "0");
      else setSelectedFee("0");
    }
  }, [formData.category, formData.subCategory, activeFeeConfig, i18n.language]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || loading) return;
    const requiredFields: Array<keyof FormDataState> = [
      "category",
      "subCategory",
      "price",
      "region",
      "type",
      "boatModel",
      "color",
      "city",
      "title",
      "description",
    ];
    const missing = requiredFields.filter(
      (key) =>
        !formData[key] ||
        (typeof formData[key] === "string" && formData[key].trim() === ""),
    );
    if (missing.length > 0) {
      return toast.error(
        `Fadlan buuxi banaanada muhiimka ah: ${missing.join(", ")}.`,
      );
    }

    const authToken = user.token || user.accessToken;
    if (!authToken) {
      toast.error("Session error. Please log in again.");
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      let finalCity = formData.city;
      if (showNewCityInputs && newCity.trim()) {
        const res: any = await addCity(
          newCity.trim(),
          newCity.trim(),
          formData.region,
          {
            id: `city-${Date.now()}`,
            name: newCity.trim(),
            regionId: formData.region,
            isActive: true,
          },
        );
        if (res.success) finalCity = res.data.name;
      }

      const base64Images = await Promise.all(
        images.map(
          (img) =>
            new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.readAsDataURL(img);
            }),
        ),
      );

      const userId = user._id ?? user.id ?? "";
      if (!userId) {
        toast.error("Session error: missing user id.");
        setLoading(false);
        return;
      }

      const payload = {
        userId,
        mainCategory: "Boats",
        category: [formData.category],
        subcategory: [formData.subCategory],
        title: formData.title,
        region: formData.region,
        city: finalCity,
        description: formData.description,
        price: Number(formData.price),
        type: formData.type,
        boatModel: formData.boatModel,
        transmission: formData.transmission,
        color: formData.color,
        images: base64Images,
        isPaid: false,
        feeAmount: Number(selectedFee),
        ...(formData.planId ? { planId: formData.planId } : {}),
      } satisfies import("@/actions/categories/boatActions").CreateBoatPayload;

      const result = await createBoat(payload as any, authToken);
      if (result.success) {
        toast.success("Waa la xayeysiiyey!");
        router.push(`/payment/plan?id=${result.boatId}`);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Cillad dhinaca network-ka ah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto mt-6 p-4 md:p-8 bg-white rounded-2xl border border-gray-100">
      <ToastContainer position="top-center" />
      <h1 className="text-3xl font-black text-center mb-10 text-gray-800 flex items-center justify-center gap-2">
        {t("createBoats.title", { defaultValue: "Boats Listing" })}
        <FaShip className="text-blue-600" />
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="mainCategory"
              className="text-xs font-bold text-gray-400 ml-2 uppercase"
            >
              {t("createBoats.mainCategory", { defaultValue: "Main Category" })}
            </label>
            <select
              id="mainCategory"
              className="border-2 border-gray-100 bg-gray-50 p-3 rounded-xl outline-none cursor-not-allowed"
              disabled
            >
              <option>
                {i18n?.language?.startsWith("so")
                  ? allCategories.find((c) => c.key === "Boats")?.so ||
                    t("categories.Boats", { defaultValue: "Boats" })
                  : t("categories.Boats", { defaultValue: "Boats" })}
              </option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="category"
              className="text-xs font-bold text-gray-400 ml-2 uppercase"
            >
              {t("createBoats.category", { defaultValue: "Category" })}
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
              className="border-2 border-gray-100 bg-gray-50 p-3 rounded-xl outline-none focus:border-blue-400"
            >
              <option value="">
                {t("createBoats.selectCategory", {
                  defaultValue: "Dooro Qaybta",
                })}
              </option>
              {boatsSubCategories.map((cat) => (
                <option key={cat.title} value={cat.title}>
                  {i18n.language === "so" ? cat.so || cat.title : cat.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="subCategory"
            className="text-xs font-bold text-gray-400 ml-2 uppercase"
          >
            {t("createBoats.subcategory", { defaultValue: "Subcategory" })}
          </label>
          <select
            id="subCategory"
            value={formData.subCategory}
            onChange={(e) =>
              setFormData({ ...formData, subCategory: e.target.value })
            }
            className="border-2 border-gray-100 bg-gray-50 p-3 rounded-xl outline-none focus:border-blue-400"
            disabled={!formData.category}
          >
            <option value="">
              {t("createBoats.selectSubcategory", {
                defaultValue: "Dooro Nooca",
              })}
            </option>
            {(boatsNestedCategoriesMap[formData.category] || []).map((sub) => (
              <option key={sub.title} value={sub.title}>
                {i18n.language === "so" ? sub.so || sub.title : sub.title}
              </option>
            ))}
          </select>

          {formData.category && (
            <div className="mt-2 flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <MdInfo className="text-blue-500" />
              <label className="text-sm font-bold text-blue-700">
                {t("createBoats.feeLabel", { defaultValue: "Lacagta Adeegga" })}{" "}
                ({formData.category}):{" "}
                <span className="text-lg font-black ml-1">${selectedFee}</span>
              </label>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="title"
            className="text-xs font-bold text-gray-400 ml-2"
          >
            {t("createBoats.titlePlaceholder", { defaultValue: "Title" })}
          </label>
          <input
            id="title"
            placeholder={t("createBoats.titlePlaceholder", {
              defaultValue: "Title",
            })}
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full border-2 border-gray-100 bg-gray-50 p-3 rounded-xl outline-none font-bold focus:border-blue-400"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="type"
              className="text-xs font-bold text-gray-400 ml-2"
            >
              {t("createBoats.typePlaceholder", {
                defaultValue: "Type (waa lama huraan)",
              })}
            </label>
            <input
              id="type"
              placeholder={t("createBoats.typePlaceholder", {
                defaultValue: "Type (waa lama huraan)",
              })}
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="border-2 border-gray-100 p-3 rounded-xl outline-none"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="model"
              className="text-xs font-bold text-gray-400 ml-2"
            >
              {t("createBoats.modelPlaceholder", { defaultValue: "Model" })}
            </label>
            <input
              id="model"
              placeholder={t("createBoats.modelPlaceholder", {
                defaultValue: "Model",
              })}
              value={formData.boatModel}
              onChange={(e) =>
                setFormData({ ...formData, boatModel: e.target.value })
              }
              className="border-2 border-gray-100 p-3 rounded-xl outline-none"
            />
          </div>
          <input
            placeholder={t("createBoats.modelPlaceholder", {
              defaultValue: "Model",
            })}
            value={formData.boatModel}
            onChange={(e) =>
              setFormData({ ...formData, boatModel: e.target.value })
            }
            className="border-2 border-gray-100 p-3 rounded-xl outline-none"
          />
          <div className="flex flex-col gap-1">
            <label
              htmlFor="transmission"
              className="text-xs font-bold text-gray-400 ml-2"
            >
              {t("createBoats.gearboxPlaceholder", { defaultValue: "Gearbox" })}
            </label>
            <select
              id="transmission"
              value={formData.transmission}
              onChange={(e) =>
                setFormData({ ...formData, transmission: e.target.value })
              }
              className="border-2 border-gray-100 p-3 rounded-xl outline-none"
            >
              <option value="">
                {t("createBoats.gearboxPlaceholder", {
                  defaultValue: "Gearbox",
                })}
              </option>
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="color"
              className="text-xs font-bold text-gray-400 ml-2"
            >
              {t("createBoats.colorPlaceholder", { defaultValue: "Color" })}
            </label>
            <input
              id="color"
              placeholder={t("createBoats.colorPlaceholder", {
                defaultValue: "Color",
              })}
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
              className="border-2 border-gray-100 p-3 rounded-xl outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="region"
              className="text-xs font-bold text-gray-400 ml-2"
            >
              {t("createBoats.region", { defaultValue: "Gobol / Region" })}
            </label>
            <select
              value={formData.region}
              onChange={(e) =>
                setFormData({ ...formData, region: e.target.value, city: "" })
              }
              id="region"
              className="border-2 border-gray-100 bg-gray-50 p-3 rounded-xl outline-none"
            >
              <option value="">
                {t("createBoats.selectRegion", { defaultValue: "Dooro Gobol" })}
              </option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {i18n.language === "so" ? (r as any).so || r.name : r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="city"
              className="text-xs font-bold text-gray-400 ml-2"
            >
              {t("createBoats.city", { defaultValue: "Magaalo / City" })}
            </label>
            <div className="relative">
              <button
                type="button"
                id="city"
                onClick={() => setShowCityDropdown((s) => !s)}
                disabled={!formData.region}
                className="w-full text-left border-2 border-gray-100 bg-gray-50 p-3 rounded-xl outline-none flex items-center justify-between"
              >
                <span>
                  {showNewCityInputs
                    ? t("createBoats.addingCity", {
                        defaultValue: "Adding city...",
                      })
                    : formData.city ||
                      t("createBoats.selectCity", {
                        defaultValue: "Dooro Magaalo",
                      })}
                </span>
                <span className="text-gray-400">▾</span>
              </button>

              {showCityDropdown && (
                <div
                  className={`absolute z-30 left-0 right-0 mt-2 bg-white border rounded-xl shadow max-h-56 overflow-auto ${!formData.region ? "hidden" : ""}`}
                >
                  {filteredCities.length === 0 ? (
                    <div className="p-3 text-sm text-gray-500">
                      {t("createBoats.noCities", {
                        defaultValue: "Ma jiraan magaalooyin",
                      })}
                    </div>
                  ) : (
                    filteredCities.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, city: c.name });
                          setShowCityDropdown(false);
                        }}
                        className="w-full text-left p-3 hover:bg-gray-50 flex flex-col"
                      >
                        <span className="font-medium text-gray-800">
                          {i18n.language === "so"
                            ? (c as any).so || (c as any).nameSo || c.name
                            : c.name}
                        </span>
                        {i18n.language !== "so" &&
                        ((c as any).so || (c as any).nameSo) ? (
                          <span className="text-xs text-gray-500">
                            {(c as any).so || (c as any).nameSo}
                          </span>
                        ) : null}
                      </button>
                    ))
                  )}

                  <div className="p-2 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewCityInputs(true);
                        setShowCityDropdown(false);
                      }}
                      className="w-full text-left p-3 text-blue-600 font-bold"
                    >
                      {t("createBoats.addAnotherCity", {
                        defaultValue: "+ Magaalo kale",
                      })}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {showNewCityInputs && (
          <div className="flex flex-col gap-1">
            <label
              htmlFor="newCity"
              className="text-xs font-bold text-gray-400 ml-2"
            >
              {t("createBoats.newCityPlaceholder", {
                defaultValue: "Enter new city name",
              })}
            </label>
            <input
              id="newCity"
              placeholder={t("createBoats.newCityPlaceholder", {
                defaultValue: "Enter new city name",
              })}
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              className="w-full border-2 border-blue-200 bg-blue-50 p-3 rounded-xl animate-pulse outline-none"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="price"
              className="text-xs font-bold text-gray-400 ml-2"
            >
              {t("createBoats.price", { defaultValue: "Price ($)" })}
            </label>
            <input
              id="price"
              type="number"
              placeholder={t("createBoats.pricePlaceholder", {
                defaultValue: "Price ($)",
              })}
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="border-2 border-gray-100 bg-gray-50 p-3 rounded-xl outline-none font-bold text-blue-600 focus:border-blue-400"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="description"
            className="text-xs font-bold text-gray-400 ml-2"
          >
            {t("createBoats.descriptionLabel", { defaultValue: "Description" })}
          </label>
          <textarea
            id="description"
            placeholder={t("createBoats.descriptionPlaceholder", {
              defaultValue: "More details...",
            })}
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full border-2 border-gray-100 bg-gray-50 p-3 rounded-xl outline-none focus:border-blue-400"
          />
        </div>

        <div className="p-4 border-2 border-dashed border-gray-100 rounded-2xl">
          <div className="flex flex-wrap gap-4">
            <label className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
              <FaShip className="text-2xl text-gray-300" />
              <input
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
              <div
                key={i}
                className="relative w-20 h-20 flex items-center justify-center"
              >
                <div className="w-full h-full flex items-center justify-center rounded-2xl bg-gray-50 text-blue-600">
                  <FaShip size={28} />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setImages(images.filter((_, idx) => idx !== i))
                  }
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`relative w-full py-4 rounded-2xl text-white font-black text-lg transition-all ${loading ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:scale-95"}`}
        >
          <span className={loading ? "invisible block" : "block"}>
            {t("createBoats.submit", { defaultValue: "Gudbi Xayeysiiska" })}
          </span>
          {loading && (
            <span className="absolute inset-0 flex items-center justify-center">
              <Loading />
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

export default BoatForSellAndBuy;

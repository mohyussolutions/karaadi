"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlinePlaylistRemove, MdCloudUpload } from "react-icons/md";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import { FaHome } from "react-icons/fa";

import { allCategories } from "@/app/(links)/storeFrontLinks/categories";
import { realEstateSubCategories } from "@/app/(links)/storeFrontLinks/subCategories";
import {
  RealEstateCommercialNestedSub,
  RealEstateFarmForSaleNestedSub,
  RealEstateForRentNestedSub,
  RealEstateForSaleNestedSub,
  RealEstateLandForSaleNestedSub,
} from "@/app/(links)/storeFrontLinks/nestedSubcategoryProperties";

import {
  getAllRegions,
  getAllCities,
  addCity,
} from "@/actions/categories/geoAction";
import { verifySession } from "@/actions/core/authAction";
import { createRealEstate } from "@/actions/categories/realEstateActions";
import { useTranslation } from "react-i18next";

const categoryNestedMap: Record<string, any[]> = {
  "For Rent": RealEstateForRentNestedSub,
  "For Sale": RealEstateForSaleNestedSub,
  "Land for Sale": RealEstateLandForSaleNestedSub,
  "Farm for Sale": RealEstateFarmForSaleNestedSub,
  Commercial: RealEstateCommercialNestedSub,
};

export default function CreateRealEstate() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [regions, setRegions] = useState<any[]>([]);
  const [allCities, setAllCities] = useState<any[]>([]);
  const [filteredCities, setFilteredCities] = useState<any[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [newCity, setNewCity] = useState("");
  const [showNewCityInputs, setShowNewCityInputs] = useState(false);

  const [formData, setFormData] = useState({
    mainCategory:
      allCategories.find((cat) => cat.key === "RealEstate")?.name ||
      "Real Estate",
    category: "",
    subCategory: "",
    title: "",
    price: "",
    region: "",
    city: "",
    address: "",
    description: "",
  });

  useEffect(() => {
    async function init() {
      try {
        const sessionUser = await verifySession();
        if (sessionUser) setCurrentUser(sessionUser);
        const [regs, cities] = await Promise.all([
          getAllRegions(),
          getAllCities(),
        ]);
        setRegions(regs || []);
        setAllCities(cities || []);
      } catch (err) {
        console.error("init error", err);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (formData.region) {
      setFilteredCities(
        allCities.filter((c) => c.regionId === formData.region),
      );
    }
  }, [formData.region, allCities]);

  useEffect(() => {
    const nested = categoryNestedMap[formData.category] || [];
    if (formData.subCategory) {
      const selected = nested.find((s) => s.title === formData.subCategory);
      if (selected) {
        const lang = i18n?.language || "en";
        const newTitle = lang.startsWith("so")
          ? selected.so
          : selected.labelKey
            ? t(selected.labelKey)
            : selected.title;
        setFormData((prev) => ({ ...prev, title: newTitle }));
      }
    }
  }, [formData.category, formData.subCategory, i18n?.language]);

  const renderLabel = (key: string, defaultValue?: string) => {
    return t(key, { defaultValue });
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (e) => reject(e);
    });
  };

  const onHandleSubmit = async () => {
    if (!currentUser || isLoading) return;

    if (
      !formData.category ||
      !formData.subCategory ||
      !formData.price ||
      !formData.region ||
      (showNewCityInputs ? !newCity : !formData.city)
    ) {
      return toast.error("Fadlan buuxi banaanada muhiimka ah");
    }
    if (images.length === 0)
      return toast.error("Ugu yaraan hal sawir soo geli");

    setIsLoading(true);
    try {
      let finalCityName = formData.city;

      if (showNewCityInputs && newCity.trim()) {
        const cityPayload = {
          id: newCity.trim().toLowerCase().replace(/\s+/g, "-"),
          name: newCity.trim(),
          regionId: formData.region,
          isActive: true,
        };

        const res: any = await addCity(cityPayload);
        if (res.success && res.data) {
          finalCityName = res.data.name;
          setAllCities((prev) => [...prev, res.data]);
        } else {
          setIsLoading(false);
          return toast.error(
            t("createRealEstate.cityAddFailed", {
              defaultValue: "Failed to add city",
            }),
          );
        }
      }

      const imagesBase64 = await Promise.all(
        images.map((img) => convertToBase64(img)),
      );

      const payload = {
        userId: currentUser._id,
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        mainCategory: formData.mainCategory,
        category: [formData.category],
        subcategory: [formData.subCategory],
        address: formData.address,
        region: formData.region,
        city: finalCityName,
        county: finalCityName,
        images: imagesBase64,
        so: formData.title,
      };

      const result: any = await createRealEstate(
        payload as any,
        currentUser.token,
      );

      if (result.success) {
        toast.success(
          t("createRealEstate.submittedSuccess", {
            defaultValue: "Listing submitted!",
          }),
        );
        router.push(`/realEstateSummary?id=${result.data?._id || result.id}`);
      } else {
        toast.error(
          result.message ||
            t("createRealEstate.submitError", {
              defaultValue: "An error occurred",
            }),
        );
      }
    } catch {
      toast.error(
        t("createRealEstate.networkError", {
          defaultValue: "Network error occurred",
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) return <Loading />;

  return (
    <div className="w-full mx-auto mt-6 p-4 md:p-8 bg-white rounded-2xl border border-gray-100">
      <ToastContainer position="top-center" autoClose={3000} />

      <h1 className="text-3xl font-black text-center mb-10 text-gray-800 flex items-center justify-center gap-2">
        {t("createRealEstate.title", { defaultValue: "Real Estate" })}{" "}
        <FaHome className="text-blue-600" />
      </h1>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              {renderLabel("createRealEstate.mainCategory", "Main Category")}
            </label>
            <select
              className="border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none cursor-not-allowed"
              disabled
            >
              <option>
                {(() => {
                  const so =
                    allCategories.find((c) => c.key === "RealEstate")?.so || "";
                  const enLabel = t("categories.RealEstate", {
                    defaultValue: "Real Estate",
                  });
                  const lang = i18n?.language || "en";
                  return lang.startsWith("so") ? so : enLabel;
                })()}
              </option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              {renderLabel("createRealEstate.category", "Category")}
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
              className="border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:border-blue-400"
            >
              <option value="">
                {t("createRealEstate.selectCategory", {
                  defaultValue: "Select category",
                })}
              </option>
              {realEstateSubCategories.map((cat) => (
                <option key={cat.title} value={cat.title}>
                  {cat.labelKey ? t(cat.labelKey) : cat.so}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              {renderLabel("createRealEstate.type", "Type")}
            </label>
            <select
              value={formData.subCategory}
              onChange={(e) =>
                setFormData({ ...formData, subCategory: e.target.value })
              }
              className="border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:border-blue-400"
              disabled={!formData.category}
            >
              <option value="">
                {t("createRealEstate.selectType", {
                  defaultValue: "Select type",
                })}
              </option>
              {formData.category && categoryNestedMap[formData.category]
                ? categoryNestedMap[formData.category].map((sub) => (
                    <option key={sub.title} value={sub.title}>
                      {sub.labelKey ? t(sub.labelKey) : sub.so}
                    </option>
                  ))
                : null}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="title"
            className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"
          >
            {renderLabel("createRealEstate.titleLabel", "Title")}
          </label>
          <input
            id="title"
            type="text"
            placeholder={t("createRealEstate.titlePlaceholder", {
              defaultValue: "Title",
            })}
            className="w-full border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none font-bold focus:border-blue-400"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="price"
              className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"
            >
              {renderLabel("createRealEstate.priceLabel", "Price ($)")}
            </label>
            <input
              id="price"
              type="number"
              placeholder={t("createRealEstate.pricePlaceholder", {
                defaultValue: "Price ($)",
              })}
              className="border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:border-blue-400"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />
          </div>
          <div>
            <label
              htmlFor="address"
              className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"
            >
              {renderLabel("createRealEstate.addressLabel", "Address")}
            </label>
            <input
              id="address"
              type="text"
              placeholder={t("createRealEstate.addressPlaceholder", {
                defaultValue: "Address",
              })}
              className="border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:border-blue-400"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="region"
              className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"
            >
              {renderLabel("createRealEstate.regionLabel", "Region")}
            </label>
            <select
              value={formData.region}
              onChange={(e) =>
                setFormData({ ...formData, region: e.target.value, city: "" })
              }
              id="region"
              className="border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:border-blue-400"
            >
              {regions.length === 0 ? (
                <option value="" disabled>
                  {t("createRealEstate.loadingRegions", {
                    defaultValue: "Loading regions...",
                  })}
                </option>
              ) : (
                <>
                  <option value="">
                    {t("createRealEstate.selectRegion", {
                      defaultValue: "Select region",
                    })}
                  </option>
                  {regions.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 md:ml-2 md:mb-1">
            {renderLabel("createRealEstate.cityLabel", "City")}
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
            className="border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:border-green-400"
            disabled={!formData.region}
          >
            {filteredCities.length === 0 ? (
              <option value="" disabled>
                {formData.region
                  ? t("createRealEstate.noCities", {
                      defaultValue: "No cities available",
                    })
                  : t("createRealEstate.selectRegion", {
                      defaultValue: "Select region",
                    })}
              </option>
            ) : (
              <>
                <option value="">
                  {t("createRealEstate.selectCity", {
                    defaultValue: "Select city",
                  })}
                </option>
                {filteredCities.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </>
            )}
            <option value="custom" className="text-blue-600 font-bold">
              {t("createRealEstate.addCity", { defaultValue: "+ Add city" })}
            </option>
          </select>
        </div>

        {showNewCityInputs && (
          <div className="flex flex-col gap-1">
            <label
              htmlFor="newCity"
              className="text-xs font-bold text-gray-400 ml-2"
            >
              {t("createRealEstate.newCityLabel", { defaultValue: "New city" })}
            </label>
            <input
              id="newCity"
              type="text"
              placeholder={t("createRealEstate.newCityPlaceholder", {
                defaultValue: "Enter new city name",
              })}
              className="w-full border-2 border-blue-200 bg-blue-50 px-4 py-3 rounded-xl outline-none"
              onChange={(e) => setNewCity(e.target.value)}
            />
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label
            htmlFor="description"
            className="text-xs font-bold text-gray-400 ml-2"
          >
            {t("createRealEstate.descriptionLabel", {
              defaultValue: "Description",
            })}
          </label>
          <textarea
            id="description"
            rows={4}
            placeholder={t("createRealEstate.descriptionPlaceholder", {
              defaultValue: "More details...",
            })}
            className="w-full border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:border-blue-400"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <div className="p-4 border-2 border-dashed border-gray-100 rounded-2xl">
          <div className="flex flex-wrap gap-4">
            <label className="w-24 h-24 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
              <MdCloudUpload className="text-3xl text-gray-300" />
              <span className="text-[10px] text-gray-400 font-bold">
                {t("createRealEstate.upload", { defaultValue: "Upload" })}
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  e.target.files &&
                  setImages((prev) => [...prev, ...Array.from(e.target.files!)])
                }
              />
            </label>
            {images.map((img, i) => (
              <div key={i} className="relative w-24 h-24 group">
                <img
                  src={URL.createObjectURL(img)}
                  className="w-full h-full object-cover rounded-2xl shadow-md"
                  alt="preview"
                />
                <button
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
          className={`w-full py-4 rounded-2xl text-white font-black text-lg transition-all shadow-xl ${
            isLoading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
          }`}
        >
          {isLoading
            ? t("createRealEstate.submitting", {
                defaultValue: "Submitting...",
              })
            : t("createRealEstate.submit", { defaultValue: "Submit Listing" })}
        </button>
      </div>
    </div>
  );
}

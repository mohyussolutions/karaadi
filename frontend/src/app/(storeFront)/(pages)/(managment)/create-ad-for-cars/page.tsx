"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlinePlaylistRemove, MdCloudUpload, MdInfo } from "react-icons/md";
import { FaCar } from "react-icons/fa";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import { useTranslation } from "react-i18next";
import type { CarSubCategory } from "@/app/(links)/storeFrontLinks/nestedSubcategoryForCars";
import {
  getAllRegions,
  getAllCities,
  addCity,
} from "@/actions/categories/geoAction";
import { verifySession } from "@/actions/core/authAction";
import {
  carsNestedCategoriesMap,
  carsSubCategories,
} from "@/app/(links)/storeFrontLinks/nestedSubcategoryForCars";
import { allCategories } from "@/app/(links)/storeFrontLinks/categories";
import { createCar } from "@/actions/categories/carActions";
import { getCarFees } from "@/actions/categories/feeAction";

type User = { _id?: string; id?: string; token?: string };
type Region = { id: string; name: string };
type City = { id: string; name: string; regionId?: string };
type FormData = {
  mainCategory: string;
  category: string;
  subCategory: string;
  title: string;
  brand: string;
  vehicleModel: string;
  year: number;
  transmission: string;
  color: string;
  mileage: string;
  fuelType: string;
  region: string;
  city: string;
  description: string;
  price: string;
};

const categoryKeyToNestedKey: Record<
  string,
  keyof typeof carsNestedCategoriesMap
> = {
  carsForSale: "CarsForSaleNestedSub",
  leaseCars: "LeaseCarsNestedSub",
  buses: "BusSubLinks",
  trailers: "TrailerNestedSub",
  carParts: "CarPartsNestedSub",
  truck: "TruckNestedSub",
  electricCars: "ElectricCarsNestedSub",
};

function getNestedForCategoryKey(key: string): CarSubCategory[] {
  const mapKey = categoryKeyToNestedKey[key];
  return mapKey ? (carsNestedCategoriesMap[mapKey] as CarSubCategory[]) : [];
}

const CarsForSellOrBuy = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [allCities, setAllCities] = useState<City[]>([]);
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

  const [formData, setFormData] = useState<FormData>({
    mainCategory:
      allCategories.find((c) => c.key === "Cars")?.name || "Gawaari",
    category: "",
    subCategory: "",
    title: "",
    brand: "",
    vehicleModel: "",
    year: new Date().getFullYear(),
    transmission: "",
    color: "",
    mileage: "",
    fuelType: "",
    region: "",
    city: "",
    description: "",
    price: "",
  });

  useEffect(() => {
    async function init() {
      const user = await verifySession();
      if (user) setCurrentUser(user);
      else setCurrentUser(null);

      const [regs, cities, feeRes] = await Promise.all([
        getAllRegions(),
        getAllCities(),
        getCarFees(),
      ]);

      setRegions(regs || []);
      setAllCities(cities || []);
      setActiveFeeConfig(feeRes);
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
    if (formData.category && formData.subCategory) {
      const nested = getNestedForCategoryKey(formData.category);
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

      let feeKey = "";
      if (formData.category === "carsForSale") feeKey = "carSale";
      else if (formData.category === "leaseCars") feeKey = "carRent";
      else if (formData.category === "carParts") feeKey = "carParts";

      if (feeKey && activeFeeConfig) {
        setSelectedFee(activeFeeConfig[feeKey] || "0");
      } else {
        setSelectedFee("0");
      }
    }
  }, [formData.category, formData.subCategory, activeFeeConfig]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || isLoading) return;

    if (
      !formData.category ||
      !formData.subCategory ||
      !formData.price ||
      !formData.region
    ) {
      return toast.error(
        t("createCars.fillRequired", {
          defaultValue: "Please fill the required fields",
        }),
      );
    }

    setIsLoading(true);
    try {
      let finalCity = formData.city;

      if (showNewCityInputs && newCity.trim()) {
        const cityName = newCity.trim();
        const res = (await addCity(cityName, cityName, formData.region, {
          id: `city-${Date.now()}`,
          name: cityName,
          regionId: formData.region,
          isActive: true,
        })) as { success?: boolean; data?: City };
        if (res?.success) finalCity = cityName;
      }

      const convertToBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (e) => reject(e);
        });

      const imagesBase64 = await Promise.all(
        images.map((img) => convertToBase64(img)),
      );

      const payload = {
        userId: currentUser._id || currentUser.id,
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        so: formData.title,
        mainCategory: "Cars",
        category: [formData.category],
        subcategory: [formData.subCategory],
        brand: formData.brand,
        vehicleModel: formData.vehicleModel,
        year: Number(formData.year),
        mileage: Number(formData.mileage),
        transmission: formData.transmission,
        fuelType: formData.fuelType,
        color: formData.color,
        region: formData.region,
        city: finalCity,
        images: imagesBase64 as string[],
        isPaid: false,
        feeAmount: Number(selectedFee),
      };

      const result = (await createCar(payload as any, currentUser.token)) as {
        success?: boolean;
        carId?: string;
        message?: string;
      };

      if (result?.success) {
        toast.success(
          t("createCars.submittedSuccess", {
            defaultValue: "Listing submitted!",
          }),
        );
        router.push(`/payment/plan?id=${result.carId}`);
      } else {
        toast.error(
          result.message ||
            t("createCars.submitError", { defaultValue: "An error occurred" }),
        );
      }
    } catch (error) {
      toast.error(
        t("createCars.networkError", {
          defaultValue: "Network error occurred",
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto mt-6 p-4 md:p-8 bg-white rounded-2xl border border-gray-100">
      <ToastContainer position="top-center" />
      {currentUser === null ? (
        <Loading />
      ) : (
        <>
          <h1 className="text-3xl font-black text-center mb-10 text-gray-800 flex items-center justify-center gap-2">
            {t("createCars.title", { defaultValue: "Cars Listing" })}{" "}
            <FaCar className="text-blue-600" />
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-400 ml-2">
                  {t("createCars.mainCategory", {
                    defaultValue: "Main Category",
                  })}
                </label>
                <select
                  className="border-2 border-gray-100 bg-gray-50 p-3 rounded-xl outline-none cursor-not-allowed"
                  disabled
                >
                  <option>
                    {(() => {
                      const so =
                        allCategories.find((c) => c.key === "Cars")?.so || "";
                      const enLabel = t("categories.Cars", {
                        defaultValue: "Cars",
                      });
                      const lang = i18n?.language || "en";
                      return lang.startsWith("so") ? so : enLabel;
                    })()}
                  </option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-400 ml-2">
                  {t("createCars.category", { defaultValue: "Category" })}
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
                  className="border-2 border-gray-100 bg-gray-50 p-3 rounded-xl outline-none focus:border-blue-400"
                >
                  <option value="">
                    {t("createCars.selectCategory", {
                      defaultValue: "Select category",
                    })}
                  </option>
                  {carsSubCategories.map((cat) => (
                    <option
                      key={cat.key || cat.title}
                      value={cat.key || cat.title}
                    >
                      {cat.labelKey ? t(cat.labelKey) : cat.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="subCategory"
                className="text-xs font-bold text-gray-400 ml-2"
              >
                {t("createCars.type", { defaultValue: "Type" })}
              </label>
              <select
                value={formData.subCategory}
                onChange={(e) =>
                  setFormData({ ...formData, subCategory: e.target.value })
                }
                className="border-2 border-gray-100 bg-gray-50 p-3 rounded-xl outline-none focus:border-blue-400"
                disabled={!formData.category}
                id="subCategory"
              >
                <option value="">
                  {t("createCars.selectType", { defaultValue: "Select type" })}
                </option>
                {getNestedForCategoryKey(formData.category).map((sub) => (
                  <option key={sub.title} value={sub.title}>
                    {sub.labelKey ? t(sub.labelKey) : sub.title}
                  </option>
                ))}
              </select>

              {formData.category && (
                <div className="mt-2 flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <MdInfo className="text-blue-500" />
                  <p className="text-sm font-bold text-blue-700">
                    Lacagta Adeegga:{" "}
                    <span className="text-lg font-black ml-1">
                      ${selectedFee}
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="title"
                className="text-xs font-bold text-gray-400 ml-2"
              >
                {t("createCars.titleLabel", { defaultValue: "Title" })}
              </label>
              <input
                id="title"
                placeholder={t("createCars.titlePlaceholder", {
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
                  htmlFor="brand"
                  className="text-xs font-bold text-gray-400 ml-2"
                >
                  {t("createCars.brandLabel", { defaultValue: "Brand" })}
                </label>
                <input
                  id="brand"
                  placeholder={t("createCars.brandPlaceholder", {
                    defaultValue: "Brand",
                  })}
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                  className="border-2 border-gray-100 p-3 rounded-xl outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="vehicleModel"
                  className="text-xs font-bold text-gray-400 ml-2"
                >
                  {t("createCars.modelLabel", { defaultValue: "Model" })}
                </label>
                <input
                  id="vehicleModel"
                  placeholder={t("createCars.modelPlaceholder", {
                    defaultValue: "Model",
                  })}
                  value={formData.vehicleModel}
                  onChange={(e) =>
                    setFormData({ ...formData, vehicleModel: e.target.value })
                  }
                  className="border-2 border-gray-100 p-3 rounded-xl outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="year"
                  className="text-xs font-bold text-gray-400 ml-2"
                >
                  {t("createCars.yearLabel", { defaultValue: "Year" })}
                </label>
                <input
                  id="year"
                  type="number"
                  placeholder={t("createCars.yearPlaceholder", {
                    defaultValue: "Year",
                  })}
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: Number(e.target.value) })
                  }
                  className="border-2 border-gray-100 p-3 rounded-xl outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="transmission"
                  className="text-xs font-bold text-gray-400 ml-2"
                >
                  {t("createCars.transmissionLabel", {
                    defaultValue: "Transmission",
                  })}
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
                    {t("createCars.transmissionPlaceholder", {
                      defaultValue: "Gear",
                    })}
                  </option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="region"
                  className="text-xs font-bold text-gray-400 ml-2"
                >
                  {t("createCars.regionLabel", { defaultValue: "Region" })}
                </label>
                <select
                  value={formData.region}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      region: e.target.value,
                      city: "",
                    })
                  }
                  id="region"
                  className="border-2 border-gray-100 bg-gray-50 p-3 rounded-xl outline-none"
                >
                  {regions.length === 0 ? (
                    <option value="" disabled>
                      {t("createCars.loadingRegions", {
                        defaultValue: "Loading regions...",
                      })}
                    </option>
                  ) : (
                    <>
                      <option value="">
                        {t("createCars.selectRegion", {
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

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="city"
                  className="text-xs font-bold text-gray-400 ml-2"
                >
                  {t("createCars.cityLabel", { defaultValue: "City" })}
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
                        ? t("createCars.addingCity", {
                            defaultValue: "Adding city...",
                          })
                        : formData.city ||
                          t("createCars.selectCity", {
                            defaultValue: "Select city",
                          })}
                    </span>
                    <span className="text-gray-400">▾</span>
                  </button>

                  {showCityDropdown && (
                    <div className="absolute z-30 left-0 right-0 mt-2 bg-white border rounded-xl shadow max-h-56 overflow-auto">
                      {filteredCities.length === 0 ? (
                        <div className="p-3 text-sm text-gray-500">
                          {formData.region
                            ? t("createCars.noCities", {
                                defaultValue: "No cities available",
                              })
                            : t("createCars.selectRegion", {
                                defaultValue: "Select region",
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
                            className="w-full text-left p-3 hover:bg-gray-50"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-800">
                                {c.name}
                              </span>
                              {((c as any).so || (c as any).nameSo) && (
                                <span className="text-xs text-gray-500">
                                  {(c as any).so || (c as any).nameSo}
                                </span>
                              )}
                            </div>
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
                          {t("createCars.addCity", {
                            defaultValue: "+ Add city",
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
                  {t("createCars.newCityLabel", { defaultValue: "New city" })}
                </label>
                <input
                  id="newCity"
                  placeholder={t("createCars.newCityPlaceholder", {
                    defaultValue: "Enter new city name",
                  })}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full border-2 border-blue-200 bg-blue-50 p-3 rounded-xl outline-none"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="number"
                placeholder={t("createCars.pricePlaceholder", {
                  defaultValue: "Price ($)",
                })}
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="border-2 border-gray-100 bg-gray-50 p-3 rounded-xl outline-none font-bold text-blue-600 focus:border-blue-400"
              />
              <input
                type="number"
                placeholder={t("createCars.mileagePlaceholder", {
                  defaultValue: "Mileage (KM)",
                })}
                value={formData.mileage}
                onChange={(e) =>
                  setFormData({ ...formData, mileage: e.target.value })
                }
                className="border-2 border-gray-100 bg-gray-50 p-3 rounded-xl outline-none"
              />
            </div>

            <textarea
              placeholder={t("createCars.descriptionPlaceholder", {
                defaultValue: "More details...",
              })}
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border-2 border-gray-100 bg-gray-50 p-3 rounded-xl outline-none focus:border-blue-400"
            />

            <div className="p-4 border-2 border-dashed border-gray-100 rounded-2xl">
              <div className="flex flex-wrap gap-4">
                <label className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                  <MdCloudUpload className="text-2xl text-gray-300" />
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
                  <div key={i} className="relative w-20 h-20">
                    <img
                      src={URL.createObjectURL(img)}
                      className="w-full h-full object-cover rounded-2xl shadow-md"
                      alt="preview"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setImages(images.filter((_, idx) => idx !== i))
                      }
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
                    >
                      <MdOutlinePlaylistRemove size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-2xl text-white font-black text-lg shadow-xl transition-all ${isLoading ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:scale-95"}`}
            >
              {isLoading
                ? t("createCars.submitting", { defaultValue: "Submitting..." })
                : t("createCars.submit", { defaultValue: "Submit Listing" })}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default CarsForSellOrBuy;

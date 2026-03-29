"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  MdCategory,
  MdOutlineDescription,
  MdAttachMoney,
  MdLocationOn,
  MdAddPhotoAlternate,
  MdCloudUpload,
  MdClose,
  MdLocationCity,
} from "react-icons/md";
import { HiOutlineTag } from "react-icons/hi";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import { verifySession } from "@/actions/core/authAction";
import { useTranslation } from "react-i18next";

import { createMarketplaceItem } from "@/actions/categories/marketplaceActions";
import {
  getAllRegions,
  getAllCities,
  addCity,
} from "@/actions/categories/geoAction";

import { allCategories } from "@/app/(links)/storeFrontLinks/categories";
import { marketplaceSubCategories } from "@/app/(links)/storeFrontLinks/subCategories";

import {
  AntiquesAndArtNestedSub,
  ElectronicsNestedSub,
  AnimalAndSuppliesNestedSub,
  SportsAndOutdoorsNestedSub,
  FurnitureNestedSub,
  FashionNestedSub,
} from "@/app/(links)/storeFrontLinks/nestedSubcategoryForMarketplace";

interface User {
  id: string;
}

interface Region {
  id: string;
  name: string;
}

interface City {
  id: string;
  name: string;
  regionId: string;
  lat?: number;
  lng?: number;
}

const categoryNestedMap: Record<string, any[]> = {
  "Antiques & Art": AntiquesAndArtNestedSub,
  Electronics: ElectronicsNestedSub,
  "Animal & Supplies": AnimalAndSuppliesNestedSub,
  "Sports & Outdoors": SportsAndOutdoorsNestedSub,
  Furniture: FurnitureNestedSub,
  Fashion: FashionNestedSub,
};

export default function MarketplaceAdForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [allCities, setAllCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    region: "",
    city: "",
  });

  const [mainCategory, setMainCategory] = useState(
    allCategories.find((cat) => cat.key === "Marketplace")?.name || "",
  );
  const [images, setImages] = useState<File[]>([]);
  const [newCity, setNewCity] = useState("");
  const [showNewCityInputs, setShowNewCityInputs] = useState(false);

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
        console.error("Initialization failed", error);
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
          toast.error("Waa lagu guul daraystay in la kaydiyo magaalada cusub");
          setIsLoading(false);
          return;
        }
      }

      const imagesBase64 = await Promise.all(
        images.map((img) => convertToBase64(img)),
      );

      if (
        !formData.title ||
        !formData.description ||
        !formData.price ||
        !mainCategory ||
        !formData.category ||
        !formData.region ||
        (!showNewCityInputs && !formData.city) ||
        (showNewCityInputs && !newCity) ||
        imagesBase64.length === 0
      ) {
        toast.error("Fadlan buuxi dhammaan xogta muhiimka ah.");
        setIsLoading(false);
        return;
      }

      const selectedRegion = regions.find((r) => r.id === formData.region);
      const selectedCityData = allCities.find((c) => c.name === finalCityName);

      const payload = {
        userId: currentUser.id,
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        mainCategory: mainCategory,
        category: [formData.category],
        subcategory: formData.subcategory ? [formData.subcategory] : [],
        region: selectedRegion ? selectedRegion.name : formData.region,
        city: finalCityName,
        images: imagesBase64,
        extra: {
          lat: selectedCityData?.lat ? Number(selectedCityData.lat) : 0,
          lng: selectedCityData?.lng ? Number(selectedCityData.lng) : 0,
        },
      };

      const result = await createMarketplaceItem(payload as any);
      if (result?.success) {
        toast.success("Waa lagu guuleystay!");
        router.push(`/(summary)/items-summary?id=${result.id}`);
      } else {
        toast.error(result?.error || "Cillad ayaa dhacday");
      }
    } catch (err) {
      toast.error("Cillad farsamo ayaa dhacday");
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) return <Loading />;

  return (
    <div className="w-full mx-auto mt-6 p-4 md:p-8 bg-white rounded-2xl border border-gray-100">
      <ToastContainer />
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-gray-800 flex items-center justify-center gap-3">
          {t("createAd.title", { defaultValue: "Gudbi Xayeysiis Marketplace" })}{" "}
          <span className="text-blue-600">
            {t("categories.Marketplace", { defaultValue: "Marketplace" })}
          </span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <MdCategory className="text-blue-600 text-lg" /> Nooca Alaabta
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select
              value={mainCategory}
              onChange={(e) => setMainCategory(e.target.value)}
              className="w-full border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none"
            >
              {allCategories
                .filter((cat) => cat.key === "Marketplace")
                .map((cat, i) => (
                  <option key={i} value={cat.name}>
                    {cat.labelKey ? t(cat.labelKey) : (cat.so ?? cat.name)}
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
              <option value="">
                {t("createAd.selectCategory", { defaultValue: "Dooro Qaybta" })}
              </option>
              {marketplaceSubCategories.map((cat: any) => (
                <option key={cat.title} value={cat.title}>
                  {cat.labelKey ? t(cat.labelKey) : (cat.so ?? cat.title)}
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
            >
              <option value="">
                {t("createAd.selectSubcategory", {
                  defaultValue: "Qayb hoosaadka",
                })}
              </option>
              {(categoryNestedMap[formData.category] || []).map((sub: any) => (
                <option key={sub.title} value={sub.title}>
                  {sub.labelKey ? t(sub.labelKey) : (sub.so ?? sub.title)}
                </option>
              ))}
            </select>

            <div className="relative flex items-center">
              <MdAttachMoney className="absolute left-4 text-green-600 text-xl" />
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full border-2 border-gray-100 bg-gray-50 pl-11 pr-4 py-3 rounded-xl outline-none"
                placeholder={t("createAd.pricePlaceholder", {
                  defaultValue: "Qiimaha",
                })}
                required
              />
            </div>
          </div>

          <div className="relative flex items-center">
            <HiOutlineTag className="absolute left-4 text-blue-500 text-xl" />
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full border-2 border-gray-100 bg-gray-50 pl-11 pr-4 py-3 rounded-xl outline-none"
              placeholder={t("createAd.titlePlaceholder", {
                defaultValue: "Cinwaanka xayeysiiska",
              })}
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <MdLocationOn className="text-red-500 text-lg" /> Goobta
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <select
              value={formData.region}
              onChange={(e) =>
                setFormData({ ...formData, region: e.target.value, city: "" })
              }
              className="w-full border-2 border-white bg-white px-4 py-3 rounded-xl shadow-sm outline-none"
              required
            >
              <option value="">
                {t("createAd.selectRegion", { defaultValue: "Dooro Gobol" })}
              </option>
              {regions.map((reg) => (
                <option key={reg.id} value={reg.id}>
                  {reg.name}
                </option>
              ))}
            </select>

            <select
              value={formData.city}
              onChange={(e) => {
                setShowNewCityInputs(e.target.value === "custom");
                setFormData({ ...formData, city: e.target.value });
                if (e.target.value !== "custom") setNewCity("");
              }}
              className="w-full border-2 border-white bg-white px-4 py-3 rounded-xl shadow-sm outline-none"
              required={!showNewCityInputs}
              disabled={!formData.region}
            >
              <option value="">
                {t("createAd.selectCity", { defaultValue: "Dooro Magaalada" })}
              </option>
              {filteredCities.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
              <option value="custom" className="text-blue-600 font-black">
                + Magaalo kale
              </option>
            </select>
          </div>
        </div>

        {showNewCityInputs && (
          <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-4">
            <MdLocationCity className="text-blue-500 text-2xl" />
            <input
              type="text"
              placeholder={t("createAd.newCityPlaceholder", {
                defaultValue: "Qor magaca magaalada",
              })}
              className="w-full border-2 border-white bg-white px-4 py-3 rounded-xl outline-none"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              required
            />
          </div>
        )}

        <div className="space-y-4">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <MdOutlineDescription className="text-blue-600 text-lg" />{" "}
            Faahfaahin
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            className="w-full border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none resize-none"
            placeholder="Sharaxaad..."
            required
          />
        </div>

        <div className="space-y-4">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <MdAddPhotoAlternate className="text-purple-600 text-lg" />{" "}
            {t("createAd.images", { defaultValue: "Sawirada" })}
          </label>
          <div className="flex flex-wrap gap-4">
            <label className="w-24 h-24 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors">
              <MdCloudUpload className="text-3xl text-gray-300" />
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) =>
                  e.target.files &&
                  setImages(Array.from(e.target.files).slice(0, 10))
                }
              />
            </label>
            {images.map((img, i) => (
              <div key={i} className="relative w-24 h-24 group">
                <img
                  src={URL.createObjectURL(img)}
                  className="w-full h-full object-cover rounded-2xl shadow-md border-2 border-white"
                  alt="preview"
                />
                <button
                  type="button"
                  onClick={() =>
                    setImages(images.filter((_, idx) => idx !== i))
                  }
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg hover:bg-red-600"
                >
                  <MdClose size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 rounded-2xl text-white font-black text-lg transition-all shadow-xl ${
            isLoading
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-blue-100"
          }`}
        >
          {isLoading
            ? t("createAd.submitting", { defaultValue: "Gudbinaya..." })
            : t("createAd.submit", { defaultValue: "Gudbi Xayeysiiska" })}
        </button>
      </form>
    </div>
  );
}

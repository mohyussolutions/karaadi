"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdOutlinePlaylistRemove, MdCloudUpload, MdInfo } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { verifySession } from "@/actions/core/authAction";
import {
  getAllRegions,
  getAllCities,
  addCity,
} from "@/actions/categories/geoAction";
import {
  BoatPartsNestedSub,
  BoatsForRentNestedSub,
  BoatsForSaleNestedSub,
  BoatEnginesNestedSub,
  BoatSubCategoryItem,
} from "@/app/(links)/storeFrontLinks/nestedSubcategoryForBoats";
import { createBoat } from "@/actions/categories/boatActions";
import { allCategories } from "@/app/(links)/storeFrontLinks/categories";
import { getBoatFees } from "@/actions/categories/feeAction";

const boatsMainCategory = allCategories.find((c) => c.key === "Boats");
const boatsSubCategories = boatsMainCategory?.subCategories || [];
const boatsNestedCategoriesMap: { [key: string]: BoatSubCategoryItem[] } = {
  "Boats for Sale": BoatsForSaleNestedSub,
  "Boats for Rent": BoatsForRentNestedSub,
  "Boat Engines for Sale": BoatEnginesNestedSub,
  "Boat Parts": BoatPartsNestedSub,
};

const BoatForSellAndBuy = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [filteredCities, setFilteredCities] = useState<any[]>([]);
  const [activeFeeConfig, setActiveFeeConfig] = useState<any>(null);
  const [selectedFee, setSelectedFee] = useState<string>("0");
  const [images, setImages] = useState<File[]>([]);
  const [showNewCityInputs, setShowNewCityInputs] = useState(false);
  const [newCity, setNewCity] = useState("");

  const [formData, setFormData] = useState({
    mainCategory: boatsMainCategory?.so || "Doomo",
    category: "",
    subCategory: "",
    title: "",
    region: "",
    city: "",
    description: "",
    price: "",
    type: "",
    boatModel: "",
    transmission: "",
    color: "",
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
    if (formData.region) {
      setFilteredCities(cities.filter((c) => c.regionId === formData.region));
    }
  }, [formData.region, cities]);

  useEffect(() => {
    if (formData.category && formData.subCategory) {
      const nested = boatsNestedCategoriesMap[formData.category] || [];
      const selected = nested.find((s) => s.title === formData.subCategory);
      if (selected) setFormData((prev) => ({ ...prev, title: selected.so }));

      let feeKey = "";
      if (formData.category === "Boats for Rent") feeKey = "boatRent";
      else if (formData.category === "Boats for Sale") feeKey = "boatSale";
      else if (formData.category === "Boat Engines for Sale")
        feeKey = "boatEngine";
      else if (formData.category === "Boat Parts") feeKey = "boatParts";

      if (feeKey && activeFeeConfig) {
        setSelectedFee(activeFeeConfig[feeKey] || "0");
      } else {
        setSelectedFee("0");
      }
    }
  }, [formData.category, formData.subCategory, activeFeeConfig]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || loading) return;

    if (
      !formData.category ||
      !formData.subCategory ||
      !formData.price ||
      !formData.region
    ) {
      return toast.error("Fadlan buuxi banaanada muhiimka ah");
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
        const res: any = await addCity({
          id: `city-${Date.now()}`,
          name: newCity.trim(),
          regionId: formData.region,
          isActive: true,
        });
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

      const payload = {
        userId: user._id || user.id,
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
        so: formData.title,
        isPaid: false,
        feeAmount: Number(selectedFee),
      };

      const result = await createBoat(payload, authToken);

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
    <div className="max-w-3xl mx-auto mt-10 p-6 md:p-10 bg-white rounded-3xl shadow-2xl">
      <ToastContainer position="top-center" />
      <h1 className="text-3xl font-black text-center mb-10 text-gray-800">
        Xayeysiis Doomo 🛥️
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-400 ml-2 uppercase">
              Main Category
            </label>
            <select
              className="border-2 border-gray-100 bg-gray-50 p-3 rounded-xl outline-none cursor-not-allowed"
              disabled
            >
              <option>{formData.mainCategory}</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-400 ml-2 uppercase">
              Category
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
              <option value="">Dooro Qaybta</option>
              {boatsSubCategories.map((cat) => (
                <option key={cat.title} value={cat.title}>
                  {cat.so}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-400 ml-2 uppercase">
            Subcategory
          </label>
          <select
            value={formData.subCategory}
            onChange={(e) =>
              setFormData({ ...formData, subCategory: e.target.value })
            }
            className="border-2 border-gray-100 bg-gray-50 p-3 rounded-xl outline-none focus:border-blue-400"
            disabled={!formData.category}
          >
            <option value="">Dooro Nooca</option>
            {(boatsNestedCategoriesMap[formData.category] || []).map((sub) => (
              <option key={sub.title} value={sub.title}>
                {sub.so}
              </option>
            ))}
          </select>

          {formData.category && (
            <div className="mt-2 flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <MdInfo className="text-blue-500" />
              <p className="text-sm font-bold text-blue-700">
                Lacagta Adeegga ({formData.category}):{" "}
                <span className="text-lg font-black ml-1">${selectedFee}</span>
              </p>
            </div>
          )}
        </div>

        <input
          placeholder="Title-ka Xayeysiiska"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full border-2 border-gray-100 bg-gray-50 p-3 rounded-xl outline-none font-bold focus:border-blue-400"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <input
            placeholder="Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="border-2 border-gray-100 p-3 rounded-xl outline-none"
          />
          <input
            placeholder="Model"
            value={formData.boatModel}
            onChange={(e) =>
              setFormData({ ...formData, boatModel: e.target.value })
            }
            className="border-2 border-gray-100 p-3 rounded-xl outline-none"
          />
          <select
            value={formData.transmission}
            onChange={(e) =>
              setFormData({ ...formData, transmission: e.target.value })
            }
            className="border-2 border-gray-100 p-3 rounded-xl outline-none"
          >
            <option value="">Gearbox</option>
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
          </select>
          <input
            placeholder="Color"
            value={formData.color}
            onChange={(e) =>
              setFormData({ ...formData, color: e.target.value })
            }
            className="border-2 border-gray-100 p-3 rounded-xl outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <select
            value={formData.region}
            onChange={(e) =>
              setFormData({ ...formData, region: e.target.value, city: "" })
            }
            className="border-2 border-gray-100 bg-gray-50 p-3 rounded-xl outline-none"
          >
            <option value="">Dooro Gobol</option>
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          <select
            value={showNewCityInputs ? "custom" : formData.city}
            onChange={(e) => {
              setShowNewCityInputs(e.target.value === "custom");
              setFormData({
                ...formData,
                city: e.target.value === "custom" ? "" : e.target.value,
              });
            }}
            className="border-2 border-gray-100 bg-gray-50 p-3 rounded-xl outline-none"
            disabled={!formData.region}
          >
            <option value="">Dooro Magaalo</option>
            {filteredCities.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
            <option value="custom" className="text-blue-600 font-bold">
              + Magaalo kale
            </option>
          </select>
        </div>

        {showNewCityInputs && (
          <input
            placeholder="Qor magaca magaalada cusub"
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            className="w-full border-2 border-blue-200 bg-blue-50 p-3 rounded-xl animate-pulse outline-none"
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="number"
            placeholder="Qiimaha ($ USD)"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="border-2 border-gray-100 bg-gray-50 p-3 rounded-xl outline-none font-bold text-blue-600 focus:border-blue-400"
          />
        </div>

        <textarea
          placeholder="Faahfaahin dheeraad ah..."
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
          disabled={loading}
          className={`w-full py-4 rounded-2xl text-white font-black text-lg shadow-xl transition-all ${
            loading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:scale-95"
          }`}
        >
          {loading ? "Gudbinaya..." : "Gudbi Xayeysiiska"}
        </button>
      </form>
    </div>
  );
};

export default BoatForSellAndBuy;

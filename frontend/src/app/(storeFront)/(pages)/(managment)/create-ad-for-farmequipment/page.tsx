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
}

const TraktorNestedSubCategoryMap: Record<string, any[]> = {
  "Tractor for Sale": TractorForSaleNestedSub,
  "Farm Tools": FarmToolsNestedSub,
  "Fertilizer Spreader": FertilizerSpreaderNestedSub,
  "Grain Harvester": GrainHarvesterNestedSub,
};

export default function TraktorAdForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [allCities, setAllCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [newCity, setNewCity] = useState("");
  const [showNewCityInputs, setShowNewCityInputs] = useState(false);

  const [mainCategory, setMainCategory] = useState(
    allCategories.find((cat) => cat.key === "farmequipment")?.name ||
      "Farmequipment",
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    region: "",
    city: "",
    make: "",
    farmequipmentModel: "",
    type: "",
    year: "",
    condition: "",
    hours: "",
    enginePower: "",
    fuelType: "",
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
      <div className="p-10 text-center font-bold text-gray-400">LOADING...</div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-6 p-4 md:p-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
      <ToastContainer />
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-gray-800 flex items-center justify-center gap-3">
          <GiFarmTractor className="text-green-600" /> Gudbi{" "}
          <span className="text-green-600">Qalabka Beeraha</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <MdCategory className="text-green-600 text-lg" /> Nooca Alaabta
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
                    {cat.so}
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
              <option value="">Dooro Qaybta</option>
              {traktorSubCategories.map((cat: any) => (
                <option key={cat.title} value={cat.title}>
                  {cat.so}
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
              <option value="">Qayb hoosaadka</option>
              {(TraktorNestedSubCategoryMap[formData.category] || []).map(
                (sub: any) => (
                  <option key={sub.title} value={sub.title}>
                    {sub.so}
                  </option>
                ),
              )}
            </select>
            <div className="relative flex items-center">
              <MdAttachMoney className="absolute left-4 text-green-600 text-xl" />
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full border-2 border-gray-100 bg-gray-50 pl-11 pr-4 py-3 rounded-xl outline-none"
                placeholder="Qiimaha"
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
              placeholder="Cinwaanka xayeysiiska"
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <MdSettings className="text-blue-600 text-lg" /> Tilmaamaha Farsamo
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Shirkadda (Make)"
              className="w-full border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none"
              value={formData.make}
              onChange={(e) =>
                setFormData({ ...formData, make: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Model-ka"
              className="w-full border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none"
              value={formData.farmequipmentModel}
              onChange={(e) =>
                setFormData({ ...formData, farmequipmentModel: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Nooca (Type)"
              className="w-full border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Sanadka (Year)"
              className="w-full border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none"
              value={formData.year}
              onChange={(e) =>
                setFormData({ ...formData, year: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Xaaladda (Condition)"
              className="w-full border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none"
              value={formData.condition}
              onChange={(e) =>
                setFormData({ ...formData, condition: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Saacadaha (Hours)"
              className="w-full border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none"
              value={formData.hours}
              onChange={(e) =>
                setFormData({ ...formData, hours: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Engine Power (HP)"
              className="w-full border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none"
              value={formData.enginePower}
              onChange={(e) =>
                setFormData({ ...formData, enginePower: e.target.value })
              }
              required
            />
            <select
              value={formData.fuelType}
              onChange={(e) =>
                setFormData({ ...formData, fuelType: e.target.value })
              }
              className="w-full border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none"
              required
            >
              <option value="">Nooca Shiidaalka</option>
              <option value="Diesel">Diesel</option>
              <option value="Gasoline">Gasoline</option>
              <option value="Electric">Electric</option>
            </select>
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
              <option value="">Dooro Gobol</option>
              {regions.map((reg) => (
                <option key={reg.id} value={reg.id}>
                  {reg.name}
                </option>
              ))}
            </select>
            <select
              value={formData.city}
              onChange={(e) => {
                const val = e.target.value;
                setShowNewCityInputs(val === "custom");
                setFormData({ ...formData, city: val });
                if (val !== "custom") setNewCity("");
              }}
              className="w-full border-2 border-white bg-white px-4 py-3 rounded-xl shadow-sm outline-none"
              required={!showNewCityInputs}
              disabled={!formData.region}
            >
              <option value="">Dooro Magaalada</option>
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
              placeholder="Qor magaca magaalada"
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
            <MdAddPhotoAlternate className="text-purple-600 text-lg" /> Sawirada
          </label>
          <div className="flex flex-wrap gap-4">
            <label className="w-24 h-24 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-green-50 transition-colors">
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
              : "bg-green-600 hover:bg-green-700 active:scale-95 shadow-green-100"
          }`}
        >
          {isLoading ? "Gudbinaya..." : "Gudbi Xayeysiiska"}
        </button>
      </form>
    </div>
  );
}

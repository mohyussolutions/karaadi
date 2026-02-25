"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlinePlaylistRemove, MdCloudUpload } from "react-icons/md";
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

const categoryNestedMap: Record<string, any[]> = {
  "For Rent": RealEstateForRentNestedSub,
  "For Sale": RealEstateForSaleNestedSub,
  "Land for Sale": RealEstateLandForSaleNestedSub,
  "Farm for Sale": RealEstateFarmForSaleNestedSub,
  Commercial: RealEstateCommercialNestedSub,
};

export default function CreateRealEstate() {
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
      const sessionUser = await verifySession();
      if (!sessionUser) return router.push("/login");
      setCurrentUser(sessionUser);
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
    const nested = categoryNestedMap[formData.category] || [];
    if (formData.subCategory) {
      const selected = nested.find((s) => s.title === formData.subCategory);
      if (selected) setFormData((prev) => ({ ...prev, title: selected.so }));
    }
  }, [formData.category, formData.subCategory]);

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
        const res: any = await addCity({
          id: `city-${Date.now()}`,
          name: newCity.trim(),
          regionId: formData.region,
          isActive: true,
        });

        if (res.success && res.data) {
          finalCityName = res.data.name;
        } else {
          setIsLoading(false);
          return toast.error(res.message || "Magaalada lama darid waayay");
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
        toast.success("Xayeysiiska waa la gudbiyey!");
        router.push(`/realEstateSummary?id=${result.data?._id || result.id}`);
      } else {
        toast.error(result.message || "Cillad ayaa dhacday");
      }
    } catch {
      toast.error("Cillad dhinaca network-ka ah");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 p-4 md:p-8 bg-white rounded-2xl shadow-2xl">
      <ToastContainer position="top-center" autoClose={3000} />

      <h1 className="text-3xl font-black text-center mb-10 text-gray-800 flex items-center justify-center gap-2">
        Real Estate <FaHome className="text-green-600" />
      </h1>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-400 ml-2">
              Main Category
            </label>
            <select
              className="border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none cursor-not-allowed"
              disabled
            >
              <option>{formData.mainCategory}</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-400 ml-2">
              Qaybta
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
              className="border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:border-green-400"
            >
              <option value="">Dooro Qaybta</option>
              {realEstateSubCategories.map((cat) => (
                <option key={cat.title} value={cat.title}>
                  {cat.so}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-400 ml-2">
              Nooca
            </label>
            <select
              value={formData.subCategory}
              onChange={(e) =>
                setFormData({ ...formData, subCategory: e.target.value })
              }
              className="border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:border-green-400"
              disabled={!formData.category}
            >
              <option value="">Nooca Guriga/Dhulka</option>
              {formData.category && categoryNestedMap[formData.category]
                ? categoryNestedMap[formData.category].map((sub) => (
                    <option key={sub.title} value={sub.title}>
                      {sub.so}
                    </option>
                  ))
                : null}
            </select>
          </div>
        </div>

        <input
          type="text"
          placeholder="Title-ka Xayeysiiska"
          className="w-full border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none font-bold focus:border-green-400"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="number"
            placeholder="Qiimaha ($)"
            className="border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:border-green-400"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Cinwaanka (Address)"
            className="border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:border-green-400"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <select
            value={formData.region}
            onChange={(e) =>
              setFormData({ ...formData, region: e.target.value, city: "" })
            }
            className="border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:border-green-400"
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
            className="border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:border-green-400"
            disabled={!formData.region}
          >
            <option value="">Dooro Magaalo</option>
            {filteredCities.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
            <option value="custom" className="text-green-600 font-bold">
              + Magaalo kale
            </option>
          </select>
        </div>

        {showNewCityInputs && (
          <input
            type="text"
            placeholder="Qor Magaca Magaalada cusub"
            className="w-full border-2 border-green-200 bg-green-50 px-4 py-3 rounded-xl animate-pulse outline-none"
            onChange={(e) => setNewCity(e.target.value)}
          />
        )}

        <textarea
          rows={4}
          placeholder="Faahfaahin dheeraad ah..."
          className="w-full border-2 border-gray-100 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:border-green-400"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        <div className="p-4 border-2 border-dashed border-gray-100 rounded-2xl">
          <div className="flex flex-wrap gap-4">
            <label className="w-24 h-24 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
              <MdCloudUpload className="text-3xl text-gray-300" />
              <span className="text-[10px] text-gray-400 font-bold">
                Upload
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
              : "bg-green-600 hover:bg-green-700 active:scale-[0.98]"
          }`}
        >
          {isLoading ? "Gudbinaya..." : "Gudbi Xayeysiiska"}
        </button>
      </div>
    </div>
  );
}

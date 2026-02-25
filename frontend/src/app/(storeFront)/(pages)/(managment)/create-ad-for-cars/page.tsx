"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlinePlaylistRemove, MdCloudUpload, MdInfo } from "react-icons/md";
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

const CarsForSellOrBuy = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [regions, setRegions] = useState<any[]>([]);
  const [allCities, setAllCities] = useState<any[]>([]);
  const [filteredCities, setFilteredCities] = useState<any[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [showNewCityInputs, setShowNewCityInputs] = useState(false);
  const [newCity, setNewCity] = useState("");

  // --- Added Fee States ---
  const [activeFeeConfig, setActiveFeeConfig] = useState<any>(null);
  const [selectedFee, setSelectedFee] = useState<string>("0");

  const [formData, setFormData] = useState({
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
      if (!user) return router.push("/login");
      setCurrentUser(user);

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

  // Handle Dynamic Title and Fee Calculation
  useEffect(() => {
    if (formData.category && formData.subCategory) {
      const nested = carsNestedCategoriesMap[formData.category] || [];
      const selected = nested.find((s) => s.title === formData.subCategory);
      if (selected) setFormData((prev) => ({ ...prev, title: selected.so }));

      // Map Category to Backend Fee Keys (Adjust keys to match your DB exactly)
      let feeKey = "";
      if (formData.category === "Cars for Sale") feeKey = "carSale";
      else if (formData.category === "Cars for Rent") feeKey = "carRent";
      else if (formData.category === "Car Parts") feeKey = "carParts";

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
      return toast.error("Fadlan buuxi banaanada muhiimka ah");
    }

    setIsLoading(true);
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
        // --- Added Payment Data ---
        isPaid: false,
        feeAmount: Number(selectedFee),
      };

      const result = await createCar(payload as any, currentUser.token);

      if (result.success) {
        toast.success("Xayeysiiska waa la gudbiyey!");
        // Redirect to payment plan
        router.push(`/payment/plan?id=${result.carId}`);
      } else {
        toast.error(result.message || "Cillad ayaa dhacday");
      }
    } catch (error) {
      toast.error("Cillad dhinaca network-ka ah");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 md:p-10 bg-white rounded-3xl shadow-2xl">
      <ToastContainer position="top-center" />
      <h1 className="text-3xl font-black text-center mb-10 text-gray-800">
        Xayeysiis Gawaari 🚗
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-400 ml-2">
              Qaybta Weyn
            </label>
            <select
              className="border-2 border-gray-100 bg-gray-50 p-3 rounded-xl outline-none cursor-not-allowed"
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
              className="border-2 border-gray-100 bg-gray-50 p-3 rounded-xl outline-none focus:border-blue-400"
            >
              <option value="">Dooro Qaybta</option>
              {carsSubCategories.map((cat) => (
                <option key={cat.title} value={cat.title}>
                  {cat.so}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-400 ml-2">Nooca</label>
          <select
            value={formData.subCategory}
            onChange={(e) =>
              setFormData({ ...formData, subCategory: e.target.value })
            }
            className="border-2 border-gray-100 bg-gray-50 p-3 rounded-xl outline-none focus:border-blue-400"
            disabled={!formData.category}
          >
            <option value="">Dooro Nooca Gawaarida</option>
            {(carsNestedCategoriesMap[formData.category] || []).map((sub) => (
              <option key={sub.title} value={sub.title}>
                {sub.so}
              </option>
            ))}
          </select>

          {/* Fee Information Box */}
          {formData.category && (
            <div className="mt-2 flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <MdInfo className="text-blue-500" />
              <p className="text-sm font-bold text-blue-700">
                Lacagta Adeegga:{" "}
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

        {/* Brand, Model, Year, Gear */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <input
            placeholder="Brand"
            onChange={(e) =>
              setFormData({ ...formData, brand: e.target.value })
            }
            className="border-2 border-gray-100 p-3 rounded-xl outline-none"
          />
          <input
            placeholder="Model"
            onChange={(e) =>
              setFormData({ ...formData, vehicleModel: e.target.value })
            }
            className="border-2 border-gray-100 p-3 rounded-xl outline-none"
          />
          <input
            type="number"
            placeholder="Year"
            value={formData.year}
            onChange={(e) =>
              setFormData({ ...formData, year: Number(e.target.value) })
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
            <option value="">Gear</option>
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
          </select>
        </div>

        {/* Region & City */}
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
            onChange={(e) => setNewCity(e.target.value)}
            className="w-full border-2 border-blue-200 bg-blue-50 p-3 rounded-xl animate-pulse outline-none"
          />
        )}

        {/* Price & Mileage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="number"
            placeholder="Qiimaha ($)"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="border-2 border-gray-100 bg-gray-50 p-3 rounded-xl outline-none font-bold text-blue-600 focus:border-blue-400"
          />
          <input
            type="number"
            placeholder="Mileage (KM)"
            value={formData.mileage}
            onChange={(e) =>
              setFormData({ ...formData, mileage: e.target.value })
            }
            className="border-2 border-gray-100 bg-gray-50 p-3 rounded-xl outline-none"
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

        {/* Image Upload */}
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
          {isLoading ? "Gudbinaya..." : "Gudbi Xayeysiiska"}
        </button>
      </form>
    </div>
  );
};

export default CarsForSellOrBuy;

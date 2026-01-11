"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MdOutlinePlaylistRemove } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaShip, FaTools } from "react-icons/fa";
import { GiBoatFishing, GiBoatPropeller } from "react-icons/gi";
import {
  cities,
  Districts,
  regions,
} from "@/app/(storeFront)/components/shared/SomaliMapRegionsAndCities/SomaliaRegions";
import { User } from "@/app/utils/types/user";
import {
  CreateBoatInput,
  useCreateBoatMutation,
} from "@/app/(storeFront)/store/slices/boatsSlice";
import {
  BoatEnginesForSaleNestedSub,
  BoatPartsNestedSub,
  BoatsForRentNestedSub,
  BoatsForSaleNestedSub,
  BoatSubCategoryItem,
} from "@/app/(storeFront)/components/navbar/mainCreateAdCategories/nestedSubcategoryForBoats";
import { allCategories } from "@/app/(storeFront)/links/categories";
import { apiService } from "@/actions/core/authAction";

interface CategoryOption {
  so: string;
  title: string;
  icon: React.ReactElement;
}

const boatMainCategories: CategoryOption[] = [
  { so: "Doomo iib ah", title: "Boats for Sale", icon: <FaShip size={28} /> },
  {
    so: "Doomo kireysi ah",
    title: "Boats for Rent",
    icon: <GiBoatFishing size={28} />,
  },
  {
    so: "Matoorada doomo iib ah",
    title: "Boat Engines for Sale",
    icon: <GiBoatPropeller size={28} />,
  },
  { so: "Qaybaha doomo", title: "Boat Parts", icon: <FaTools size={28} /> },
];

const boatsNestedCategoriesMap: { [key: string]: BoatSubCategoryItem[] } = {
  "Boats for Sale": BoatsForSaleNestedSub,
  "Boats for Rent": BoatsForRentNestedSub,
  "Boat Engines for Sale": BoatEnginesForSaleNestedSub,
  "Boat Parts": BoatPartsNestedSub,
};

type BoatFormData = {
  mainCategory: string;
  title: string;
  category: string;
  subCategory: string;
  region: string;
  city: string;
  district: string;
  subDistrict: string;
  description: string;
  price: string;
  type: string;
  boatModel: string;
  transmission: string;
  color: string;
};

const BoatForSellAndBuy = () => {
  const [mainCategory, setMainCategory] = useState(
    allCategories[0]?.name || ""
  );
  const router = useRouter();
  const [createBoat, { isLoading }] = useCreateBoatMutation();
  const [user, setUser] = useState<User | null>(null);

  const [formData, setFormData] = useState<BoatFormData>({
    mainCategory: "Doomo",
    title: "",
    category: "",
    subCategory: "",
    region: "",
    city: "",
    district: "",
    subDistrict: "",
    description: "",
    price: "",
    type: "",
    boatModel: "",
    transmission: "",
    color: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [filteredDistricts, setFilteredDistricts] = useState<string[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<
    BoatSubCategoryItem[]
  >([]);
  const [newCity, setNewCity] = useState("");
  const [newDistrict, setNewDistrict] = useState("");
  const [showNewCityInputs, setShowNewCityInputs] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const sessionUser = await apiService.verifySession();
      if (!sessionUser) {
        router.push("/login");
      } else {
        setUser(sessionUser);
      }
    };
    fetchUser();
  }, [router]);

  const handleInputChange = (field: keyof BoatFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (!formData.region) return setFilteredCities([]);
    const citiesInRegion = cities
      .filter((c) => c.regionId === formData.region)
      .map((c) => c.name);
    setFilteredCities(citiesInRegion);
    handleInputChange("city", "");
    handleInputChange("district", "");
    setFilteredDistricts([]);
    setShowNewCityInputs(false);
    setNewCity("");
    setNewDistrict("");
  }, [formData.region]);

  useEffect(() => {
    if (formData.city === "custom") {
      setShowNewCityInputs(true);
      setFilteredDistricts([]);
      handleInputChange("district", "");
      handleInputChange("subDistrict", "");
      setNewDistrict("");
    } else if (formData.city) {
      setShowNewCityInputs(false);
      const cityDistrictObj = Districts.find((d) => d.name === formData.city);
      setFilteredDistricts(
        cityDistrictObj?.subDistricts.map((sd) => sd.name) || []
      );
      handleInputChange("district", "");
      handleInputChange("subDistrict", "");
    } else {
      setShowNewCityInputs(false);
      setFilteredDistricts([]);
      handleInputChange("district", "");
      handleInputChange("subDistrict", "");
    }
  }, [formData.city]);

  useEffect(() => {
    if (formData.category) {
      setFilteredSubcategories(
        boatsNestedCategoriesMap[formData.category] || []
      );
      handleInputChange("subCategory", "");
      handleInputChange("title", "");
    } else {
      setFilteredSubcategories([]);
    }
  }, [formData.category]);

  useEffect(() => {
    if (formData.category && formData.subCategory) {
      const selectedSub = boatsNestedCategoriesMap[formData.category]?.find(
        (sub) => sub.title === formData.subCategory
      );
      handleInputChange("title", selectedSub?.so || "");
    }
  }, [formData.category, formData.subCategory]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + images.length > 10) {
      toast.warn("You can only upload up to 10 images.", {
        position: "bottom-center",
      });
      return;
    }
    setImages((prev) => [...prev, ...selectedFiles].slice(0, 10));
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleSaveNewCityDistrict = () => {
    if (!newCity.trim() || !newDistrict.trim()) {
      toast.warn("Please enter both city and district names.", {
        position: "bottom-center",
      });
      return;
    }
    handleInputChange("city", newCity.trim());
    handleInputChange("district", newDistrict.trim());
    handleInputChange("subDistrict", newDistrict.trim());
    setShowNewCityInputs(false);
    setFilteredDistricts([newDistrict.trim()]);
    setNewCity("");
    setNewDistrict("");
  };

  const isFormValid = () => {
    const selectedCity = showNewCityInputs ? newCity.trim() : formData.city;
    const selectedDistrict = showNewCityInputs
      ? newDistrict.trim()
      : formData.district;

    return (
      formData.category &&
      formData.subCategory &&
      formData.title &&
      formData.region &&
      selectedCity &&
      selectedDistrict &&
      formData.description &&
      formData.price &&
      !isNaN(Number(formData.price)) &&
      Number(formData.price) >= 0 &&
      formData.type &&
      formData.boatModel &&
      formData.transmission &&
      formData.color &&
      images.length > 0 &&
      user
    );
  };

  const convertImagesToBase64 = async (files: File[]): Promise<string[]> =>
    Promise.all(
      files.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      )
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast.warn("Please fill out all required fields correctly.", {
        position: "bottom-center",
      });
      return;
    }

    if (!user || !user._id) {
      toast.error("User session not found. Please log in.", {
        position: "top-right",
      });
      return;
    }

    const selectedCity = showNewCityInputs ? newCity.trim() : formData.city;
    const selectedDistrict = showNewCityInputs
      ? newDistrict.trim()
      : formData.district;

    try {
      const imageBase64Array = await convertImagesToBase64(images);

      const payload: CreateBoatInput & { mainCategory: string } = {
        user: user._id,
        mainCategory: formData.mainCategory,
        title: formData.title.trim(),
        category: formData.category,
        subCategory: formData.subCategory,
        region: formData.region,
        city: selectedCity,
        district: selectedDistrict,
        subDistrict: formData.subDistrict || selectedDistrict,
        description: formData.description.trim(),
        price: Number(formData.price),
        images: imageBase64Array,
        type: formData.type.trim(),
        boatModel: formData.boatModel.trim(),
        transmission: formData.transmission.trim(),
        color: formData.color.trim(),
      };

      console.log("the form", payload);
      const response = await createBoat(payload).unwrap();
      const boatId = response._id;

      if (!boatId) {
        throw new Error("Boat ID is missing from API response.");
      }

      toast.success("Boat listing created successfully!", {
        position: "top-right",
      });
      router.push(`/boatsSummary?id=${boatId}`);
    } catch (error) {
      console.log("API Error Response:", error);
      toast.error("Error saving the boat listing.", { position: "top-right" });
    }
  };

  if (!user) return <p className="text-center mt-10">Loading user...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-6 p-4 md:p-6 bg-gray-50 rounded-lg shadow-xl">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Ads Boat (Xayasiiso Doomo) 🛥️
      </h1>

      <form onSubmit={handleSubmit} ref={formRef} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Main Category
            </label>
            <select
              value={mainCategory}
              onChange={(e) => {
                setMainCategory(e.target.value);
                handleInputChange("category", "");
                handleInputChange("subCategory", "");
              }}
              required
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            >
              {allCategories
                .filter((cat) => cat.key === "Boats")
                .map((cat, index) => (
                  <option key={index} value={cat.name}>
                    {cat.so ?? cat.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => {
                handleInputChange("category", e.target.value);
                handleInputChange("subCategory", "");
                handleInputChange("title", "");
              }}
              required
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            >
              <option value="">Select category</option>
              {boatMainCategories.map((cat) => (
                <option key={cat.title} value={cat.title}>
                  {cat.so} ({cat.title})
                </option>
              ))}
            </select>
          </div>
        </div>

        {formData.category && filteredSubcategories.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subcategory
            </label>
            <select
              value={formData.subCategory}
              onChange={(e) => handleInputChange("subCategory", e.target.value)}
              required
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            >
              <option value="">Select subcategory</option>
              {filteredSubcategories.map((sub) => (
                <option key={sub.title} value={sub.title}>
                  {sub.so} ({sub.title})
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            required
            placeholder="Auto-filled, adjust if necessary"
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Boat Type
            </label>
            <input
              type="text"
              value={formData.type}
              onChange={(e) => handleInputChange("type", e.target.value)}
              required
              placeholder="e.g., Catamaran, Dinghy, Speedboat"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Model/Make
            </label>
            <input
              type="text"
              value={formData.boatModel}
              onChange={(e) => handleInputChange("boatModel", e.target.value)}
              required
              placeholder="e.g., Yamaha, Boston Whaler"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transmission
            </label>
            <select
              value={formData.transmission}
              onChange={(e) =>
                handleInputChange("transmission", e.target.value)
              }
              required
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            >
              <option value="">Select transmission</option>
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
              <option value="N/A">N/A (Sailing/Non-Motorized)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <input
              type="text"
              value={formData.color}
              onChange={(e) => handleInputChange("color", e.target.value)}
              required
              placeholder="e.g., White, Blue"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Region
            </label>
            <select
              value={formData.region}
              onChange={(e) => handleInputChange("region", e.target.value)}
              required
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            >
              <option value="">Select region</option>
              {regions.map((reg) => (
                <option key={reg.id} value={reg.id}>
                  {reg.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <select
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              required={!showNewCityInputs}
              disabled={!formData.region}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            >
              <option value="">Select city</option>
              {filteredCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value="custom" className="font-bold text-blue-600">
                Add new city/district
              </option>
            </select>
          </div>
        </div>

        {showNewCityInputs ? (
          <div className="space-y-3 p-4 border border-blue-200 rounded-lg bg-blue-50">
            <input
              type="text"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              placeholder="New City Name (Required)"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg"
              required
            />
            <input
              type="text"
              value={newDistrict}
              onChange={(e) => setNewDistrict(e.target.value)}
              placeholder="New District Name (Required)"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg"
              required
            />
            <button
              type="button"
              onClick={handleSaveNewCityDistrict}
              className="w-full bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-150"
            >
              Save New Location
            </button>
          </div>
        ) : (
          formData.city &&
          filteredDistricts.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                District
              </label>
              <select
                value={formData.district}
                onChange={(e) => handleInputChange("district", e.target.value)}
                required
                disabled={!formData.city || formData.city === "custom"}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              >
                <option value="">Select district</option>
                {filteredDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          )
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price (USD)
          </label>
          <input
            type="number"
            min="0"
            value={formData.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
            required
            placeholder="0.00"
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            required
            placeholder="Detail the boat's condition, engine hours, size, and any included accessories."
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Images (Min 1, Max 10)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <div className="flex flex-wrap mt-4 gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative w-20 h-20 shadow-md">
                <img
                  src={URL.createObjectURL(img)}
                  alt={`preview ${i}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(i)}
                  className="absolute top-[-5px] right-[-5px] bg-red-600 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center border-2 border-white hover:bg-red-700 transition duration-150"
                  aria-label="Remove image"
                >
                  <MdOutlinePlaylistRemove size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!isFormValid() || isLoading}
          className={`w-full py-3 rounded-lg text-white font-bold text-lg transition duration-200 shadow-md ${
            isFormValid() && !isLoading
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isLoading ? "Submitting..." : "Submit Boat Ad"}
        </button>
      </form>
    </div>
  );
};

export default BoatForSellAndBuy;

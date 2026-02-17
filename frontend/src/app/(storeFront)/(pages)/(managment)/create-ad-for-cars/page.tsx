"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  CreateCarInput,
  ICar,
  useCreateCarMutation,
  User,
} from "@/app/(storeFront)/store/slices/carsSlice";
import {
  cities,
  Districts,
  regions,
} from "@/app/(storeFront)/components/shared/SomLocs/SomaliaRegions";

import { apiService } from "@/actions/core/authAction";
import {
  carsNestedCategoriesMap,
  carsSubCategories,
  CarSubCategory,
} from "@/app/(links)/storeFrontLinks/nestedSubcategoryForCars";
import { allCategories } from "@/app/(links)/storeFrontLinks/categories";

const CarsForSellOrBuy = () => {
  const router = useRouter();
  const [createCar, { isLoading }] = useCreateCarMutation();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  type CarFormData = Omit<
    ICar,
    | "_id"
    | "images"
    | "user"
    | "price"
    | "year"
    | "mileage"
    | "createdAt"
    | "updatedAt"
  > & {
    price: string;
    year: number | undefined;
    mileage: number | undefined;
    mainCategory: string;
  };

  const [formData, setFormData] = useState<CarFormData>({
    mainCategory: "Gawaari",
    title: "",
    description: "",
    price: "",
    category: "",
    subCategory: "",
    listingType: "",
    brand: "",
    vehicleModel: "",
    year: undefined,
    mileage: undefined,
    transmission: "",
    fuelType: "",
    color: "",
    region: "",
    city: "",
    district: "",
    subDistrict: "",
    area: "",
  });
  const [mainCategory, setMainCategory] = useState(
    allCategories[0]?.name || "",
  );
  const [images, setImages] = useState<File[]>([]);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [filteredDistricts, setFilteredDistricts] = useState<string[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<
    CarSubCategory[]
  >([]);
  const [newCity, setNewCity] = useState("");
  const [newDistrict, setNewDistrict] = useState("");
  const [showNewCityInputs, setShowNewCityInputs] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const sessionUser = await apiService.verifySession();
        if (!sessionUser) {
          router.push("/login");
        } else {
          setCurrentUser(sessionUser);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, [router]);

  const handleInputChange = (
    field: keyof CarFormData,
    value: string | number | undefined,
  ) => {
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
      const cityObj = Districts.find((d) => d.name === formData.city);
      setFilteredDistricts(cityObj?.subDistricts.map((sd) => sd.name) || []);
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
        carsNestedCategoriesMap[formData.category] || [],
      );
      handleInputChange("subCategory", "");
    } else {
      setFilteredSubcategories([]);
    }
  }, [formData.category]);

  useEffect(() => {
    if (formData.category && formData.subCategory) {
      const selectedSub = carsNestedCategoriesMap[formData.category]?.find(
        (sub) => sub.title === formData.subCategory,
      );
      handleInputChange("title", selectedSub?.so || "");
    }
  }, [formData.category, formData.subCategory]);

  const handleSaveNewCityDistrict = () => {
    if (!newCity.trim() || !newDistrict.trim()) {
      toast.warn("Please enter both city and district names.");
      return;
    }
    handleInputChange("city", newCity.trim());
    handleInputChange("district", newDistrict.trim());
    handleInputChange("subDistrict", newDistrict.trim());
    setFilteredDistricts([newDistrict.trim()]);
    setShowNewCityInputs(false);
    setNewCity("");
    setNewDistrict("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + images.length > 10) {
      toast.warn("You can only upload up to 10 images.");
      return;
    }
    setImages((prev) => [...prev, ...selectedFiles].slice(0, 10));
  };

  const isFormValid = () => {
    if (!currentUser) return false;
    const selectedCity = showNewCityInputs ? newCity.trim() : formData.city;
    const selectedDistrict = showNewCityInputs
      ? newDistrict.trim()
      : formData.district;
    return (
      formData.category &&
      formData.subCategory &&
      formData.title &&
      formData.description &&
      formData.price &&
      !isNaN(Number(formData.price)) &&
      Number(formData.price) >= 0 &&
      formData.listingType &&
      formData.brand &&
      formData.vehicleModel &&
      formData.transmission &&
      formData.color &&
      formData.region &&
      selectedCity &&
      selectedDistrict &&
      images.length > 0
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
          }),
      ),
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("User not loaded yet.");
      return;
    }
    if (!isFormValid()) {
      toast.warn("Please fill out all required fields correctly.");
      return;
    }

    const selectedCity = showNewCityInputs ? newCity.trim() : formData.city;
    const selectedDistrict = showNewCityInputs
      ? newDistrict.trim()
      : formData.district;
    const subDistrictValue = formData.subDistrict || selectedDistrict;

    try {
      const imagesBase64 = await convertImagesToBase64(images);

      const payload: CreateCarInput & { mainCategory: string } = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        mainCategory: mainCategory,
        category: formData.category,
        subCategory: formData.subCategory,
        listingType: formData.listingType,
        brand: formData.brand,
        vehicleModel: formData.vehicleModel,
        year: formData.year,
        mileage: formData.mileage,
        transmission: formData.transmission,
        fuelType: formData.fuelType,
        color: formData.color,
        region: formData.region,
        city: selectedCity,
        district: selectedDistrict,
        subDistrict: subDistrictValue,
        area: formData.area,
        user: currentUser._id,
        images: imagesBase64,
      };
      console.log("........", payload);
      const createdCar: ICar = await createCar(payload).unwrap();
      router.push(`/carsSummary?id=${createdCar._id}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create car listing.");
    }
  };

  if (!currentUser) return <div>Loading user...</div>;

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-md">
      <ToastContainer />
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Ads Cars (Xayasiiso Gawaarida)
      </h1>
      <form onSubmit={handleSubmit} ref={formRef} className="space-y-5">
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
              .filter((cat) => cat.key === "Cars")
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
            {carsSubCategories.map((cat) => (
              <option key={cat.title} value={cat.title}>
                {cat.so} ({cat.title})
              </option>
            ))}
          </select>
        </div>

        {filteredSubcategories.length > 0 && (
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
              {filteredSubcategories.map((sub: CarSubCategory) => (
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
              Brand
            </label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => handleInputChange("brand", e.target.value)}
              required
              placeholder="e.g., Toyota, Ford"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Model
            </label>
            <input
              type="text"
              value={formData.vehicleModel}
              onChange={(e) =>
                handleInputChange("vehicleModel", e.target.value)
              }
              required
              placeholder="e.g., Corolla, F-150"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <input
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={formData.year || ""}
              onChange={(e) =>
                handleInputChange("year", Number(e.target.value))
              }
              placeholder="e.g., 2018"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            />
          </div>

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
              <option value="">Select</option>
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
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
              placeholder="e.g., White, Red"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mileage (km/mi)
            </label>
            <input
              type="number"
              min="0"
              value={formData.mileage || ""}
              onChange={(e) =>
                handleInputChange("mileage", Number(e.target.value))
              }
              placeholder="Optional"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fuel Type
            </label>
            <input
              type="text"
              value={formData.fuelType || ""}
              onChange={(e) => handleInputChange("fuelType", e.target.value)}
              placeholder="e.g., Petrol, Diesel, Hybrid"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Listing Type
            </label>
            <input
              type="text"
              value={formData.listingType}
              onChange={(e) => handleInputChange("listingType", e.target.value)}
              required
              placeholder="e.g., For Sale, Lease"
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

        {showNewCityInputs && (
          <div className="space-y-3 p-4 border border-blue-200 rounded-lg bg-blue-50">
            <input
              type="text"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg"
              placeholder="New City Name (Required)"
              required
            />
            <input
              type="text"
              value={newDistrict}
              onChange={(e) => setNewDistrict(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg"
              placeholder="New District Name (Required)"
              required
            />
            <button
              type="button"
              onClick={handleSaveNewCityDistrict}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-150"
            >
              Save New Location
            </button>
          </div>
        )}

        {!showNewCityInputs &&
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
                disabled={formData.city === "custom"}
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
          )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sub District (optional)
          </label>
          <input
            type="text"
            value={formData.subDistrict}
            onChange={(e) => handleInputChange("subDistrict", e.target.value)}
            placeholder="e.g., Village or specific neighborhood"
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Area (optional)
          </label>
          <input
            type="text"
            value={formData.area}
            onChange={(e) => handleInputChange("area", e.target.value)}
            placeholder="e.g., Street name or landmark"
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
            placeholder="Provide details about the car's condition, features, history, etc."
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            rows={4}
          />
        </div>

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
            Images (Min 1, Max 10)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <div className="flex flex-wrap mt-2 gap-2">
            {images.map((img, i) => (
              <div
                key={i}
                className="relative inline-block w-20 h-20 shadow-md"
              >
                <img
                  src={URL.createObjectURL(img)}
                  alt={`preview ${i}`}
                  className="w-full h-full object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() =>
                    setImages(images.filter((_, idx) => idx !== i))
                  }
                  className="absolute top-[-5px] right-[-5px] bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm border-2 border-white hover:bg-red-700"
                >
                  &times;
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
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default CarsForSellOrBuy;

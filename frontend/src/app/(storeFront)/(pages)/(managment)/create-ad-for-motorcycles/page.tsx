"use client";

import { useState, useEffect, useRef, ReactElement } from "react";
import { useRouter } from "next/navigation";
import { MdOutlinePlaylistRemove } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useCreateMotorcycleMutation } from "@/app/(storeFront)/store/slices/motorcyclesSlice";
import { User } from "@/app/utils/types/user";
import {
  cities,
  Districts,
  regions,
} from "@/app/(storeFront)/components/shared/SomLocs/SomaliaRegions";
import { subCategoriesMotorSomalia } from "@/app/(storeFront)/components/navbar/mainCreateAdCategories/nestedSubcategoryForMotorcycles";
import { allCategories } from "@/app/(storeFront)/links/categories";
import { motorcyclesSubCategories } from "@/app/(storeFront)/components/navbar/mainCreateAdCategories/subCategories";
import { apiService } from "@/actions/core/authAction";

interface MotorcycleData {
  make: string;
  title: string;
  description: string;
  price: string;
  category: string;
  subCategory: string;
  region: string;
  city: string;
  district: string;
  subDistrict: string;
  type: string;
  modelName: string;
  transmission: string;
  color: string;
  year: string;
  mileage: string;
  engineSize: string;
  fuelType: string;
}

interface SubCategoryItem {
  so: string;
  title: string;
  icon?: ReactElement;
  href?: string;
}

const MotoForSellAndBuy = () => {
  const router = useRouter();
  const [createMotorcycle, { isLoading: isSubmittingAPI }] =
    useCreateMotorcycleMutation();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<MotorcycleData>({
    title: "",
    description: "",
    price: "",
    category: "",
    subCategory: "",
    region: "",
    city: "",
    district: "",
    subDistrict: "",
    type: "",
    modelName: "",
    transmission: "",
    color: "",
    year: "",
    mileage: "",
    engineSize: "",
    fuelType: "",
    make: "",
  });

  const [mainCategory, setMainCategory] = useState(
    allCategories.find((cat) => cat.key === "Motorcycles")?.name || "",
  );

  const [images, setImages] = useState<File[]>([]);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [filteredDistricts, setFilteredDistricts] = useState<string[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<
    SubCategoryItem[]
  >([]);
  const [newCity, setNewCity] = useState("");
  const [newDistrict, setNewDistrict] = useState("");
  const [showNewCityInputs, setShowNewCityInputs] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const inputStyle =
    "w-full border border-gray-300 rounded-lg px-4 py-3 text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 shadow-sm";
  const labelStyle =
    "block mb-2 font-medium text-gray-700 text-sm md:text-base";
  const sectionHeaderStyle =
    "text-xl font-semibold text-gray-800 border-b pb-2 mb-4";

  const handleInputChange = (field: keyof MotorcycleData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const fetchUser = async () => {
      const sessionUser = await apiService.verifySession();
      setCurrentUser(sessionUser);
      if (!sessionUser) router.push("/login");
    };
    fetchUser();
  }, [router]);

  useEffect(() => {
    setIsSubmitting(isSubmittingAPI);
  }, [isSubmittingAPI]);

  useEffect(() => {
    if (formData.region) {
      const citiesInRegion = cities
        .filter((c: any) => c.regionId === formData.region)
        .map((c: any) => c.name);
      setFilteredCities([...citiesInRegion, "custom"]);
      handleInputChange("city", "");
      handleInputChange("district", "");
      setFilteredDistricts([]);
      setShowNewCityInputs(false);
      setNewCity("");
      setNewDistrict("");
    } else {
      setFilteredCities([]);
      handleInputChange("city", "");
      handleInputChange("district", "");
      setFilteredDistricts([]);
      setShowNewCityInputs(false);
      setNewCity("");
      setNewDistrict("");
    }
  }, [formData.region]);

  useEffect(() => {
    if (formData.city === "custom") {
      setShowNewCityInputs(true);
      setFilteredDistricts([]);
      handleInputChange("district", "");
      setNewDistrict("");
    } else if (formData.city) {
      setShowNewCityInputs(false);
      const cityDistrictObj = Districts.find(
        (d: any) => d.name === formData.city,
      );
      setFilteredDistricts(
        cityDistrictObj?.subDistricts.map((sd: any) => sd.name) || [],
      );
      handleInputChange("district", "");
      setNewDistrict("");
    } else {
      setShowNewCityInputs(false);
      setFilteredDistricts([]);
      handleInputChange("district", "");
      setNewDistrict("");
    }
  }, [formData.city]);

  useEffect(() => {
    const categoryKey = formData.category;
    const subCategories = subCategoriesMotorSomalia[categoryKey] || [];
    setFilteredSubcategories(subCategories);

    if (categoryKey && formData.subCategory) {
      const selectedSub = subCategories.find(
        (sub) => sub.title === formData.subCategory,
      );
      handleInputChange("title", selectedSub?.so || "");
    } else if (categoryKey && !formData.subCategory) {
      handleInputChange("title", "");
    }
  }, [formData.category, formData.subCategory]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);

    const filesToProcess = selectedFiles.slice(0, 10 - images.length);

    if (selectedFiles.length > filesToProcess.length) {
      toast.warn(
        "You can only upload up to 10 images total. Some were ignored.",
      );
    }

    if (filesToProcess.length === 0) return;

    setImages((prev) => [...prev, ...filesToProcess]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveNewCityDistrict = () => {
    if (!newCity.trim() || !newDistrict.trim()) {
      toast.error("Please enter both city and district names.");
      return;
    }
    handleInputChange("city", newCity.trim());
    handleInputChange("district", newDistrict.trim());
    setShowNewCityInputs(false);
    setFilteredDistricts([newDistrict.trim()]);
    setNewCity("");
    setNewDistrict("");
    toast.success("New location saved temporarily.");
  };

  const isFormValid = () => {
    const selectedCity = showNewCityInputs ? newCity.trim() : formData.city;
    const selectedDistrict = showNewCityInputs
      ? newDistrict.trim()
      : formData.district;

    const isYearValid =
      !isNaN(Number(formData.year)) &&
      Number(formData.year) > 1900 &&
      Number(formData.year) <= new Date().getFullYear();
    const isPriceValid =
      formData.price !== "" &&
      !isNaN(Number(formData.price)) &&
      Number(formData.price) >= 0;

    return (
      formData.category &&
      formData.subCategory &&
      formData.title &&
      formData.type &&
      formData.make &&
      formData.modelName &&
      formData.transmission &&
      formData.color &&
      isYearValid &&
      formData.mileage !== "" &&
      formData.engineSize &&
      formData.fuelType &&
      formData.region &&
      selectedCity &&
      selectedDistrict &&
      formData.description &&
      isPriceValid &&
      images.length > 0 &&
      currentUser &&
      currentUser._id
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
      toast.error("User not loaded. Please log in.");
      return;
    }
    if (!isFormValid()) {
      toast.warn(
        "Please fill out all required fields correctly (including Year, Price, and at least one image).",
      );
      return;
    }

    const selectedCity = showNewCityInputs ? newCity.trim() : formData.city;
    const selectedDistrict = showNewCityInputs
      ? newDistrict.trim()
      : formData.district;

    const imagesBase64 = await convertImagesToBase64(images);
    setIsSubmitting(true);

    try {
      const motorcycleData = {
        mainCategory: mainCategory,
        title: formData.title,
        description: formData.description,
        city: selectedCity,
        district: selectedDistrict,
        subDistrict: formData.subDistrict || null,
        region: formData.region,
        price: Number(formData.price),
        images: imagesBase64,
        category: formData.category,
        subCategory: formData.subCategory,
        type: formData.type,
        make: formData.make,
        modelName: formData.modelName,
        year: Number(formData.year),
        mileage: Number(formData.mileage),
        engineSize: formData.engineSize,
        fuelType: formData.fuelType,
        transmission: formData.transmission,
        color: formData.color,
        userId: currentUser._id,
        so: formData.title,
      };

      console.log(motorcycleData);

      const created = await createMotorcycle(motorcycleData as any).unwrap();

      toast.success("Motorcycle listing created successfully!");

      setTimeout(() => {
        router.push(`/motorcyclesSummary?id=${created._id}`);
        formRef.current?.reset();
      }, 1000);
    } catch (err: any) {
      console.error("Error details:", err);
      const errorMessage =
        err.data?.message ||
        err.error ||
        "Failed to create listing. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser)
    return <div className="text-center p-6">Loading user data...</div>;

  return (
    <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-xl shadow-2xl border border-gray-100">
      <ToastContainer />

      <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-800">
        🛵 Iska gad Mootooyin (Motorcycles)
      </h1>
      <form onSubmit={handleSubmit} ref={formRef} className="space-y-8">
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
              handleInputChange("title", "");
            }}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          >
            {allCategories
              .filter((cat) => cat.key === "Motorcycles")
              .map((cat, index) => (
                <option key={index} value={cat.name}>
                  {cat.so ?? cat.name}
                </option>
              ))}
          </select>
        </div>
        <div>
          <h2 className={sectionHeaderStyle}>Listing Details</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>Category</label>
              <select
                value={formData.category}
                onChange={(e) => {
                  handleInputChange("category", e.target.value);
                  handleInputChange("subCategory", "");
                  handleInputChange("title", "");
                }}
                required
                className={inputStyle}
              >
                <option value="">Select category</option>
                {motorcyclesSubCategories.map((cat) => (
                  <option key={cat.title} value={cat.title}>
                    {cat.so} ({cat.title})
                  </option>
                ))}
              </select>
            </div>

            {formData.category && filteredSubcategories.length > 0 && (
              <div className="md:col-span-2">
                <label className={labelStyle}>Subcategory</label>
                <select
                  value={formData.subCategory}
                  onChange={(e) => {
                    handleInputChange("subCategory", e.target.value);
                  }}
                  required
                  className={inputStyle}
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
          </div>
          <div className="mt-6">
            <label className={labelStyle}>Title (so)</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Title (Auto-filled by Subcategory)"
              required
              className={inputStyle}
            />
          </div>
        </div>

        <div>
          <h2 className={sectionHeaderStyle}>Motorcycle Specifications</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>Make</label>
              <input
                type="text"
                value={formData.make}
                onChange={(e) => handleInputChange("make", e.target.value)}
                placeholder="Make (e.g., Honda, Bajaj)"
                required
                className={inputStyle}
              />
            </div>
            <div>
              <label className={labelStyle}>Model</label>
              <input
                type="text"
                value={formData.modelName}
                onChange={(e) => handleInputChange("modelName", e.target.value)}
                placeholder="Model (e.g., Pulsar, CD 70)"
                required
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>Year</label>
              <input
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={formData.year}
                onChange={(e) => handleInputChange("year", e.target.value)}
                placeholder="Year"
                required
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>Type</label>
              <input
                type="text"
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                placeholder="Type (e.g., Standard, Cruiser, Sport)"
                required
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>Engine Size (cc)</label>
              <input
                type="text"
                value={formData.engineSize}
                onChange={(e) =>
                  handleInputChange("engineSize", e.target.value)
                }
                placeholder="Engine Size (e.g., 150cc)"
                required
                className={inputStyle}
              />
            </div>
            <div>
              <label className={labelStyle}>Mileage (km)</label>
              <input
                type="number"
                min="0"
                value={formData.mileage}
                onChange={(e) => handleInputChange("mileage", e.target.value)}
                placeholder="Mileage in km"
                required
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>Fuel Type</label>
              <select
                value={formData.fuelType}
                onChange={(e) => handleInputChange("fuelType", e.target.value)}
                required
                className={inputStyle}
              >
                <option value="">Select fuel type</option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
              </select>
            </div>
            <div>
              <label className={labelStyle}>Transmission</label>
              <select
                value={formData.transmission}
                onChange={(e) =>
                  handleInputChange("transmission", e.target.value)
                }
                required
                className={inputStyle}
              >
                <option value="">Select transmission</option>
                <option value="manual">Manual</option>
                <option value="automatic">Automatic</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className={labelStyle}>Color</label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => handleInputChange("color", e.target.value)}
                placeholder="Color"
                required
                className={inputStyle}
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className={sectionHeaderStyle}>Location & Pricing</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>Region</label>
              <select
                value={formData.region}
                onChange={(e) => handleInputChange("region", e.target.value)}
                required
                className={inputStyle}
              >
                <option value="">Select region</option>
                {regions.map((r: any) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelStyle}>City</label>
              <select
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                required={!showNewCityInputs}
                className={inputStyle}
                disabled={!formData.region}
              >
                <option value="">Select city</option>
                {filteredCities
                  .filter((c) => c !== "custom")
                  .map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                <option value="custom" className="font-semibold text-blue-600">
                  + Add New City
                </option>
              </select>
            </div>

            {showNewCityInputs && (
              <div className="md:col-span-2 p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-3">
                <p className="font-semibold text-sm text-blue-700">
                  Enter New Location Details
                </p>
                <input
                  type="text"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  placeholder="New City Name"
                  required
                  className={inputStyle}
                />
                <input
                  type="text"
                  value={newDistrict}
                  onChange={(e) => setNewDistrict(e.target.value)}
                  placeholder="New District Name"
                  required
                  className={inputStyle}
                />
                <button
                  type="button"
                  onClick={handleSaveNewCityDistrict}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Save New Location
                </button>
              </div>
            )}

            {!showNewCityInputs && filteredDistricts.length > 0 && (
              <div>
                <label className={labelStyle}>District</label>
                <select
                  value={formData.district}
                  onChange={(e) =>
                    handleInputChange("district", e.target.value)
                  }
                  required
                  className={inputStyle}
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
              <label className={labelStyle}>Sub District (optional)</label>
              <input
                type="text"
                value={formData.subDistrict}
                onChange={(e) =>
                  handleInputChange("subDistrict", e.target.value)
                }
                placeholder="Sub District"
                className={inputStyle}
              />
            </div>
          </div>

          <div className="mt-6">
            <label className={labelStyle}>Price ($)</label>
            <input
              type="number"
              min="0"
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              placeholder="Price in USD"
              required
              className={inputStyle}
            />
          </div>
        </div>

        <div>
          <h2 className={sectionHeaderStyle}>Description & Media</h2>
          <div>
            <label className={labelStyle}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your motorcycle's condition, features, and history..."
              required
              rows={5}
              className={inputStyle}
            />
          </div>

          <div className="mt-6">
            <label className={labelStyle}>Images (Min 1, Max 10)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
            />
            <div className="mt-4 flex flex-wrap gap-3">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="relative w-20 h-20 border-2 border-gray-200 rounded-lg overflow-hidden shadow-md"
                >
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`Selected ${i}`}
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-[-5px] right-[-5px] bg-red-600 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center border-2 border-white hover:bg-red-700 transition"
                    aria-label="Remove image"
                  >
                    <MdOutlinePlaylistRemove size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isFormValid() || isSubmitting}
          className={`w-full py-3 rounded-xl text-white font-bold text-lg tracking-wider transition transform ${
            isFormValid() && !isSubmitting
              ? "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Post Motorcycle Listing"}
        </button>
      </form>
    </div>
  );
};

export default MotoForSellAndBuy;

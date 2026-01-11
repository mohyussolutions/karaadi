"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCreateTractorMutation } from "@/app/(storeFront)/store/slices/tractorsSlice";
import { User } from "@/app/utils/types/user";

import {
  cities,
  Districts,
  regions,
} from "@/app/(storeFront)/components/shared/SomaliMapRegionsAndCities/SomaliaRegions";
import {
  TraktorSubCategoryItem,
  TraktorTopCategories,
  TractorForSaleNestedSub,
  FarmToolsNestedSub,
  FertilizerSpreaderNestedSub,
  GrainHarvesterNestedSub,
} from "@/app/(storeFront)/components/navbar/mainCreateAdCategories/nestedsubcategoryfortractors";
import { allCategories } from "@/app/(storeFront)/links/categories";
import { apiService } from "@/actions/core/authAction";

const TraktorNestedSubCategoryMap: { [key: string]: TraktorSubCategoryItem[] } =
  {
    "Tractor for Sale": TractorForSaleNestedSub,
    "Farm Tools": FarmToolsNestedSub,
    "Fertilizer Spreader": FertilizerSpreaderNestedSub,
    "Grain Harvester": GrainHarvesterNestedSub,
  };

const Traktor = () => {
  const router = useRouter();
  const [createTractor, { isLoading, isError, isSuccess }] =
    useCreateTractorMutation();
  const [mainCategory, setMainCategory] = useState(
    allCategories.find((cat) => cat.key === "Traktor")?.name || ""
  );
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [subDistrict, setSubDistrict] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [filteredDistricts, setFilteredDistricts] = useState<string[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<
    TraktorSubCategoryItem[]
  >([]);
  const [newCity, setNewCity] = useState("");
  const [newDistrict, setNewDistrict] = useState("");
  const [showNewCityInputs, setShowNewCityInputs] = useState(false);
  const [type, setType] = useState("");
  const [equipmentModel, setEquipmentModel] = useState("");
  const [transmission, setTransmission] = useState("");
  const [color, setColor] = useState("");
  const [make, setMake] = useState("");
  const [enginePower, setEnginePower] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  const inputStyle =
    "w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 shadow-sm";
  const labelStyle = "block mb-2 font-medium text-gray-700 text-sm";
  const sectionHeaderStyle =
    "text-xl font-semibold text-gray-800 border-b pb-2 mb-4";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await apiService.verifySession();
        if (user) {
          setCurrentUser(user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (region) {
      const citiesInRegion = cities
        .filter((c: any) => c.regionId === region)
        .map((c: any) => c.name);
      setFilteredCities([...citiesInRegion, "custom"]);
      setCity("");
      setDistrict("");
      setFilteredDistricts([]);
      setShowNewCityInputs(false);
      setNewCity("");
      setNewDistrict("");
    } else {
      setFilteredCities([]);
      setCity("");
      setDistrict("");
      setFilteredDistricts([]);
      setShowNewCityInputs(false);
      setNewCity("");
      setNewDistrict("");
    }
  }, [region]);

  useEffect(() => {
    if (city === "custom") {
      setShowNewCityInputs(true);
      setFilteredDistricts([]);
      setDistrict("");
      setNewDistrict("");
    } else if (city) {
      setShowNewCityInputs(false);
      const cityDistrictObj = Districts.find((d: any) => d.name === city);
      if (cityDistrictObj?.subDistricts) {
        setFilteredDistricts(
          cityDistrictObj.subDistricts.map((sd: any) => sd.name)
        );
      } else {
        setFilteredDistricts([]);
      }
      setDistrict("");
      setNewDistrict("");
    } else {
      setShowNewCityInputs(false);
      setFilteredDistricts([]);
      setDistrict("");
      setNewDistrict("");
    }
  }, [city]);

  useEffect(() => {
    if (category) {
      setFilteredSubcategories(TraktorNestedSubCategoryMap[category] || []);

      const mainCat =
        TraktorTopCategories.find((c) => c.title === category)?.so || "";
      if (titleRef.current) titleRef.current.value = mainCat;
    } else {
      setFilteredSubcategories([]);
      if (titleRef.current) titleRef.current.value = "";
    }
    setSubCategory("");
  }, [category]);

  useEffect(() => {
    if (category && subCategory) {
      const selectedSub = TraktorNestedSubCategoryMap[category]?.find(
        (sub: TraktorSubCategoryItem) => sub.title === subCategory
      );
      if (titleRef.current && selectedSub?.so) {
        titleRef.current.value = selectedSub.so;
      }
    } else if (category && !subCategory) {
      const mainCat =
        TraktorTopCategories.find((c) => c.title === category)?.so || "";
      if (titleRef.current) titleRef.current.value = mainCat;
    } else if (titleRef.current) {
      titleRef.current.value = "";
    }
  }, [category, subCategory]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isSuccess) return;
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (files.length + images.length > 10) {
      toast.error("Max 10 images allowed");
      return;
    }
    setImages((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (index: number) => {
    if (isSuccess) return;
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const convertImagesToBase64 = async (files: File[]) => {
    return Promise.all(
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
  };

  const handleSaveNewCityDistrict = () => {
    if (isSuccess) return;
    if (!newCity.trim() || !newDistrict.trim()) {
      toast.error("Please enter both city and district names.");
      return;
    }
    setCity(newCity.trim());
    setDistrict(newDistrict.trim());
    setShowNewCityInputs(false);
    setFilteredDistricts([newDistrict.trim()]);
    setNewCity("");
    setNewDistrict("");
  };

  const isFormValid = () => {
    const selectedCity = showNewCityInputs ? newCity.trim() : city;
    const selectedDistrict = showNewCityInputs ? newDistrict.trim() : district;
    const title = titleRef.current?.value || "";

    return (
      mainCategory &&
      category &&
      subCategory &&
      title &&
      type &&
      equipmentModel &&
      transmission &&
      color &&
      region &&
      selectedCity &&
      selectedDistrict &&
      description &&
      price !== "" &&
      !isNaN(Number(price)) &&
      Number(price) >= 0 &&
      currentUser &&
      currentUser._id &&
      make &&
      enginePower &&
      fuelType &&
      images.length > 0
    );
  };

  const resetForm = () => {
    setCategory("");
    setSubCategory("");
    setRegion("");
    setCity("");
    setDistrict("");
    setSubDistrict("");
    setDescription("");
    setPrice("");
    setImages([]);
    setFilteredCities([]);
    setFilteredDistricts([]);
    setNewCity("");
    setNewDistrict("");
    setShowNewCityInputs(false);
    setType("");
    setEquipmentModel("");
    setTransmission("");
    setColor("");
    setMake("");
    setEnginePower("");
    setFuelType("");
    if (titleRef.current) titleRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error("Please fill out all required fields correctly.");
      return;
    }
    if (!currentUser) {
      toast.error("User information is missing. Please log in.");
      return;
    }
    if (isLoading || isSuccess) return;

    const selectedCity = showNewCityInputs ? newCity.trim() : city;
    const selectedDistrict = showNewCityInputs ? newDistrict.trim() : district;
    const title = titleRef.current?.value || "";

    try {
      const imagesBase64 = await convertImagesToBase64(images);

      const tractorData = {
        mainCategory: mainCategory,
        title,
        description: description,
        price: Number(price),
        city: selectedCity,
        region,
        category,
        subCategories: subCategory,
        so: title,
        images: imagesBase64,
        // *** FIX/CHECK AREA 1: Assumed Prisma foreign key name is 'userId' ***
        // If your Prisma field is named 'ownerId' or something else, change this line.
        userId: currentUser._id,
        // *******************************************************************
        type: type,
        make: make,
        equipmentModel,
        year: new Date().getFullYear(),
        condition: "good",
        hours: 0,
        enginePower: enginePower,
        fuelType: fuelType,
        transmissionType: transmission,
        district: selectedDistrict,
        subDistrict: subDistrict || null, // Use null for optional string fields
        // *** FIX/CHECK AREA 2: Ensure 'extra' is a JSON type in Prisma ***
        // If 'extra' is NOT Json in Prisma, remove this object entirely.
        extra: {
          color,
        },
        // ***************************************************************
      };

      // 🪵 LOGGING DATA BEFORE SUBMISSION
      console.log("Tractor Data Payload:", tractorData);

      const created = await createTractor(tractorData as any).unwrap();

      toast.success("Tractor listing created successfully!");

      setTimeout(() => {
        router.push(`/tractorsSummary?id=${created._id}`);
      }, 1000);
    } catch (error) {
      console.error("Failed to create tractor listing:", error);
      toast.error("Failed to create tractor listing. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-xl shadow-2xl border border-gray-100">
      <ToastContainer />
      <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-800">
        🚜 Create Traktor Listing
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            main Category
          </label>
          <select
            value={mainCategory}
            onChange={(e) => {
              setMainCategory(e.target.value);
              setCategory("");
              setSubCategory("");
            }}
            required
            disabled={isSuccess}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          >
            {allCategories
              .filter((cat) => cat.key === "Traktor")
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
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSubCategory("");
                }}
                required
                disabled={isSuccess}
                className={inputStyle}
              >
                <option value="">Select category</option>
                {TraktorTopCategories.map((cat) => (
                  <option key={cat.title} value={cat.title}>
                    {cat.so} ({cat.title})
                  </option>
                ))}
              </select>
            </div>

            {category && filteredSubcategories.length > 0 && (
              <div>
                <label className={labelStyle}>Subcategory</label>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  required
                  disabled={isSuccess}
                  className={inputStyle}
                >
                  <option value="">Select subcategory</option>
                  {filteredSubcategories.map((sub) => (
                    <option key={sub.title} value={sub.title}>
                      {sub.so}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className={sectionHeaderStyle}>Tractor Specifications</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className={labelStyle}>
                Title (Auto-filled by Subcategory)
              </label>
              <input
                type="text"
                ref={titleRef}
                placeholder="Title"
                required
                disabled={isSuccess}
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>Make</label>
              <input
                type="text"
                value={make}
                onChange={(e) => setMake(e.target.value)}
                placeholder="Make/Brand (e.g., John Deere)"
                required
                disabled={isSuccess}
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>Model</label>
              <input
                type="text"
                value={equipmentModel}
                onChange={(e) => setEquipmentModel(e.target.value)}
                placeholder="Model (e.g., 6155R)"
                required
                disabled={isSuccess}
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>Type</label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="Type (e.g., Row-Crop, Compact)"
                required
                disabled={isSuccess}
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>Engine Power</label>
              <input
                type="text"
                value={enginePower}
                onChange={(e) => setEnginePower(e.target.value)}
                placeholder="Engine Power (HP)"
                required
                disabled={isSuccess}
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>Fuel Type</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                required
                disabled={isSuccess}
                className={inputStyle}
              >
                <option value="">Select fuel type</option>
                <option value="diesel">Diesel</option>
                <option value="gasoline">Gasoline</option>
                <option value="electric">Electric</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className={labelStyle}>Transmission</label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                required
                disabled={isSuccess}
                className={inputStyle}
              >
                <option value="">Select transmission</option>
                <option value="manual">Manual</option>
                <option value="automatic">Automatic</option>
              </select>
            </div>

            <div>
              <label className={labelStyle}>Color</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="Color"
                required
                disabled={isSuccess}
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
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                required
                disabled={isSuccess}
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
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required={!showNewCityInputs}
                className={inputStyle}
                disabled={!region || isSuccess}
              >
                <option value="">Select city</option>
                {filteredCities.map((c) => (
                  <option
                    key={c}
                    value={c}
                    className={
                      c === "custom" ? "font-semibold text-blue-600" : ""
                    }
                  >
                    {c === "custom" ? "+ Add New City" : c}
                  </option>
                ))}
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
                  disabled={isSuccess}
                  className={inputStyle}
                />
                <input
                  type="text"
                  value={newDistrict}
                  onChange={(e) => setNewDistrict(e.target.value)}
                  placeholder="New District Name"
                  required
                  disabled={isSuccess}
                  className={inputStyle}
                />
                <button
                  type="button"
                  onClick={handleSaveNewCityDistrict}
                  disabled={isSuccess}
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
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  required
                  disabled={isSuccess}
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
                value={subDistrict}
                onChange={(e) => setSubDistrict(e.target.value)}
                placeholder="Sub District"
                disabled={isSuccess}
                className={inputStyle}
              />
            </div>
          </div>

          <div className="mt-6">
            <label className={labelStyle}>Price ($)</label>
            <input
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price in USD"
              required
              disabled={isSuccess}
              className={inputStyle}
            />
          </div>
        </div>

        <div>
          <h2 className={sectionHeaderStyle}>Description & Media</h2>
          <div>
            <label className={labelStyle}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your tractor's condition, features, and history..."
              required
              rows={5}
              disabled={isSuccess}
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
              disabled={isSuccess}
              className="w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
            />
            <div className="mt-4 flex flex-wrap gap-3">
              {images.map((file, i) => (
                <div
                  key={i}
                  className="relative w-20 h-20 border-2 border-gray-200 rounded-lg overflow-hidden shadow-md"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Selected ${i}`}
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    disabled={isSuccess}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-bl-lg w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-red-700 transition"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isFormValid() || isLoading || isSuccess}
          className={`w-full py-3 rounded-xl text-white font-bold text-lg tracking-wider transition transform ${
            isFormValid() && !isLoading && !isSuccess
              ? "bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg"
              : isSuccess
              ? "bg-green-400 cursor-not-allowed"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isLoading
            ? "Submitting..."
            : isSuccess
            ? "Ad Submitted"
            : "Submit Tractor Listing"}
        </button>

        {isError && (
          <div className="text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 mt-2 text-center">
            Failed to create tractor listing. Please try again.
          </div>
        )}

        {isSuccess && (
          <div className="text-green-600 bg-green-50 p-3 rounded-lg border border-green-200 mt-2 text-center">
            Tractor listing created successfully! Redirecting...
          </div>
        )}
      </form>
    </div>
  );
};

export default Traktor;

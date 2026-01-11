"use client";

import { useState, useEffect, useRef, ReactElement } from "react";
import { useRouter } from "next/navigation";
import { MdOutlinePlaylistRemove } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { allCategories } from "@/app/(storeFront)/links/categories";
import {
  CreateRealEstateItemInput,
  useCreateRealEstateItemMutation,
} from "@/app/(storeFront)/store/slices/realtStateSlice";
import { cities } from "@/app/(dashboard)/dashboard/regions.and.cities";
import {
  Districts,
  regions,
} from "@/app/(storeFront)/components/shared/SomaliMapRegionsAndCities/SomaliaRegions";
import {
  RealEstateCommercialNestedSub,
  RealEstateFarmForSaleNestedSub,
  RealEstateForRentNestedSub,
  RealEstateForSaleNestedSub,
  RealEstateLandForSaleNestedSub,
} from "@/app/(storeFront)/components/navbar/mainCreateAdCategories/nestedSubcategoryProperties";
import { realEstateSubCategories } from "@/app/(storeFront)/components/navbar/mainCreateAdCategories/subCategories";
import { apiService } from "@/actions/core/authAction";

interface User {
  _id: string;
  username?: string;
  phone?: string;
}

interface SubCategoryItem {
  so: string;
  title: string;
  icon: ReactElement;
  href: string;
}

const realEstateNestedCategoriesMap: { [key: string]: SubCategoryItem[] } = {
  "For Rent": RealEstateForRentNestedSub,
  "For Sale": RealEstateForSaleNestedSub,
  "Land for Sale": RealEstateLandForSaleNestedSub,
  "Farm for Sale": RealEstateFarmForSaleNestedSub,
  Commercial: RealEstateCommercialNestedSub,
};

const CreateRealEstate = () => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  // FIX: isSuccess is correctly destructured here
  const [createRealEstateItem, { isLoading, isSuccess }] =
    useCreateRealEstateItemMutation();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [subDistrict, setSubDistrict] = useState("");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [filteredDistricts, setFilteredDistricts] = useState<string[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<
    SubCategoryItem[]
  >([]);
  const [newCity, setNewCity] = useState("");
  const [newDistrict, setNewDistrict] = useState("");
  const [showNewCityInputs, setShowNewCityInputs] = useState(false);
  const [mainCategory, setMainCategory] = useState(
    allCategories.find((cat) => cat.key === "RealEstate")?.name || ""
  );

  useEffect(() => {
    const fetchUser = async () => {
      const sessionUser = await apiService.verifySession();
      if (!sessionUser) router.push("/login");
      else setCurrentUser(sessionUser);
    };
    fetchUser();
  }, [router]);

  useEffect(() => {
    if (!region) return setFilteredCities([]);
    const citiesInRegion = cities
      .filter((c) => c.regionId === region)
      .map((c) => c.name);
    setFilteredCities(citiesInRegion);
    setCity("");
    setDistrict("");
    setFilteredDistricts([]);
    setShowNewCityInputs(false);
    setNewCity("");
    setNewDistrict("");
  }, [region]);

  useEffect(() => {
    if (city === "custom") {
      setShowNewCityInputs(true);
      setFilteredDistricts([]);
      setDistrict("");
      setSubDistrict("");
      setNewDistrict("");
    } else if (city) {
      setShowNewCityInputs(false);
      const cityObj = Districts.find((d) => d.name === city);
      setFilteredDistricts(cityObj?.subDistricts.map((sd) => sd.name) || []);
      setDistrict("");
      setSubDistrict("");
      setNewDistrict("");
    } else {
      setShowNewCityInputs(false);
      setFilteredDistricts([]);
      setDistrict("");
      setSubDistrict("");
      setNewDistrict("");
    }
  }, [city]);

  useEffect(() => {
    if (category) {
      setFilteredSubcategories(realEstateNestedCategoriesMap[category] || []);
      setSubCategory("");
      setTitle("");
    } else {
      setFilteredSubcategories([]);
    }
  }, [category]);

  useEffect(() => {
    if (category && subCategory) {
      const selectedSub = realEstateNestedCategoriesMap[category]?.find(
        (sub) => sub.title === subCategory
      );
      // Ensure title is based on the Somali title (so) if available, otherwise use English title
      setTitle(selectedSub?.so || selectedSub?.title || "");
    }
  }, [category, subCategory]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (files.length + images.length > 10)
      return toast.warn("Max 10 images allowed", { position: "bottom-center" });
    setImages((prev) => [...prev, ...files].slice(0, 10));
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveNewCityDistrict = () => {
    if (!newCity.trim() || !newDistrict.trim())
      return toast.warn("City and District names are required.", {
        position: "bottom-center",
      });
    setCity(newCity.trim());
    setDistrict(newDistrict.trim());
    setSubDistrict(newDistrict.trim());
    setShowNewCityInputs(false);
    setFilteredDistricts([newDistrict.trim()]);
    setNewCity("");
    setNewDistrict("");
  };

  const isFormValid = () => {
    // Determine the actual city/district values based on whether custom inputs are showing
    const selectedCity = showNewCityInputs ? newCity.trim() : city;
    const selectedDistrict = showNewCityInputs ? newDistrict.trim() : district;

    // Check if the auto-filled title has a value (this indirectly checks if category/subcategory are selected)
    const hasValidTitle = title && title.trim().length > 0;

    return (
      mainCategory && // Included mainCategory in validation
      category &&
      subCategory &&
      hasValidTitle &&
      region &&
      selectedCity &&
      selectedDistrict &&
      address &&
      price &&
      !isNaN(Number(price)) &&
      Number(price) >= 0 &&
      description &&
      currentUser
    );
  };

  const convertImagesToBase64 = async (files: File[]) =>
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
      toast.warn("Please fill all required fields correctly.", {
        position: "bottom-center",
      });
      return;
    }
    if (!currentUser) {
      toast.error("User not loaded yet.", { position: "bottom-center" });
      return;
    }
    // Prevent double submit when loading or success
    if (isLoading || isSuccess) return;

    const selectedCity = showNewCityInputs ? newCity.trim() : city;
    const selectedDistrict = showNewCityInputs ? newDistrict.trim() : district;

    const imagesBase64 = await convertImagesToBase64(images);

    const payload: CreateRealEstateItemInput = {
      mainCategory: mainCategory, // Included mainCategory in payload
      user: currentUser._id,
      title,
      category,
      subCategory,
      region,
      city: selectedCity,
      district: selectedDistrict,
      subDistrict: subDistrict || selectedDistrict,
      address,
      description,
      price: Number(price),
      area,
      images: imagesBase64,
    };

    console.log("--- Real Estate Ad Payload ---");
    console.log(payload);
    console.log("------------------------------");

    try {
      const created = await createRealEstateItem(payload).unwrap();
      toast.success("Real Estate Ad created successfully!", {
        position: "top-right",
      });

      setTimeout(() => {
        router.push(`/realEstateSummary?id=${created._id}`);
      }, 1000);
    } catch {
      toast.error("Failed to create item", { position: "top-right" });
    }
  };

  if (!currentUser) return <p className="text-center mt-10">Loading user...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-6 p-4 md:p-6 bg-gray-50 rounded-lg shadow-xl">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Create Real Estate Ad 🏘️
      </h1>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
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
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          >
            {allCategories
              .filter((cat) => cat.key === "RealEstate")
              .map((cat, index) => (
                <option key={index} value={cat.name}>
                  {cat.so ?? cat.name}
                </option>
              ))}
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSubCategory("");
                setTitle("");
              }}
              required
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            >
              <option value="">Select category</option>
              {realEstateSubCategories.map((cat) => (
                <option key={cat.title} value={cat.title}>
                  {cat.so} ({cat.title})
                </option>
              ))}
            </select>
          </div>

          {category && filteredSubcategories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subcategory
              </label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Auto-filled, adjust if necessary"
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            placeholder="Street address or nearest landmark"
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Region
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              required
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            >
              <option value="">Select region</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
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

        {city && filteredDistricts.length > 0 && !showNewCityInputs && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              District
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              required
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

        {showNewCityInputs && (
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
        )}

        {/* Optional Sub District input */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sub District (Optional)
          </label>
          <input
            type="text"
            value={subDistrict}
            onChange={(e) => setSubDistrict(e.target.value)}
            placeholder="e.g., Zone A"
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Area (m²) - Optional
            </label>
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="e.g., 200 (for 200m²)"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (USD)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              placeholder="0.00"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            placeholder="Describe the property in detail: amenities, condition, proximity to services."
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Images (Max 10)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <div className="flex flex-wrap gap-3 mt-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative w-20 h-20 shadow-md">
                <img
                  src={URL.createObjectURL(img)}
                  alt={`Preview ${idx}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
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
          // FIX: Correctly disabled based on form validity, loading, OR success
          disabled={!isFormValid() || isLoading || isSuccess}
          className={`w-full py-3 rounded-lg text-white font-bold text-lg transition duration-200 shadow-md ${
            // FIX: Correctly styled based on state
            isFormValid() && !isLoading && !isSuccess
              ? "bg-green-600 hover:bg-green-700"
              : isSuccess
              ? "bg-green-400 cursor-not-allowed" // Success/disabled state color
              : "bg-gray-400 cursor-not-allowed" // Invalid/default disabled state color
          }`}
        >
          {/* FIX: Correct button text based on state */}
          {isLoading
            ? "Submitting..."
            : isSuccess
            ? "Ad Submitted"
            : "Submit Real Estate Ad"}
        </button>
        {isSuccess && (
          <div className="text-green-600 bg-green-50 p-3 rounded-lg border border-green-200 mt-2 text-center">
            Real Estate Ad created successfully! Redirecting...
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateRealEstate;

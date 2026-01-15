"use client";

import { useState, useEffect, useRef, ReactElement } from "react";
import { useRouter } from "next/navigation";
import { MdOutlinePlaylistRemove } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Districts,
  regions,
} from "@/app/(storeFront)/components/shared/SomaliMapRegionsAndCities/SomaliaRegions";
import {
  CreateRealEstateItemInput,
  useCreateMarketplaceItemMutation,
} from "@/app/(storeFront)/store/slices/marketplaceSlice";



import { apiService } from "@/actions/core/authAction";
import { allCategories } from "@/app/(links)/dashboardLinks/categories";
import { marketplaceSubCategories } from "@/app/(links)/storeFrontLinks/subCategories";
import {  AntiquesAndArtNestedSub,
  ElectronicsNestedSub,
  AnimalAndSuppliesNestedSub,
  SportsAndOutdoorsNestedSub,
  FurnitureNestedSub,
  FashionNestedSub,} from "@/app/(links)/storeFrontLinks/nestedSubcategoryForMarketplace";

interface User {
  _id: string;
  username?: string;
  profileImage?: string;
  phone?: string;
}

interface SubCategoryItem {
  so: string;
  title: string;
  icon: ReactElement;
  href: string;
}

const categoryNestedMap: { [key: string]: SubCategoryItem[] } = {
  "Antiques & Art": AntiquesAndArtNestedSub,
  Electronics: ElectronicsNestedSub,
  "Animal & Supplies": AnimalAndSuppliesNestedSub,
  "Sports & Outdoors": SportsAndOutdoorsNestedSub,
  Furniture: FurnitureNestedSub,
  Fashion: FashionNestedSub,
};

const MarketplaceAdForm = () => {
  const router = useRouter();
  const [createMarketplaceItem, { isLoading }] =
    useCreateMarketplaceItemMutation();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  type FormData = Omit<
    CreateRealEstateItemInput,
    "user" | "images" | "price"
  > & { price: string };

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    region: "",
    city: "",
    district: "",
    subDistrict: "",
    extra: {},
    maGaday: false,
  });

  const [mainCategory, setMainCategory] = useState(
    allCategories[0]?.name || ""
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

  useEffect(() => {
    const fetchUser = async () => {
      const sessionUser = await apiService.verifySession();
      setCurrentUser(sessionUser);
    };
    fetchUser();
  }, []);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (!formData.region) return;
    const citiesInRegion = Districts.filter(
      (d) => d.regionId === formData.region
    ).map((d) => d.name);
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
    } else if (formData.city) {
      setShowNewCityInputs(false);
      const cityObj = Districts.find((d) => d.name === formData.city);
      setFilteredDistricts(cityObj?.subDistricts.map((sd) => sd.name) || []);
      handleInputChange("district", "");
    } else {
      setShowNewCityInputs(false);
      setFilteredDistricts([]);
      handleInputChange("district", "");
    }
  }, [formData.city]);

  useEffect(() => {
    if (formData.category) {
      const selectedCategoryEntry = (marketplaceSubCategories as any)[
        formData.category
      ];
      const selectedCategoryTitle = selectedCategoryEntry?.title;

      const nested = categoryNestedMap[selectedCategoryTitle] || [];

      setFilteredSubcategories(nested);
    } else {
      setFilteredSubcategories([]);
    }
  }, [formData.category]);

  const handleSaveNewCityDistrict = () => {
    if (!newCity.trim() || !newDistrict.trim()) return;
    handleInputChange("city", newCity.trim());
    handleInputChange("subDistrict", newDistrict.trim());
    handleInputChange("district", newDistrict.trim());
    setFilteredDistricts([newDistrict.trim()]);
    setShowNewCityInputs(false);
    setNewCity("");
    setNewDistrict("");
  };

  const isFormValid = () => {
    if (!currentUser) return false;
    const selectedCity = showNewCityInputs ? newCity.trim() : formData.city;
    const selectedDistrict = showNewCityInputs
      ? newDistrict.trim()
      : formData.subDistrict;
    return (
      mainCategory &&
      formData.category &&
      formData.subcategory &&
      formData.title &&
      formData.description &&
      formData.price &&
      !isNaN(Number(formData.price)) &&
      Number(formData.price) >= 0 &&
      formData.region &&
      selectedCity &&
      selectedDistrict
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
    if (!currentUser) {
      toast.error("User not loaded yet.", { position: "bottom-center" });
      return;
    }
    if (!isFormValid()) {
      toast.warn("Please fill out all required fields correctly.", {
        position: "bottom-center",
      });
      return;
    }

    const selectedCity = showNewCityInputs ? newCity.trim() : formData.city;
    const selectedSubDistrict = showNewCityInputs
      ? newDistrict.trim()
      : formData.subDistrict;

    const categoryEntry = (marketplaceSubCategories as any)[formData.category];
    const categoryTitle = categoryEntry
      ? categoryEntry.title
      : formData.category;

    const imagesBase64 = await convertImagesToBase64(images);

    const payload: CreateRealEstateItemInput & {
      user: string;
      images: string[];
      mainCategory: string;
    } = {
      ...formData,
      category: categoryTitle,
      price: Number(formData.price),
      user: currentUser._id,
      images: imagesBase64,
      city: selectedCity,
      subDistrict: selectedSubDistrict,
      mainCategory: mainCategory,
    };

    console.log("--- FINAL PAYLOAD Submitted (All Fields) ---");
    console.log(payload);
    console.log("------------------------------------------");

    try {
      const createdItem = await createMarketplaceItem(payload).unwrap();

      toast.success("Ad submitted successfully!", { position: "top-right" });

      setTimeout(() => {
        router.push(`/marketplaceSummary?id=${createdItem.id}`);
      }, 1000);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to create marketplace item.", {
        position: "top-right",
      });
    }
  };

  if (!currentUser) return <div>Loading user...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-6 p-4 md:p-6 bg-gray-50 rounded-lg shadow-xl">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Create Marketplace Ad 🚀
      </h1>
      <form onSubmit={handleSubmit} ref={formRef} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            main Category
          </label>
          <select
            value={mainCategory}
            onChange={(e) => {
              setMainCategory(e.target.value);
              handleInputChange("category", "");
              handleInputChange("subcategory", "");
            }}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          >
            {allCategories
              .filter((cat) => cat.key === "Marketplace")
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
              value={formData.category}
              onChange={(e) => {
                handleInputChange("category", e.target.value);
                handleInputChange("subcategory", "");
                handleInputChange("title", "");
              }}
              required
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            >
              <option value="">Select Category</option>
              {Object.entries(marketplaceSubCategories).map(([key, label]) => (
                <option key={key} value={key}>
                  {(label as any).so}
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
                value={formData.subcategory}
                onChange={(e) =>
                  handleInputChange("subcategory", e.target.value)
                }
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              >
                <option value="">Select Subcategory</option>
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
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            required
            placeholder="e.g., Brand New Samsung Galaxy S21"
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
            rows={4}
            placeholder="Provide a detailed description of your item..."
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <select
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              required={!showNewCityInputs}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            >
              <option value="">Select city</option>
              {filteredCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value="custom" className="font-bold text-blue-600">
                Add new city
              </option>
            </select>
          </div>

          {!showNewCityInputs && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                District
              </label>
              <select
                value={formData.district}
                onChange={(e) => handleInputChange("district", e.target.value)}
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
        </div>

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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sub District (Optional)
          </label>
          <input
            type="text"
            value={formData.subDistrict}
            onChange={(e) => handleInputChange("subDistrict", e.target.value)}
            placeholder="e.g., Zone A"
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
            onChange={(e) =>
              e.target.files &&
              setImages([...images, ...Array.from(e.target.files)].slice(0, 10))
            }
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <div className="flex flex-wrap mt-4 gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative w-20 h-20 shadow-md">
                <img
                  src={URL.createObjectURL(img)}
                  alt={`Ad image ${i + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() =>
                    setImages(images.filter((_, idx) => idx !== i))
                  }
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
          {isLoading ? "Submitting..." : "Submit Ad"}
        </button>
      </form>
    </div>
  );
};

export default MarketplaceAdForm;

"use client";

import { useRouter } from "next/navigation";
import { JSX, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { TiArrowSortedUp } from "react-icons/ti";

import { allCategories } from "@/app/(links)/dashboardLinks/categories";
import {
  boatsSubCategories,
  carsSubCategories,
  jobsSubCategories,
  marketplaceSubCategories,
  motorcyclesSubCategories,
  realEstateSubCategories,
  traktorSubCategories,
} from "@/app/(links)/storeFrontLinks/subCategories";

interface CategoryOption {
  title: string;
  description?: string;
  so?: string;
  href?: string;
  icon?: JSX.Element;
}

const categoryOptions: { [key: string]: CategoryOption[] } = {
  Marketplace: marketplaceSubCategories,
  RealEstate: realEstateSubCategories,
  Cars: carsSubCategories,
  Motorcycles: motorcyclesSubCategories,
  Boats: boatsSubCategories,
  Traktor: traktorSubCategories,
  Jobs: jobsSubCategories as CategoryOption[],
};

const getAdCreationPath = (categoryKey: string): string | null => {
  switch (categoryKey) {
    case "RealEstate":
      return "/create-ad-for-real-estate";
    case "Traktor":
      return "/create-ad-for-traktor";
    case "Motorcycles":
      return "/create-ad-for-motorcycles";
    case "Boats":
      return "/create-ad-for-boats";
    case "Jobs":
      return "/create-ad-for-jobs";
    default:
      return null;
  }
};

function Ads() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [, setOption] = useState<string | null>(null);
  const [openModel, setOpenModel] = useState(false);
  const router = useRouter();

  const handleCategoryClick = (categoryName: string) => {
    if (selectedCategory !== categoryName) {
      setSelectedCategory(categoryName);
      setOption(null);
      setOpenModel(true);
    } else {
      setOpenModel((prev) => !prev);
    }
  };

  const getPublicPrivateOptions = (): CategoryOption[] => {
    const description = categoryOptions.Cars?.[0]?.description || "";
    return [
      { title: "Public", description, so: "Shirkad" },
      { title: "Private", description, so: "Shaqsi" },
    ];
  };

  const getOptionsForCategory = (): CategoryOption[] => {
    if (!selectedCategory) return [];

    const categoryKey = selectedCategory.replace(/\s/g, "");

    if (selectedCategory === "Marketplace" || selectedCategory === "Cars") {
      return getPublicPrivateOptions();
    }

    if (categoryOptions[categoryKey as keyof typeof categoryOptions]) {
      return categoryOptions[categoryKey as keyof typeof categoryOptions];
    }

    return [];
  };

  const handleOptionSelect = (selectedOptionTitle: string) => {
    setOption(selectedOptionTitle);
    setOpenModel(false);

    if (!selectedCategory) return;

    if (selectedOptionTitle === "Public") {
      router.push("/business-customer");
      return;
    }

    if (
      selectedOptionTitle === "Private" &&
      (selectedCategory === "Marketplace" || selectedCategory === "Cars")
    ) {
      const path =
        selectedCategory === "Marketplace"
          ? "/create-ad-for-marketplace"
          : "/create-ad-for-cars";
      router.push(path);
      return;
    }

    const categoryKey = selectedCategory.replace(/\s/g, "");
    const path = getAdCreationPath(categoryKey);

    if (path) {
      router.push(path);
    }
  };

  const currentOptions = getOptionsForCategory();

  return (
    <div className="border bg-gray-90 min-h-[45rem] m-4 rounded-lg">
      <div className="bg-gray-10 flex flex-col md:flex-row md:items-start md:justify-start gap-5 p-5 rounded-lg">
        <div className="space-y-4 w-full md:w-1/2">
          <h2 className="text-2xl font-bold mb-2">Categories</h2>
          {allCategories
            .filter(
              (category) =>
                category.name !== "mohyus" && category.name !== "Smart Suuq"
            )
            .map((category) => (
              <div
                key={category.name}
                onClick={() => handleCategoryClick(category.name || "")}
                className={`flex items-center justify-between p-2 bg-white hover:bg-gray-10 rounded-lg cursor-pointer text-left ${
                  selectedCategory === category.name
                    ? "text-blue-500 font-semibold"
                    : "text-gray-800"
                }`}
              >
                <span className="flex items-center space-x-2">
                  {category.icon}
                  <span>
                    {category.name} {category.so && `(${category.so})`}
                  </span>
                </span>
                {selectedCategory === category.name && openModel ? (
                  <TiArrowSortedUp className="text-xl" />
                ) : (
                  <IoMdArrowDropdown className="text-xl" />
                )}
              </div>
            ))}
        </div>

        <div className="w-full md:w-1/2">
          {selectedCategory && (
            <div className="space-y-6">
              {currentOptions.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col space-y-2 border rounded-md bg-gray-90 p-4"
                >
                  <button
                    onClick={() => handleOptionSelect(item.title || "")}
                    className="px-4 mt-2 py-2 rounded-lg text-left bg-white hover:bg-gray-200 text-gray-800 w-full"
                  >
                    <span className="block">
                      {item.title}
                      {item.so && (
                        <span className="block text-sm text-gray-500">
                          ({item.so})
                        </span>
                      )}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Ads;

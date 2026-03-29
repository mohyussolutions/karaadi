"use client";
import { useRouter } from "next/navigation";
import { JSX, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { TiArrowSortedUp } from "react-icons/ti";

import { allCategories } from "@/app/(links)/storeFrontLinks/categories";
import { useTranslation } from "react-i18next";
import {
  boatsSubCategories,
  marketplaceSubCategories,
  motorcyclesSubCategories,
  realEstateSubCategories,
  traktorSubCategories,
} from "@/app/(links)/storeFrontLinks/subCategories";
import { carsSubCategories } from "@/app/(links)/storeFrontLinks/nestedSubcategoryForCars";

const CATEGORIES = {
  Marketplace: "Marketplace",
  RealEstate: "RealEstate",
  Cars: "Cars",
  Motorcycles: "Motorcycles",
  Boats: "Boats",
  Farmequipment: "Farmequipment",
} as const;

const OPTION = {
  Public: "Public",
  Private: "Private",
} as const;

interface CategoryOption {
  title: string;
  description?: string;
  so?: string;
  href?: string;
  icon?: JSX.Element;
  labelKey?: string;
}

const categoryOptions: { [key: string]: ReadonlyArray<CategoryOption> } = {
  [CATEGORIES.Marketplace]: marketplaceSubCategories,
  [CATEGORIES.RealEstate]: realEstateSubCategories,
  [CATEGORIES.Cars]: carsSubCategories,
  [CATEGORIES.Motorcycles]: motorcyclesSubCategories,
  [CATEGORIES.Boats]: boatsSubCategories,
  [CATEGORIES.Farmequipment]: traktorSubCategories,
};

const createPublicPrivateOptions = (
  description = "",
): ReadonlyArray<CategoryOption> => [
  {
    title: OPTION.Public,
    description,
    so: "Shirkad",
    labelKey: "createAd.public",
  },
  {
    title: OPTION.Private,
    description,
    so: "Shaqsi",
    labelKey: "createAd.private",
  },
];

const getAdCreationPath = (categoryKey: string): string | null => {
  switch (categoryKey) {
    case CATEGORIES.RealEstate:
      return "/create-ad-for-real-estate";
    case CATEGORIES.Farmequipment:
      return "/create-ad-for-farmequipment";
    case CATEGORIES.Motorcycles:
      return "/create-ad-for-motorcycles";
    case CATEGORIES.Boats:
      return "/create-ad-for-boats";
    default:
      return null;
  }
};

function Ads() {
  const { t } = useTranslation();
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

  const getPublicPrivateOptions = (): ReadonlyArray<CategoryOption> => {
    const description = categoryOptions.Cars?.[0]?.description || "";
    return createPublicPrivateOptions(description);
  };

  const getOptionsForCategory = (): ReadonlyArray<CategoryOption> => {
    if (!selectedCategory) return [];

    const categoryKey = selectedCategory.replace(/\s/g, "");

    if (
      selectedCategory === CATEGORIES.Marketplace ||
      selectedCategory === CATEGORIES.Cars
    ) {
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

    if (selectedOptionTitle === OPTION.Public) {
      router.push("/business-customer");
      return;
    }

    if (
      selectedOptionTitle === OPTION.Private &&
      (selectedCategory === CATEGORIES.Marketplace ||
        selectedCategory === CATEGORIES.Cars)
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
          <h2 className="text-2xl font-bold mb-2">
            {t("createAd.categories", { defaultValue: "Categories" })}
          </h2>
          {allCategories
            .filter(
              (category) =>
                category.name !== "mohyus" &&
                category.name !== "Smart Suuq" &&
                category.name !== "Jobs" &&
                category.name !== "Smartsuuq",
            )
            .map((category) => (
              <div
                key={category.key}
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
                    {category.labelKey
                      ? t(category.labelKey, {
                          defaultValue: category.so ?? category.name,
                        })
                      : t(`categories.${category.key}`, {
                          defaultValue: category.so ?? category.name,
                        })}
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
                  key={item.title ? `${item.title}-${idx}` : idx}
                  className="flex flex-col space-y-2 border rounded-md bg-gray-90 p-4"
                >
                  <button
                    onClick={() => handleOptionSelect(item.title || "")}
                    className="px-4 mt-2 py-2 rounded-lg text-left bg-white hover:bg-gray-200 text-gray-800 w-full"
                  >
                    <span className="block">
                      {item.labelKey
                        ? t(item.labelKey, {
                            defaultValue: item.so ?? item.title,
                          })
                        : t(item.title ?? "", {
                            defaultValue: item.so ?? item.title,
                          })}
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

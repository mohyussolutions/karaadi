"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { allCategories } from "@/app/(links)/storeFrontLinks/categories";
import {
  marketplaceSubCategories,
  realEstateSubCategories,
  vehicleSubCategories,
  motorcycleSubCategories,
  boatSubCategories,
  farmEquipmentSubCategories,
} from "@/app/(links)/storeFrontLinks/subCategories";
import { CategoryOption } from "@/app/utils/types/categoriestype";
import { CategoryItem } from "../../components/shared/buttons/CategoryItem";
import { OptionButton } from "../../components/shared/buttons/OptionButton";

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

const categoryOptions: Record<string, readonly CategoryOption[]> = {
  [CATEGORIES.Marketplace]: marketplaceSubCategories,
  [CATEGORIES.RealEstate]: realEstateSubCategories,
  [CATEGORIES.Cars]: vehicleSubCategories,
  [CATEGORIES.Motorcycles]: motorcycleSubCategories,
  [CATEGORIES.Boats]: boatSubCategories,
  [CATEGORIES.Farmequipment]: farmEquipmentSubCategories,
};

interface OptionItem {
  key: string;
  name: string;
  labelKey: string;
  icon?: React.ReactNode;
  href?: string;
  title?: string;
  description?: string;
}

const createPublicPrivateOptions = (description = ""): OptionItem[] => [
  {
    key: "public",
    name: "Public",
    title: OPTION.Public,
    description,
    labelKey: "createAd.public",
  },
  {
    key: "private",
    name: "Private",
    title: OPTION.Private,
    description,
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
    case CATEGORIES.Marketplace:
      return "/create-ad-for-marketplace";
    case CATEGORIES.Cars:
      return "/create-ad-for-cars";
    default:
      return null;
  }
};

const filteredCategories = allCategories.filter((category) => {
  if (category.key === "Smartsuuq" || category.logo) return false;
  const name = (category.name || "").toLowerCase();
  return !["mohyus", "smart suuq", "jobs"].includes(name);
});

function Ads() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [, setOption] = useState<string | null>(null);
  const [openModel, setOpenModel] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  const handleCategoryClick = useCallback(
    (categoryName: string) => {
      if (selectedCategory !== categoryName) {
        setSelectedCategory(categoryName);
        setOption(null);
        setOpenModel(true);
      } else {
        setOpenModel((prev) => !prev);
      }
    },
    [selectedCategory],
  );

  const getPublicPrivateOptions = useCallback((): OptionItem[] => {
    const description = categoryOptions[CATEGORIES.Cars]?.[0]?.name || "";
    return createPublicPrivateOptions(description);
  }, []);

  const currentOptions = useMemo(() => {
    if (!selectedCategory) return [];
    return getPublicPrivateOptions();
  }, [selectedCategory, getPublicPrivateOptions]);

  const handleOptionSelect = useCallback(
    (selectedOptionTitle: string) => {
      setOption(selectedOptionTitle);
      setOpenModel(false);
      if (!selectedCategory) return;

      if (selectedOptionTitle === OPTION.Public) {
        router.push("/business-customer");
        return;
      }

      const categoryKey = selectedCategory.replace(/\s/g, "");
      const path = getAdCreationPath(categoryKey);
      if (path) router.push(path);
    },
    [selectedCategory, router],
  );

  const getCategoryLabel = useCallback(
    (category: any) => {
      if (category.labelKey) {
        return t(category.labelKey, {
          defaultValue: category.name,
        });
      }
      return t(`categories.${category.key}`, {
        defaultValue: category.name,
      });
    },
    [t],
  );

  if (loading) {
    return null;
  }
  if (!user) return null;

  return (
    <div className="border bg-gray-90 min-h-[45rem] m-4 rounded-lg">
      <div className="bg-gray-10 flex flex-col md:flex-row md:items-start md:justify-start gap-5 p-5 rounded-lg">
        <div className="space-y-4 w-full md:w-1/2">
          <h2 className="text-2xl font-bold mb-2">
            {t("createAd.categories")}
          </h2>
          {filteredCategories.map((category) => (
            <CategoryItem
              key={category.key}
              name={category.name || ""}
              icon={category.icon}
              label={getCategoryLabel(category)}
              isSelected={selectedCategory === category.name}
              isOpen={openModel}
              onSelect={handleCategoryClick}
            />
          ))}
        </div>

        <div className="w-full md:w-1/2">
          {selectedCategory && (
            <div className="space-y-6">
              {currentOptions.map((item) => (
                <div
                  key={item.key}
                  className="flex flex-col space-y-2 border rounded-md p-4"
                >
                  <OptionButton
                    title={item.title || item.name}
                    onSelect={() => handleOptionSelect(item.title || item.name)}
                    disabled={false}
                  >
                    {item.title || item.name}
                  </OptionButton>
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

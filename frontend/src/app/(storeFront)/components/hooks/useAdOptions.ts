"use client";

import { useMemo, useCallback } from "react";
import {
  marketplaceSubCategories,
  realEstateSubCategories,
  vehicleSubCategories,
  motorcycleSubCategories,
  boatSubCategories,
  farmEquipmentSubCategories,
} from "@/app/(links)/storeFrontLinks/mainCategotyCategorySubCategory";
import { CategoryOption } from "@/app/utils/types/categoriestype";
import { OPTION } from "@/actions/constant/constant";

const CATEGORIES = {
  Marketplace: "Marketplace",
  RealEstate: "RealEstate",
  Cars: "Cars",
  Motorcycles: "Motorcycles",
  Boats: "Boats",
  Farmequipment: "Farmequipment",
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

export function useAdOptions(selectedCategory: string | null) {
  const getPublicPrivateOptions = useCallback((): OptionItem[] => {
    const description = categoryOptions[CATEGORIES.Cars]?.[0]?.name || "";
    return createPublicPrivateOptions(description);
  }, []);

  const currentOptions = useMemo(() => {
    if (!selectedCategory) return [];
    return getPublicPrivateOptions();
  }, [selectedCategory, getPublicPrivateOptions]);

  return { currentOptions };
}

"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { OPTION } from "@/actions/constant/constant";

const CATEGORIES = {
  Marketplace: "Marketplace",
  RealEstate: "RealEstate",
  Cars: "Cars",
  Motorcycles: "Motorcycles",
  Boats: "Boats",
  Farmequipment: "Farmequipment",
} as const;

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

export function useAdNavigation() {
  const router = useRouter();

  const handleOptionSelect = useCallback(
    (selectedOptionTitle: string, selectedCategory: string | null) => {
      if (!selectedCategory) return;

      if (selectedOptionTitle === OPTION.Public) {
        router.push("/business");
        return;
      }

      const categoryKey = selectedCategory.replace(/\s/g, "");
      const path = getAdCreationPath(categoryKey);
      if (path) router.push(path);
    },
    [router],
  );

  return { handleOptionSelect };
}

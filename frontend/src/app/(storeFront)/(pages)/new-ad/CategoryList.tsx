"use client";

import { useTranslation } from "react-i18next";
import { CategoryItem } from "../../components/shared/buttons/CategoryItem";
import { allCategories } from "@/app/(links)/storeFrontLinks/mainCategotyCategorySubCategory";

const filteredCategories = allCategories.filter((category) => {
  if (category.key === "Smartsuuq" || category.logo) return false;
  const name = (category.name || "").toLowerCase();
  return !["mohyus", "smart suuq", "jobs"].includes(name);
});

interface CategoryListProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryName: string) => void;
  isOpen: boolean;
}

export function CategoryList({
  selectedCategory,
  onSelectCategory,
  isOpen,
}: CategoryListProps) {
  const { t } = useTranslation();

  const getCategoryLabel = (category: any) => {
    if (category.labelKey) {
      return t(category.labelKey, {
        defaultValue: category.name,
      });
    }
    return t(`categories.${category.key}`, {
      defaultValue: category.name,
    });
  };

  return (
    <div className="space-y-4 w-full md:w-1/2">
      <h2 className="text-2xl font-bold mb-2">{t("createAd.categories")}</h2>
      {filteredCategories.map((category) => (
        <CategoryItem
          key={category.key}
          name={category.name || ""}
          icon={category.icon}
          label={getCategoryLabel(category)}
          isSelected={selectedCategory === category.name}
          isOpen={isOpen}
          onSelect={onSelectCategory}
        />
      ))}
    </div>
  );
}

"use client";

import {
  BUSINESS_CATEGORIES,
  CategoryKey,
} from "@/app/(links)/storeFrontLinks/businessCategoriesConfig";

interface BusinessCategoryGridProps {
  selectedCategory: CategoryKey | null;
  onSelectCategory: (category: CategoryKey) => void;
}

export function BusinessCategoryGrid({
  selectedCategory,
  onSelectCategory,
}: BusinessCategoryGridProps) {
  return (
    <div className="grid grid-cols-3 gap-3 px-3 py-3 w-full">
      {BUSINESS_CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const active = selectedCategory === cat.key;
        return (
          <button
            key={cat.key}
            type="button"
            onClick={() => onSelectCategory(cat.key)}
            className={`flex flex-col items-center gap-2 px-2 py-4 rounded-2xl font-semibold text-sm transition-all duration-150 border-2 ${
              active
                ? "border-blue-500 text-blue-600 scale-[1.02]"
                : "border-gray-100 text-gray-500"
            }`}
          >
            <Icon className={`text-[26px] ${active ? "text-blue-500" : "text-gray-400"}`} />
            <span className="leading-tight text-center text-[12px] font-semibold">
              {cat.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

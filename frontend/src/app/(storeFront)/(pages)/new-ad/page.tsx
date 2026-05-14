"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { useAdOptions } from "../../components/hooks/useAdOptions";
import { useAdNavigation } from "../../components/hooks/useAdNavigation";
import { allCategories } from "@/app/(links)/storeFrontLinks/mainCategotyCategorySubCategory";
import { useLanguage } from "@/app/(storeFront)/components/hooks/useLanguage";
import { ChevronRight, ChevronLeft, LayoutGrid } from "lucide-react";
import type { MainCategory } from "@/app/utils/types/categoriestype";

const filteredCategories = (allCategories as MainCategory[]).filter(
  (c) =>
    !c.logo &&
    !["Smartsuuq", "mohyus", "smart suuq", "jobs"].includes(
      (c.name || c.key || "").toLowerCase(),
    ),
);

export default function NewAdPage() {
  const router = useRouter();
  const { t } = useTranslation();
  useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { user, loading } = useAuth();
  const { handleOptionSelect } = useAdNavigation();
  const { currentOptions } = useAdOptions(selectedCategory);

  useEffect(() => {
    if (!loading && !user) router.replace("/login?redirect=/new-ad");
  }, [user, loading, router]);

  if (loading || !user) return null;

  const getCategoryLabel = (category: MainCategory) =>
    category.labelKey
      ? t(category.labelKey, { defaultValue: category.name })
      : t(`categories.${category.key}`, { defaultValue: category.name });

  const selectedCategoryObj = filteredCategories.find(
    (c) => c.name === selectedCategory,
  );

  return (
    <div
      className="min-h-screen bg-white"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 4rem)" }}
    >
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3.5 flex items-center gap-3 shadow-sm">
        {selectedCategory && (
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className="p-2 -ml-1 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation lg:hidden"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
        )}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <LayoutGrid className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-black text-gray-900 leading-tight">
              {selectedCategory
                ? getCategoryLabel(selectedCategoryObj!)
                : t("createAd.title", "Post an Ad")}
            </h1>
            {!selectedCategory && (
              <p className="text-[11px] text-gray-400 font-medium leading-none mt-0.5">
                {t(
                  "createAd.selectCategory",
                  "Select a category to get started",
                )}
              </p>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-5 sm:py-7">
        {/* Desktop layout */}
        <div className="hidden lg:flex gap-5 items-start">
          <nav className="w-56 flex-shrink-0 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {t("createAd.categories", "Categories")}
              </p>
            </div>
            {filteredCategories.map((category) => {
              const label = getCategoryLabel(category);
              const isSelected = selectedCategory === category.name;
              return (
                <button
                  key={category.key}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(
                      isSelected ? null : (category.name ?? null),
                    )
                  }
                  className={`w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 last:border-b-0 text-sm font-semibold transition-colors touch-manipulation select-none ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                  }`}
                >
                  <span className="text-lg leading-none flex-shrink-0">
                    {category.icon}
                  </span>
                  <span className="flex-1 text-left">{label}</span>
                  <ChevronRight
                    className={`w-4 h-4 flex-shrink-0 transition-opacity ${isSelected ? "opacity-70" : "opacity-0"}`}
                  />
                </button>
              );
            })}
          </nav>

          <div className="flex-1">
            {!selectedCategory ? (
              <div className="flex flex-col items-center justify-center py-28 text-center bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                  <LayoutGrid className="w-7 h-7 text-blue-500" />
                </div>
                <p className="font-bold text-gray-700 text-base mb-1">
                  {t("createAd.selectCategory", "Select a category")}
                </p>
                <p className="text-sm text-gray-400">
                  {t(
                    "createAd.selectCategoryHint",
                    "Choose from the list on the left",
                  )}
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {t("createAd.selectType", "Select type")}
                  </p>
                </div>
                <div className="divide-y divide-gray-100">
                  {currentOptions.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() =>
                        handleOptionSelect(
                          item.title || item.name,
                          selectedCategory,
                        )
                      }
                      className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation select-none"
                    >
                      <div className="flex items-center gap-3">
                        {item.icon && (
                          <span className="text-xl flex-shrink-0">
                            {item.icon}
                          </span>
                        )}
                        <div>
                          <span className="font-semibold text-gray-900 text-sm block">
                            {item.labelKey
                              ? t(item.labelKey, {
                                  defaultValue: item.title || item.name,
                                })
                              : item.title || item.name}
                          </span>
                          {item.description && (
                            <span className="text-xs text-gray-400 block mt-0.5">
                              {item.description}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile layout */}
        <div className="lg:hidden">
          {!selectedCategory ? (
            <>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">
                {t("createAd.categories", "Categories")}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredCategories.map((category) => {
                  const label = getCategoryLabel(category);
                  return (
                    <button
                      key={category.key}
                      type="button"
                      onClick={() => setSelectedCategory(category.name ?? null)}
                      className="flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-gray-200 px-3 py-6 shadow-sm active:scale-[0.97] active:bg-blue-50 active:border-blue-400 transition-all touch-manipulation select-none"
                    >
                      <span className="text-4xl leading-none">
                        {category.icon}
                      </span>
                      <span className="font-bold text-gray-800 text-sm text-center leading-snug">
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">
                {t("createAd.selectType", "Select type")}
              </p>
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {currentOptions.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() =>
                        handleOptionSelect(
                          item.title || item.name,
                          selectedCategory,
                        )
                      }
                      className="w-full flex items-center justify-between gap-3 px-4 py-4 text-left active:bg-gray-50 transition-colors touch-manipulation select-none min-h-[64px]"
                    >
                      <div className="flex items-center gap-3">
                        {item.icon && (
                          <span className="text-2xl flex-shrink-0">
                            {item.icon}
                          </span>
                        )}
                        <div>
                          <span className="font-semibold text-gray-900 text-sm block">
                            {item.labelKey
                              ? t(item.labelKey, {
                                  defaultValue: item.title || item.name,
                                })
                              : item.title || item.name}
                          </span>
                          {item.description && (
                            <span className="text-xs text-gray-400 block mt-0.5">
                              {item.description}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

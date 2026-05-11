"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { useAdOptions } from "../../components/hooks/useAdOptions";
import { useAdNavigation } from "../../components/hooks/useAdNavigation";
import { allCategories } from "@/app/(links)/storeFrontLinks/mainCategotyCategorySubCategory";
import { useLanguage } from "@/app/(storeFront)/components/hooks/useLanguage";

const filteredCategories = allCategories.filter((c) => {
  if (c.key === "Smartsuuq" || (c as any).logo) return false;
  const name = (c.name || "").toLowerCase();
  return !["mohyus", "smart suuq", "jobs"].includes(name);
});

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

  const getCategoryLabel = (category: any) =>
    category.labelKey
      ? t(category.labelKey, { defaultValue: category.name })
      : t(`categories.${category.key}`, { defaultValue: category.name });

  return (
    <div
      className="flex flex-col min-h-screen bg-gray-50"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 4rem)" }}
    >
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm px-4 py-3">
        <h1 className="text-base font-black uppercase tracking-tight text-gray-900">
          {t("createAd.title", "Post an Ad")}
        </h1>
      </header>

      <div className="flex-1 flex flex-col md:flex-row md:gap-6 md:p-6">
        <nav className="md:w-56 md:flex-shrink-0">
          <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible px-3 py-3 md:px-0 md:py-0 scrollbar-hide">
            {filteredCategories.map((category) => {
              const label = getCategoryLabel(category);
              const isSelected = selectedCategory === category.name;
              return (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => setSelectedCategory(isSelected ? null : (category.name ?? null))}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all touch-manipulation select-none min-h-[44px] whitespace-nowrap md:w-full md:justify-start ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white text-gray-700 border-gray-200 active:bg-gray-50"
                  }`}
                >
                  <span className="text-base leading-none flex-shrink-0">{category.icon}</span>
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="flex-1 px-3 pb-4 md:px-0">
          {!selectedCategory ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
              <span className="text-4xl mb-3">📋</span>
              <p className="font-semibold text-sm">
                {t("createAd.selectCategory", "Select a category to continue")}
              </p>
            </div>
          ) : (
            <div className="space-y-3 mt-1">
              {(currentOptions as any[]).map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleOptionSelect(item.title || item.name, selectedCategory)}
                  className="w-full flex items-center justify-between gap-3 bg-white border border-gray-200 rounded-xl px-4 py-4 text-left hover:border-blue-300 hover:bg-blue-50 active:scale-[0.99] transition-all touch-manipulation select-none min-h-[56px] shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    {item.icon && <span className="text-xl flex-shrink-0">{item.icon}</span>}
                    <span className="font-semibold text-gray-800 text-sm">
                      {item.labelKey
                        ? t(item.labelKey, { defaultValue: item.title || item.name })
                        : item.title || item.name}
                    </span>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

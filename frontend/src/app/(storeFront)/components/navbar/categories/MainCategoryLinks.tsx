"use client";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import {
  Category,
  EXTERNAL_LINK_PROPS,
  EXTERNAL_LINK_REGEX,
} from "@/app/utils/types/navCategory.types";
import { allCategories } from "@/app/(links)/storeFrontLinks/mainCategotyCategorySubCategory";
import { useLanguage } from "@/app/(storeFront)/components/hooks/useLanguage";

const HIDDEN_KEYS = new Set(["Jobs", "jobs", "Smartsuuq"]);

const visibleCategories = (allCategories as Category[]).filter(
  (c) => !HIDDEN_KEYS.has(c.key) && !(c as any).logo,
);

const CategoryLinks = memo(function CategoryLinks() {
  const { t } = useTranslation();
  useLanguage();

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-3 max-w-7xl mx-auto">
      {visibleCategories.map((category) => {
        const isExternal = EXTERNAL_LINK_REGEX.test(category.href);
        const translatedTitle = category.labelKey
          ? t(category.labelKey, { defaultValue: category.name })
          : t(`categories.${category.key}`, {
              defaultValue: category.name || category.key,
            });

        return (
          <Link
            key={category.key}
            href={category.href}
            prefetch={true}
            {...(isExternal ? EXTERNAL_LINK_PROPS : {})}
            className="group no-underline"
          >
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white py-3 px-2 min-h-[84px] w-full active:scale-[0.97]">
              {!category.hideIcon && (
                <div className="w-10 h-10 rounded-xl bg-gray-120 flex items-center justify-center text-[20px] text-gray-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200">
                  {category.icon}
                </div>
              )}
              <p className="font-semibold text-[13px] text-center leading-tight m-0 text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                {translatedTitle}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
});

export default CategoryLinks;

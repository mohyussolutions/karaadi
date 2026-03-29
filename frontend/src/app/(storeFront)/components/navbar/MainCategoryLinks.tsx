"use client";

import { memo } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
import { allCategories } from "@/app/(links)/storeFrontLinks/categories";

const CategoryLinks = memo(function CategoryLinks() {
  const iconBaseClasses =
    "flex items-center justify-center rounded-xl transition-all duration-300";
  const iconSizeClasses = "w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10";

  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  return (
    <div className="grid grid-cols-4 gap-0.5 px-0.5 py-1 max-w-5xl mx-auto">
      {allCategories.map((category) => {
        const isSmartsuuq = category.key === "Smartsuuq";
        const isExternal = /^https?:\/\//.test(category.href);

        const translatedName = category.labelKey
          ? t(category.labelKey, { defaultValue: category.name })
          : (currentLang === "so" && category.so) || category.name || "";

        return (
          <Link
            key={category.key}
            href={category.href}
            prefetch={false}
            {...(isExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="flex flex-col items-center text-center group p-1 rounded-xl border border-gray-50 bg-white hover:border-blue-200 transition-all active:scale-95"
          >
            <div
              className={`${iconBaseClasses} ${isSmartsuuq ? "w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24" : iconSizeClasses}`}
            >
              {category.logo ? (
                <div
                  className={`relative ${isSmartsuuq ? "w-12 h-12 sm:w-16 sm:h-16" : "w-5 h-5 sm:w-6 sm:h-6"}`}
                >
                  <Image
                    src={category.logo}
                    alt={translatedName}
                    fill
                    sizes={
                      isSmartsuuq
                        ? "(max-width: 640px) 64px, 96px"
                        : "(max-width: 640px) 20px, 40px"
                    }
                    className="object-contain"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div
                  className={`${isSmartsuuq ? "text-4xl sm:text-6xl" : "text-xl"} text-blue-500 group-hover:text-blue-600 transition-colors`}
                >
                  {category.icon}
                </div>
              )}
            </div>
            <div className="flex flex-col pt-1 w-full">
              <span
                className={`text-[10px] sm:text-[12px] font-medium leading-tight ${isSmartsuuq ? "text-blue-600" : "text-gray-800"}`}
              >
                {translatedName}
                {isSmartsuuq && category.name && (
                  <>
                    <br />
                    <span className="text-blue-600 font-extrabold text-[16px] sm:text-[20px] leading-tight">
                      {category.name}
                    </span>
                  </>
                )}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
});

export default CategoryLinks;

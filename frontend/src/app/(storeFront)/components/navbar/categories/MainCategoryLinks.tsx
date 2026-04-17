"use client";

import { memo } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
import { allCategories } from "@/app/(links)/storeFrontLinks/categories";
import LinksStyleCard from "../../Cards/containerCards/linksstyleCard";
import {
  Category,
  EXTERNAL_LINK_PROPS,
  IMAGE_SIZES,
  EXTERNAL_LINK_REGEX,
} from "./types";

const CategoryLinks = memo(function CategoryLinks() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 px-2 py-4 max-w-7xl mx-auto items-stretch">
      {(allCategories as Category[]).map((category) => {
        const isExternal = EXTERNAL_LINK_REGEX.test(category.href);
        const isSmartsuuq = category.key === "Smartsuuq";

        const translatedTitle = category.labelKey
          ? t(category.labelKey, { defaultValue: category.name })
          : (currentLang === "so" && category.so) || category.name || "";

        const iconContent = category.logo ? (
          <div className="relative w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
            <Image
              src={category.logo}
              alt={category.name || "category"}
              fill
              className="object-contain"
              sizes={IMAGE_SIZES}
              priority
            />
          </div>
        ) : (
          <div className="flex items-center justify-center flex-shrink-0">
            {category.icon}
          </div>
        );

        return (
          <Link
            key={category.key}
            href={category.href}
            prefetch={true}
            {...(isExternal ? EXTERNAL_LINK_PROPS : {})}
            className="transition-transform active:scale-95 no-underline flex w-full"
          >
            <div className="w-full flex items-stretch">
              <LinksStyleCard
                title={translatedTitle}
                name={isSmartsuuq ? category.name : undefined}
                icon={iconContent}
                isSmartsuuq={isSmartsuuq}
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
});

export default CategoryLinks;

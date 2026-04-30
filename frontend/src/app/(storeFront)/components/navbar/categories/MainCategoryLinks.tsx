"use client";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";

import LinksStyleCard from "../../Cards/containerCards/linksstyleCard";
import { Category, EXTERNAL_LINK_PROPS, EXTERNAL_LINK_REGEX } from "@/app/utils/types/navCategory.types";
import { allCategories } from "@/app/(links)/storeFrontLinks/mainCategotyCategorySubCategory";

const CategoryLinks = memo(function CategoryLinks() {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 px-2 sm:px-4 py-3 sm:py-4 max-w-7xl mx-auto items-stretch">
      {(allCategories as Category[]).map((category) => {
        const isExternal = EXTERNAL_LINK_REGEX.test(category.href);
        const translatedTitle = category.labelKey
          ? t(category.labelKey, { defaultValue: category.name })
          : t(`categories.${category.key}`, { defaultValue: category.name || category.key });

        const iconContent = category.hideIcon ? undefined : (
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
              <LinksStyleCard title={translatedTitle} icon={iconContent} />
            </div>
          </Link>
        );
      })}
    </div>
  );
});

export default CategoryLinks;

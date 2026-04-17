"use client";

import { memo } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import LinksStyleCard from "../../Cards/containerCards/linksstyleCard";

interface CategoryOption {
  key: string;
  name: string;
  labelKey: string;
  icon: React.ReactNode;
  href: string;
}

interface SubCategoryListProps {
  data: CategoryOption[];
}

const EXTERNAL_PROPS = { target: "_blank", rel: "noopener noreferrer" };

const SubCategoryList = memo(function SubCategoryList({
  data,
}: SubCategoryListProps) {
  const { t, i18n } = useTranslation();

  if (!i18n.isInitialized) {
    return (
      <div className="grid grid-cols-2 gap-3 px-3 w-full max-w-2xl min-h-[100px] mx-auto animate-pulse bg-gray-50 rounded-lg" />
    );
  }

  return (
    <div className="flex justify-center w-full py-2">
      <div className="grid grid-cols-2 gap-3 px-3 w-full max-w-2xl">
        {data.map((item) => {
          const isExternal = /^https?:\/\//.test(item.href);
          const translatedTitle = t(item.labelKey, item.name);

          return (
            <Link
              key={item.key}
              href={item.href}
              {...(isExternal ? EXTERNAL_PROPS : {})}
              className="transition-transform active:scale-95 no-underline flex items-stretch"
            >
              <div className="w-full flex items-stretch">
                <LinksStyleCard
                  title={translatedTitle}
                  icon={<div className="flex-shrink-0">{item.icon}</div>}
                  size="sm"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
});

export default SubCategoryList;

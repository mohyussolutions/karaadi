"use client";

import { memo } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useLanguage } from "@/app/(storeFront)/components/hooks/useLanguage";

interface CategoryOption {
  key: string;
  name: string;
  labelKey: string;
  icon: React.ReactNode;
  href: string;
}

interface SubCategoryListProps {
  data: CategoryOption[];
  cols?: 2 | 3 | 4;
}

const EXTERNAL_PROPS = { target: "_blank", rel: "noopener noreferrer" };

const COLS_CLASS: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
};

const CARD_SIZE: Record<number, { card: string; icon: string; label: string }> = {
  2: {
    card: "py-6 px-4 min-h-[120px]",
    icon: "w-12 h-12 rounded-2xl text-[22px]",
    label: "text-sm font-semibold",
  },
  3: {
    card: "py-3 px-2 min-h-[76px]",
    icon: "w-9 h-9 rounded-xl text-[18px]",
    label: "text-[12px] font-semibold",
  },
  4: {
    card: "py-3 px-2 min-h-[76px]",
    icon: "w-9 h-9 rounded-xl text-[18px]",
    label: "text-[12px] font-semibold",
  },
};

const SubCategoryList = memo(function SubCategoryList({
  data,
  cols = 3,
}: SubCategoryListProps) {
  const { t } = useTranslation();
  useLanguage();

  const size = CARD_SIZE[cols];

  const gapClass = cols === 2 ? "gap-1" : "gap-2 sm:gap-3";

  return (
    <div className={`grid ${COLS_CLASS[cols]} ${gapClass} px-2 sm:px-3 py-2 sm:py-3 max-w-7xl mx-auto`}>
      {data.map((item) => {
        const isExternal = /^https?:\/\//.test(item.href);
        const label = t(item.labelKey, { defaultValue: item.name });

        return (
          <Link
            key={item.key}
            href={item.href}
            {...(isExternal ? EXTERNAL_PROPS : {})}
            className="group no-underline"
          >
            <div className={`flex flex-col items-center justify-center gap-2 rounded-2xl bg-white ${size.card} w-full active:scale-[0.97]`}>
              <div className={`${size.icon} flex items-center justify-center text-gray-500 group-hover:text-blue-600 transition-all duration-200`}>
                {item.icon}
              </div>
              <p className={`${size.label} text-center leading-tight m-0 text-gray-900 group-hover:text-blue-600 transition-colors duration-200`}>
                {label}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
});

export default SubCategoryList;

"use client";

import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { allCategories } from "@/app/(links)/storeFrontLinks/categories";

const CategoryLinks = memo(function CategoryLinks() {
  const iconBaseClasses =
    "flex items-center justify-center rounded-xl transition-all duration-300";
  const iconSizeClasses = "w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14";

  return (
    <div className="grid grid-cols-4 gap-1.5 px-1 py-2 sm:grid-cols-4 lg:grid-cols-4 max-w-5xl mx-auto">
      {allCategories.map((category) => {
        const isSmartsuuq = category.key === "Smartsuuq";
        const isExternal = /^https?:\/\//.test(category.href);
        return (
          <Link
            key={category.key}
            href={category.href}
            prefetch={false}
            {...(isExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="flex flex-col items-center text-center group p-1.5 rounded-xl border border-gray-50 bg-white hover:border-blue-200 transition-all active:scale-95"
          >
            <div className={`${iconBaseClasses} ${iconSizeClasses}`}>
              {category.logo ? (
                <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                  <Image
                    src={category.logo}
                    alt={category.name ?? "Category"}
                    fill
                    className="object-contain"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="text-2xl text-blue-500 group-hover:text-blue-600 transition-colors">
                  {category.icon}
                </div>
              )}
            </div>
            <div className="flex flex-col pt-1">
              <span
                className={`text-[11px] sm:text-[13px] font-normal leading-tight ${isSmartsuuq ? "text-blue-600" : "text-gray-800"}`}
              >
                {category.so || category.name}
              </span>
              <span className="text-[9px] sm:text-[11px] font-light text-gray-500 leading-tight mt-0.5">
                {category.name}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
});

export default CategoryLinks;

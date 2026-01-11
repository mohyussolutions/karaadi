"use client";

import Link from "next/link";
import Image from "next/image";
import { allCategories } from "@/app/(links)/dashboardLinks/categories";

export default function CategoryLinks() {
  const iconBaseClasses =
    "flex items-center justify-center rounded-xl transition-colors duration-300";
  const iconSizeClasses = "w-16 h-16 sm:w-16 sm:h-16 lg:w-20 lg:h-20";
  const linkHoverClasses = "border border-transparent";

  return (
    <div className="grid grid-cols-3 gap-2 px-4 py-6 sm:grid-cols-4 lg:grid-cols-4">
      {allCategories.map((category) => {
        const isExternal = category.href.startsWith("http");

        const linkClasses = `flex flex-col items-center text-center group space-y-0 p-1 mt-2 rounded-xl ${linkHoverClasses}`;

        const categoryContent = (
          <>
            {category.logo ? (
              <div className={`${iconBaseClasses} ${iconSizeClasses}`}>
                <Image
                  src={category.logo}
                  alt=""
                  width={60}
                  height={60}
                  className="object-contain mt-2"
                />
              </div>
            ) : (
              <div
                className={`${iconBaseClasses} ${iconSizeClasses} text-3xl text-blue-400 group-hover:text-black`}
              >
                {category.icon}
              </div>
            )}

            <span className="text-sm font-medium text-gray-800 leading-snug pt-0">
              {category.so}
            </span>
          </>
        );

        return isExternal ? (
          <Link
            prefetch={false}
            key={category.name}
            href={category.href}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClasses}
          >
            {categoryContent}
          </Link>
        ) : (
          <Link
            prefetch={false}
            key={category.name}
            href={category.href}
            className={linkClasses}
          >
            {categoryContent}
          </Link>
        );
      })}
    </div>
  );
}

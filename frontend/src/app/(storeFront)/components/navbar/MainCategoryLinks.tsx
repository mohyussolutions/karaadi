import Link from "next/link";
import Image from "next/image";
import { allCategories } from "@/app/(links)/storeFrontLinks/categories";

export default function CategoryLinks() {
  const iconBaseClasses =
    "flex items-center justify-center rounded-xl transition-colors duration-300";
  const iconSizeClasses = "w-16 h-16 sm:w-16 sm:h-16 lg:w-20 lg:h-20";

  return (
    <div className="grid grid-cols-3 gap-2 px-4 py-6 sm:grid-cols-4 lg:grid-cols-4">
      {allCategories.map((category) => {
        const isExternal = category.href.startsWith("http");

        return (
          <Link
            key={category.key}
            href={category.href}
            prefetch={false}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="flex flex-col items-center text-center group space-y-0 p-1 mt-2 rounded-xl border border-transparent"
          >
            <div className={`${iconBaseClasses} ${iconSizeClasses}`}>
              {category.logo ? (
                <Image
                  src={category.logo}
                  alt={category.name}
                  width={60}
                  height={60}
                  className="object-contain"
                  priority
                />
              ) : (
                <div className="text-3xl text-blue-400 group-hover:text-black transition-colors">
                  {category.icon}
                </div>
              )}
            </div>

            <span className="text-sm font-medium text-gray-800 leading-snug pt-1">
              {category.so}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

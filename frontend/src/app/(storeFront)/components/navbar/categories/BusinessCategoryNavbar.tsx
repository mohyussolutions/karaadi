"use client";

import { useRef } from "react";
import {
  FaHome,
  FaCar,
  FaMotorcycle,
  FaShip,
  FaTractor,
  FaStore,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

export type CategoryKey =
  | "realestate"
  | "motor"
  | "motorcycles"
  | "boats"
  | "farmequipment"
  | "marketplace"
  | "schools";

interface CategoryConfig {
  key: CategoryKey;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  border: string;
  activeBorder: string;
  activeBg: string;
}

const AD_CATEGORIES: CategoryConfig[] = [
  {
    key: "realestate",
    icon: FaHome,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    border: "border-gray-200 hover:border-blue-300",
    activeBorder: "border-blue-500",
    activeBg: "bg-blue-50",
  },
  {
    key: "motor",
    icon: FaCar,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    border: "border-gray-200 hover:border-red-300",
    activeBorder: "border-red-500",
    activeBg: "bg-red-50",
  },
  {
    key: "motorcycles",
    icon: FaMotorcycle,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    border: "border-gray-200 hover:border-orange-300",
    activeBorder: "border-orange-500",
    activeBg: "bg-orange-50",
  },
  {
    key: "boats",
    icon: FaShip,
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
    border: "border-gray-200 hover:border-cyan-300",
    activeBorder: "border-cyan-500",
    activeBg: "bg-cyan-50",
  },
  {
    key: "farmequipment",
    icon: FaTractor,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    border: "border-gray-200 hover:border-green-300",
    activeBorder: "border-green-500",
    activeBg: "bg-green-50",
  },
  {
    key: "marketplace",
    icon: FaStore,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    border: "border-gray-200 hover:border-purple-300",
    activeBorder: "border-purple-500",
    activeBg: "bg-purple-50",
  },
  {
    key: "schools",
    icon: FaStore,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    border: "border-gray-200 hover:border-yellow-300",
    activeBorder: "border-yellow-500",
    activeBg: "bg-yellow-50",
  },
];

interface CategoryNavbarProps {
  selectedCategory: CategoryKey | null;
  onSelectCategory: (category: CategoryKey) => void;
}

export function CategoryNavbar({
  selectedCategory,
  onSelectCategory,
}: CategoryNavbarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const newScrollLeft =
        direction === "left"
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-5">
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 rounded-r-lg shadow-md transition-all"
        aria-label="Scroll left"
      >
        <FaChevronLeft className="w-4 h-4 text-gray-600" />
      </button>

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden scroll-smooth"
        style={
          {
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
          } as React.CSSProperties
        }
      >
        {AD_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => onSelectCategory(cat.key)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all flex-shrink-0 ${
                isActive
                  ? `${cat.activeBorder} ${cat.iconColor} bg-gray-50`
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon
                className={`text-base shrink-0 ${isActive ? cat.iconColor : "text-gray-400"}`}
              />
              {cat.key}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 rounded-l-lg shadow-md transition-all"
        aria-label="Scroll right"
      >
        <FaChevronRight className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  );
}

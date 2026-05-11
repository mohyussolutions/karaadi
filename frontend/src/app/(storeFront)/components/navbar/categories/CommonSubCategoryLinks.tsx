"use client";

import React from "react";

interface SubCategory {
  labelKey?: string;
  title?: string;
  icon?: React.ReactNode;
}

interface CommonSubCategoryLinksProps {
  items: SubCategory[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onScroll?: (direction: "left" | "right") => void;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  t: any;
}

export const CommonSubCategoryLinks = ({
  items,
  selectedId,
  onSelect,
  t,
}: CommonSubCategoryLinksProps) => {
  if (!items?.length) return null;

  return (
    <div className="flex overflow-x-auto scrollbar-hide justify-center gap-2 px-3 py-3 sm:flex-wrap sm:justify-center sm:overflow-visible">
      {items.map((item, idx) => {
        const id = item.labelKey ?? String(idx);
        const isActive = selectedId === id;
        const label = t(item.labelKey ?? id, { defaultValue: item.title || id });

        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={`group flex items-center gap-2 rounded-full px-4 py-2.5 font-semibold text-sm whitespace-nowrap transition-all duration-200 active:scale-[0.97] outline-none ${
              isActive
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-gray-900 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            <span
              className={`hidden sm:flex items-center text-[16px] transition-colors duration-200 ${
                isActive ? "text-white" : "text-gray-400 group-hover:text-blue-500"
              }`}
            >
              {item.icon}
            </span>
            <span>{label}</span>
            <span
              className={`hidden sm:flex items-center text-[16px] transition-colors duration-200 ${
                isActive ? "text-white" : "text-gray-400 group-hover:text-blue-500"
              }`}
            >
              {item.icon}
            </span>
          </button>
        );
      })}
    </div>
  );
};

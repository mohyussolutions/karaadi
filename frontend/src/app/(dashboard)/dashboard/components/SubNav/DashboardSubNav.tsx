"use client";

import React from "react";
import { CategoryOption } from "@/app/utils/types/nesSubCategoryTypes";

interface NestedItem {
  key: string;
  name: string;
}

interface DashboardSubNavProps {
  title: string;
  subCategories: CategoryOption[];
  activeKey: string;
  onChange: (key: string) => void;
  nestedMap?: Record<string, NestedItem[]>;
  activeNestedKey?: string;
  onNestedChange?: (key: string) => void;
}

const chip = (active: boolean, purple = false) =>
  `px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${
    active
      ? purple
        ? "bg-purple-600 text-white border-purple-600"
        : "bg-blue-600 text-white border-blue-600"
      : purple
        ? "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-purple-400"
        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400"
  }`;

export default function DashboardSubNav({
  title,
  subCategories,
  activeKey,
  onChange,
  nestedMap,
  activeNestedKey = "",
  onNestedChange,
}: DashboardSubNavProps) {
  const nestedItems = activeKey && nestedMap ? nestedMap[activeKey] : null;
  const activeLabel = subCategories.find((c) => c.key === activeKey)?.name;

  return (
    <div className="mb-4">
      <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-3">{title}</h1>

      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide sm:flex-wrap sm:overflow-visible">
        <button onClick={() => onChange("")} className={chip(activeKey === "")}>
          All
        </button>
        {subCategories.map((cat) => (
          <button key={cat.key} onClick={() => onChange(cat.key)} className={chip(activeKey === cat.key)}>
            {cat.name}
          </button>
        ))}
      </div>

      {nestedItems && nestedItems.length > 0 && onNestedChange && (
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide sm:flex-wrap sm:overflow-visible mt-2 pl-2 border-l-2 border-blue-200 dark:border-blue-800">
          <button onClick={() => onNestedChange("")} className={chip(activeNestedKey === "", true)}>
            All {activeLabel}
          </button>
          {nestedItems.map((sub) => (
            <button key={sub.key} onClick={() => onNestedChange(sub.key)} className={chip(activeNestedKey === sub.key, true)}>
              {sub.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

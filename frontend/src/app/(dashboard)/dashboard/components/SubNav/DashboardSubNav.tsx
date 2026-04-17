"use client";

import React from "react";
import { CategoryOption } from "@/app/utils/types/nesSubCategoryTypes";

interface DashboardSubNavProps {
  title: string;
  subCategories: CategoryOption[];
  activeKey: string;
  onChange: (key: string) => void;
}

export default function DashboardSubNav({
  title,
  subCategories,
  activeKey,
  onChange,
}: DashboardSubNavProps) {
  const chipClass = (active: boolean) =>
    `flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition duration-200 shadow-sm whitespace-nowrap border ${
      active
        ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-blue-400"
    }`;

  return (
    <div className="mb-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-4">
        {title}
      </h1>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onChange("")}
          className={chipClass(activeKey === "")}
        >
          All {title}
        </button>
        {subCategories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => onChange(cat.key)}
            className={chipClass(activeKey === cat.key)}
          >
            {cat.icon}
            <span>{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface Stats {
  users: number;
  visitors: number;
  messages: number;
  ads: number;
  subscriptions: number;
  regions: number;
  cities: number;
}

const COLORS = [
  "from-blue-500 to-blue-700",
  "from-violet-500 to-violet-700",
  "from-emerald-500 to-emerald-700",
  "from-orange-500 to-orange-700",
  "from-pink-500 to-pink-700",
  "from-teal-500 to-teal-700",
  "from-indigo-500 to-indigo-700",
  "from-amber-500 to-amber-700",
];

export const StatsCards = ({ stats }: { stats: Stats }) => {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const items = [
    { label: t("adminTable.totalUsers"),     value: stats.users },
    { label: t("adminTable.totalVisited"),   value: stats.visitors },
    { label: t("adminTable.messages"),       value: stats.messages },
    { label: t("adminTable.advertisements"), value: stats.ads },
    { label: t("adminTable.subscriptions"),  value: stats.subscriptions },
    { label: t("adminTable.regionsTitle"),   value: stats.regions },
    { label: t("adminTable.citiesLinked"),   value: stats.cities },
  ];

  if (!mounted) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {items.map(({ label, value }, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col"
        >
          <div className={`h-1.5 w-full bg-gradient-to-r ${COLORS[i]}`} />
          <div className="flex flex-col gap-1 p-3 sm:p-4">
            <p className="text-[11px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wide leading-tight line-clamp-2">
              {label}
            </p>
            <p className="text-2xl sm:text-3xl font-black text-gray-800 leading-none mt-1">
              {value.toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

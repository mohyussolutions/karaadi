"use client";
import { settingsOptions } from "@/app/(links)/storeFrontLinks/mineLinks";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface Setting {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  colorClass?: string;
}

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full flex justify-center items-center min-h-[60vh] px-2 sm:px-4 md:px-8 py-8">
      <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-6 justify-items-center">
        {settingsOptions.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link key={idx} href={item.href} className="w-full">
              <div className="flex flex-col items-center gap-4 border border-gray-200 rounded-2xl p-5 sm:p-7 md:p-8 shadow-md bg-white transition duration-300 hover:shadow-xl hover:bg-gray-50 hover:scale-[1.03] cursor-pointer w-full h-full">
                <div className={item.colorClass || "text-gray-700"}>
                  <Icon size={48} />
                </div>
                <h3 className="text-xl font-bold text-center">
                  {item.labelKey ? t(item.labelKey, item.title) : item.title}
                </h3>
                <p className="text-sm text-gray-600 text-center line-clamp-3">
                  {item.labelKey
                    ? t(`${item.labelKey}.description`, item.description)
                    : item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Settings;

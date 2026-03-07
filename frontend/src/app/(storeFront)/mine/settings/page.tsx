"use client";
import { settingsOptions } from "@/app/(links)/storeFrontLinks/mineLinks";
import Link from "next/link";
import React, { useState, useEffect } from "react";

interface Setting {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  colorClass?: string;
}

const Settings: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
      {settingsOptions.map((item, idx) => {
        const Icon = item.icon;
        return (
          <Link key={idx} href={item.href}>
            <div className="flex flex-col items-center gap-4 border border-gray-200 rounded-2xl p-8 shadow-md bg-white transition duration-300 hover:shadow-xl hover:bg-gray-50 hover:scale-[1.03] cursor-pointer">
              <div className={item.colorClass || "text-gray-700"}>
                <Icon size={48} />
              </div>
              <h3 className="text-xl font-bold text-center">{item.title}</h3>
              <p className="text-sm text-gray-600 text-center line-clamp-3">
                {item.description}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Settings;

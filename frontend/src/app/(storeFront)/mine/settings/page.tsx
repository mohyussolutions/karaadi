"use client";
export const dynamic = "force-dynamic";

import { settingsOptions } from "@/app/(links)/storeFrontLinks/mineLinks";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";
import PushToggle from "@/app/(storeFront)/components/notifications/PushToggle";

const Settings: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full flex flex-col items-center min-h-[60vh] px-2 sm:px-4 md:px-8 py-6 gap-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
          <p className="font-bold text-gray-900 text-sm">Notifications</p>
        </div>
        <div className="px-5">
          <PushToggle />
        </div>
      </div>

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
                  {item.labelKey ? t(item.labelKey, { defaultValue: item.title }) : item.title}
                </h3>
                <p className="text-sm text-gray-600 text-center line-clamp-3">
                  {item.labelKey
                    ? t(`${item.labelKey}.description`, { defaultValue: item.description })
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

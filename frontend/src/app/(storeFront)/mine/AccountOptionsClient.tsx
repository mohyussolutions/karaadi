"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/app/(storeFront)/components/hooks/useLanguage";
import { accountOptions } from "@/app/(links)/storeFrontLinks/mineLinks";
import type { NormalizedUser } from "@/app/utils/types/user.types";

export default function AccountOptionsClient({
  user,
}: {
  user?: NormalizedUser | null;
}) {
  const { t } = useTranslation();
  const { activeLanguage } = useLanguage();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10" style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 4rem)" }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {accountOptions.map((item, idx) => {
          const Icon = item.icon;
          const isAccount =
            (item.title || "").toLowerCase().includes("account") ||
            !!(
              item.labelKey && item.labelKey.toLowerCase().includes("account")
            );

          const title = item.labelKey
            ? t(item.labelKey, { defaultValue: item.title || item.labelKey })
            : item.title;
          const descKey = item.labelKey
            ? `${item.labelKey}.description`
            : undefined;
          const description = descKey
            ? t(descKey, { defaultValue: item.description || "" })
            : item.description || "";

          const verifyEmailText = t(
            "mine.settings.verifyEmail",
            "Verify Email",
          );

          return (
            <Link key={idx} href={item.href} className="block h-full touch-manipulation select-none">
              <div className="flex items-center gap-4 border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-sm bg-white active:scale-[0.98] active:bg-gray-50 transition-all duration-200 h-full min-h-[72px] sm:min-h-[140px] sm:items-start sm:flex-col sm:gap-3">
                <div className={`${item.colorClass} shrink-0`}>
                  {Icon ? <Icon size={24} /> : null}
                </div>

                <div className="flex-1">
                  <h3 className="text-[15px] font-bold text-gray-900 leading-none mb-1">
                    {title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {description}
                  </p>

                  {!(user?.emailVerified ?? true) && isAccount && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                      </span>
                      <span className="text-[10px] text-amber-600 font-black uppercase tracking-wider">
                        {verifyEmailText}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

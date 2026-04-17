"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function WantSell() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [checking, setChecking] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (authLoading || checking) return;

    setChecking(true);

    if (user) {
      router.push("/new-ad");
    } else {
      router.push("/login");
    }

    setChecking(false);
  };

  const isProcessing = authLoading || checking;

  return (
    <button
      onClick={handleClick}
      disabled={isProcessing}
      className="flex items-center justify-between w-full px-5 py-3 bg-blue-600 text-white rounded-xl font-bold uppercase text-sm transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-80 disabled:cursor-not-allowed shadow-md"
    >
      <div className="flex items-center gap-2">
        {isProcessing ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
        )}
        <span suppressHydrationWarning>
          {isProcessing
            ? t("common.loading", "Loading...")
            : t("wantSell.title", "Want to Sell?")}
        </span>
      </div>

      {!isProcessing && (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M9 5l7 7-7 7"
          />
        </svg>
      )}
    </button>
  );
}

"use client";

import React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import type { AdItem } from "./types";
import { PLACEHOLDER_IMAGE } from "@/actions/constant/constant";

interface AdCardProps {
  ad: AdItem;
  onEdit: (ad: AdItem) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, current: boolean) => void;
  loading: boolean;
}

export default function AdCard({
  ad,
  onEdit,
  onDelete,
  onToggle,
  loading,
}: AdCardProps) {
  const { t } = useTranslation();
  const isSidebar = ad.position === "sidebar";

  return (
    <div
      className={`rounded-xl border p-4 flex gap-4 items-start ${isSidebar ? "border-indigo-100 bg-indigo-50/30" : "border-emerald-100 bg-emerald-50/30"}`}
    >
      {ad.imageUrl && (
        <div className="relative shrink-0 w-20 h-14 rounded-lg overflow-hidden border bg-gray-100">
          <Image
            src={
              /^https?:\/\//.test(ad.imageUrl) ? ad.imageUrl : PLACEHOLDER_IMAGE
            }
            alt={ad.title}
            fill
            className="object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span
            className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${isSidebar ? "bg-indigo-100 text-indigo-700" : "bg-emerald-100 text-emerald-700"}`}
          >
            {ad.position}
          </span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full ${ad.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
          >
            {ad.isActive ? t("adminTable.active") : t("adminTable.inactive")}
          </span>
          <span className="font-semibold text-sm text-gray-800 truncate">
            {ad.title}
          </span>
          <span className="text-xs text-gray-400">P:{ad.priority}</span>
        </div>
        <p className="text-xs text-gray-500 line-clamp-1 mb-1">
          {ad.description}
        </p>
        <div className="text-xs text-gray-400 flex gap-3 flex-wrap">
          <a
            href={ad.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline truncate max-w-[160px]"
          >
            {ad.link}
          </a>
          <span>
            {ad.clicks ?? 0} clicks · {ad.views ?? 0} views
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 shrink-0">
        <button
          onClick={() => onEdit(ad)}
          disabled={loading}
          className="text-xs px-3 py-1 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50"
        >
          {t("adminTable.edit")}
        </button>
        <button
          onClick={() => onToggle(ad.id, ad.isActive)}
          disabled={loading}
          className={`text-xs px-3 py-1 border rounded-lg ${ad.isActive ? "border-yellow-200 text-yellow-600 hover:bg-yellow-50" : "border-green-200 text-green-600 hover:bg-green-50"}`}
        >
          {ad.isActive ? t("adminTable.pause") : t("adminTable.activate")}
        </button>
        <button
          onClick={() => onDelete(ad.id)}
          disabled={loading}
          className="text-xs px-3 py-1 border border-red-200 text-red-500 rounded-lg hover:bg-red-50"
        >
          {t("adminTable.delete")}
        </button>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import {
  FaTrashAlt,
  FaEdit,
  FaCheckCircle,
  FaTimesCircle,
} from "@/app/utils/icons/dashboardIcons";
import type { AdminMarketplaceItem } from "@/app/utils/types/marketplace.types";
import {
  marketplaceSubCategories,
  categories,
} from "@/app/(links)/storeFrontLinks/mainCategotyCategorySubCategory";
import { PLACEHOLDER_IMAGE, CATEGORY_ENDPOINTS } from "@/actions/constant/constant";
import DashboardSubNav from "../../components/SubNav/DashboardSubNav";

const ALL_NESTED_ENTRIES = Object.values(categories.marketplaceNestedMap).flat();

function resolveCatName(raw: string): string {
  if (!raw) return "";
  const hit =
    marketplaceSubCategories.find((s) => s.key === raw || s.labelKey === raw || s.name === raw) ||
    ALL_NESTED_ENTRIES.find((n) => n.key === raw || n.labelKey === raw || n.name === raw);
  return hit?.name ?? raw.split(".").pop() ?? raw;
}

function resolveSubcatName(raw: string): string {
  if (!raw) return "";
  const hit = ALL_NESTED_ENTRIES.find((n) => n.key === raw || n.labelKey === raw || n.name === raw);
  return hit?.name ?? raw.split(".").pop() ?? raw;
}

export default function MarketplacePage() {
  const { t } = useTranslation();
  const [items, setItems] = useState<AdminMarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSubKey, setActiveSubKey] = useState("");
  const [activeNestedKey, setActiveNestedKey] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(CATEGORY_ENDPOINTS.MARKETPLACE_ADMIN, {
          credentials: "include",
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`${res.status}`);
        const data = await res.json();
        if (!cancelled) setItems(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setError("Failed to load marketplace items");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleDeleteItem = useCallback(async (item: AdminMarketplaceItem) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    const itemId = String(item.id);
    const res = await fetch(CATEGORY_ENDPOINTS.DELETE_ITEM(itemId), {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) setItems((prev) => prev.filter((i) => String(i.id) !== itemId));
  }, []);

  const handleTogglePaidStatus = useCallback(async (item: AdminMarketplaceItem) => {
    const newStatus = !item.isPaid;
    const itemId = String(item.id);
    const res = await fetch(CATEGORY_ENDPOINTS.UPDATE_ITEM(itemId), {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPaid: newStatus }),
    });
    if (res.ok)
      setItems((prev) =>
        prev.map((i) => (String(i.id) === itemId ? { ...i, isPaid: newStatus } : i))
      );
  }, []);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.style.display = "none";
  }, []);

  const filtered = useMemo(() => {
    if (!activeSubKey) return items;
    const match = marketplaceSubCategories.find((s) => s.key === activeSubKey);
    if (!match) return items;
    const catName = match.name.toLowerCase();

    let result = items.filter((i) => {
      const cat = (
        (Array.isArray(i.category) ? i.category.join(" ") : i.category) ||
        (i as any).mainCategory || ""
      ).toLowerCase();
      return cat.includes(catName) || cat.includes(activeSubKey.toLowerCase());
    });

    if (activeNestedKey) {
      const nestedList = categories.marketplaceNestedMap[activeSubKey as keyof typeof categories.marketplaceNestedMap];
      const nestedMatch = nestedList?.find((n) => n.key === activeNestedKey);
      if (nestedMatch) {
        const subName = nestedMatch.name.toLowerCase();
        result = result.filter((i) => {
          const sub = (
            (Array.isArray(i.subcategory) ? i.subcategory.join(" ") : i.subcategory) || ""
          ).toLowerCase();
          return sub.includes(subName) || sub.includes(activeNestedKey.toLowerCase());
        });
      }
    }

    return result;
  }, [items, activeSubKey, activeNestedKey]);

  if (error && items.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 py-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-4 rounded-xl">
          <p className="font-bold">{t("adminTable.error")}</p>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition"
          >
            {t("adminTable.tryAgain")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        <DashboardSubNav
          title={t("adminTable.marketplace")}
          subCategories={marketplaceSubCategories}
          activeKey={activeSubKey}
          onChange={(key) => { setActiveSubKey(key); setActiveNestedKey(""); }}
          nestedMap={categories.marketplaceNestedMap}
          activeNestedKey={activeNestedKey}
          onNestedChange={setActiveNestedKey}
        />

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 rounded-xl px-4 py-2 shadow-sm flex items-center gap-2">
            <span className="text-gray-500 text-xs font-medium">{t("adminTable.total")}:</span>
            {loading ? (
              <span className="w-12 h-4 bg-gray-100 rounded animate-pulse inline-block" />
            ) : (
              <span className="text-lg font-bold text-green-600">{items.length.toLocaleString()}</span>
            )}
          </div>
          {!loading && filtered.length !== items.length && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 rounded-xl px-4 py-2 shadow-sm flex items-center gap-2">
              <span className="text-gray-500 text-xs font-medium">{t("adminTable.showing")}:</span>
              <span className="text-lg font-bold text-blue-600">{filtered.length.toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className="block lg:hidden space-y-3">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 rounded-xl p-3 animate-pulse h-28" />
              ))
            : filtered.length > 0
              ? filtered.map((item, idx) => (
                  <div key={`m-${item.id}-${idx}`} className="bg-white dark:bg-gray-800 border border-gray-200 rounded-xl p-3 shadow-sm">
                    <div className="flex gap-3">
                      <Image
                        src={item.images?.[0] || PLACEHOLDER_IMAGE}
                        alt={item.title || "image"}
                        width={72}
                        height={72}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        onError={handleImageError}
                        unoptimized
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm truncate">{item.title}</h3>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {item.mainCategory && (
                            <span className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">{item.mainCategory}</span>
                          )}
                          {(Array.isArray(item.category) ? item.category : [item.category]).filter(Boolean).map((c, i) => (
                            <span key={i} className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full font-medium">{resolveCatName(c)}</span>
                          ))}
                          {(Array.isArray(item.subcategory) ? item.subcategory : [item.subcategory]).filter(Boolean).map((s, i) => (
                            <span key={i} className="text-xs bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded-full font-medium">{resolveSubcatName(s)}</span>
                          ))}
                        </div>
                        <p className="text-base font-bold text-blue-600 mt-1">${item.price}</p>
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="text-gray-400">{t("adminTable.city")}</span>
                        <p className="font-medium truncate">{item.city}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="text-gray-400">{t("adminTable.status")}</span>
                        <p className={`font-medium ${item.isPaid ? "text-green-600" : "text-red-600"}`}>
                          {item.isPaid ? t("adminTable.paid") : t("adminTable.unpaid")}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 bg-gray-50 p-2 rounded-lg text-xs">
                      <p className="text-gray-400 mb-0.5">{t("adminTable.seller")}</p>
                      <p className="font-medium truncate">{item.user?.username || "N/A"}</p>
                      <p className="text-gray-500 truncate">{item.user?.email}</p>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleTogglePaidStatus(item)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition ${
                          item.isPaid ? "bg-yellow-500 text-white hover:bg-yellow-600" : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                      >
                        {item.isPaid ? <FaTimesCircle size={11} /> : <FaCheckCircle size={11} />}
                        {item.isPaid ? t("adminTable.markUnpaid") : t("adminTable.markPaid")}
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item)}
                        className="flex-1 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1 hover:bg-red-600 transition"
                      >
                        <FaTrashAlt size={11} />
                        {t("adminTable.delete")}
                      </button>
                    </div>
                  </div>
                ))
              : (
                <div className="text-center py-10 text-gray-500 border border-dashed rounded-lg">
                  {t("adminTable.noItems")}
                </div>
              )}
        </div>

        <div className="hidden lg:block w-full rounded-xl border border-gray-200 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
          <table className="w-full table-fixed min-w-[700px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="border-b p-3 text-xs font-semibold text-left w-[8%]">{t("adminTable.image")}</th>
                <th className="border-b p-3 text-xs font-semibold text-left w-[16%]">{t("adminTable.title")}</th>
                <th className="border-b p-3 text-xs font-semibold text-left w-[18%]">{t("adminTable.category")}</th>
                <th className="border-b p-3 text-xs font-semibold text-left w-[8%]">{t("adminTable.price")}</th>
                <th className="border-b p-3 text-xs font-semibold text-left w-[8%]">{t("adminTable.city")}</th>
                <th className="border-b p-3 text-xs font-semibold text-left w-[18%]">{t("adminTable.seller")}</th>
                <th className="border-b p-3 text-xs font-semibold text-left w-[8%]">{t("adminTable.paid")}</th>
                <th className="border-b p-3 text-xs font-semibold text-left w-[12%]">{t("adminTable.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} className="border-b p-3">
                          <div className="h-4 bg-gray-100 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : filtered.length > 0
                  ? filtered.map((item, idx) => (
                      <tr key={`d-${item.id}-${idx}`} className="hover:bg-gray-50 transition">
                        <td className="border-b p-3">
                          <Image
                            src={item.images?.[0] || PLACEHOLDER_IMAGE}
                            alt={item.title || "image"}
                            width={44}
                            height={44}
                            className="w-11 h-11 object-cover rounded-lg"
                            onError={handleImageError}
                            unoptimized
                          />
                        </td>
                        <td className="border-b p-3">
                          <span className="text-sm font-medium block truncate" title={item.title}>{item.title}</span>
                        </td>
                        <td className="border-b p-3">
                          <div className="flex flex-wrap gap-1">
                            {item.mainCategory && (
                              <span className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap">{item.mainCategory}</span>
                            )}
                            {(Array.isArray(item.category) ? item.category : [item.category]).filter(Boolean).map((c, i) => (
                              <span key={i} className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap">{resolveCatName(c)}</span>
                            ))}
                            {(Array.isArray(item.subcategory) ? item.subcategory : [item.subcategory]).filter(Boolean).map((s, i) => (
                              <span key={i} className="text-xs bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap">{resolveSubcatName(s)}</span>
                            ))}
                          </div>
                        </td>
                        <td className="border-b p-3">
                          <span className="text-sm font-semibold">${item.price}</span>
                        </td>
                        <td className="border-b p-3">
                          <span className="text-xs block truncate" title={item.city}>{item.city}</span>
                        </td>
                        <td className="border-b p-3">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Image
                              src={item.user?.profileImage || PLACEHOLDER_IMAGE}
                              alt={item.user?.username || "User"}
                              width={24}
                              height={24}
                              className="w-6 h-6 rounded-full object-cover border flex-shrink-0"
                              onError={handleImageError}
                              unoptimized
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-semibold truncate">{item.user?.username}</p>
                              <p className="text-xs text-gray-500 truncate">{item.user?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="border-b p-3">
                          {item.isPaid ? (
                            <span className="text-green-600 font-semibold flex items-center gap-1 text-xs">
                              <FaCheckCircle size={10} /> {t("adminTable.paid")}
                            </span>
                          ) : (
                            <span className="text-red-600 font-semibold flex items-center gap-1 text-xs">
                              <FaTimesCircle size={10} /> {t("adminTable.unpaid")}
                            </span>
                          )}
                        </td>
                        <td className="border-b p-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleTogglePaidStatus(item)}
                              className={`p-1.5 rounded text-white transition ${item.isPaid ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-600 hover:bg-green-700"}`}
                              title={item.isPaid ? t("adminTable.markUnpaid") : t("adminTable.markPaid")}
                            >
                              {item.isPaid ? <FaTimesCircle size={11} /> : <FaCheckCircle size={11} />}
                            </button>
                            <button className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition" title={t("adminTable.edit")}>
                              <FaEdit size={11} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item)}
                              className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition"
                              title={t("adminTable.delete")}
                            >
                              <FaTrashAlt size={11} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  : (
                    <tr>
                      <td colSpan={8} className="text-center py-10 text-gray-500 text-sm">
                        {t("adminTable.noItems")}
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

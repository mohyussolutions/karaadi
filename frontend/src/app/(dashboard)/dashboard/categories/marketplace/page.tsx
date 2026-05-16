"use client";
import { getPlan, getExpiry } from "../../planUtils";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import {
  FaTrashAlt,
  FaEdit,
  FaCheckCircle,
  FaTimesCircle,
} from "@/app/utils/icons/dashboardIcons";
import {
  marketplaceSubCategories,
  categories,
} from "@/app/(links)/storeFrontLinks/mainCategotyCategorySubCategory";
import { PLACEHOLDER_IMAGE, normalizeImg } from "@/actions/constant/constant";
import DashboardSubNav from "../../components/SubNav/DashboardSubNav";
import {
  getAdminMarketplaceItems,
  deleteAdminMarketplaceItem,
  updateAdminMarketplaceItemPaidStatus,
} from "@/actions/categories/marketplaceActions";
import Pagination from "@/app/(dashboard)/dashboard/components/Pagination";

const PAGE_SIZE = 20;

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
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSubKey, setActiveSubKey] = useState("");
  const [activeNestedKey, setActiveNestedKey] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminMarketplaceItems();
      setItems(data);
    } catch {
      setError("Failed to load marketplace items");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleTogglePaid = async (id: string, currentStatus: boolean) => {
    const original = [...items];
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, isPaid: !currentStatus } : i)));
    const ok = await updateAdminMarketplaceItemPaidStatus(id, !currentStatus);
    if (!ok) {
      setItems(original);
      alert("Failed to update payment status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    const original = [...items];
    setItems((prev) => prev.filter((i) => i.id !== id));
    const ok = await deleteAdminMarketplaceItem(id);
    if (!ok) {
      setItems(original);
      alert("Failed to delete item");
    }
  };

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
        i.mainCategory || ""
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

  const visible = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);

  if (error && items.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 py-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-4 rounded-xl">
          <p className="font-bold">{t("adminTable.error")}</p>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={loadData}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition"
          >
            {t("adminTable.tryAgain")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        <DashboardSubNav
          title={t("adminTable.marketplace")}
          subCategories={marketplaceSubCategories}
          activeKey={activeSubKey}
          onChange={(key) => { setActiveSubKey(key); setActiveNestedKey(""); setVisibleCount(PAGE_SIZE); }}
          nestedMap={categories.marketplaceNestedMap}
          activeNestedKey={activeNestedKey}
          onNestedChange={(key) => { setActiveNestedKey(key); setVisibleCount(PAGE_SIZE); }}
        />

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 rounded-xl px-4 py-2 shadow-sm flex items-center gap-2">
            <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">{t("adminTable.total")}:</span>
            {loading ? (
              <span className="w-12 h-4 bg-gray-100 rounded animate-pulse inline-block" />
            ) : (
              <span className="text-lg font-bold text-green-600">{items.length.toLocaleString()}</span>
            )}
          </div>
          {!loading && filtered.length !== items.length && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 rounded-xl px-4 py-2 shadow-sm flex items-center gap-2">
              <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">{t("adminTable.showing")}:</span>
              <span className="text-lg font-bold text-blue-600">{filtered.length.toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className="block lg:hidden space-y-3">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 rounded-xl p-3 animate-pulse h-28" />
              ))
            : visible.length > 0
              ? visible.map((item) => (
                  <div key={item.id} className="bg-white dark:bg-gray-800 border border-gray-200 rounded-xl p-3 shadow-sm">
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
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate">{item.title}</h3>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {(Array.isArray(item.category) ? item.category : [item.category]).filter(Boolean).map((c: string, i: number) => (
                            <span key={i} className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full font-medium">{resolveCatName(c)}</span>
                          ))}
                          {(Array.isArray(item.subcategory) ? item.subcategory : [item.subcategory]).filter(Boolean).map((s: string, i: number) => (
                            <span key={i} className="text-xs bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded-full font-medium">{resolveSubcatName(s)}</span>
                          ))}
                        </div>
                        <p className="text-base font-bold text-blue-600 mt-1">${item.price}</p>
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                        <span className="text-gray-400 dark:text-gray-500">{t("adminTable.city")}</span>
                        <p className="font-medium truncate">{item.city}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                        <span className="text-gray-400 dark:text-gray-500">{t("adminTable.status")}</span>
                        <p className={`font-medium ${item.isPaid ? "text-green-600" : "text-red-600"}`}>
                          {item.isPaid ? t("adminTable.paid") : t("adminTable.unpaid")}
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                        <span className="text-gray-400 dark:text-gray-500">Plan</span>
                        <p className="font-medium text-blue-700">{getPlan(item)}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded col-span-2">
                        <span className="text-gray-400 dark:text-gray-500">Expires</span>
                        {(() => { const e = getExpiry(item); return (
                          <p className={`font-medium ${e.expired ? "text-red-600" : "text-gray-700"}`}>{e.label}</p>
                        ); })()}
                      </div>
                    </div>
                    <div className="mt-2 bg-gray-50 p-2 rounded-lg text-xs">
                      <p className="text-gray-400 dark:text-gray-500 mb-0.5">{t("adminTable.seller")}</p>
                      <p className="font-medium truncate">{item.user?.username || "N/A"}</p>
                      <p className="text-gray-500 dark:text-gray-400 truncate">{item.user?.email}</p>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleTogglePaid(item.id, item.isPaid)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition ${
                          item.isPaid ? "bg-yellow-500 text-white hover:bg-yellow-600" : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                      >
                        {item.isPaid ? <FaTimesCircle size={11} /> : <FaCheckCircle size={11} />}
                        {item.isPaid ? t("adminTable.markUnpaid") : t("adminTable.markPaid")}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="flex-1 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1 hover:bg-red-600 transition"
                      >
                        <FaTrashAlt size={11} />
                        {t("adminTable.delete")}
                      </button>
                    </div>
                  </div>
                ))
              : (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400 border border-dashed dark:border-gray-700 rounded-lg">
                  {t("adminTable.noItems")}
                </div>
              )}
        </div>

        <div className="hidden lg:block w-full rounded-xl border border-gray-200 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
          <table className="w-full table-fixed min-w-[700px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="border-b p-3 text-xs font-semibold text-left w-[7%]">{t("adminTable.image")}</th>
                <th className="border-b p-3 text-xs font-semibold text-left w-[14%]">{t("adminTable.title")}</th>
                <th className="border-b p-3 text-xs font-semibold text-left w-[14%]">{t("adminTable.category")}</th>
                <th className="border-b p-3 text-xs font-semibold text-left w-[7%]">{t("adminTable.price")}</th>
                <th className="border-b p-3 text-xs font-semibold text-left w-[8%]">{t("adminTable.city")}</th>
                <th className="border-b p-3 text-xs font-semibold text-left w-[14%]">{t("adminTable.seller")}</th>
                <th className="border-b p-3 text-xs font-semibold text-left w-[7%]">{t("adminTable.paid")}</th>
                <th className="border-b p-3 text-xs font-semibold text-left w-[10%]">Plan</th>
                <th className="border-b p-3 text-xs font-semibold text-left w-[10%]">Expires</th>
                <th className="border-b p-3 text-xs font-semibold text-left w-[9%]">{t("adminTable.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 10 }).map((_, j) => (
                        <td key={j} className="border-b p-3">
                          <div className="h-4 bg-gray-100 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : visible.length > 0
                  ? visible.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
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
                            {(Array.isArray(item.category) ? item.category : [item.category]).filter(Boolean).map((c: string, i: number) => (
                              <span key={i} className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap">{resolveCatName(c)}</span>
                            ))}
                            {(Array.isArray(item.subcategory) ? item.subcategory : [item.subcategory]).filter(Boolean).map((s: string, i: number) => (
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
                              src={normalizeImg(item.user?.profileImage)}
                              alt={item.user?.username || "User"}
                              width={24}
                              height={24}
                              className="w-6 h-6 rounded-full object-cover border flex-shrink-0"
                              onError={handleImageError}
                              unoptimized
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-semibold truncate">{item.user?.username}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.user?.email}</p>
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
                          <span className="text-xs font-medium text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                            {getPlan(item)}
                          </span>
                        </td>
                        <td className="border-b p-3">
                          {(() => { const e = getExpiry(item); return (
                            <span className={`text-xs font-medium whitespace-nowrap ${e.expired ? "text-red-600" : "text-gray-700"}`}>
                              {e.label}
                            </span>
                          ); })()}
                        </td>
                        <td className="border-b p-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleTogglePaid(item.id, item.isPaid)}
                              className={`p-1.5 rounded text-white transition ${item.isPaid ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-600 hover:bg-green-700"}`}
                              title={item.isPaid ? t("adminTable.markUnpaid") : t("adminTable.markPaid")}
                            >
                              {item.isPaid ? <FaTimesCircle size={11} /> : <FaCheckCircle size={11} />}
                            </button>
                            <button className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition" title={t("adminTable.edit")}>
                              <FaEdit size={11} />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
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
                      <td colSpan={8} className="text-center py-10 text-gray-500 dark:text-gray-400 text-sm">
                        {t("adminTable.noItems")}
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>
        </div>

        {filtered.length > visibleCount && (
          <Pagination
            hasMore={filtered.length > visibleCount}
            onSeeMore={() => setVisibleCount((p) => p + PAGE_SIZE)}
          />
        )}
      </div>
    </div>
  );
}

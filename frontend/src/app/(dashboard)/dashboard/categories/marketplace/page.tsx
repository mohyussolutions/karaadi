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
import {
  getAdminMarketplaceItems,
  deleteAdminMarketplaceItem,
  updateAdminMarketplaceItemPaidStatus,
  getTotalMarketplaceItemsCount,
} from "@/actions/categories/marketplaceActions";
import type { AdminMarketplaceItem } from "@/app/utils/types/marketplace.types";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import { marketplaceSubCategories } from "@/app/(links)/storeFrontLinks/subCategories";
import { PLACEHOLDER_IMAGE } from "@/actions/constant/constant";
import Pagination from "../../components/Pagination";
import DashboardSubNav from "../../components/SubNav/DashboardSubNav";

const PAGE_SIZE = 20;

export default function MarketplacePage() {
  const { t } = useTranslation();
  const [items, setItems] = useState<AdminMarketplaceItem[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [activeSubKey, setActiveSubKey] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);
      try {
        const [raw, count] = await Promise.all([
          getAdminMarketplaceItems(undefined, page, PAGE_SIZE),
          page === 1 ? getTotalMarketplaceItemsCount() : Promise.resolve(null),
        ]);
        const data = Array.isArray(raw) ? raw : [];
        setItems((prev) => (page === 1 ? data : [...prev, ...data]));
        if (count !== null) setTotal(Number(count));
      } catch {
        setError("Failed to load marketplace items");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };
    fetchData();
  }, [page]);

  const handleDeleteItem = useCallback(async (item: AdminMarketplaceItem) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    const itemId = String(item.id);
    if (!itemId) return;
    const success = await deleteAdminMarketplaceItem(itemId);
    if (success) setItems((prev) => prev.filter((i) => String(i.id) !== itemId));
  }, []);

  const handleTogglePaidStatus = useCallback(async (item: AdminMarketplaceItem) => {
    const newStatus = !item.isPaid;
    const itemId = String(item.id);
    if (!itemId) return;
    const success = await updateAdminMarketplaceItemPaidStatus(itemId, newStatus);
    if (success)
      setItems((prev) =>
        prev.map((i) => (String(i.id) === itemId ? { ...i, isPaid: newStatus } : i)),
      );
  }, []);

  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      e.currentTarget.onerror = null;
      e.currentTarget.style.display = "none";
    },
    [],
  );

  const filtered = useMemo(() => {
    if (!activeSubKey) return items;
    const match = marketplaceSubCategories.find((s) => s.key === activeSubKey);
    if (!match) return items;
    const name = match.name.toLowerCase();
    return items.filter((i) => {
      const cat = (
        (Array.isArray(i.category) ? i.category.join(" ") : i.category) ||
        (i as any).mainCategory ||
        ""
      ).toLowerCase();
      return cat.includes(name) || cat.includes(activeSubKey.toLowerCase());
    });
  }, [items, activeSubKey]);

  const hasMore = items.length % PAGE_SIZE === 0 && items.length !== 0;

  if (error && items.length === 0) {
    return (
      <div className="w-full min-h-screen bg-gray-50 overflow-x-hidden">
        <div className="w-full px-4 sm:px-6 py-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-4 rounded-xl">
            <p className="font-bold text-base sm:text-lg">{t("adminTable.error")}</p>
            <p className="text-sm mt-1">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition w-full sm:w-auto"
            >
              {t("adminTable.tryAgain")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-6">

        <DashboardSubNav
          title={t("adminTable.marketplace")}
          subCategories={marketplaceSubCategories}
          activeKey={activeSubKey}
          onChange={setActiveSubKey}
        />

        <div className="flex flex-wrap items-center gap-2 mt-3 mb-3">
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm flex items-center gap-2">
            <span className="text-gray-500 text-xs font-medium">{t("adminTable.total")}:</span>
            {total === null ? (
              <span className="w-12 h-4 bg-gray-100 rounded animate-pulse inline-block" />
            ) : (
              <span className="text-lg font-bold text-green-600">{total.toLocaleString()}</span>
            )}
          </div>
          {items.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm flex items-center gap-2">
              <span className="text-gray-500 text-xs font-medium">{t("adminTable.showing")}:</span>
              <span className="text-lg font-bold text-blue-600">{items.length.toLocaleString()}</span>
            </div>
          )}
        </div>

        {loading && (
          <div className="text-center py-10">
            <Loading />
          </div>
        )}

        {!loading && (
          <>
            <div className="block lg:hidden space-y-3">
              {filtered.length > 0 ? (
                filtered.map((item, idx) => (
                  <div
                    key={`m-${item.id}-${idx}`}
                    className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm"
                  >
                    <div className="flex gap-3">
                      <Image
                        src={item.images?.[0] || PLACEHOLDER_IMAGE}
                        alt={item.title || "image"}
                        width={72}
                        height={72}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
                        onError={handleImageError}
                        unoptimized
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm truncate">{item.title}</h3>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {item.mainCategory}{item.category ? ` • ${Array.isArray(item.category) ? item.category[0] : item.category}` : ""}
                        </p>
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
                          item.isPaid
                            ? "bg-yellow-500 text-white hover:bg-yellow-600"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                      >
                        {item.isPaid ? <FaTimesCircle size={11} /> : <FaCheckCircle size={11} />}
                        <span className="truncate">{item.isPaid ? t("adminTable.markUnpaid") : t("adminTable.markPaid")}</span>
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item)}
                        className="flex-1 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1 hover:bg-red-600 transition"
                      >
                        <FaTrashAlt size={11} />
                        <span className="truncate">{t("adminTable.delete")}</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-500 border border-dashed rounded-lg">
                  {t("adminTable.noItems")}
                </div>
              )}
            </div>

            <div className="hidden lg:block w-full rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <table className="w-full table-fixed min-w-[700px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border-b p-3 text-xs font-semibold text-left w-[8%]">{t("adminTable.image")}</th>
                    <th className="border-b p-3 text-xs font-semibold text-left w-[16%]">{t("adminTable.title")}</th>
                    <th className="border-b p-3 text-xs font-semibold text-left w-[10%]">{t("adminTable.category")}</th>
                    <th className="border-b p-3 text-xs font-semibold text-left w-[8%]">{t("adminTable.price")}</th>
                    <th className="border-b p-3 text-xs font-semibold text-left w-[8%]">{t("adminTable.city")}</th>
                    <th className="border-b p-3 text-xs font-semibold text-left w-[18%]">{t("adminTable.seller")}</th>
                    <th className="border-b p-3 text-xs font-semibold text-left w-[8%]">{t("adminTable.paid")}</th>
                    <th className="border-b p-3 text-xs font-semibold text-left w-[12%]">{t("adminTable.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? (
                    filtered.map((item, idx) => (
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
                          <span className="text-sm font-medium block truncate" title={item.title}>
                            {item.title}
                          </span>
                          <span className="text-xs text-gray-400 block truncate">
                            {item.mainCategory}
                          </span>
                        </td>
                        <td className="border-b p-3">
                          <span className="text-xs block truncate">
                            {Array.isArray(item.category) ? item.category.join(", ") : item.category}
                          </span>
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
                              className={`p-1.5 rounded text-white transition ${
                                item.isPaid ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-600 hover:bg-green-700"
                              }`}
                              title={item.isPaid ? t("adminTable.markUnpaid") : t("adminTable.markPaid")}
                            >
                              {item.isPaid ? <FaTimesCircle size={11} /> : <FaCheckCircle size={11} />}
                            </button>
                            <button
                              className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                              title={t("adminTable.edit")}
                            >
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
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center py-10 text-gray-500 text-sm">
                        {t("adminTable.noItems")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        <Pagination
          hasMore={hasMore}
          loading={loadingMore}
          onSeeMore={() => setPage((p) => p + 1)}
        />
      </div>
    </div>
  );
}

"use client";
import { getPlan, getExpiry } from "../../planUtils";

import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";

import {
  FaTrashAlt,
  FaCheckCircle,
  FaTimesCircle,
} from "@/app/utils/icons/dashboardIcons";
import {
  deleteRealEstate,
  updatePaidStatus,
  getAllRealEstatesAdmin,
} from "@/actions/categories/realEstateActions";
import { realEstateSubCategories } from "@/app/(links)/storeFrontLinks/mainCategotyCategorySubCategory";
import { PLACEHOLDER_IMAGE } from "@/actions/constant/constant";
import Loading from "@/app/ui/loading/Loading";
import Pagination from "../../components/Pagination";
import DashboardSubNav from "../../components/SubNav/DashboardSubNav";

export default function RealEstateAdminPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);
      try {
        const result = await getAllRealEstatesAdmin(page, PAGE_SIZE);
        setItems((prev) =>
          page === 1 ? result.data : [...prev, ...result.data],
        );
        setError(null);
      } catch {
        setError("Failed to load real estate data");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };
    fetchData();
  }, [page]);

  const handleDeleteItem = async (item: any) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    const itemId = String(item.id);
    if (!itemId) {
      alert("Invalid item: missing ID.");
      return;
    }

    const originalItems = [...items];
    setItems((prev) => prev.filter((i) => String(i.id) !== itemId));

    const result = await deleteRealEstate(itemId);

    if (result.success) {
      alert("Listing deleted successfully");
    } else {
      setItems(originalItems);
      alert(result.message || "Failed to delete listing");
    }
  };

  const handleTogglePaidStatus = async (item: any) => {
    const newStatus = !item.isPaid;
    const itemId = String(item.id);
    if (!itemId) {
      alert("Invalid item: missing ID.");
      return;
    }

    const originalItems = [...items];
    setItems((prev) =>
      prev.map((i) =>
        String(i.id) === itemId ? { ...i, isPaid: newStatus } : i,
      ),
    );

    const result = await updatePaidStatus(itemId, newStatus);

    if (result.success) {
      alert(newStatus ? "Marked as paid" : "Marked as unpaid");
    } else {
      setItems(originalItems);
      alert(result.message || "Failed to update paid status");
    }
  };

  const [activeSubKey, setActiveSubKey] = React.useState("");

  let filtered = items;
  if (activeSubKey) {
    const match = realEstateSubCategories.find((s) => s.key === activeSubKey);
    if (match) {
      const name = match.name.toLowerCase();
      filtered = filtered.filter((i) => {
        const cat = String(i.category ?? "").toLowerCase();
        return cat.includes(name) || cat.includes(activeSubKey.toLowerCase());
      });
    }
  }
  const hasMore = items.length % PAGE_SIZE === 0 && items.length !== 0;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.style.display = "none";
  };

  if (error && items.length === 0 && !loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
        <div className="w-full px-4 sm:px-6 py-6 sm:py-8">
          <div className="w-full max-w-full">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 sm:px-6 py-4 rounded-xl">
              <p className="font-bold text-base sm:text-lg">{t("adminTable.error")}</p>
              <p className="text-sm sm:text-base mt-1">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 sm:mt-4 bg-red-600 text-white px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base hover:bg-red-700 transition w-full sm:w-auto"
              >
                {t("adminTable.tryAgain")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="w-full max-w-full">
          <DashboardSubNav
            title="Real Estate Categories"
            subCategories={realEstateSubCategories}
            activeKey={activeSubKey}
            onChange={setActiveSubKey}
          />

          {loading && (
            <div className="text-center py-10 text-gray-500">
              <Loading />
            </div>
          )}

          {!loading && (
            <div className="mt-6 w-full">
              <div className="block lg:hidden">
                <div className="space-y-4 w-full">
                  {filtered.length > 0 ? (
                    filtered.map((item, idx) => (
                      <div
                        key={`item-${item.id}-${idx}`}
                        className="bg-white dark:bg-gray-800 border border-gray-200 rounded-xl p-4 shadow-sm w-full"
                      >
                        <div className="flex gap-3">
                          <Image
                            src={item.images?.[0] || PLACEHOLDER_IMAGE}
                            alt={item.title || "image"}
                            width={80}
                            height={80}
                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                            onError={handleImageError}
                            unoptimized
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 mb-1 truncate">
                              {item.title}
                            </h3>
                            <p className="text-xs text-gray-500 mb-1 truncate">
                              {item.category} • {item.subCategory || "N/A"}
                            </p>
                            <p className="text-lg font-bold text-blue-600">
                              ${item.price?.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                            <span className="text-gray-500">{t("adminTable.city")}</span>
                            <p className="font-medium truncate">{item.city}</p>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                            <span className="text-gray-500">{t("adminTable.status")}</span>
                            <p
                              className={`font-medium truncate ${item.isPaid ? "text-green-600" : "text-red-600"}`}
                            >
                              {item.isPaid ? t("adminTable.paid") : t("adminTable.unpaid")}
                            </p>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                            <span className="text-gray-500">Plan</span>
                            <p className="font-medium truncate text-blue-700">{getPlan(item)}</p>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                            <span className="text-gray-500">Expires</span>
                            <p className={`font-medium truncate ${getExpiry(item).expired ? "text-red-600" : "text-gray-700"}`}>{getExpiry(item).label}</p>
                          </div>
                        </div>

                        <div className="mt-3 bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">{t("adminTable.seller")}</p>
                          <p className="font-medium text-sm truncate">
                            {item.user?.username || "N/A"}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {item.user?.email}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {item.user?.phone}
                          </p>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => handleTogglePaidStatus(item)}
                            className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1 ${
                              item.isPaid
                                ? "bg-yellow-500 text-white hover:bg-yellow-600"
                                : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                          >
                            {item.isPaid ? (
                              <FaTimesCircle size={12} />
                            ) : (
                              <FaCheckCircle size={12} />
                            )}
                            <span className="truncate">
                              {item.isPaid ? t("adminTable.markUnpaid") : t("adminTable.markPaid")}
                            </span>
                          </button>

                          <button
                            onClick={() => handleDeleteItem(item)}
                            className="flex-1 py-2 px-2 bg-red-500 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1 hover:bg-red-600 transition"
                          >
                            <FaTrashAlt size={12} />
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
              </div>

              <div className="hidden lg:block w-full">
                <div className="border border-gray-300 rounded-xl bg-white dark:bg-gray-800 overflow-hidden">
                  <table className="w-full table-fixed">
                    <thead className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                      <tr>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[10%]">{t("adminTable.image")}</th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[15%]">{t("adminTable.title")}</th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[12%]">{t("adminTable.category")}</th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[12%]">{t("adminTable.subcategory")}</th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[8%]">{t("adminTable.price")}</th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[8%]">{t("adminTable.city")}</th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[15%]">{t("adminTable.seller")}</th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[8%]">{t("adminTable.paid")}</th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[9%]">Plan</th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[10%]">Expires</th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[12%]">{t("adminTable.actions")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length > 0 ? (
                        filtered.map((item, idx) => (
                          <tr
                            key={`item-${item.id}-${idx}`}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          >
                            <td className="border-b p-3">
                              <Image
                                src={item.images?.[0] || PLACEHOLDER_IMAGE}
                                alt={item.title || "image"}
                                width={48}
                                height={48}
                                className="w-12 h-12 object-cover rounded"
                                onError={handleImageError}
                                unoptimized
                              />
                            </td>
                            <td className="border-b p-3">
                              <span
                                className="text-sm font-medium block truncate"
                                title={item.title}
                              >
                                {item.title}
                              </span>
                            </td>
                            <td className="border-b p-3">
                              <span
                                className="text-sm block truncate"
                                title={item.category}
                              >
                                {item.category}
                              </span>
                            </td>
                            <td className="border-b p-3">
                              <span
                                className="text-sm block truncate"
                                title={item.subCategory}
                              >
                                {item.subCategory || "N/A"}
                              </span>
                            </td>
                            <td className="border-b p-3">
                              <span className="text-sm font-semibold">
                                ${item.price?.toLocaleString()}
                              </span>
                            </td>
                            <td className="border-b p-3">
                              <span
                                className="text-sm block truncate"
                                title={item.city}
                              >
                                {item.city}
                              </span>
                            </td>
                            <td className="border-b p-3">
                              <div className="flex flex-col text-xs">
                                <span
                                  className="font-semibold truncate"
                                  title={item.user?.username}
                                >
                                  {item.user?.username}
                                </span>
                                <span
                                  className="text-gray-600 truncate"
                                  title={item.user?.email}
                                >
                                  {item.user?.email}
                                </span>
                                <span
                                  className="text-gray-600 truncate"
                                  title={item.user?.phone}
                                >
                                  {item.user?.phone}
                                </span>
                              </div>
                            </td>
                            <td className="border-b p-3">
                              {item.isPaid ? (
                                <span className="text-green-600 font-semibold flex items-center text-xs">
                                  <FaCheckCircle className="mr-1 flex-shrink-0" size={10} />
                                  {t("adminTable.paid")}
                                </span>
                              ) : (
                                <span className="text-red-600 font-semibold flex items-center text-xs">
                                  <FaTimesCircle className="mr-1 flex-shrink-0" size={10} />
                                  {t("adminTable.unpaid")}
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
                                  onClick={() => handleTogglePaidStatus(item)}
                                  className={`p-1.5 rounded text-white text-xs transition flex items-center justify-center ${
                                    item.isPaid
                                      ? "bg-yellow-500 hover:bg-yellow-600"
                                      : "bg-green-600 hover:bg-green-700"
                                  }`}
                                  title={
                                    item.isPaid
                                      ? "Mark as Unpaid"
                                      : "Mark as Paid"
                                  }
                                >
                                  {item.isPaid ? (
                                    <FaTimesCircle size={12} />
                                  ) : (
                                    <FaCheckCircle size={12} />
                                  )}
                                </button>

                                <button
                                  onClick={() => handleDeleteItem(item)}
                                  className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                  title="Delete"
                                >
                                  <FaTrashAlt size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={11} className="text-center py-10 text-gray-500">
                            {t("adminTable.noItems")}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
        <Pagination
          hasMore={hasMore}
          loading={loadingMore}
          onSeeMore={() => setPage((p) => p + 1)}
        />
      </div>
    </div>
  );
}

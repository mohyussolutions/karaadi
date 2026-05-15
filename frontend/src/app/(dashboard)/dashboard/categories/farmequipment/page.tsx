"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import {
  FaTrashAlt,
  FaEdit,
  FaCheckCircle,
  FaTimesCircle,
} from "@/app/utils/icons/dashboardIcons";
import {
  getAllFarmEquipment,
  updateTraktor,
  deleteTraktor,
} from "@/actions/categories/FarmequipmentAction";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "@/app/ui/loading/Loading";
import { FarmEquipment } from "@/app/utils/types/farmequipment.types";
import { PLACEHOLDER_IMAGE } from "@/actions/constant/constant";
import Pagination from "../../components/Pagination";
import { farmEquipmentSubCategories } from "@/app/(links)/storeFrontLinks/mainCategotyCategorySubCategory";
import DashboardSubNav from "../../components/SubNav/DashboardSubNav";

export default function TraktorsPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState<FarmEquipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getAllFarmEquipment(1, 20);
        setItems(result.data);
        setTotal(result.total);
        setHasMore(result.hasMore);
        setPage(result.page);
      } catch {
        setItems([]);
        setTotal(0);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const result = await getAllFarmEquipment(nextPage, 20);
      setItems((prev) => [...prev, ...result.data]);
      setPage(nextPage);
      setHasMore(result.hasMore);
      setTotal(result.total);
    } catch (error) {
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleTogglePaid = async (item: FarmEquipment) => {
    if (!item._id) return;
    const nextStatus = !item.isPaid;
    const originalItems = [...items];

    setItems((prev) =>
      prev.map((t) => (t._id === item._id ? { ...t, isPaid: nextStatus } : t)),
    );

    const res = await updateTraktor(String(item._id), { isPaid: nextStatus });

    if (!res.success) {
      setItems(originalItems);
      const errorMsg = (res as any).message || "Update failed";
      toast.error(errorMsg);
    } else {
      toast.success(nextStatus ? "Marked as paid" : "Marked as unpaid");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    const originalItems = [...items];
    setItems((prev) => prev.filter((item) => item._id !== id));

    const res = await deleteTraktor(id);

    if (res.success) {
      toast.success("Item deleted successfully");
    } else {
      setItems(originalItems);
      const errorMsg = (res as any).message || "Failed to delete item";
      toast.error(errorMsg);
    }
  };

  const [activeSubKey, setActiveSubKey] = React.useState("");

  const filtered = useMemo(() => {
    let result = items;
    if (activeSubKey) {
      const match = farmEquipmentSubCategories.find(
        (s) => s.key === activeSubKey,
      );
      if (match) {
        const name = match.name.toLowerCase();
        result = result.filter((i) => {
          const cat = (
            (Array.isArray(i.category) ? i.category.join(" ") : i.category) ||
            i.mainCategory ||
            ""
          ).toLowerCase();
          return cat.includes(name) || cat.includes(activeSubKey.toLowerCase());
        });
      }
    }
    return result;
  }, [items, activeSubKey]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.style.display = "none";
  };

  const getPlan = (item: any) =>
    item.isPremium90 ? "Premium 90" : item.isStandard60 ? "Standard 60" : item.isBasic30 ? "Basic 30" : "—";

  const getExpiry = (item: any) => {
    if (!item.expiryDate) return { label: "—", expired: false };
    const d = new Date(item.expiryDate);
    return { label: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }), expired: d < new Date() };
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 overflow-x-hidden">
      <ToastContainer position="bottom-right" />
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="w-full max-w-full">
          <DashboardSubNav
            title="Farm Equipment Categories"
            subCategories={farmEquipmentSubCategories}
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
                    filtered.map((item) => (
                      <div
                        key={item._id}
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
                              {item.mainCategory} •{" "}
                              {Array.isArray(item.category)
                                ? item.category[0]
                                : item.category}
                            </p>
                            <p className="text-lg font-bold text-blue-600">
                              ${item.price?.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="text-gray-500">{t("adminTable.city")}</span>
                            <p className="font-medium truncate">{item.city}</p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="text-gray-500">{t("adminTable.status")}</span>
                            <p
                              className={`font-medium truncate ${item.isPaid ? "text-green-600" : "text-red-600"}`}
                            >
                              {item.isPaid ? t("adminTable.paid") : t("adminTable.unpaid")}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="text-gray-500">Plan</span>
                            <p className="font-medium truncate text-blue-700">{getPlan(item)}</p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
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
                            onClick={() => handleTogglePaid(item)}
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
                            onClick={() => handleDelete(String(item._id))}
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
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[10%]">{t("adminTable.image")}</th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[15%]">{t("adminTable.title")}</th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[12%]">{t("adminTable.mainCategory")}</th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[12%]">{t("adminTable.category")}</th>
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
                        filtered.map((item) => (
                          <tr key={item._id} className="hover:bg-gray-50">
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
                                title={item.mainCategory}
                              >
                                {item.mainCategory}
                              </span>
                            </td>
                            <td className="border-b p-3">
                              <span
                                className="text-sm block truncate"
                                title={
                                  Array.isArray(item.category)
                                    ? item.category.join(", ")
                                    : item.category
                                }
                              >
                                {Array.isArray(item.category)
                                  ? item.category.join(", ")
                                  : item.category}
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
                                  onClick={() => handleTogglePaid(item)}
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
                                  onClick={() => handleDelete(String(item._id))}
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
        {!loading && (
          <Pagination
            hasMore={hasMore}
            loading={loadingMore}
            onSeeMore={handleLoadMore}
          />
        )}
      </div>
    </div>
  );
}

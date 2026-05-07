"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaTrashAlt,
  FaShip,
  FaTools,
  FaUser,
  FaPhoneAlt,
} from "@/app/utils/icons/dashboardIcons";
import { boatSubCategories } from "@/app/(links)/storeFrontLinks/mainCategotyCategorySubCategory";
import DashboardSubNav from "../../components/SubNav/DashboardSubNav";
import {
  getAllBoatsAdminAction,
  toggleBoatPaymentAction,
  deleteBoatAction,
} from "@/actions/categories/boatActions";
import Loading from "@/app/ui/loading/Loading";
import { PLACEHOLDER_IMAGE } from "@/actions/constant/constant";
import Pagination from "@/app/(dashboard)/dashboard/components/Pagination";

const PAGE_SIZE = 20;

export default function BoatPages() {
  const { t } = useTranslation();
  const [boats, setBoats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMainCategory, setActiveMainCategory] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllBoatsAdminAction();
      setBoats(data);
    } catch {
      setError("Failed to load boats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleTogglePaid = async (id: string, currentStatus: boolean) => {
    const originalBoats = [...boats];
    setBoats((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isPaid: !currentStatus } : b)),
    );

    const result = await toggleBoatPaymentAction(id, currentStatus);

    if (!result.success) {
      setBoats(originalBoats);
      alert("Failed to update payment status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this boat?")) return;

    const originalBoats = [...boats];
    setBoats((prev) => prev.filter((b) => b.id !== id));

    const result = await deleteBoatAction(id);

    if (!result.success) {
      setBoats(originalBoats);
      alert("Failed to delete boat");
    }
  };

  const filteredBoats = useMemo(
    () =>
      activeMainCategory
        ? boats.filter((b) => b.category === activeMainCategory)
        : boats,
    [boats, activeMainCategory],
  );

  const visibleBoats = filteredBoats.slice(0, visibleCount);
  const hasMore = filteredBoats.length > visibleCount;

  const handleLoadMore = useCallback(() => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + PAGE_SIZE);
      setLoadingMore(false);
    }, 300);
  }, []);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeMainCategory]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.style.display = "none";
  };

  if (error && boats.length === 0) {
    return (
      <div className="w-full min-h-screen bg-gray-50 overflow-x-hidden">
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
    <div className="w-full min-h-screen overflow-x-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="w-full max-w-full">
          <DashboardSubNav
            title="Boat Categories"
            subCategories={boatSubCategories}
            activeKey={activeMainCategory}
            onChange={setActiveMainCategory}
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
                  {visibleBoats.length > 0 ? (
                    visibleBoats.map((boat, index) => (
                      <div
                        key={`boat-mobile-${boat.id || index}`}
                        className="bg-white dark:bg-gray-800 border border-gray-200 rounded-xl p-4 shadow-sm w-full"
                      >
                        <div className="flex gap-3">
                          <img
                            src={boat.images?.[0] || PLACEHOLDER_IMAGE}
                            alt={boat.title}
                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                            onError={handleImageError}
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 mb-1 truncate">
                              {boat.title}
                            </h3>
                            <p className="text-xs text-gray-500 mb-1 truncate">
                              {boat.category} • {boat.subCategory}
                            </p>
                            <p className="text-lg font-bold text-blue-600">
                              ${boat.price?.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="text-gray-500">{t("adminTable.city")}</span>
                            <p className="font-medium truncate">{boat.city}</p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="text-gray-500">{t("adminTable.status")}</span>
                            <p
                              className={`font-medium truncate ${boat.isPaid ? "text-green-600" : "text-red-600"}`}
                            >
                              {boat.isPaid ? t("adminTable.paid") : t("adminTable.unpaid")}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">{t("adminTable.seller")}</p>
                          <p className="font-medium text-sm truncate">
                            {boat.user?.username || "N/A"}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {boat.user?.email}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {boat.user?.phone}
                          </p>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() =>
                              handleTogglePaid(boat.id, boat.isPaid)
                            }
                            className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1 ${
                              boat.isPaid
                                ? "bg-yellow-500 text-white hover:bg-yellow-600"
                                : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                          >
                            {boat.isPaid ? (
                              <FaTimesCircle size={12} />
                            ) : (
                              <FaCheckCircle size={12} />
                            )}
                            <span className="truncate">
                              {boat.isPaid ? t("adminTable.markUnpaid") : t("adminTable.markPaid")}
                            </span>
                          </button>

                          <button
                            onClick={() => handleDelete(boat.id)}
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
                        <th className="border-b p-3 text-xs font-semibold text-left w-[12%]">{t("adminTable.category")}</th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[12%]">{t("adminTable.subcategory")}</th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[8%]">{t("adminTable.price")}</th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[8%]">{t("adminTable.city")}</th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[15%]">{t("adminTable.seller")}</th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[8%]">{t("adminTable.paid")}</th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[12%]">{t("adminTable.actions")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleBoats.length > 0 ? (
                        visibleBoats.map((boat, index) => (
                          <tr
                            key={`boat-desktop-${boat.id || index}`}
                            className="hover:bg-gray-50"
                          >
                            <td className="border-b p-3">
                              <img
                                src={boat.images?.[0] || PLACEHOLDER_IMAGE}
                                alt={boat.title}
                                className="w-12 h-12 object-cover rounded"
                                onError={handleImageError}
                              />
                            </td>
                            <td className="border-b p-3">
                              <span
                                className="text-sm font-medium block truncate"
                                title={boat.title}
                              >
                                {boat.title}
                              </span>
                            </td>
                            <td className="border-b p-3">
                              <span
                                className="text-sm block truncate"
                                title={boat.category}
                              >
                                {boat.category}
                              </span>
                            </td>
                            <td className="border-b p-3">
                              <span
                                className="text-sm block truncate"
                                title={boat.subCategory}
                              >
                                {boat.subCategory}
                              </span>
                            </td>
                            <td className="border-b p-3">
                              <span className="text-sm font-semibold">
                                ${boat.price?.toLocaleString()}
                              </span>
                            </td>
                            <td className="border-b p-3">
                              <span
                                className="text-sm block truncate"
                                title={boat.city}
                              >
                                {boat.city}
                              </span>
                            </td>
                            <td className="border-b p-3">
                              <div className="flex flex-col text-xs">
                                <span
                                  className="font-semibold truncate"
                                  title={boat.user?.username}
                                >
                                  <FaUser
                                    className="inline mr-1 text-gray-400"
                                    size={10}
                                  />
                                  {boat.user?.username || "N/A"}
                                </span>
                                <span
                                  className="text-gray-600 truncate"
                                  title={boat.user?.email}
                                >
                                  {boat.user?.email}
                                </span>
                                <span
                                  className="text-gray-600 truncate"
                                  title={boat.user?.phone}
                                >
                                  <FaPhoneAlt
                                    className="inline mr-1 text-gray-400"
                                    size={8}
                                  />
                                  {boat.user?.phone || "N/A"}
                                </span>
                              </div>
                            </td>
                            <td className="border-b p-3">
                              {boat.isPaid ? (
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
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() =>
                                    handleTogglePaid(boat.id, boat.isPaid)
                                  }
                                  className={`p-1.5 rounded text-white text-xs transition flex items-center justify-center ${
                                    boat.isPaid
                                      ? "bg-yellow-500 hover:bg-yellow-600"
                                      : "bg-green-600 hover:bg-green-700"
                                  }`}
                                  title={
                                    boat.isPaid
                                      ? "Mark as Unpaid"
                                      : "Mark as Paid"
                                  }
                                >
                                  {boat.isPaid ? (
                                    <FaTimesCircle size={12} />
                                  ) : (
                                    <FaCheckCircle size={12} />
                                  )}
                                </button>

                                <button
                                  onClick={() => handleDelete(boat.id)}
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
                          <td colSpan={9} className="text-center py-10 text-gray-500">
                            {t("adminTable.noItems")}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <Pagination
                hasMore={hasMore}
                onSeeMore={handleLoadMore}
                loading={loadingMore}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
BoatPages.displayName = "BoatPages";

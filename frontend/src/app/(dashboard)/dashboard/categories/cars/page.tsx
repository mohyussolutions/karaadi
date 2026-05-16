"use client";
import { getPlan, getExpiry } from "../../planUtils";

import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaTrashAlt,
  FaUser,
} from "@/app/utils/icons/dashboardIcons";
import {
  deleteCarAction,
  toggleCarPayment,
  getAllCarsAdmin,
} from "@/actions/categories/carActions";
import Loading from "@/app/ui/loading/Loading";
import { Car } from "@/app/utils/types/cars.types";
import { PLACEHOLDER_IMAGE } from "@/actions/constant/constant";
import Pagination from "../../components/Pagination";
import { vehicleSubCategories } from "@/app/(links)/storeFrontLinks/mainCategotyCategorySubCategory";
import DashboardSubNav from "../../components/SubNav/DashboardSubNav";

export default function CarManagement() {
  const { t } = useTranslation();
  const [items, setItems] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const PAGE_SIZE = 20;

  useEffect(() => {
    const fetchData = async () => {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);
      try {
        const data = await getAllCarsAdmin(page, PAGE_SIZE);
        setItems((prev) => (page === 1 ? data : [...prev, ...data]));
      } catch {
        setError("Failed to load cars");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };
    fetchData();
  }, [page]);

  const handleTogglePaid = useCallback(async (car: Car) => {
    const newStatus = !car.isPaid;
    const carId = String(car.id);
    if (!carId) return;
    setItems((prev) =>
      prev.map((c) => (String(c.id) === carId ? { ...c, isPaid: newStatus } : c)),
    );
    const result = await toggleCarPayment(carId, newStatus);
    if (!result.success) {
      setItems((prev) =>
        prev.map((c) => (String(c.id) === carId ? { ...c, isPaid: !newStatus } : c)),
      );
    }
  }, []);

  const handleDelete = useCallback(async (car: Car) => {
    if (!confirm(t("adminTable.delete") + "?")) return;
    const carId = String(car.id);
    if (!carId) return;
    const result = await deleteCarAction(carId);
    if (result.success) {
      setItems((prev) => prev.filter((c) => String(c.id) !== carId));
    }
  }, [t]);

  const [activeSubKey, setActiveSubKey] = React.useState("");
  const filtered = activeSubKey
    ? items.filter((c) => {
        const match = vehicleSubCategories.find((s) => s.key === activeSubKey);
        if (!match) return true;
        const name = match.name.toLowerCase();
        const cat = (
          (c as any).subcategory ||
          (c as any).category ||
          ""
        ).toLowerCase();
        return cat.includes(name) || cat.includes(activeSubKey.toLowerCase());
      })
    : items;
  const hasMore = items.length % PAGE_SIZE === 0 && items.length !== 0;
  const handleSeeMore = () => setPage((p) => p + 1);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.style.display = "none";
  };

  if (error && items.length === 0) {
    return (
      <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
        <div className="w-full px-4 sm:px-6 py-6 sm:py-8">
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
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="w-full max-w-full">
          <DashboardSubNav
            title="Car Categories"
            subCategories={vehicleSubCategories}
            activeKey={activeSubKey}
            onChange={setActiveSubKey}
          />

          {loading && (
            <div className="text-center py-10">
              <Loading />
            </div>
          )}

          {!loading && (
            <div className="mt-6 w-full">
              <div className="block lg:hidden">
                <div className="space-y-4 w-full">
                  {filtered.length > 0 ? (
                    filtered.map((car, idx) => (
                      <div
                        key={`car-mobile-${car.id || idx}`}
                        className="bg-white dark:bg-gray-800 border border-gray-200 rounded-xl p-4 shadow-sm w-full"
                      >
                        <div className="flex gap-3">
                          <img
                            src={car.images?.[0] || PLACEHOLDER_IMAGE}
                            alt={car.title || "image"}
                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                            onError={handleImageError}
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 mb-1 truncate">
                              {car.title}
                            </h3>
                            <p className="text-xs text-gray-500 mb-1 truncate">
                              {car.subcategory}
                            </p>
                            <p className="text-lg font-bold text-blue-600">
                              ${car.price?.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                            <span className="text-gray-500">{t("adminTable.city")}</span>
                            <p className="font-medium truncate">{car.city}</p>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                            <span className="text-gray-500">{t("adminTable.status")}</span>
                            <p
                              className={`font-medium truncate ${car.isPaid ? "text-green-600" : "text-red-600"}`}
                            >
                              {car.isPaid ? t("adminTable.paid") : t("adminTable.unpaid")}
                            </p>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                            <span className="text-gray-500">Plan</span>
                            <p className="font-medium truncate text-blue-700">{getPlan(car)}</p>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                            <span className="text-gray-500">Expires</span>
                            <p className={`font-medium truncate ${getExpiry(car).expired ? "text-red-600" : "text-gray-700"}`}>{getExpiry(car).label}</p>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => handleTogglePaid(car)}
                            className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1 ${
                              car.isPaid
                                ? "bg-yellow-500 text-white hover:bg-yellow-600"
                                : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                          >
                            {car.isPaid ? (
                              <FaTimesCircle size={12} />
                            ) : (
                              <FaCheckCircle size={12} />
                            )}
                            <span className="truncate">
                              {car.isPaid ? t("adminTable.markUnpaid") : t("adminTable.markPaid")}
                            </span>
                          </button>
                          <button
                            onClick={() => handleDelete(car)}
                            className="flex-1 py-2 px-2 bg-red-500 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1 hover:bg-red-600 transition"
                          >
                            <FaTrashAlt size={12} />{" "}
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
                        <th className="border-b p-3 text-xs font-semibold text-left w-[20%]">{t("adminTable.title")}</th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[12%]">{t("adminTable.subcategory")}</th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[8%]">{t("adminTable.price")}</th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[8%]">{t("adminTable.city")}</th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[12%]">{t("adminTable.seller")}</th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[8%]">{t("adminTable.paid")}</th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[9%]">Plan</th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[10%]">Expires</th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[12%]">{t("adminTable.actions")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length > 0 ? (
                        filtered.map((car, idx) => (
                          <tr
                            key={`car-desktop-${car.id || idx}`}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          >
                            <td className="border-b p-3">
                              <img
                                src={car.images?.[0] || PLACEHOLDER_IMAGE}
                                alt={car.title || "image"}
                                className="w-12 h-12 object-cover rounded"
                                onError={handleImageError}
                              />
                            </td>
                            <td className="border-b p-3">
                              <span
                                className="text-sm font-medium block truncate"
                                title={car.title}
                              >
                                {car.title}
                              </span>
                            </td>
                            <td className="border-b p-3">
                              <span
                                className="text-sm block truncate"
                                title={
                                  Array.isArray(car.subcategory)
                                    ? car.subcategory.join(", ")
                                    : car.subcategory
                                }
                              >
                                {Array.isArray(car.subcategory)
                                  ? car.subcategory.join(", ")
                                  : car.subcategory}
                              </span>
                            </td>
                            <td className="border-b p-3">
                              <span className="text-sm font-semibold">
                                ${car.price?.toLocaleString()}
                              </span>
                            </td>
                            <td className="border-b p-3">
                              <span
                                className="text-sm block truncate"
                                title={car.city}
                              >
                                {car.city}
                              </span>
                            </td>
                            <td className="border-b p-3">
                              <div className="flex items-center gap-1">
                                <FaUser className="text-gray-400 text-xs" />
                                <span className="text-xs truncate">
                                  {car.user?.username || "N/A"}
                                </span>
                              </div>
                            </td>
                            <td className="border-b p-3">
                              {car.isPaid ? (
                                <span className="text-green-600 font-semibold flex items-center text-xs">
                                  <FaCheckCircle className="mr-1" size={10} />
                                  {t("adminTable.paid")}
                                </span>
                              ) : (
                                <span className="text-red-600 font-semibold flex items-center text-xs">
                                  <FaTimesCircle className="mr-1" size={10} />
                                  {t("adminTable.unpaid")}
                                </span>
                              )}
                            </td>
                            <td className="border-b p-3">
                              <span className="text-xs font-medium text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                                {getPlan(car)}
                              </span>
                            </td>
                            <td className="border-b p-3">
                              {(() => { const e = getExpiry(car); return (
                                <span className={`text-xs font-medium whitespace-nowrap ${e.expired ? "text-red-600" : "text-gray-700"}`}>
                                  {e.label}
                                </span>
                              ); })()}
                            </td>
                            <td className="border-b p-3">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleTogglePaid(car)}
                                  className={`px-3 py-1.5 rounded text-white text-xs transition ${
                                    car.isPaid
                                      ? "bg-yellow-500 hover:bg-yellow-600"
                                      : "bg-green-600 hover:bg-green-700"
                                  }`}
                                >
                                  {car.isPaid ? t("adminTable.markUnpaid") : t("adminTable.markPaid")}
                                </button>
                                <button
                                  onClick={() => handleDelete(car)}
                                  className="px-3 py-1.5 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                                >
                                  {t("adminTable.delete")}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={10} className="text-center py-10 text-gray-500">
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
          onSeeMore={handleSeeMore}
        />
      </div>
    </div>
  );
}

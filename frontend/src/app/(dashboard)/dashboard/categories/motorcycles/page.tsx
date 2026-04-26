"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  FaMotorcycle,
  FaTrashAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
} from "@/app/utils/icons/dashboardIcons";
import { motorcycleSubCategories } from "../../../../(links)/storeFrontLinks/mainCategotyCategorySubCategory";
import DashboardSubNav from "../../components/SubNav/DashboardSubNav";
import {
  getAllMotorcyclesAdminAction,
  toggleMotorcyclePaidAction,
  deleteMotorcycleAction,
} from "@/actions/categories/motorcycleActions";
import Loading from "@/app/ui/loading/Loading";
import { PLACEHOLDER_IMAGE } from "@/actions/constant/constant";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AdminMotorcycle {
  _id?: string;
  id?: string;
  title?: string;
  price?: number;
  category?: string;
  subCategory?: string;
  city?: string;
  images?: string[];
  isPaid?: boolean;
  user?: { username?: string; email?: string; phone?: string } | string;
}

export default function MotorcyclesPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState<AdminMotorcycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMainCat, setActiveMainCat] = useState<string>("");
  const [activeSubCat, setActiveSubCat] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);
      try {
        const data = await getAllMotorcyclesAdminAction(page, 20);
        const mappedData: AdminMotorcycle[] = data.map((item: any) => ({
          ...item,
          _id: item._id || item.id,
          id: item.id || item._id,
          title: item.title || "",
          price: item.price || 0,
          category: item.category || "",
          subCategory: item.subCategory || "",
          city: item.city || "",
          images: item.images || [],
          isPaid: item.isPaid || false,
          user: item.user || "Unknown",
        }));
        setItems((prev) =>
          page === 1 ? mappedData : [...prev, ...mappedData],
        );
        setHasMore(data.length === 20);
      } catch {
        setError("Failed to load motorcycles");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };
    fetchData();
  }, [page]);

  const handleTogglePaid = async (moto: AdminMotorcycle) => {
    const motoId = String(moto.id ?? moto._id ?? "");
    const originalItems = [...items];
    setItems((prev) =>
      prev.map((i) =>
        i.id === motoId || i._id === motoId
          ? { ...i, isPaid: !moto.isPaid }
          : i,
      ),
    );
    const result = await toggleMotorcyclePaidAction(motoId, !!moto.isPaid);
    if (!result.success) {
      setItems(originalItems);
      const errorMsg =
        (result as any).message || "Failed to update payment status";
      toast.error(errorMsg);
    } else {
      toast.success(`Motorcycle marked as ${!moto.isPaid ? "Paid" : "Unpaid"}`);
    }
  };

  const handleDelete = async (moto: AdminMotorcycle) => {
    if (!window.confirm(`Delete ${moto.title}?`)) return;
    const originalItems = [...items];
    const motoId = String(moto.id ?? moto._id ?? "");
    setItems((prev) => prev.filter((i) => (i.id || i._id) !== motoId));
    const result = await deleteMotorcycleAction(motoId);
    if (!result.success) {
      setItems(originalItems);
      const errorMsg = (result as any).message || "Failed to delete motorcycle";
      toast.error(errorMsg);
    } else {
      toast.success("Motorcycle deleted successfully");
    }
  };

  const filtered = (() => {
    let result = items;
    if (activeMainCat) {
      result = result.filter((item) => item.category === activeMainCat);
    }
    if (activeSubCat) {
      result = result.filter((item) => item.subCategory === activeSubCat);
    }
    return result;
  })();

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.style.display = "none";
  };

  if (error && items.length === 0) {
    return (
      <div className="w-full min-h-screen bg-gray-50 overflow-x-hidden">
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
    <div className="w-full min-h-screen bg-gray-50 overflow-x-hidden">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={3}
      />
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="w-full max-w-full">
          <DashboardSubNav
            title="Motorcycle Categories"
            subCategories={motorcycleSubCategories}
            activeKey={activeMainCat}
            onChange={(key) => {
              setActiveMainCat(key);
              setActiveSubCat("");
            }}
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
                    filtered.map((moto, index) => (
                      <div
                        key={moto.id || moto._id || index}
                        className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm w-full"
                      >
                        <div className="flex gap-3">
                          <img
                            src={moto.images?.[0] || PLACEHOLDER_IMAGE}
                            alt={moto.title}
                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                            onError={handleImageError}
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 mb-1 truncate">
                              {moto.title}
                            </h3>
                            <p className="text-xs text-gray-500 mb-1 truncate">
                              {moto.category} • {moto.subCategory}
                            </p>
                            <p className="text-lg font-bold text-blue-600">
                              ${moto.price?.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="text-gray-500">{t("adminTable.city")}</span>
                            <p className="font-medium truncate">{moto.city}</p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="text-gray-500">{t("adminTable.status")}</span>
                            <p
                              className={`font-medium truncate ${moto.isPaid ? "text-green-600" : "text-red-600"}`}
                            >
                              {moto.isPaid ? t("adminTable.paid") : t("adminTable.unpaid")}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">{t("adminTable.seller")}</p>
                          <p className="font-medium text-sm truncate">
                            {typeof moto.user === "object"
                              ? moto.user?.username
                              : moto.user || "N/A"}
                          </p>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => handleTogglePaid(moto)}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${moto.isPaid ? "bg-yellow-500 text-white hover:bg-yellow-600" : "bg-green-600 text-white hover:bg-green-700"}`}
                          >
                            {moto.isPaid ? (
                              <FaTimesCircle size={14} />
                            ) : (
                              <FaCheckCircle size={14} />
                            )}
                            {moto.isPaid ? t("adminTable.markUnpaid") : t("adminTable.markPaid")}
                          </button>
                          <button
                            onClick={() => handleDelete(moto)}
                            className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-600"
                          >
                            <FaTrashAlt size={14} /> {t("adminTable.delete")}
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
                <div className="border border-gray-300 rounded-xl bg-white overflow-hidden">
                  <table className="w-full table-fixed">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[8%]">{t("adminTable.image")}</th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[15%]">{t("adminTable.title")}</th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[10%]">{t("adminTable.category")}</th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[12%]">{t("adminTable.subcategory")}</th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[8%]">{t("adminTable.price")}</th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[8%]">{t("adminTable.city")}</th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[15%]">{t("adminTable.seller")}</th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[8%]">{t("adminTable.paid")}</th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[16%]">{t("adminTable.actions")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length > 0 ? (
                        filtered.map((moto, index) => (
                          <tr
                            key={moto.id || moto._id || index}
                            className="hover:bg-gray-50"
                          >
                            <td className="border-b p-3">
                              <img
                                src={moto.images?.[0] || PLACEHOLDER_IMAGE}
                                alt={moto.title}
                                className="w-12 h-12 object-cover rounded"
                                onError={handleImageError}
                              />
                            </td>
                            <td className="border-b p-3">
                              <span
                                className="text-sm font-medium block truncate"
                                title={moto.title}
                              >
                                {moto.title}
                              </span>
                            </td>
                            <td className="border-b p-3">
                              <span className="text-sm block truncate">
                                {moto.category}
                              </span>
                            </td>
                            <td className="border-b p-3">
                              <span className="text-sm block truncate">
                                {moto.subCategory}
                              </span>
                            </td>
                            <td className="border-b p-3">
                              <span className="text-sm font-semibold">
                                ${moto.price?.toLocaleString()}
                              </span>
                            </td>
                            <td className="border-b p-3">
                              <span className="text-sm block truncate">
                                {moto.city}
                              </span>
                            </td>
                            <td className="border-b p-3">
                              <div className="flex items-center gap-1">
                                <FaUser className="text-gray-400 text-xs" />
                                <span className="text-xs truncate">
                                  {typeof moto.user === "object"
                                    ? moto.user?.username
                                    : moto.user || "N/A"}
                                </span>
                              </div>
                            </td>
                            <td className="border-b p-3">
                              {moto.isPaid ? (
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
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleTogglePaid(moto)}
                                  className={`px-3 py-1.5 rounded text-white text-xs transition ${moto.isPaid ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-600 hover:bg-green-700"}`}
                                >
                                  {moto.isPaid ? t("adminTable.markUnpaid") : t("adminTable.markPaid")}
                                </button>
                                <button
                                  onClick={() => handleDelete(moto)}
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
                          <td colSpan={9} className="text-center py-10 text-gray-500">
                            {t("adminTable.noItems")}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              {hasMore && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={loadingMore}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loadingMore ? "Loading..." : "See More"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

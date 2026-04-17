"use client";

import React, { useEffect, useState } from "react";
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

export default function MarketplacePage() {
  const [items, setItems] = useState<AdminMarketplaceItem[]>([]);
  const [total, setTotal] = useState<number | null>(null);
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

  const handleDeleteItem = async (item: AdminMarketplaceItem) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    const itemId = String(item.id);
    if (!itemId) {
      alert("Invalid item: missing ID.");
      return;
    }
    const success = await deleteAdminMarketplaceItem(itemId);
    if (success) {
      setItems((prev) => prev.filter((i) => String(i.id) !== itemId));
    } else {
      alert("Failed to delete item. Please try again.");
    }
  };

  const handleTogglePaidStatus = async (item: AdminMarketplaceItem) => {
    const newStatus = !item.isPaid;
    const itemId = String(item.id);
    if (!itemId) {
      alert("Invalid item: missing ID.");
      return;
    }
    const success = await updateAdminMarketplaceItemPaidStatus(
      itemId,
      newStatus,
    );
    if (success) {
      setItems((prev) =>
        prev.map((i) =>
          String(i.id) === itemId ? { ...i, isPaid: newStatus } : i,
        ),
      );
    } else {
      alert("Failed to update paid status. Please try again.");
    }
  };

  const [activeSubKey, setActiveSubKey] = React.useState("");

  let filtered = items;
  if (activeSubKey) {
    const match = marketplaceSubCategories.find((s) => s.key === activeSubKey);
    if (match) {
      const name = match.name.toLowerCase();
      filtered = filtered.filter((i) => {
        const cat = (
          (Array.isArray(i.category) ? i.category.join(" ") : i.category) ||
          (i as any).mainCategory ||
          ""
        ).toLowerCase();
        return cat.includes(name) || cat.includes(activeSubKey.toLowerCase());
      });
    }
  }
  const paginated = filtered;
  const hasMore = items.length % PAGE_SIZE === 0 && items.length !== 0;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.style.display = "none";
  };

  if (error && items.length === 0) {
    return (
      <div className="w-full min-h-screen bg-gray-50 overflow-x-hidden">
        <div className="w-full px-4 sm:px-6 py-6 sm:py-8">
          <div className="w-full max-w-full">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 sm:px-6 py-4 rounded-xl">
              <p className="font-bold text-base sm:text-lg">Error</p>
              <p className="text-sm sm:text-base mt-1">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 sm:mt-4 bg-red-600 text-white px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base hover:bg-red-700 transition w-full sm:w-auto"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="w-full max-w-full">
          <DashboardSubNav
            title="Marketplace Categories"
            subCategories={marketplaceSubCategories}
            activeKey={activeSubKey}
            onChange={setActiveSubKey}
          />

          <div className="flex items-center gap-3 mt-4 mb-2">
            <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 shadow-sm flex items-center gap-2">
              <span className="text-gray-500 text-sm font-medium">
                Total Marketplace Items:
              </span>
              {total === null ? (
                <span className="w-16 h-5 bg-gray-100 rounded animate-pulse inline-block" />
              ) : (
                <span className="text-xl font-bold text-green-600">
                  {total.toLocaleString()}
                </span>
              )}
            </div>
            {items.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 shadow-sm flex items-center gap-2">
                <span className="text-gray-500 text-sm font-medium">
                  Showing:
                </span>
                <span className="text-xl font-bold text-blue-600">
                  {items.length.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {loading && (
            <div className="text-center py-10 text-gray-500">
              <Loading />
            </div>
          )}

          {!loading && (
            <div className="mt-6 w-full">
              <div className="block md:hidden">
                <div className="space-y-4 w-full">
                  {paginated.length > 0 ? (
                    paginated.map((item, idx) => (
                      <div
                        key={`item-${item.id}-${idx}`}
                        className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm w-full"
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
                              ${item.price}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="text-gray-500">City</span>
                            <p className="font-medium truncate">{item.city}</p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="text-gray-500">Status</span>
                            <p
                              className={`font-medium truncate ${item.isPaid ? "text-green-600" : "text-red-600"}`}
                            >
                              {item.isPaid ? "Paid" : "Unpaid"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Seller</p>
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
                              {item.isPaid ? "Unpaid" : "Paid"}
                            </span>
                          </button>

                          <button
                            onClick={() =>
                              console.log(
                                `Attempting to navigate to edit page for item ID: ${item.id}`,
                              )
                            }
                            className="flex-1 py-2 px-2 bg-blue-500 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1 hover:bg-blue-600 transition"
                          >
                            <FaEdit size={12} />
                            <span className="truncate">Edit</span>
                          </button>

                          <button
                            onClick={() => handleDeleteItem(item)}
                            className="flex-1 py-2 px-2 bg-red-500 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1 hover:bg-red-600 transition"
                          >
                            <FaTrashAlt size={12} />
                            <span className="truncate">Delete</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-gray-500 border border-dashed rounded-lg">
                      No items found in the database
                    </div>
                  )}
                </div>
              </div>

              <div className="hidden md:block w-full">
                <div className="border border-gray-300 rounded-xl bg-white overflow-hidden">
                  <table className="w-full table-fixed">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[10%]">
                          Image
                        </th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[12%]">
                          Title
                        </th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[10%]">
                          Main Cat
                        </th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[10%]">
                          Category
                        </th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[10%]">
                          Subcategory
                        </th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[8%]">
                          Price
                        </th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[8%]">
                          City
                        </th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[12%]">
                          Seller
                        </th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[8%]">
                          Paid
                        </th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[12%]">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.length > 0 ? (
                        paginated.map((item, idx) => (
                          <tr
                            key={`item-${item.id}-${idx}`}
                            className="hover:bg-gray-50"
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
                              <span
                                className="text-sm block truncate"
                                title={
                                  Array.isArray(item.subcategory)
                                    ? item.subcategory.join(", ")
                                    : item.subcategory
                                }
                              >
                                {Array.isArray(item.subcategory)
                                  ? item.subcategory.join(", ")
                                  : item.subcategory}
                              </span>
                            </td>
                            <td className="border-b p-3">
                              <span className="text-sm font-semibold">
                                ${item.price}
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
                              <div className="flex items-center gap-2 text-xs">
                                <Image
                                  src={
                                    item.user?.profileImage || PLACEHOLDER_IMAGE
                                  }
                                  alt={item.user?.username || "User"}
                                  width={28}
                                  height={28}
                                  className="w-7 h-7 rounded-full object-cover border"
                                  onError={handleImageError}
                                  unoptimized
                                />
                                <div className="flex flex-col">
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
                              </div>
                            </td>
                            <td className="border-b p-3">
                              {item.isPaid ? (
                                <span className="text-green-600 font-semibold flex items-center text-xs">
                                  <FaCheckCircle
                                    className="mr-1 flex-shrink-0"
                                    size={10}
                                  />
                                  PAID
                                </span>
                              ) : (
                                <span className="text-red-600 font-semibold flex items-center text-xs">
                                  <FaTimesCircle
                                    className="mr-1 flex-shrink-0"
                                    size={10}
                                  />
                                  NOT PAID
                                </span>
                              )}
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
                                  onClick={() =>
                                    console.log(
                                      `Attempting to navigate to edit page for item ID: ${item.id}`,
                                    )
                                  }
                                  className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                  title="Edit"
                                >
                                  <FaEdit size={12} />
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
                          <td
                            colSpan={10}
                            className="text-center py-10 text-gray-500"
                          >
                            No items found in the database
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

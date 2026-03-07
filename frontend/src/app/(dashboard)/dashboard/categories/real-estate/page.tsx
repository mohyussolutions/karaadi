"use client";

import {
  fetchAdminRealEstate,
  deleteRealEstate,
  updatePaidStatus,
} from "@/actions/categories/realEstateActions";
import { categoryNestedMap } from "@/app/(links)/storeFrontLinks/nestedSubcategoryProperties";
import { realEstateSubCategories } from "@/app/(links)/storeFrontLinks/subCategories";
import { verifySession } from "@/actions/core/authAction";
import React, { JSX, useEffect, useState, useMemo } from "react";
import {
  FaTrashAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaPhoneAlt,
  FaFilter,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaHome,
} from "react-icons/fa";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";

const PLACEHOLDER_IMAGE =
  "https://placehold.co/80x80/9ca3af/ffffff?text=No+Image";

const realEstateIcons: Record<string, JSX.Element> = {
  "All Listings": <FaHome className="mr-2" />,
};

export default function RealEstatePage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userToken, setUserToken] = useState<string | undefined>();
  const [activeMainCat, setActiveMainCat] = useState<string>("");
  const [activeSubCat, setActiveSubCat] = useState<string>("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [expandedMobileSection, setExpandedMobileSection] = useState<
    string | null
  >(null);
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });

  const showStatus = (text: string, type = "success") => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage({ text: "", type: "" }), 4000);
  };

  useEffect(() => {
    const init = async () => {
      try {
        const session = await verifySession();

        if (session?.accessToken) {
          setAuthenticated(true);
          setUserToken(session.accessToken);

          const isUserAdmin = session.isAdmin || false;
          const isUserManager = session.isManager || false;

          if (isUserAdmin || isUserManager) {
            setIsAdmin(true);
            await loadData(session.accessToken);
          } else {
            setError(
              "You don't have permission to access this page. Admin or Manager role required.",
            );
            setLoading(false);
          }
        } else {
          setError("Please log in to access real estate management");
          setLoading(false);
        }
      } catch (err) {
        console.error("Auth error:", err);
        setError("Authentication failed");
        setLoading(false);
      }
    };
    init();
  }, []);

  const loadData = async (token?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminRealEstate();
      setItems(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load properties",
      );
      console.error("Error loading properties:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePaid = async (item: any) => {
    if (!authenticated || !isAdmin) return;

    const originalItems = [...items];
    const newStatus = !item.isPaid;

    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, isPaid: newStatus } : i)),
    );

    const result = await updatePaidStatus(item.id, newStatus);

    if (!result.success) {
      setItems(originalItems);
      showStatus("Status update failed", "error");
    } else {
      showStatus(`Updated status to ${newStatus ? "Paid" : "Unpaid"}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!authenticated || !isAdmin) return;
    if (!window.confirm("Are you sure you want to delete this listing?"))
      return;

    const originalItems = [...items];
    setItems((prev) => prev.filter((item) => item.id !== id));

    const result = await deleteRealEstate(id);

    if (!result.success) {
      setItems(originalItems);
      showStatus("Delete failed", "error");
    } else {
      showStatus("Property deleted successfully");
    }
  };

  const filtered = useMemo(() => {
    let filtered = items;

    if (activeMainCat) {
      filtered = filtered.filter((item) => item.category === activeMainCat);
    }

    if (activeSubCat) {
      filtered = filtered.filter((item) => item.subCategory === activeSubCat);
    }

    return filtered;
  }, [items, activeMainCat, activeSubCat]);

  const uniqueMainCategories = realEstateSubCategories
    .map((cat) => cat.so)
    .filter((cat): cat is string => cat !== undefined);

  const getNestedItems = () => {
    return categoryNestedMap[activeMainCat] || [];
  };

  const handleSubCategoryClick = (subcategoryTitle: string) => {
    setActiveSubCat(subcategoryTitle);
    setMobileFiltersOpen(false);
  };

  const handleMainCategoryClick = (mainCategoryTitle: string) => {
    setActiveMainCat(mainCategoryTitle);
    setActiveSubCat("");
    setMobileFiltersOpen(false);
  };

  const resetFilters = () => {
    setActiveMainCat("");
    setActiveSubCat("");
    setMobileFiltersOpen(false);
  };

  const getCategoryIcon = (title: string) => {
    return realEstateIcons[title] || <FaHome className="mr-2" />;
  };

  const getChipClass = (isActive: boolean) =>
    `flex items-center justify-center px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition duration-200 shadow-sm whitespace-nowrap ${
      isActive
        ? "bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 hover:shadow-md"
        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 hover:border-blue-400"
    }`;

  const toggleMobileSection = (section: string) => {
    setExpandedMobileSection(
      expandedMobileSection === section ? null : section,
    );
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = PLACEHOLDER_IMAGE;
  };

  if (!authenticated && !loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 overflow-x-hidden">
        <div className="w-full px-4 sm:px-6 py-6 sm:py-8">
          <div className="w-full max-w-full">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 sm:px-6 py-4 rounded-xl">
              <p className="font-bold text-base sm:text-lg">
                Authentication Required
              </p>
              <p className="text-sm sm:text-base mt-1">
                Please log in to access real estate management.
              </p>
              <button
                onClick={() => (window.location.href = "/login")}
                className="mt-3 sm:mt-4 bg-yellow-500 text-white px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base hover:bg-yellow-600 transition w-full sm:w-auto"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (authenticated && !isAdmin && !loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 overflow-x-hidden">
        <div className="w-full px-4 sm:px-6 py-6 sm:py-8">
          <div className="w-full max-w-full">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 sm:px-6 py-4 rounded-xl">
              <p className="font-bold text-base sm:text-lg">Access Denied</p>
              <p className="text-sm sm:text-base mt-1">
                You need admin or manager privileges to access this page.
              </p>
              <button
                onClick={() => (window.location.href = "/")}
                className="mt-3 sm:mt-4 bg-red-600 text-white px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base hover:bg-red-700 transition w-full sm:w-auto"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 break-words">
              Real Estate Management
            </h1>

            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="sm:hidden flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
            >
              <FaFilter />
              {mobileFiltersOpen ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {statusMessage.text && (
            <div
              className={`fixed bottom-8 right-8 z-50 px-6 py-4 rounded-2xl shadow-2xl text-white font-bold ${
                statusMessage.type === "error"
                  ? "bg-rose-500"
                  : "bg-emerald-500"
              }`}
            >
              {statusMessage.text}
            </div>
          )}

          <div className="hidden sm:block">
            <h2 className="text-lg sm:text-xl font-bold mb-3 text-gray-700 border-b pb-2">
              Main Categories
            </h2>
            <div className="flex flex-wrap gap-2 sm:gap-3 pb-6 border-b border-gray-200">
              <button
                onClick={resetFilters}
                className={getChipClass(!activeMainCat && !activeSubCat)}
              >
                {getCategoryIcon("All Listings")} All Listings
              </button>

              {uniqueMainCategories.map((cat, index) => (
                <button
                  key={`main-cat-${cat}-${index}`}
                  onClick={() => handleMainCategoryClick(cat)}
                  className={getChipClass(activeMainCat === cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {activeMainCat && getNestedItems().length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg sm:text-xl font-bold mb-3 text-gray-700 border-b pb-2">
                  Subcategories in {activeMainCat}
                </h2>
                <div className="flex flex-wrap gap-2 sm:gap-3 pb-6 border-b border-gray-200">
                  <button
                    onClick={() => handleSubCategoryClick("")}
                    className={getChipClass(!activeSubCat)}
                  >
                    All {activeMainCat}
                  </button>
                  {getNestedItems().map((sub) => (
                    <button
                      key={`sub-cat-${activeMainCat}-${sub.so}`}
                      onClick={() => handleSubCategoryClick(sub.so)}
                      className={getChipClass(activeSubCat === sub.so)}
                    >
                      <span className="mr-2">{sub.icon}</span>
                      <span className="hidden sm:inline">{sub.title}</span>
                      <span className="sm:hidden">{sub.so}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {mobileFiltersOpen && (
            <div className="sm:hidden mb-6 bg-white rounded-xl border border-gray-200 p-4 w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-700">Filters</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={18} />
                </button>
              </div>

              <div className="mb-4">
                <button
                  onClick={() => toggleMobileSection("main")}
                  className="flex items-center justify-between w-full py-2 font-semibold text-gray-700"
                >
                  <span>Main Categories</span>
                  {expandedMobileSection === "main" ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </button>
                {expandedMobileSection === "main" && (
                  <div className="mt-2 space-y-2">
                    <button
                      onClick={resetFilters}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                        !activeMainCat && !activeSubCat
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      All Listings
                    </button>
                    {uniqueMainCategories.map((cat, index) => (
                      <button
                        key={`mobile-main-cat-${cat}-${index}`}
                        onClick={() => handleMainCategoryClick(cat)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                          activeMainCat === cat
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {activeMainCat && getNestedItems().length > 0 && (
                <div className="mb-4">
                  <button
                    onClick={() => toggleMobileSection("subcategory")}
                    className="flex items-center justify-between w-full py-2 font-semibold text-gray-700"
                  >
                    <span>Subcategories in {activeMainCat}</span>
                    {expandedMobileSection === "subcategory" ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </button>
                  {expandedMobileSection === "subcategory" && (
                    <div className="mt-2 space-y-2">
                      <button
                        onClick={() => handleSubCategoryClick("")}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                          !activeSubCat
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        All {activeMainCat}
                      </button>
                      {getNestedItems().map((sub) => (
                        <button
                          key={`mobile-sub-cat-${activeMainCat}-${sub.so}`}
                          onClick={() => handleSubCategoryClick(sub.so)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                            activeSubCat === sub.so
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {sub.so}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {loading && (
            <div className="text-center py-10 text-gray-500">
              <Loading />
            </div>
          )}

          {!loading && (
            <div className="mt-6 w-full">
              <div className="block md:hidden">
                <div className="space-y-4 w-full">
                  {filtered.length > 0 ? (
                    filtered.map((item, index) => (
                      <div
                        key={`property-mobile-${item.id || index}`}
                        className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm w-full"
                      >
                        <div className="flex gap-3">
                          <img
                            src={item.images?.[0] || PLACEHOLDER_IMAGE}
                            alt={item.title}
                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                            onError={handleImageError}
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 mb-1 truncate">
                              {item.title}
                            </h3>
                            <p className="text-xs text-gray-500 mb-1 truncate">
                              {item.category} • {item.subCategory}
                            </p>
                            <p className="text-lg font-bold text-blue-600">
                              ${item.price?.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="text-gray-500">Location</span>
                            <p className="font-medium truncate">{item.city}</p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="text-gray-500">Specs</span>
                            <p className="font-medium truncate">
                              {item.bedrooms}bd • {item.bathrooms}ba
                            </p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="text-gray-500">Region</span>
                            <p className="font-medium truncate">
                              {item.region}
                            </p>
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

                        <div className="mt-4 flex flex-col gap-2">
                          <button
                            onClick={() => handleTogglePaid(item)}
                            className={`w-full py-3 px-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${
                              item.isPaid
                                ? "bg-yellow-500 text-white hover:bg-yellow-600"
                                : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                          >
                            {item.isPaid ? (
                              <FaTimesCircle size={14} />
                            ) : (
                              <FaCheckCircle size={14} />
                            )}
                            <span>
                              {item.isPaid ? "Mark as Unpaid" : "Mark as Paid"}
                            </span>
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            className="w-full py-3 px-2 bg-red-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-600 transition"
                          >
                            <FaTrashAlt size={14} />{" "}
                            <span>Delete Property</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-gray-500 border border-dashed rounded-lg">
                      No properties found in the database
                    </div>
                  )}
                </div>
              </div>

              <div className="hidden md:block w-full">
                <div className="border border-gray-300 rounded-xl bg-white overflow-hidden">
                  <table className="w-full table-fixed">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[12%]">
                          Image
                        </th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[15%]">
                          Title
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
                        <th className="border-b p-3 text-xs font-semibold text-left w-[10%]">
                          Location
                        </th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[15%]">
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
                      {filtered.length > 0 ? (
                        filtered.map((item, index) => (
                          <tr
                            key={`property-desktop-${item.id || index}`}
                            className="hover:bg-gray-50"
                          >
                            <td className="border-b p-3">
                              <img
                                src={item.images?.[0] || PLACEHOLDER_IMAGE}
                                alt={item.title}
                                className="w-12 h-12 object-cover rounded"
                                onError={handleImageError}
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
                                {item.subCategory}
                              </span>
                            </td>
                            <td className="border-b p-3">
                              <span className="text-sm font-semibold">
                                ${item.price?.toLocaleString()}
                              </span>
                            </td>
                            <td className="border-b p-3">
                              <div className="flex flex-col text-xs">
                                <span
                                  className="font-medium truncate"
                                  title={item.city}
                                >
                                  {item.city}
                                </span>
                                <span
                                  className="text-gray-500 truncate"
                                  title={item.region}
                                >
                                  {item.region}
                                </span>
                              </div>
                            </td>
                            <td className="border-b p-3">
                              <div className="flex flex-col text-xs">
                                <span
                                  className="font-semibold truncate"
                                  title={item.user?.username}
                                >
                                  <FaUser
                                    className="inline mr-1 text-gray-400"
                                    size={10}
                                  />
                                  {item.user?.username || "N/A"}
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
                                  <FaPhoneAlt
                                    className="inline mr-1 text-gray-400"
                                    size={8}
                                  />
                                  {item.user?.phone || "N/A"}
                                </span>
                              </div>
                            </td>
                            <td className="border-b p-3">
                              {item.isPaid ? (
                                <span className="text-green-600 font-semibold flex items-center text-xs">
                                  <FaCheckCircle
                                    className="mr-1 flex-shrink-0"
                                    size={10}
                                  />{" "}
                                  PAID
                                </span>
                              ) : (
                                <span className="text-red-600 font-semibold flex items-center text-xs">
                                  <FaTimesCircle
                                    className="mr-1 flex-shrink-0"
                                    size={10}
                                  />{" "}
                                  UNPAID
                                </span>
                              )}
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
                                  onClick={() => handleDelete(item.id)}
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
                            colSpan={9}
                            className="text-center py-10 text-gray-500"
                          >
                            No properties found in the database
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
      </div>
    </div>
  );
}

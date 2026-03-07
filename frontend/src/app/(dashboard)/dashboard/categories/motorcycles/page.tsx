"use client";

import React, { JSX, useEffect, useState, useMemo } from "react";
import {
  FaMotorcycle,
  FaTrashAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaUser,
  FaPhoneAlt,
  FaFilter,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { motorcyclesSubCategories } from "../../../../(links)/storeFrontLinks/subCategories";
import {
  getAllMotorcyclesAdminAction,
  toggleMotorcyclePaidAction,
  deleteMotorcycleAction,
} from "@/actions/categories/motorcycleActions";
import {
  MotorcyclesForNestedSub,
  MotorcycleRentNestedSub,
  MCPartsNestedSub,
  OtherNestedSub,
} from "@/app/(links)/storeFrontLinks/nestedSubcategoryForMotorcycles";
import { verifySession } from "@/actions/core/authAction";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";

const PLACEHOLDER_IMAGE =
  "https://placehold.co/80x80/9ca3af/ffffff?text=No+Image";

interface NestedSubItem {
  so: string;
  title: string;
  icon?: JSX.Element;
}

const categoryMap: Record<string, NestedSubItem[]> = {
  "Beec ah": MotorcyclesForNestedSub,
  "Kiro ah": MotorcycleRentNestedSub,
  Qaybaha: MCPartsNestedSub,
  "Wax Kale": OtherNestedSub,
};

const motorcycleIcons: Record<string, JSX.Element> = {
  "Beec ah": <FaMotorcycle className="mr-2" />,
  "Kiro ah": <FaMotorcycle className="mr-2" />,
  Qaybaha: <FaMotorcycle className="mr-2" />,
  "Wax Kale": <FaMotorcycle className="mr-2" />,
  "All Categories": <FaMotorcycle className="mr-2" />,
};

export default function MotorcyclesPage() {
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
          setError("Please log in to access motorcycle management");
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
      const data = await getAllMotorcyclesAdminAction();
      setItems(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load motorcycles",
      );
      console.error("Error loading motorcycles:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePaid = async (moto: any) => {
    if (!authenticated || !isAdmin) return;

    const originalItems = [...items];
    const motoId = moto.id || moto._id;

    setItems((prev) =>
      prev.map((i) =>
        i.id === motoId || i._id === motoId
          ? { ...i, isPaid: !moto.isPaid }
          : i,
      ),
    );

    const result = await toggleMotorcyclePaidAction(motoId, moto.isPaid);

    if (!result.success) {
      setItems(originalItems);
      alert("Failed to update payment status");
    }
  };

  const handleDelete = async (moto: any) => {
    if (!authenticated || !isAdmin) return;
    if (!window.confirm(`Delete ${moto.title}?`)) return;

    const originalItems = [...items];
    const motoId = moto.id || moto._id;

    setItems((prev) => prev.filter((i) => (i.id || i._id) !== motoId));

    const result = await deleteMotorcycleAction(motoId);

    if (!result.success) {
      setItems(originalItems);
      alert("Failed to delete motorcycle");
    }
  };

  const currentNestedItems = useMemo((): NestedSubItem[] => {
    return categoryMap[activeMainCat] || [];
  }, [activeMainCat]);

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

  const uniqueMainCategories = motorcyclesSubCategories
    .map((cat) => cat.so)
    .filter((cat): cat is string => cat !== undefined);

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
    const cat = motorcyclesSubCategories.find((c) => c.so === title);
    return cat?.icon || <FaMotorcycle className="mr-2" />;
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
                Please log in to access motorcycle management.
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
              Motorcycle Management
            </h1>

            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="sm:hidden flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
            >
              <FaFilter />
              {mobileFiltersOpen ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          <div className="hidden sm:block">
            <h2 className="text-lg sm:text-xl font-bold mb-3 text-gray-700 border-b pb-2">
              Main Categories
            </h2>
            <div className="flex flex-wrap gap-2 sm:gap-3 pb-6 border-b border-gray-200">
              <button
                onClick={resetFilters}
                className={getChipClass(!activeMainCat && !activeSubCat)}
              >
                <FaMotorcycle className="mr-2" /> All Categories
              </button>

              {uniqueMainCategories.map((cat, index) => {
                const category = motorcyclesSubCategories.find(
                  (c) => c.so === cat,
                );
                return (
                  <button
                    key={`main-cat-${cat}-${index}`}
                    onClick={() => handleMainCategoryClick(cat)}
                    className={getChipClass(activeMainCat === cat)}
                  >
                    <span className="mr-2">{category?.icon}</span> {cat}
                  </button>
                );
              })}
            </div>

            {activeMainCat && currentNestedItems.length > 0 && (
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
                  {currentNestedItems.map((sub) => (
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
                      All Categories
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

              {activeMainCat && currentNestedItems.length > 0 && (
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
                      {currentNestedItems.map((sub) => (
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
                    filtered.map((moto, index) => (
                      <div
                        key={`moto-mobile-${moto.id || moto._id || index}`}
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
                            <span className="text-gray-500">City</span>
                            <p className="font-medium truncate">{moto.city}</p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="text-gray-500">Status</span>
                            <p
                              className={`font-medium truncate ${moto.isPaid ? "text-green-600" : "text-red-600"}`}
                            >
                              {moto.isPaid ? "Paid" : "Unpaid"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Seller</p>
                          <p className="font-medium text-sm truncate">
                            {moto.user?.username || "N/A"}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {moto.user?.email}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {moto.user?.phone}
                          </p>
                        </div>

                        <div className="mt-4 flex flex-col gap-2">
                          <button
                            onClick={() => handleTogglePaid(moto)}
                            className={`w-full py-3 px-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${
                              moto.isPaid
                                ? "bg-yellow-500 text-white hover:bg-yellow-600"
                                : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                          >
                            {moto.isPaid ? (
                              <FaTimesCircle size={14} />
                            ) : (
                              <FaCheckCircle size={14} />
                            )}
                            <span>
                              {moto.isPaid ? "Mark as Unpaid" : "Mark as Paid"}
                            </span>
                          </button>

                          <button
                            onClick={() => handleDelete(moto)}
                            className="w-full py-3 px-2 bg-red-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-600 transition"
                          >
                            <FaTrashAlt size={14} /> <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-gray-500 border border-dashed rounded-lg">
                      No motorcycles found in the database
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
                        <th className="border-b p-3 text-xs font-semibold text-left w-[15%]">
                          Title
                        </th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[12%]">
                          Category
                        </th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[12%]">
                          Subcategory
                        </th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[8%]">
                          Price
                        </th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[8%]">
                          City
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
                        filtered.map((moto, index) => (
                          <tr
                            key={`moto-desktop-${moto.id || moto._id || index}`}
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
                              <span
                                className="text-sm block truncate"
                                title={moto.category}
                              >
                                {moto.category}
                              </span>
                            </td>
                            <td className="border-b p-3">
                              <span
                                className="text-sm block truncate"
                                title={moto.subCategory}
                              >
                                {moto.subCategory}
                              </span>
                            </td>
                            <td className="border-b p-3">
                              <span className="text-sm font-semibold">
                                ${moto.price?.toLocaleString()}
                              </span>
                            </td>
                            <td className="border-b p-3">
                              <span
                                className="text-sm block truncate"
                                title={moto.city}
                              >
                                {moto.city}
                              </span>
                            </td>
                            <td className="border-b p-3">
                              <div className="flex flex-col text-xs">
                                <span
                                  className="font-semibold truncate"
                                  title={moto.user?.username}
                                >
                                  <FaUser
                                    className="inline mr-1 text-gray-400"
                                    size={10}
                                  />
                                  {moto.user?.username || "N/A"}
                                </span>
                                <span
                                  className="text-gray-600 truncate"
                                  title={moto.user?.email}
                                >
                                  {moto.user?.email}
                                </span>
                                <span
                                  className="text-gray-600 truncate"
                                  title={moto.user?.phone}
                                >
                                  <FaPhoneAlt
                                    className="inline mr-1 text-gray-400"
                                    size={8}
                                  />
                                  {moto.user?.phone || "N/A"}
                                </span>
                              </div>
                            </td>
                            <td className="border-b p-3">
                              {moto.isPaid ? (
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
                                  onClick={() => handleTogglePaid(moto)}
                                  className={`p-1.5 rounded text-white text-xs transition flex items-center justify-center ${
                                    moto.isPaid
                                      ? "bg-yellow-500 hover:bg-yellow-600"
                                      : "bg-green-600 hover:bg-green-700"
                                  }`}
                                  title={
                                    moto.isPaid
                                      ? "Mark as Unpaid"
                                      : "Mark as Paid"
                                  }
                                >
                                  {moto.isPaid ? (
                                    <FaTimesCircle size={12} />
                                  ) : (
                                    <FaCheckCircle size={12} />
                                  )}
                                </button>

                                <button
                                  onClick={() => handleDelete(moto)}
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
                            No motorcycles found in the database
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

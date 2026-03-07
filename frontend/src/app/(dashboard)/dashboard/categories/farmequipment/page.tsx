"use client";

import React, { JSX, useEffect, useState, useMemo } from "react";
import {
  FaTrashAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaList,
  FaSync,
  FaUser,
  FaPhoneAlt,
  FaTractor,
  FaFilter,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import {
  getAllFarmEquipment,
  updateTraktor,
  deleteTraktor,
  FarmEquipment,
} from "@/actions/categories/FarmequipmentAction";
import { verifySession } from "@/actions/core/authAction";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";

const PLACEHOLDER_IMAGE =
  "https://placehold.co/80x80/9ca3af/ffffff?text=No+Image";

const tractorIcons: Record<string, JSX.Element> = {
  All: <FaTractor className="mr-2" />,
};

export default function TraktorsPage() {
  const [items, setItems] = useState<FarmEquipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userToken, setUserToken] = useState<string | undefined>();
  const [activeMainCategory, setActiveMainCategory] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [activeSubCategory, setActiveSubCategory] = useState("");
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
            await loadData();
          } else {
            setError(
              "You don't have permission to access this page. Admin or Manager role required.",
            );
            setLoading(false);
          }
        } else {
          setError("Please log in to access farm equipment management");
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

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllFarmEquipment();
      setItems(data);
    } catch (error) {
      toast.error("Error loading data");
      console.error("Load error:", error);
      setError("Failed to load equipment");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePaid = async (item: FarmEquipment) => {
    if (!authenticated || !isAdmin) return;

    const itemId = item._id;
    if (!itemId) return;

    const nextStatus = !item.isPaid;
    const originalItems = [...items];

    setItems((prev) =>
      prev.map((t) => (t._id === itemId ? { ...t, isPaid: nextStatus } : t)),
    );

    const res = await updateTraktor(itemId, { isPaid: nextStatus }, userToken);

    if (!res.success) {
      setItems(originalItems);
      toast.error(res.message || "Update failed");
    } else {
      toast.success(nextStatus ? "Marked as paid" : "Marked as unpaid");
    }
  };

  const handleDelete = async (id: string) => {
    if (!authenticated || !isAdmin) return;
    if (!confirm("Ma hubtaa inaad tirtirto xayeysiiskan?")) return;

    const originalItems = [...items];
    setItems((prev) => prev.filter((item) => item._id !== id));

    const res = await deleteTraktor(id, userToken);

    if (res.success) {
      toast.success("Waa la tirtiray");
    } else {
      setItems(originalItems);
      toast.error("Waa lagu fashilmay tirtirista");
    }
  };

  // Filter Logic
  const filtered = useMemo(() => {
    let filtered = items;

    if (activeMainCategory) {
      filtered = filtered.filter((i) => i.mainCategory === activeMainCategory);
    }
    if (activeCategory) {
      filtered = filtered.filter((i) =>
        Array.isArray(i.category)
          ? i.category.includes(activeCategory)
          : i.category === activeCategory,
      );
    }
    if (activeSubCategory) {
      filtered = filtered.filter((i) =>
        Array.isArray(i.subcategory)
          ? i.subcategory.includes(activeSubCategory)
          : i.subcategory === activeSubCategory,
      );
    }

    return filtered;
  }, [items, activeMainCategory, activeCategory, activeSubCategory]);

  const uniqueMainCategories = Array.from(
    new Set(items.map((i) => i.mainCategory).filter(Boolean)),
  );

  const uniqueCategories = useMemo(() => {
    if (!activeMainCategory) return [];
    return Array.from(
      new Set(
        items
          .filter((i) => i.mainCategory === activeMainCategory)
          .flatMap((i) =>
            Array.isArray(i.category) ? i.category : [i.category],
          )
          .filter(Boolean),
      ),
    );
  }, [items, activeMainCategory]);

  const uniqueSubCategories = useMemo(() => {
    if (!activeCategory) return [];
    return Array.from(
      new Set(
        items
          .filter((i) =>
            Array.isArray(i.category)
              ? i.category.includes(activeCategory)
              : i.category === activeCategory,
          )
          .flatMap((i) =>
            Array.isArray(i.subcategory) ? i.subcategory : [i.subcategory],
          )
          .filter(Boolean),
      ),
    );
  }, [items, activeCategory]);

  const handleSubCategoryClick = (subcategoryTitle: string) => {
    setActiveSubCategory(subcategoryTitle);
    setMobileFiltersOpen(false);
  };

  const handleCategoryClick = (categoryTitle: string) => {
    setActiveCategory(categoryTitle);
    setActiveSubCategory("");
    setMobileFiltersOpen(false);
  };

  const handleMainCategoryClick = (mainCategoryTitle: string) => {
    setActiveMainCategory(mainCategoryTitle);
    setActiveCategory("");
    setActiveSubCategory("");
    setMobileFiltersOpen(false);
  };

  const resetFilters = () => {
    setActiveMainCategory("");
    setActiveCategory("");
    setActiveSubCategory("");
    setMobileFiltersOpen(false);
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
                Please log in to access farm equipment management.
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
      <ToastContainer position="bottom-right" />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="w-full max-w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 break-words">
              Farm Equipment Management
            </h1>

            <div className="flex items-center justify-between sm:justify-end gap-3">
              <div className="bg-white border px-4 py-2 rounded-lg shadow-sm">
                <span className="block text-lg font-black text-blue-600 text-center">
                  {filtered.length}
                </span>
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                  RESULTS
                </span>
              </div>

              <button
                onClick={loadData}
                className="p-3 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-all"
                title="Refresh"
              >
                <FaSync className={loading ? "animate-spin" : "text-lg"} />
              </button>

              <button
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="sm:hidden flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                <FaFilter />
                {mobileFiltersOpen ? "Hide" : "Filters"}
              </button>
            </div>
          </div>

          <div className="hidden sm:block">
            <h2 className="text-lg sm:text-xl font-bold mb-3 text-gray-700 border-b pb-2">
              Main Categories
            </h2>
            <div className="flex flex-wrap gap-2 sm:gap-3 pb-6 border-b border-gray-200">
              <button
                onClick={resetFilters}
                className={getChipClass(
                  !activeMainCategory && !activeCategory && !activeSubCategory,
                )}
              >
                <FaList className="mr-2" /> All Equipment
              </button>

              {uniqueMainCategories.map((cat, index) => (
                <button
                  key={`main-cat-${cat}-${index}`}
                  onClick={() => handleMainCategoryClick(cat)}
                  className={getChipClass(activeMainCategory === cat)}
                >
                  <FaTractor className="mr-2" /> {cat}
                </button>
              ))}
            </div>

            {activeMainCategory && uniqueCategories.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg sm:text-xl font-bold mb-3 text-gray-700 border-b pb-2">
                  Categories in {activeMainCategory}
                </h2>
                <div className="flex flex-wrap gap-2 sm:gap-3 pb-6 border-b border-gray-200">
                  <button
                    onClick={() => handleCategoryClick("")}
                    className={getChipClass(!activeCategory)}
                  >
                    All {activeMainCategory}
                  </button>
                  {uniqueCategories.map((cat, index) => (
                    <button
                      key={`cat-${activeMainCategory}-${cat}-${index}`}
                      onClick={() => handleCategoryClick(cat)}
                      className={getChipClass(activeCategory === cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeCategory && uniqueSubCategories.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg sm:text-xl font-bold mb-3 text-gray-700 border-b pb-2">
                  Subcategories in {activeCategory}
                </h2>
                <div className="flex flex-wrap gap-2 sm:gap-3 pb-6 border-b border-gray-200">
                  <button
                    onClick={() => handleSubCategoryClick("")}
                    className={getChipClass(!activeSubCategory)}
                  >
                    All {activeCategory}
                  </button>
                  {uniqueSubCategories.map((sub, index) => (
                    <button
                      key={`sub-${activeCategory}-${sub}-${index}`}
                      onClick={() => handleSubCategoryClick(sub)}
                      className={getChipClass(activeSubCategory === sub)}
                    >
                      {sub}
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
                        !activeMainCategory &&
                        !activeCategory &&
                        !activeSubCategory
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      All Equipment
                    </button>
                    {uniqueMainCategories.map((cat, index) => (
                      <button
                        key={`mobile-main-cat-${cat}-${index}`}
                        onClick={() => handleMainCategoryClick(cat)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                          activeMainCategory === cat
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

              {activeMainCategory && uniqueCategories.length > 0 && (
                <div className="mb-4">
                  <button
                    onClick={() => toggleMobileSection("category")}
                    className="flex items-center justify-between w-full py-2 font-semibold text-gray-700"
                  >
                    <span>Categories in {activeMainCategory}</span>
                    {expandedMobileSection === "category" ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </button>
                  {expandedMobileSection === "category" && (
                    <div className="mt-2 space-y-2">
                      <button
                        onClick={() => handleCategoryClick("")}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                          !activeCategory
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        All {activeMainCategory}
                      </button>
                      {uniqueCategories.map((cat, index) => (
                        <button
                          key={`mobile-cat-${activeMainCategory}-${cat}-${index}`}
                          onClick={() => handleCategoryClick(cat)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                            activeCategory === cat
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
              )}

              {activeCategory && uniqueSubCategories.length > 0 && (
                <div className="mb-4">
                  <button
                    onClick={() => toggleMobileSection("subcategory")}
                    className="flex items-center justify-between w-full py-2 font-semibold text-gray-700"
                  >
                    <span>Subcategories in {activeCategory}</span>
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
                          !activeSubCategory
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        All {activeCategory}
                      </button>
                      {uniqueSubCategories.map((sub, index) => (
                        <button
                          key={`mobile-sub-${activeCategory}-${sub}-${index}`}
                          onClick={() => handleSubCategoryClick(sub)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                            activeSubCategory === sub
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {sub}
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
                        key={`tractor-mobile-${item._id || index}`}
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
                            <span>{item.isPaid ? "Unpaid" : "Paid"}</span>
                          </button>

                          <button
                            onClick={() => handleDelete(item._id)}
                            className="w-full py-3 px-2 bg-red-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-600 transition"
                          >
                            <FaTrashAlt size={14} /> <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-gray-500 border border-dashed rounded-lg">
                      No equipment found in the database
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
                          Main Category
                        </th>
                        <th className="border-b p-3 text-xs font-semibold text-left w-[12%]">
                          Category
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
                        filtered.map((item, index) => (
                          <tr
                            key={`tractor-desktop-${item._id || index}`}
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
                                  onClick={() => handleDelete(item._id)}
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
                            No equipment found in the database
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

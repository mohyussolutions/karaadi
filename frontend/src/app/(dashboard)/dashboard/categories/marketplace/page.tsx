"use client";

import React, { JSX, useEffect, useState } from "react";
import {
  FaTag,
  FaTools,
  FaHome,
  FaTrashAlt,
  FaEdit,
  FaCheckCircle,
  FaTimesCircle,
  FaList,
  FaTv,
  FaUtensils,
  FaMugHot,
  FaWineGlass,
  FaPalette,
  FaStar,
  FaBicycle,
  FaCouch,
  FaTshirt,
  FaDumbbell,
  FaChevronDown,
  FaChevronUp,
  FaFilter,
  FaTimes,
} from "react-icons/fa";
import { GiGoat } from "react-icons/gi";

import {
  getAdminMarketplaceItems,
  deleteAdminMarketplaceItem,
  updateAdminMarketplaceItemPaidStatus,
  AdminMarketplaceItem,
} from "@/actions/categories/marketplaceActions";

import { verifySession } from "@/actions/core/authAction";
import {
  AntiquesAndArtNestedSub,
  ElectronicsNestedSub,
  AnimalAndSuppliesNestedSub,
  SportsAndOutdoorsNestedSub,
  FurnitureNestedSub,
  FashionNestedSub,
} from "@/app/(links)/storeFrontLinks/nestedSubcategoryForMarketplace";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";

const PLACEHOLDER_IMAGE =
  "https://placehold.co/80x80/9ca3af/ffffff?text=No+Image";

const categoryMap: Record<string, any[]> = {
  "Antiques & Art": AntiquesAndArtNestedSub,
  Electronics: ElectronicsNestedSub,
  "Animal & Supplies": AnimalAndSuppliesNestedSub,
  "Sports & Outdoors": SportsAndOutdoorsNestedSub,
  Furniture: FurnitureNestedSub,
  Fashion: FashionNestedSub,
};

const marketplaceIcons: Record<string, JSX.Element> = {
  "Antiques & Art": <FaPalette className="mr-2" />,
  Electronics: <FaTv className="mr-2" />,
  "Animal & Supplies": <GiGoat className="mr-2" />,
  "Sports & Outdoors": <FaDumbbell className="mr-2" />,
  Furniture: <FaCouch className="mr-2" />,
  Fashion: <FaTshirt className="mr-2" />,
  "All Items": <FaList className="mr-2" />,
};

export default function Marketplace() {
  const [items, setItems] = useState<AdminMarketplaceItem[]>([]);
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
            await loadItems(session.accessToken);
          } else {
            setError(
              "You don't have permission to access this page. Admin or Manager role required.",
            );
            setLoading(false);
          }
        } else {
          setError("Please log in to access marketplace management");
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

  const loadItems = async (token?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminMarketplaceItems(token);
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load items");
      console.error("Error loading marketplace items:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (item: AdminMarketplaceItem) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    const success = await deleteAdminMarketplaceItem(item.id, userToken);
    if (success) {
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } else {
      alert("Failed to delete item. Please try again.");
    }
  };

  const handleTogglePaidStatus = async (item: AdminMarketplaceItem) => {
    const newStatus = !item.isPaid;

    const success = await updateAdminMarketplaceItemPaidStatus(
      item.id,
      newStatus,
      userToken,
    );
    if (success) {
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, isPaid: newStatus } : i)),
      );
    } else {
      alert("Failed to update paid status. Please try again.");
    }
  };

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

  const uniqueMainCategories = Array.from(
    new Set(items.map((i) => i.mainCategory)),
  );

  const uniqueCategories = activeMainCategory
    ? Array.from(
        new Set(
          items
            .filter((i) => i.mainCategory === activeMainCategory)
            .flatMap((i) =>
              Array.isArray(i.category) ? i.category : [i.category],
            ),
        ),
      ).filter(Boolean)
    : [];

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

  const getCategoryIcon = (title: string) => {
    return marketplaceIcons[title] || <FaTag className="mr-2" />;
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
                Please log in to access marketplace management.
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
              Marketplace Management
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
                className={getChipClass(
                  !activeMainCategory && !activeCategory && !activeSubCategory,
                )}
              >
                {getCategoryIcon("All Items")} All Items
              </button>

              {uniqueMainCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleMainCategoryClick(cat)}
                  className={getChipClass(activeMainCategory === cat)}
                >
                  {getCategoryIcon(cat)} {cat}
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
                    className={getChipClass(activeCategory === "")}
                  >
                    {getCategoryIcon("All")} All {activeMainCategory}
                  </button>
                  {uniqueCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className={getChipClass(activeCategory === cat)}
                    >
                      {getCategoryIcon(cat)} {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeCategory && categoryMap[activeMainCategory] && (
              <div className="mt-6">
                <h2 className="text-lg sm:text-xl font-bold mb-3 text-gray-700 border-b pb-2">
                  Subcategories in {activeCategory}
                </h2>
                <div className="flex flex-wrap gap-2 sm:gap-3 pb-6 border-b border-gray-200">
                  <button
                    onClick={() => handleSubCategoryClick("")}
                    className={getChipClass(activeSubCategory === "")}
                  >
                    {getCategoryIcon("All")} All {activeCategory}
                  </button>
                  {categoryMap[activeMainCategory].map((subCat: any) => (
                    <button
                      key={subCat.title}
                      onClick={() => handleSubCategoryClick(subCat.title)}
                      className={getChipClass(
                        activeSubCategory === subCat.title,
                      )}
                    >
                      <span className="mr-2">{subCat.icon}</span>
                      <span className="hidden sm:inline">{subCat.title}</span>
                      <span className="sm:hidden">
                        {subCat.so || subCat.title}
                      </span>
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
                      All Items
                    </button>
                    {uniqueMainCategories.map((cat) => (
                      <button
                        key={cat}
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
                          activeCategory === ""
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        All {activeMainCategory}
                      </button>
                      {uniqueCategories.map((cat) => (
                        <button
                          key={cat}
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

              {activeCategory && categoryMap[activeMainCategory] && (
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
                          activeSubCategory === ""
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        All {activeCategory}
                      </button>
                      {categoryMap[activeMainCategory].map((subCat: any) => (
                        <button
                          key={subCat.title}
                          onClick={() => handleSubCategoryClick(subCat.title)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                            activeSubCategory === subCat.title
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {subCat.so || subCat.title}
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
                    filtered.map((item) => (
                      <div
                        key={item.id}
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
                            <FaEdit size={12} />{" "}
                            <span className="truncate">Edit</span>
                          </button>

                          <button
                            onClick={() => handleDeleteItem(item)}
                            className="flex-1 py-2 px-2 bg-red-500 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1 hover:bg-red-600 transition"
                          >
                            <FaTrashAlt size={12} />{" "}
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
                      {filtered.length > 0 ? (
                        filtered.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50">
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
      </div>
    </div>
  );
}

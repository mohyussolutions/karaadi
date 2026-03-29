"use client";

import React, { JSX, useEffect, useState, useMemo } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaTrashAlt,
  FaCar,
  FaSpinner,
  FaUser,
  FaPhoneAlt,
  FaFilter,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import {
  carsSubCategories,
  carsNestedCategoriesMap,
} from "@/app/(links)/storeFrontLinks/nestedSubcategoryForCars";
import {
  deleteCarAction,
  toggleCarPayment,
  Car,
  getAllCarsAdmin,
} from "@/actions/categories/carActions";
import { verifySession } from "@/actions/core/authAction";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";

const PLACEHOLDER_IMAGE =
  "https://placehold.co/80x80/9ca3af/ffffff?text=No+Image";

const carIcons: Record<string, JSX.Element> = {
  "All Vehicles": <FaCar className="mr-2" />,
};

export default function CarsPage() {
  const [items, setItems] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userToken, setUserToken] = useState<string | undefined>();
  const [activeMainTitle, setActiveMainTitle] = useState("");
  const [activeSubTitle, setActiveSubTitle] = useState("");
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
          setError("Please log in to access car management");
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
      const data = await getAllCarsAdmin(token);
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load cars");
      console.error("Error loading cars:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePaid = async (carId: string, isPaid: boolean) => {
    if (!authenticated || !isAdmin) return;

    const originalItems = [...items];
    setItems((prev) =>
      prev.map((c) => (c.id === carId ? { ...c, isPaid: !isPaid } : c)),
    );

    const result = await toggleCarPayment(carId, isPaid, userToken);

    if (!result.success) {
      setItems(originalItems);
      alert("Failed to update payment status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!authenticated || !isAdmin) return;
    if (!window.confirm("Are you sure you want to delete this car?")) return;

    const originalItems = [...items];
    setItems((prev) => prev.filter((car) => car._id !== id));

    const result = await deleteCarAction(id, userToken);

    if (!result.success) {
      setItems(originalItems);
      alert("Failed to delete car");
    }
  };

  const filtered = useMemo(() => {
    let filtered = items;

    if (activeMainTitle) {
      filtered = filtered.filter((item) => {
        const itemCat = Array.isArray(item.category)
          ? item.category[0]
          : item.category;
        return itemCat === activeMainTitle;
      });
    }

    if (activeSubTitle) {
      filtered = filtered.filter((item) => {
        const itemSub = Array.isArray(item.subcategory)
          ? item.subcategory[0]
          : item.subcategory;
        return itemSub === activeSubTitle;
      });
    }

    return filtered;
  }, [items, activeMainTitle, activeSubTitle]);

  const uniqueMainCategories = carsSubCategories.map((cat) => cat.title);

  const getNestedItems = () => {
    if (!activeMainTitle) return [];
    return (
      (carsNestedCategoriesMap as Record<string, any[]>)[activeMainTitle] || []
    );
  };

  const handleSubCategoryClick = (subcategoryTitle: string) => {
    setActiveSubTitle(subcategoryTitle);
    setMobileFiltersOpen(false);
  };

  const handleMainCategoryClick = (mainCategoryTitle: string) => {
    setActiveMainTitle(mainCategoryTitle);
    setActiveSubTitle("");
    setMobileFiltersOpen(false);
  };

  const resetFilters = () => {
    setActiveMainTitle("");
    setActiveSubTitle("");
    setMobileFiltersOpen(false);
  };

  const getCategoryIcon = (title: string) => {
    const cat = carsSubCategories.find((c) => c.title === title);
    return cat?.icon || <FaCar className="mr-2" />;
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
                Please log in to access car management.
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
              Car Management
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
                className={getChipClass(!activeMainTitle && !activeSubTitle)}
              >
                <FaCar className="mr-2" /> All Vehicles
              </button>

              {uniqueMainCategories.map((cat, index) => {
                const category = carsSubCategories.find((c) => c.title === cat);
                return (
                  <button
                    key={`main-cat-${cat}-${index}`}
                    onClick={() => handleMainCategoryClick(cat)}
                    className={getChipClass(activeMainTitle === cat)}
                  >
                    <span className="mr-2">{category?.icon}</span>{" "}
                    {category?.so || cat}
                  </button>
                );
              })}
            </div>

            {activeMainTitle && getNestedItems().length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg sm:text-xl font-bold mb-3 text-gray-700 border-b pb-2">
                  Subcategories in{" "}
                  {carsSubCategories.find((c) => c.title === activeMainTitle)
                    ?.so || activeMainTitle}
                </h2>
                <div className="flex flex-wrap gap-2 sm:gap-3 pb-6 border-b border-gray-200">
                  <button
                    onClick={() => handleSubCategoryClick("")}
                    className={getChipClass(!activeSubTitle)}
                  >
                    All{" "}
                    {carsSubCategories.find((c) => c.title === activeMainTitle)
                      ?.so || activeMainTitle}
                  </button>
                  {getNestedItems().map((sub: any) => (
                    <button
                      key={`sub-cat-${activeMainTitle}-${sub.title}`}
                      onClick={() => handleSubCategoryClick(sub.title)}
                      className={getChipClass(activeSubTitle === sub.title)}
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
                        !activeMainTitle && !activeSubTitle
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      All Vehicles
                    </button>
                    {uniqueMainCategories.map((cat, index) => {
                      const category = carsSubCategories.find(
                        (c) => c.title === cat,
                      );
                      return (
                        <button
                          key={`mobile-main-cat-${cat}-${index}`}
                          onClick={() => handleMainCategoryClick(cat)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                            activeMainTitle === cat
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {category?.so || cat}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {activeMainTitle && getNestedItems().length > 0 && (
                <div className="mb-4">
                  <button
                    onClick={() => toggleMobileSection("subcategory")}
                    className="flex items-center justify-between w-full py-2 font-semibold text-gray-700"
                  >
                    <span>
                      Subcategories in{" "}
                      {carsSubCategories.find(
                        (c) => c.title === activeMainTitle,
                      )?.so || activeMainTitle}
                    </span>
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
                          !activeSubTitle
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        All{" "}
                        {carsSubCategories.find(
                          (c) => c.title === activeMainTitle,
                        )?.so || activeMainTitle}
                      </button>
                      {getNestedItems().map((sub: any) => (
                        <button
                          key={`mobile-sub-cat-${activeMainTitle}-${sub.title}`}
                          onClick={() => handleSubCategoryClick(sub.title)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                            activeSubTitle === sub.title
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
                    filtered.map((car, index) => (
                      <div
                        key={`car-mobile-${car.id || index}`}
                        className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm w-full"
                      >
                        <div className="flex gap-3">
                          <img
                            src={car.images?.[0] || PLACEHOLDER_IMAGE}
                            alt={car.title}
                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                            onError={handleImageError}
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 mb-1 truncate">
                              {car.title}
                            </h3>
                            <p className="text-xs text-gray-500 mb-1 truncate">
                              {car.category} • {car.subcategory}
                            </p>
                            <p className="text-lg font-bold text-blue-600">
                              ${car.price?.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="text-gray-500">City</span>
                            <p className="font-medium truncate">{car.city}</p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="text-gray-500">Status</span>
                            <p
                              className={`font-medium truncate ${car.isPaid ? "text-green-600" : "text-red-600"}`}
                            >
                              {car.isPaid ? "Paid" : "Unpaid"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Seller</p>
                          <p className="font-medium text-sm truncate">
                            {car.user?.username || "N/A"}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {car.user?.email}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {car.user?.phone}
                          </p>
                        </div>

                        <div className="mt-4 flex flex-col gap-2">
                          <button
                            onClick={() => handleTogglePaid(car.id, car.isPaid)}
                            className={`w-full py-3 px-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${
                              car.isPaid
                                ? "bg-yellow-500 text-white hover:bg-yellow-600"
                                : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                          >
                            {car.isPaid ? (
                              <FaTimesCircle size={14} />
                            ) : (
                              <FaCheckCircle size={14} />
                            )}
                            <span>
                              {car.isPaid ? "Mark as Unpaid" : "Mark as Paid"}
                            </span>
                          </button>

                          <button
                            onClick={() => handleDelete(car.id)}
                            className="w-full py-3 px-2 bg-red-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-600 transition"
                          >
                            <FaTrashAlt size={14} /> <span>Delete Car</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-gray-500 border border-dashed rounded-lg">
                      No cars found in the database
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
                        filtered.map((car, index) => (
                          <tr
                            key={`car-desktop-${car.id || index}`}
                            className="hover:bg-gray-50"
                          >
                            <td className="border-b p-3">
                              <img
                                src={car.images?.[0] || PLACEHOLDER_IMAGE}
                                alt={car.title}
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
                                title={car.category}
                              >
                                {car.category}
                              </span>
                            </td>
                            <td className="border-b p-3">
                              <span
                                className="text-sm block truncate"
                                title={car.subcategory}
                              >
                                {car.subcategory}
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
                              <div className="flex flex-col text-xs">
                                <span
                                  className="font-semibold truncate"
                                  title={car.user?.username}
                                >
                                  <FaUser
                                    className="inline mr-1 text-gray-400"
                                    size={10}
                                  />
                                  {car.user?.username || "N/A"}
                                </span>
                                <span
                                  className="text-gray-600 truncate"
                                  title={car.user?.email}
                                >
                                  {car.user?.email}
                                </span>
                                <span
                                  className="text-gray-600 truncate"
                                  title={car.user?.phone}
                                >
                                  <FaPhoneAlt
                                    className="inline mr-1 text-gray-400"
                                    size={8}
                                  />
                                  {car.user?.phone || "N/A"}
                                </span>
                              </div>
                            </td>
                            <td className="border-b p-3">
                              {car.isPaid ? (
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
                                  onClick={() =>
                                    handleTogglePaid(car.id, car.isPaid)
                                  }
                                  className={`p-1.5 rounded text-white text-xs transition flex items-center justify-center ${
                                    car.isPaid
                                      ? "bg-yellow-500 hover:bg-yellow-600"
                                      : "bg-green-600 hover:bg-green-700"
                                  }`}
                                  title={
                                    car.isPaid
                                      ? "Mark as Unpaid"
                                      : "Mark as Paid"
                                  }
                                >
                                  {car.isPaid ? (
                                    <FaTimesCircle size={12} />
                                  ) : (
                                    <FaCheckCircle size={12} />
                                  )}
                                </button>

                                <button
                                  onClick={() => handleDelete(car.id)}
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
                            No cars found in the database
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

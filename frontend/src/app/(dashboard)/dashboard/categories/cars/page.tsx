"use client";

import React, { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaTrashAlt,
  FaEdit,
  FaCar,
} from "react-icons/fa";
import { carsSubCategories } from "@/app/(storeFront)/components/navbar/mainCreateAdCategories/subCategories";
import {
  CarPartsNestedSub,
  CarsForSaleNestedSub,
  ElectricCarsNestedSub,
  LeaseCarsNestedSub,
  TrailerNestedSub,
  TruckNestedSub,
} from "@/app/(storeFront)/components/navbar/mainCreateAdCategories/nestedSubcategoryForCars";

const apiService = {
  verifySession: async () => {
    return { id: "mock-user-123", username: "AdminUser" };
  },
};

interface CategoryData {
  so: string;
  title: string;
  icon: React.ReactElement;
}

export default function CarsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMainCategory, setActiveMainCategory] = useState("");
  const [activeSubCategory, setActiveSubCategory] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });

  const showStatus = (text: string, type = "success") => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage({ text: "", type: "" }), 4000);
  };

  const checkAuthorization = async () => {
    try {
      const user: any = await apiService.verifySession();
      if (user && user.id) {
        setIsAuthorized(true);
      }
    } catch (error) {
      setIsAuthorized(false);
      showStatus("Authentication failed", "error");
    }
  };

  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:8080/api/cars/all-including-unpaid",
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      if (!res.ok) {
        showStatus("Failed to fetch cars. Check API status.", "error");
        return;
      }

      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      showStatus("Could not connect to car service.", "error");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthorization();
    fetchCars();
  }, []);

  const filtered = items.filter((item) => {
    if (activeMainCategory && item.category !== activeMainCategory)
      return false;
    if (activeSubCategory && item.subcategory !== activeSubCategory)
      return false;
    return true;
  });

  const uniqueMainCategories = Array.from(
    new Set(items.map((c) => c.category))
  );
  const uniqueSubCategories = Array.from(
    new Set(
      items
        .filter((c) => c.category === activeMainCategory)
        .map((c) => c.subcategory)
    )
  );

  const handleMainCategoryClick = (mainCategoryTitle: string) => {
    setActiveMainCategory(mainCategoryTitle);
    setActiveSubCategory("");
  };

  const handleSubCategoryClick = (subCategoryTitle: string) => {
    setActiveSubCategory(subCategoryTitle);
  };

  const resetFilters = () => {
    setActiveMainCategory("");
    setActiveSubCategory("");
  };

  const getCategoryIcon = (title: string) => {
    const category = carsSubCategories.find((cat) => cat.so === title);
    if (category) return category.icon;

    const allNested = [
      ...CarsForSaleNestedSub,
      ...LeaseCarsNestedSub,
      ...CarPartsNestedSub,
      ...TruckNestedSub,
      ...ElectricCarsNestedSub,
      ...TrailerNestedSub,
    ];
    const nestedCat = allNested.find((cat) => cat.so === title);
    if (nestedCat) return nestedCat.icon;

    return <FaCar className="mr-2" />;
  };

  const getChipClass = (isActive: boolean) =>
    `flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium transition duration-200 shadow-sm whitespace-nowrap ${
      isActive
        ? "bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 hover:shadow-md"
        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 hover:border-blue-400"
    }`;

  const getNestedSubCategories = () => {
    switch (activeMainCategory) {
      case "Gawaari iib ah":
        return CarsForSaleNestedSub;
      case "Gawaari kirayn":
        return LeaseCarsNestedSub;
      case "rimoor":
        return TrailerNestedSub;
      case "Qaybaha gawaarida":
        return CarPartsNestedSub;
      case "Baabuur xamuul":
        return TruckNestedSub;
      case "Gawaari Koronto":
        return ElectricCarsNestedSub;
      default:
        return [];
    }
  };

  const togglePaid = async (carId: string, isPaid: boolean) => {
    if (!isAuthorized) {
      showStatus("You must be authorized to change payment status.", "error");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/cars/${carId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPaid: !isPaid }),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const updatedCar = await res.json();
      setItems((prev) => prev.map((c) => (c.id === carId ? updatedCar : c)));
      showStatus(
        `Car marked as ${!isPaid ? "PAID" : "UNPAID"} successfully.`,
        "success"
      );
    } catch (err) {
      showStatus("Error toggling payment status.", "error");
    }
  };

  const deleteCar = async (id: string) => {
    if (!isAuthorized) {
      showStatus("You must be authorized to delete listings.", "error");
      return;
    }

    const proceed = window.confirm("Are you sure you want to delete this car?");
    if (!proceed) return;

    try {
      await fetch(`http://localhost:8080/api/cars/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setItems((prev) => prev.filter((car) => car.id !== id));
      showStatus("Car deleted successfully.", "success");
    } catch (err) {
      showStatus("Error deleting car.", "error");
    }
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
        Car Management Dashboard
      </h1>

      {statusMessage.text && (
        <div
          className={`p-3 mb-4 rounded-lg font-medium text-white shadow-md ${
            statusMessage.type === "error"
              ? "bg-red-500"
              : statusMessage.type === "info"
              ? "bg-blue-500"
              : "bg-green-500"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      <h2 className="text-xl font-bold mb-3 text-gray-700 border-b pb-2">
        Main Categories
      </h2>
      <div className="flex flex-wrap gap-3 pb-6 border-b border-gray-200">
        <button
          onClick={resetFilters}
          className={getChipClass(!activeMainCategory && !activeSubCategory)}
        >
          <FaCar className="mr-2" /> All Vehicles
        </button>

        {carsSubCategories.map((cat) => (
          <button
            key={cat.title}
            onClick={() => handleMainCategoryClick(cat.so)}
            className={getChipClass(activeMainCategory === cat.so)}
          >
            {getCategoryIcon(cat.so)} {cat.so}
          </button>
        ))}
      </div>

      {activeMainCategory && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-3 text-gray-700 border-b pb-2">
            Subcategories in <strong>{activeMainCategory}</strong>
          </h2>
          <div className="flex flex-wrap gap-3 pb-6 border-b border-gray-200">
            <button
              onClick={() => handleSubCategoryClick("")}
              className={getChipClass(activeSubCategory === "")}
            >
              All {activeMainCategory}
            </button>
            {getNestedSubCategories().map((subCat) => (
              <button
                key={subCat.title}
                onClick={() => handleSubCategoryClick(subCat.so)}
                className={getChipClass(activeSubCategory === subCat.so)}
              >
                {getCategoryIcon(subCat.so)} {subCat.so}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-10 text-gray-500">
          <div className="border-t-2 border-blue-500 border-solid rounded-full w-8 h-8 animate-spin mx-auto mb-3"></div>
          Loading vehicles...
        </div>
      )}

      {!loading && (
        <div className="overflow-x-auto mt-6">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="border p-2">Image</th>
                <th className="border p-2">Title</th>
                <th className="border p-2">Main Category</th>
                <th className="border p-2">Subcategory</th>
                <th className="border p-2">Brand</th>
                <th className="border p-2">Model</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Year</th>
                <th className="border p-2">Mileage</th>
                <th className="border p-2">Transmission</th>
                <th className="border p-2">Fuel Type</th>
                <th className="border p-2">Seller</th>
                <th className="border p-2">Paid</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length > 0 ? (
                filtered.map((car) => (
                  <tr key={car.id} className="hover:bg-gray-50">
                    <td className="border p-2">
                      <img
                        src={
                          car.images?.[0] ||
                          "https://placehold.co/80x80/9ca3af/ffffff?text=No+Image"
                        }
                        alt={car.title}
                        className="w-20 h-20 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/80x80/9ca3af/ffffff?text=No+Image";
                        }}
                      />
                    </td>

                    <td className="border p-2 font-medium">{car.title}</td>
                    <td className="border p-2">{car.category}</td>
                    <td className="border p-2">{car.subcategory}</td>
                    <td className="border p-2 font-semibold">{car.brand}</td>
                    <td className="border p-2">{car.vehicleModel}</td>
                    <td className="border p-2 font-semibold text-blue-700">
                      ${Number(car.price).toLocaleString()}
                    </td>
                    <td className="border p-2">{car.year || "N/A"}</td>
                    <td className="border p-2">
                      {car.mileage
                        ? `${car.mileage.toLocaleString()} km`
                        : "N/A"}
                    </td>
                    <td className="border p-2">{car.transmission || "N/A"}</td>
                    <td className="border p-2">{car.fuelType || "N/A"}</td>

                    <td className="border p-2">
                      {car.user ? (
                        <div className="flex flex-col">
                          <span className="font-semibold">
                            {car.user.username}
                          </span>
                          <span className="text-sm text-gray-600">
                            {car.user.email}
                          </span>
                          <span className="text-sm text-gray-600">
                            {car.user.phone}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">N/A</span>
                      )}
                    </td>

                    <td className="border p-2">
                      {car.isPaid ? (
                        <span className="text-green-600 font-semibold flex items-center">
                          <FaCheckCircle className="mr-1" /> PAID
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold flex items-center">
                          <FaTimesCircle className="mr-1" /> NOT PAID
                        </span>
                      )}
                    </td>

                    <td className="border p-2 flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => togglePaid(car.id, car.isPaid)}
                        disabled={!isAuthorized}
                        className={`
                          px-3 py-1 rounded text-white text-sm transition flex items-center justify-center gap-1
                          ${
                            isAuthorized
                              ? car.isPaid
                                ? "bg-yellow-500 hover:bg-yellow-600"
                                : "bg-green-600 hover:bg-green-700"
                              : "bg-gray-400 cursor-not-allowed"
                          }
                        `}
                      >
                        {car.isPaid ? (
                          <>
                            <FaTimesCircle /> Unmark Paid
                          </>
                        ) : (
                          <>
                            <FaCheckCircle /> Mark Paid
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => console.log(`Edit car: ${car.id}`)}
                        className="px-3 py-1 bg-blue-500 text-white rounded flex items-center justify-center gap-1 text-sm hover:bg-blue-600 transition"
                      >
                        <FaEdit /> Edit
                      </button>

                      <button
                        onClick={() => deleteCar(car.id)}
                        disabled={!isAuthorized}
                        className={`px-3 py-1 text-white rounded flex items-center justify-center gap-1 text-sm transition ${
                          isAuthorized
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <FaTrashAlt /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={14}
                    className="text-center py-10 text-gray-500 border"
                  >
                    No vehicles found in this category
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

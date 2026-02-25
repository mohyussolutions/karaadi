"use client";

import React, { useEffect, useState } from "react";

import {
  FaCheckCircle,
  FaTimesCircle,
  FaTrashAlt,
  FaEdit,
  FaShip,
} from "react-icons/fa";
import {
  BoatPartsNestedSub,
  BoatsForRentNestedSub,
  BoatsForSaleNestedSub,
  BoatEnginesNestedSub,
} from "@/app/(links)/storeFrontLinks/nestedSubcategoryForBoats";
import { boatsSubCategories } from "@/app/(links)/storeFrontLinks/subCategories";

const apiService = {
  verifySession: async () => {
    return { id: "mock-manager-123" };
  },
};

export default function BoatPages() {
  const [boats, setBoats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });

  const [activeMainCategory, setActiveMainCategory] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  const showStatus = (text: string, type = "success") => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage({ text: "", type: "" }), 4000);
  };

  const checkAuthorization = async () => {
    try {
      await apiService.verifySession();
      setIsAuthorized(true);
    } catch (error) {
      setIsAuthorized(false);
    }
  };

  const fetchBoats = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:8080/api/boats/all-including-unpaid",
        {
          credentials: "include",
          cache: "no-store",
        },
      );

      if (!res.ok) {
        showStatus("Failed to fetch boats. Check API status.", "error");
        return;
      }

      const data = await res.json();
      setBoats(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Boat fetch error:", err);
      showStatus("Could not connect to boat service.", "error");
      setBoats([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthorization();
    fetchBoats();
  }, []);

  let filtered = boats;

  if (activeMainCategory) {
    filtered = filtered.filter((b) => b.category === activeMainCategory);
  }

  if (activeCategory) {
    filtered = filtered.filter((b) => b.subCategory === activeCategory);
  }

  const handleMainCategoryClick = (mainCategoryTitle: string) => {
    setActiveMainCategory(mainCategoryTitle);
    setActiveCategory("");
  };

  const handleSubCategoryClick = (subCategoryTitle: string) => {
    setActiveCategory(subCategoryTitle);
  };

  const resetFilters = () => {
    setActiveMainCategory("");
    setActiveCategory("");
  };

  const getCategoryIcon = (title: string) => {
    const category = boatsSubCategories.find((cat) => cat.so === title);
    if (category) return category.icon;

    const allNested = [
      ...BoatsForSaleNestedSub,
      ...BoatsForRentNestedSub,
      ...BoatEnginesNestedSub,
      ...BoatPartsNestedSub,
    ];
    const nestedCat = allNested.find((cat) => cat.so === title);
    if (nestedCat) return nestedCat.icon;

    return <FaShip className="mr-2" />;
  };

  const getChipClass = (isActive: boolean) =>
    `flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium transition duration-200 shadow-sm whitespace-nowrap ${
      isActive
        ? "bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 hover:shadow-md"
        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 hover:border-blue-400"
    }`;

  const getNestedSubCategories = () => {
    switch (activeMainCategory) {
      case "Doomo iib ah":
        return BoatsForSaleNestedSub;
      case "Doomo kireysi ah":
        return BoatsForRentNestedSub;
      case "Matoorada doomo iib ah":
        return BoatEnginesNestedSub;
      case "Qaybaha doomo":
        return BoatPartsNestedSub;
      default:
        return [];
    }
  };

  const togglePaid = async (boatId: string, isPaid: boolean) => {
    if (!isAuthorized) {
      showStatus(
        "Unauthorized: You must be a manager to change payment status.",
        "error",
      );
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/boats/${boatId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPaid: !isPaid }),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const updatedBoat = await res.json();
      setBoats((prev) => prev.map((b) => (b.id === boatId ? updatedBoat : b)));
      showStatus(
        `Boat marked as ${!isPaid ? "PAID" : "UNPAID"} successfully.`,
        "success",
      );
    } catch (err) {
      showStatus("Error toggling payment status.", "error");
      console.error("Toggle error:", err);
    }
  };

  const deleteBoat = async (id: string) => {
    if (!isAuthorized) {
      showStatus(
        "Unauthorized: You must be a manager to delete listings.",
        "error",
      );
      return;
    }

    const proceed = window.confirm(
      "Are you sure you want to delete this boat?",
    );
    if (!proceed) return;

    try {
      await fetch(`http://localhost:8080/api/boats/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setBoats((prev) => prev.filter((boat) => boat.id !== id));
      showStatus("Boat deleted successfully.", "success");
    } catch (err) {
      showStatus("Error deleting boat.", "error");
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
        Boat Management Dashboard
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
          className={getChipClass(!activeMainCategory && !activeCategory)}
        >
          <FaShip className="mr-2" /> All Boats
        </button>

        {boatsSubCategories.map((cat) => (
          <button
            key={cat.title}
            onClick={() => handleMainCategoryClick(cat.so || "")}
            className={getChipClass(activeMainCategory === cat.so)}
          >
            {getCategoryIcon(cat.so || "")} {cat.so}
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
              className={getChipClass(activeCategory === "")}
            >
              All {activeMainCategory}
            </button>
            {getNestedSubCategories().map((subCat) => (
              <button
                key={subCat.title}
                onClick={() => handleSubCategoryClick(subCat.so || "")}
                className={getChipClass(activeCategory === subCat.so)}
              >
                {getCategoryIcon(subCat.so || "")} {subCat.so}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-10 text-gray-500">
          <div className="border-t-2 border-blue-500 border-solid rounded-full w-8 h-8 animate-spin mx-auto mb-3"></div>
          Loading boats...
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
                <th className="border p-2">Price</th>
                <th className="border p-2">City</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Seller</th>
                <th className="border p-2">Paid</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length > 0 ? (
                filtered.map((boat) => (
                  <tr key={boat.id} className="hover:bg-gray-50">
                    <td className="border p-2">
                      <img
                        src={
                          boat.images?.[0] ||
                          "https://placehold.co/80x80/9ca3af/ffffff?text=No+Image"
                        }
                        alt={boat.title}
                        className="w-20 h-20 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/80x80/9ca3af/ffffff?text=No+Image";
                        }}
                      />
                    </td>

                    <td className="border p-2 font-medium">{boat.title}</td>
                    <td className="border p-2">{boat.category}</td>
                    <td className="border p-2">{boat.subCategory}</td>
                    <td className="border p-2 font-semibold text-blue-700">
                      ${Number(boat.price).toLocaleString()}
                    </td>
                    <td className="border p-2">{boat.city}</td>
                    <td className="border p-2">{boat.type}</td>

                    <td className="border p-2">
                      {boat.user ? (
                        <div className="flex flex-col">
                          <span className="font-semibold">
                            {boat.user.username}
                          </span>
                          <span className="text-sm text-gray-600">
                            {boat.user.email}
                          </span>
                          <span className="text-sm text-gray-600">
                            {boat.user.phone}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">N/A</span>
                      )}
                    </td>

                    <td className="border p-2">
                      {boat.isPaid ? (
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
                        onClick={() => togglePaid(boat.id, boat.isPaid)}
                        disabled={!isAuthorized}
                        className={`
                          px-3 py-1 rounded text-white text-sm transition flex items-center justify-center gap-1
                          ${
                            isAuthorized
                              ? boat.isPaid
                                ? "bg-yellow-500 hover:bg-yellow-600"
                                : "bg-green-600 hover:bg-green-700"
                              : "bg-gray-400 cursor-not-allowed"
                          }
                        `}
                      >
                        {boat.isPaid ? (
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
                        onClick={() => console.log(`Edit boat: ${boat.id}`)}
                        className="px-3 py-1 bg-blue-500 text-white rounded flex items-center justify-center gap-1 text-sm hover:bg-blue-600 transition"
                      >
                        <FaEdit /> Edit
                      </button>

                      <button
                        onClick={() => deleteBoat(boat.id)}
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
                    colSpan={10}
                    className="text-center py-10 text-gray-500 border"
                  >
                    No boats found in this category
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

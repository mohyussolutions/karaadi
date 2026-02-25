"use client";

import React, { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaTrashAlt,
  FaEdit,
  FaCar,
} from "react-icons/fa";
import {
  carsSubCategories,
  carsNestedCategoriesMap,
} from "@/app/(links)/storeFrontLinks/nestedSubcategoryForCars";

const apiService = {
  verifySession: async () => {
    return { id: "admin-123", username: "AdminUser" };
  },
};

export default function CarsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMainTitle, setActiveMainTitle] = useState("");
  const [activeSubTitle, setActiveSubTitle] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });

  const showStatus = (text: string, type = "success") => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage({ text: "", type: "" }), 4000);
  };

  const checkAuthorization = async () => {
    try {
      const user: any = await apiService.verifySession();
      if (user?.id) setIsAuthorized(true);
    } catch (error) {
      setIsAuthorized(false);
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
        },
      );
      if (!res.ok) throw new Error();
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
    const itemCat = Array.isArray(item.category)
      ? item.category[0]
      : item.category;
    const itemSub = Array.isArray(item.subcategory)
      ? item.subcategory[0]
      : item.subcategory;

    if (activeMainTitle && itemCat !== activeMainTitle) return false;
    if (activeSubTitle && itemSub !== activeSubTitle) return false;
    return true;
  });

  const handleMainCategoryClick = (title: string) => {
    setActiveMainTitle(title);
    setActiveSubTitle("");
  };

  const resetFilters = () => {
    setActiveMainTitle("");
    setActiveSubTitle("");
  };

  const getChipClass = (isActive: boolean) =>
    `flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium transition duration-200 shadow-sm whitespace-nowrap ${
      isActive
        ? "bg-blue-600 text-white border border-blue-600 shadow-md"
        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
    }`;

  const togglePaid = async (carId: string, isPaid: boolean) => {
    if (!isAuthorized) return showStatus("Unauthorized", "error");
    try {
      const res = await fetch(`http://localhost:8080/api/cars/${carId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPaid: !isPaid }),
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      const updatedCar = await res.json();
      setItems((prev) => prev.map((c) => (c.id === carId ? updatedCar : c)));
      showStatus(`Updated to ${!isPaid ? "PAID" : "UNPAID"}`);
    } catch (err) {
      showStatus("Update failed", "error");
    }
  };

  const deleteCar = async (id: string) => {
    if (!isAuthorized) return showStatus("Unauthorized", "error");
    if (!window.confirm("Delete this listing?")) return;
    try {
      await fetch(`http://localhost:8080/api/cars/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setItems((prev) => prev.filter((car) => car.id !== id));
      showStatus("Deleted successfully");
    } catch (err) {
      showStatus("Delete failed", "error");
    }
  };

  return (
    <div className="px-4 py-6 max-w-[1600px] mx-auto">
      <h1 className="text-3xl font-black text-gray-800 mb-6">Car Management</h1>

      {statusMessage.text && (
        <div
          className={`p-3 mb-4 rounded-xl text-white font-bold shadow-lg animate-bounce ${
            statusMessage.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      <div className="flex flex-wrap gap-3 pb-6 border-b">
        <button
          onClick={resetFilters}
          className={getChipClass(!activeMainTitle)}
        >
          <FaCar className="mr-2" /> All Vehicles
        </button>
        {carsSubCategories.map((cat) => (
          <button
            key={cat.title}
            onClick={() => handleMainCategoryClick(cat.title)}
            className={getChipClass(activeMainTitle === cat.title)}
          >
            <span className="mr-2">{cat.icon}</span> {cat.so}
          </button>
        ))}
      </div>

      {activeMainTitle && carsNestedCategoriesMap[activeMainTitle] && (
        <div className="mt-6 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-wrap gap-3 pb-6 border-b">
            <button
              onClick={() => setActiveSubTitle("")}
              className={getChipClass(activeSubTitle === "")}
            >
              All{" "}
              {carsSubCategories.find((c) => c.title === activeMainTitle)?.so}
            </button>
            {carsNestedCategoriesMap[activeMainTitle].map((sub) => (
              <button
                key={sub.title}
                onClick={() => setActiveSubTitle(sub.title)}
                className={getChipClass(activeSubTitle === sub.title)}
              >
                <span className="mr-2">{sub.icon}</span> {sub.so}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-xl font-bold text-gray-400">
          Loading listings...
        </div>
      ) : (
        <div className="overflow-x-auto mt-6 rounded-2xl border shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-bold text-gray-600">Vehicle</th>
                <th className="p-4 font-bold text-gray-600">Category</th>
                <th className="p-4 font-bold text-gray-600">Price</th>
                <th className="p-4 font-bold text-gray-600">Seller</th>
                <th className="p-4 font-bold text-gray-600">Status</th>
                <th className="p-4 font-bold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((car) => (
                <tr key={car.id} className="hover:bg-blue-50/30 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={car.images?.[0] || "https://placehold.co/100"}
                        className="w-14 h-14 object-cover rounded-lg shadow-sm"
                        alt=""
                      />
                      <span className="font-bold text-gray-800">
                        {car.title}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs font-bold uppercase text-gray-400">
                      {car.category}
                    </div>
                    <div className="text-sm text-gray-600">
                      {car.subcategory}
                    </div>
                  </td>
                  <td className="p-4 font-black text-blue-600">
                    ${Number(car.price).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-bold">
                      {car.user?.username || "Guest"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {car.user?.phone}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black ${
                        car.isPaid
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {car.isPaid ? "PAID" : "UNPAID"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => togglePaid(car.id, car.isPaid)}
                        className={`p-2 rounded-lg text-white transition ${car.isPaid ? "bg-orange-400" : "bg-green-500"}`}
                      >
                        {car.isPaid ? <FaTimesCircle /> : <FaCheckCircle />}
                      </button>
                      <button
                        onClick={() => deleteCar(car.id)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-20 text-center text-gray-400 font-medium">
              No vehicles found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

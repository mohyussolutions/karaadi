"use client";

import {
  fetchAdminRealEstate,
  deleteRealEstate,
  updatePaidStatus,
} from "@/actions/categories/realEstateActions";
import { realEstateSubCategories } from "@/app/(links)/storeFrontLinks/subCategories";
import React, { useEffect, useState } from "react";

export default function RealEstatePage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminRealEstate();
      setItems(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete?")) return;
    try {
      const res = await deleteRealEstate(id);
      if (res.success) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        alert("Deleted successfully");
      } else {
        alert("Delete failed on server");
      }
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleTogglePaid = async (item: any) => {
    try {
      const newStatus = !item.isPaid;
      const res = await updatePaidStatus(item.id, newStatus);

      if (res.success) {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, isPaid: newStatus } : i)),
        );
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      alert("Update failed");
    }
  };

  const filtered =
    activeCategory === ""
      ? items
      : items.filter((i) => i.subCategory === activeCategory);

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Real Estate Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pb-6">
        <button
          onClick={() => setActiveCategory("")}
          className={`px-3 py-2 rounded-lg border text-sm transition text-center ${
            activeCategory === ""
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {realEstateSubCategories.map((cat) => (
          <button
            key={cat.so}
            onClick={() => setActiveCategory(cat.so || "")}
            className={`px-3 py-2 rounded-lg border text-sm transition text-center ${
              activeCategory === cat.so
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat.so}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500 font-medium">
          Loading property listings...
        </div>
      ) : (
        <div className="overflow-x-auto mt-6">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="border p-2">Image</th>
                <th className="border p-2">Title</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Location</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Details</th>
                <th className="border p-2">Seller</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="border p-2">
                      <img
                        src={item.images?.[0] || "/placeholder-house.png"}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded shadow-sm"
                      />
                    </td>
                    <td className="border p-2 font-medium">{item.title}</td>
                    <td className="border p-2 text-blue-700 font-bold">
                      ${item.price.toLocaleString()}
                    </td>
                    <td className="border p-2 text-sm">
                      {item.region}, {item.city}
                    </td>
                    <td className="border p-2 text-sm italic">
                      {item.subCategory}
                    </td>
                    <td className="border p-2 text-xs leading-relaxed">
                      {item.bedrooms}B / {item.bathrooms}Ba <br />
                      {item.squareFeet} sqft
                    </td>
                    <td className="border p-2">
                      <div className="text-xs">
                        <p className="font-bold">
                          {item.user?.username || "N/A"}
                        </p>
                        <p className="text-gray-500">{item.user?.phone}</p>
                      </div>
                    </td>
                    <td className="border p-2 text-center">
                      <span
                        className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${
                          item.isPaid
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.isPaid ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                    <td className="border p-2">
                      <div className="flex flex-col gap-1.5">
                        <button
                          onClick={() => handleTogglePaid(item)}
                          className={`px-2 py-1 text-xs text-white rounded font-medium transition ${
                            item.isPaid
                              ? "bg-orange-500 hover:bg-orange-600"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {item.isPaid ? "Unmark" : "Mark Paid"}
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-2 py-1 text-xs bg-red-500 text-white rounded font-medium hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center py-12 border text-gray-400 italic"
                  >
                    No properties found in this category.
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

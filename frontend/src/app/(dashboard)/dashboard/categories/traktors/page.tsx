"use client";

import { traktorSubCategories } from "@/app/(storeFront)/components/navbar/mainCreateAdCategories/subCategories";
import React, { useEffect, useState } from "react";

export default function TraktorsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    const fetchTraktors = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/api/traktor/all-including-unpaid",
          { cache: "no-store", credentials: "include" }
        );
        if (!res.ok) throw new Error("Failed to fetch traktors");
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error("Error fetching traktors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTraktors();
  }, []);

  const filtered =
    activeCategory === ""
      ? items
      : items.filter((i) => i.subCategory === activeCategory);

  const deleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete?")) return;
    try {
      await fetch(`http://localhost:8080/api/traktor/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setItems((prev) => prev.filter((item) => item.id !== id));
      alert("Deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const togglePaidStatus = async (tractor: any) => {
    const newStatus = !tractor.isPaid;
    try {
      const res = await fetch(
        `http://localhost:8080/api/traktor/${tractor.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isPaid: newStatus }),
          credentials: "include",
        }
      );
      if (!res.ok) return;
      setItems((prev) =>
        prev.map((t) => (t.id === tractor.id ? { ...t, isPaid: newStatus } : t))
      );
    } catch (err) {
      console.error("Toggle paid error:", err);
    }
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Traktors</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pb-6">
        {traktorSubCategories.map((cat) => (
          <button
            key={cat.so}
            onClick={() => setActiveCategory(cat.so)}
            className={`px-3 py-2 rounded-lg border text-sm transition text-center ${
              activeCategory === cat.so
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat.so}
          </button>
        ))}
        <button
          onClick={() => setActiveCategory("")}
          className="px-3 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition text-sm text-center"
        >
          All
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading traktors...
        </div>
      ) : (
        <div className="overflow-x-auto mt-6">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="border p-2">Image</th>
                <th className="border p-2">Title</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Region</th>
                <th className="border p-2">City</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Seller</th>
                <th className="border p-2">Paid</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length > 0 ? (
                filtered.map((tractor) => (
                  <tr key={tractor.id} className="hover:bg-gray-50">
                    <td className="border p-2">
                      <img
                        src={
                          tractor.images?.[0] ??
                          "https://placehold.co/80x80/9ca3af/ffffff?text=No+Image"
                        }
                        alt={tractor.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                    </td>
                    <td className="border p-2 font-medium">{tractor.title}</td>
                    <td className="border p-2">${tractor.price}</td>
                    <td className="border p-2">{tractor.region || "—"}</td>
                    <td className="border p-2">{tractor.city || "—"}</td>
                    <td className="border p-2">{tractor.subCategory}</td>
                    <td className="border p-2">
                      <div className="flex flex-col">
                        <span className="font-semibold">
                          {tractor.user?.username}
                        </span>
                        <span className="text-sm text-gray-600">
                          {tractor.user?.email}
                        </span>
                        <span className="text-sm text-gray-600">
                          {tractor.user?.phone}
                        </span>
                      </div>
                    </td>
                    <td className="border p-2">
                      {tractor.isPaid ? (
                        <span className="text-green-600 font-semibold">
                          PAID
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          NOT PAID
                        </span>
                      )}
                    </td>
                    <td className="border p-2 flex gap-2 flex-wrap">
                      <button
                        onClick={() => togglePaidStatus(tractor)}
                        className={`px-3 py-1 rounded text-white text-sm ${
                          tractor.isPaid
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {tractor.isPaid ? "Unmark" : "Mark Paid"}
                      </button>

                      <button
                        onClick={() => alert("Edit " + tractor.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteItem(tractor.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center py-10 text-gray-500 border"
                  >
                    No traktors found
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

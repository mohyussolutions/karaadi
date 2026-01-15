"use client";


import { realEstateSubCategories } from "@/app/(links)/storeFrontLinks/subCategories";
import React, { useEffect, useState } from "react";

export default function RealEstatePage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("");

  useEffect(() => {
    const fetchRealEstates = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/api/real-estate/all-including-unpaid",
          {
            cache: "no-store",
            credentials: "include",
          }
        );

        if (res.ok) {
          const data = await res.json();
          setItems(data);
        }
      } catch (err) {
        console.error("Error fetching real estate:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRealEstates();
  }, []);

  const filtered =
    activeCategory === ""
      ? items
      : items.filter((i) => i.subCategory === activeCategory);

  const deleteItem = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    try {
      await fetch(`http://localhost:8080/api/real-estate/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      setItems((prev) => prev.filter((item) => item.id !== id));
      alert("Deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const togglePaidStatus = async (item: any) => {
    try {
      const newStatus = !item.isPaid;

      const res = await fetch(
        `http://localhost:8080/api/real-estate/${item.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isPaid: newStatus }),
          credentials: "include",
        }
      );

      if (!res.ok) return;

      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, isPaid: newStatus } : i))
      );
    } catch (err) {
      console.error("Toggle paid error:", err);
    }
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Real Estate</h1>

      {/* Somali categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pb-6">
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

        <button
          onClick={() => setActiveCategory("")}
          className="px-3 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition text-sm text-center"
        >
          All
        </button>
      </div>

      {loading && (
        <div className="text-center py-10 text-gray-500">
          Loading real estate...
        </div>
      )}

      {!loading && (
        <div className="overflow-x-auto mt-6">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="border p-2">Image</th>
                <th className="border p-2">Title</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Region</th>
                <th className="border p-2">City</th>
                <th className="border p-2">Subcategory</th>
                <th className="border p-2">Beds</th>
                <th className="border p-2">Baths</th>
                <th className="border p-2">SqFt</th>
                <th className="border p-2">Seller</th>
                <th className="border p-2">Paid</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="border p-2">
                      <img
                        src={item.images?.[0]}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                    </td>

                    <td className="border p-2 font-medium">{item.title}</td>
                    <td className="border p-2">${item.price}</td>
                    <td className="border p-2">{item.region}</td>
                    <td className="border p-2">{item.city}</td>
                    <td className="border p-2">{item.subCategory}</td>
                    <td className="border p-2">{item.bedrooms}</td>
                    <td className="border p-2">{item.bathrooms}</td>
                    <td className="border p-2">{item.squareFeet}</td>

                    <td className="border p-2">
                      <div className="flex flex-col">
                        <span className="font-semibold">
                          {item.user?.username}
                        </span>
                        <span className="text-sm text-gray-600">
                          {item.user?.email}
                        </span>
                        <span className="text-sm text-gray-600">
                          {item.user?.phone}
                        </span>
                      </div>
                    </td>

                    <td className="border p-2">
                      {item.isPaid ? (
                        <span className="text-green-600 font-semibold">
                          PAID
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          NOT PAID
                        </span>
                      )}
                    </td>

                    <td className="border p-2 flex gap-2">
                      <button
                        onClick={() => alert("Edit " + item.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => togglePaidStatus(item)}
                        className={`px-3 py-1 rounded text-white ${
                          item.isPaid ? "bg-yellow-500" : "bg-green-600"
                        }`}
                      >
                        {item.isPaid ? "Unmark" : "Mark Paid"}
                      </button>

                      <button
                        onClick={() => deleteItem(item.id)}
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
                    colSpan={12}
                    className="text-center py-10 text-gray-500 border"
                  >
                    No properties found
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

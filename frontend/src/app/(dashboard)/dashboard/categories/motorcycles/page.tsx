"use client";
import { motorcyclesSubCategories } from "../../../../(links)/storeFrontLinks/subCategories";
import React, { useEffect, useState } from "react";

export default function MotorcyclesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  const fetchMotorcycles = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:8080/api/motorcycles/all-including-unpaid",
        { cache: "no-store", credentials: "include" }
      );
      if (!res.ok) return;
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Error fetching motorcycles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMotorcycles();
  }, []);

  const handleDeleteClick = (item: any) => {
    setItemToDelete(item);
    setShowDeleteConfirmation(true);
  };

  const confirmDeletion = async () => {
    if (!itemToDelete) return;

    setShowDeleteConfirmation(false);

    try {
      await fetch(`http://localhost:8080/api/motorcycles/${itemToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      setItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setItemToDelete(null);
    }
  };

  const cancelDeletion = () => {
    setShowDeleteConfirmation(false);
    setItemToDelete(null);
  };

  const togglePaidStatus = async (item: any) => {
    const newStatus = !item.isPaid;

    try {
      const res = await fetch(
        `http://localhost:8080/api/motorcycles/${item.id}`,
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

  const filtered =
    activeCategory === ""
      ? items
      : items.filter((i) => i.subCategory === activeCategory);

  return (
    <div className="px-4 py-6">
      {showDeleteConfirmation && itemToDelete && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-red-600">
              ❗ Confirm Deletion
            </h2>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete:
              <span className="font-semibold text-blue-600 block mt-1">
                "{itemToDelete.title}"
              </span>
              ?
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDeletion}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={confirmDeletion}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">Motorcycles</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pb-6">
        {motorcyclesSubCategories.map((cat) => (
          <button
            key={cat.so}
            onClick={() => setActiveCategory(cat.so || "")}
            className={`px-3 py-2 rounded-lg border text-sm text-center ${
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
          className="px-3 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm text-center"
        >
          All
        </button>
      </div>

      {loading && (
        <div className="text-center py-10 text-gray-500">
          Loading motorcycles...
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
                <th className="border p-2">City</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Seller</th>
                <th className="border p-2">Paid</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length > 0 ? (
                filtered.map((moto) => (
                  <tr key={moto.id} className="hover:bg-gray-50">
                    <td className="border p-2">
                      <img
                        src={
                          moto.images?.[0] ||
                          "https://placehold.co/80x80/9ca3af/ffffff?text=No+Image"
                        }
                        alt={moto.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                    </td>

                    <td className="border p-2 font-medium">{moto.title}</td>
                    <td className="border p-2">${moto.price}</td>
                    <td className="border p-2">{moto.city}</td>
                    <td className="border p-2">{moto.subCategory}</td>

                    <td className="border p-2">
                      <div className="flex flex-col">
                        <span className="font-semibold">
                          {moto.user?.username}
                        </span>
                        <span className="text-sm text-gray-600">
                          {moto.user?.email}
                        </span>
                        <span className="text-sm text-gray-600">
                          {moto.user?.phone}
                        </span>
                      </div>
                    </td>

                    <td className="border p-2">
                      {moto.isPaid ? (
                        <span className="text-green-600 font-semibold">
                          PAID
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          NOT PAID
                        </span>
                      )}
                    </td>

                    <td className="border p-2 flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => togglePaidStatus(moto)}
                        className={`px-3 py-1 rounded text-white text-sm ${
                          moto.isPaid
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {moto.isPaid ? "Unmark" : "Mark Paid"}
                      </button>

                      <button
                        onClick={() => alert("Edit " + moto.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteClick(moto)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-10 text-gray-500 border"
                  >
                    No motorcycles found
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

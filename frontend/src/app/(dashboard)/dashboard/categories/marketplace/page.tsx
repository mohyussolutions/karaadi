"use client";

import React, { useEffect, useState, ReactElement } from "react";
import {
  FaTag,
  FaTools,
  FaHome,
  FaCar,
  FaMotorcycle,
  FaShip,
  FaTractor,
  FaTrashAlt,
  FaEdit,
  FaCheckCircle,
  FaTimesCircle,
  FaList,
} from "react-icons/fa";

interface MarketplaceItem {
  id: string;
  title: string;
  mainCategory: string;
  // Assuming these are arrays based on previous context, or at least need to be handled as such
  category: string | string[];
  subcategory: string | string[];
  price: number;
  city: string;
  images: string[];
  isPaid: boolean;
  user?: {
    username: string;
    email: string;
    phone: string;
  };
}

export default function Marketplace() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMainCategory, setActiveMainCategory] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [activeSubCategory, setActiveSubCategory] = useState("");

  const fetchMarketplace = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:8080/api/marketplace/all-including-unpaid",
        {
          cache: "no-store",
          credentials: "include",
        }
      );
      if (!res.ok) {
        console.error("Failed to fetch data");
        return;
      }
      // Cast the data to the defined interface for better safety
      const data: MarketplaceItem[] = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Error fetching marketplace data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketplace();
  }, []);

  const deleteItem = async (item: MarketplaceItem) => {
    try {
      await fetch(`http://localhost:8080/api/marketplace/${item.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const togglePaidStatus = async (item: MarketplaceItem) => {
    const newStatus = !item.isPaid;

    try {
      const res = await fetch(
        `http://localhost:8080/api/marketplace/${item.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isPaid: newStatus }),
          credentials: "include",
        }
      );

      if (!res.ok) {
        console.error("Failed to update status");
        return;
      }

      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, isPaid: newStatus } : i))
      );
    } catch (err) {
      console.error("Toggle paid error:", err);
    }
  };

  let filtered = items;

  if (activeMainCategory) {
    filtered = filtered.filter((i) => i.mainCategory === activeMainCategory);
  }

  if (activeCategory) {
    // Check if category is a string or array and filter accordingly
    filtered = filtered.filter((i) =>
      Array.isArray(i.category)
        ? i.category.includes(activeCategory)
        : i.category === activeCategory
    );
  }

  if (activeSubCategory) {
    // Check if subcategory is a string or array and filter accordingly
    filtered = filtered.filter((i) =>
      Array.isArray(i.subcategory)
        ? i.subcategory.includes(activeSubCategory)
        : i.subcategory === activeSubCategory
    );
  }

  const uniqueMainCategories = Array.from(
    new Set(items.map((i) => i.mainCategory))
  );

  // FIX: Use flatMap to handle category array/string, filter out empty values
  const uniqueCategories = Array.from(
    new Set(
      items
        .filter((i) => i.mainCategory === activeMainCategory)
        .flatMap((i) => (Array.isArray(i.category) ? i.category : [i.category]))
    )
  ).filter(Boolean);

  // FIX: Use flatMap to handle subcategory array/string, filter out empty values
  const uniqueSubCategories = Array.from(
    new Set(
      items
        .filter((i) =>
          Array.isArray(i.category)
            ? i.category.includes(activeCategory)
            : i.category === activeCategory
        )
        .flatMap((i) =>
          Array.isArray(i.subcategory) ? i.subcategory : [i.subcategory]
        )
    )
  ).filter(Boolean);

  const handleSubCategoryClick = (subcategoryTitle: string) => {
    setActiveSubCategory(subcategoryTitle);
  };

  const handleCategoryClick = (categoryTitle: string) => {
    setActiveCategory(categoryTitle);
    setActiveSubCategory("");
  };

  const handleMainCategoryClick = (mainCategoryTitle: string) => {
    setActiveMainCategory(mainCategoryTitle);
    setActiveCategory("");
    setActiveSubCategory("");
  };

  const resetFilters = () => {
    setActiveMainCategory("");
    setActiveCategory("");
    setActiveSubCategory("");
  };

  const getCategoryIcon = (title: string | unknown) => {
    if (typeof title !== "string" || !title) {
      return <FaTag className="mr-2" />;
    }

    const normalizedTitle = title.toLowerCase();

    if (normalizedTitle.includes("all") || normalizedTitle.includes("items"))
      return <FaList className="mr-2" />;
    if (normalizedTitle.includes("electronics"))
      return <FaTools className="mr-2" />;
    if (
      normalizedTitle.includes("real estate") ||
      normalizedTitle.includes("property")
    )
      return <FaHome className="mr-2" />;
    if (normalizedTitle.includes("cars")) return <FaCar className="mr-2" />;
    if (normalizedTitle.includes("motorcycles"))
      return <FaMotorcycle className="mr-2" />;
    if (normalizedTitle.includes("boats")) return <FaShip className="mr-2" />;
    if (normalizedTitle.includes("tractors"))
      return <FaTractor className="mr-2" />;

    return <FaTag className="mr-2" />;
  };

  const getChipClass = (isActive: boolean) =>
    `flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium transition duration-200 shadow-sm whitespace-nowrap ${
      isActive
        ? "bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 hover:shadow-md"
        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 hover:border-blue-400"
    }`;

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
        Marketplace Management
      </h1>

      <h2 className="text-xl font-bold mb-3 text-gray-700 border-b pb-2">
        Main Categories
      </h2>
      <div className="flex flex-wrap gap-3 pb-6 border-b border-gray-200">
        <button
          onClick={resetFilters}
          className={getChipClass(
            !activeMainCategory && !activeCategory && !activeSubCategory
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
          <h2 className="text-xl font-bold mb-3 text-gray-700 border-b pb-2">
            Categories in **{activeMainCategory}**
          </h2>
          <div className="flex flex-wrap gap-3 pb-6 border-b border-gray-200">
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

      {activeCategory && uniqueSubCategories.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-3 text-gray-700 border-b pb-2">
            Subcategories in **{activeCategory}**
          </h2>
          <div className="flex flex-wrap gap-3 pb-6 border-b border-gray-200">
            <button
              onClick={() => handleSubCategoryClick("")}
              className={getChipClass(activeSubCategory === "")}
            >
              {getCategoryIcon("All")} All {activeCategory}
            </button>
            {uniqueSubCategories.map((subCat) => (
              <button
                key={subCat}
                onClick={() => handleSubCategoryClick(subCat)}
                className={getChipClass(activeSubCategory === subCat)}
              >
                {getCategoryIcon(subCat)} {subCat}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-10 text-gray-500">Loading items...</div>
      )}

      {!loading && (
        <div className="overflow-x-auto mt-6">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="border p-2">Image</th>
                <th className="border p-2">Title</th>
                <th className="border p-2">Main Category</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Subcategory</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">City</th>
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
                        src={
                          item.images?.[0] ||
                          "https://placehold.co/80x80/9ca3af/ffffff?text=No+Image"
                        }
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/80x80/9ca3af/ffffff?text=No+Image";
                        }}
                      />
                    </td>

                    <td className="border p-2 font-medium">{item.title}</td>
                    <td className="border p-2">{item.mainCategory}</td>
                    <td className="border p-2">
                      {Array.isArray(item.category)
                        ? item.category.join(", ")
                        : item.category}
                    </td>
                    <td className="border p-2">
                      {Array.isArray(item.subcategory)
                        ? item.subcategory.join(", ")
                        : item.subcategory}
                    </td>
                    <td className="border p-2">${item.price}</td>
                    <td className="border p-2">{item.city}</td>

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
                        onClick={() => togglePaidStatus(item)}
                        className={`px-3 py-1 rounded text-white text-sm transition flex items-center justify-center gap-1 ${
                          item.isPaid
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {item.isPaid ? <FaTimesCircle /> : <FaCheckCircle />}
                        {item.isPaid ? "Unmark" : "Mark Paid"}
                      </button>

                      <button
                        onClick={() =>
                          console.log(
                            `Attempting to navigate to edit page for item ID: ${item.id}`
                          )
                        }
                        className="px-3 py-1 bg-blue-500 text-white rounded flex items-center justify-center gap-1 text-sm hover:bg-blue-600 transition"
                      >
                        <FaEdit /> Edit
                      </button>

                      <button
                        onClick={() => deleteItem(item)}
                        className="px-3 py-1 bg-red-500 text-white rounded flex items-center justify-center gap-1 text-sm hover:bg-red-600 transition"
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
                    No items found in this category
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

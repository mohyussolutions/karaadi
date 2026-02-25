"use client";

import React, { useEffect, useState } from "react";
import {
  FaTrashAlt,
  FaEdit,
  FaCheckCircle,
  FaTimesCircle,
  FaList,
  FaSync,
  FaUser,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaTractor,
  FaTag,
  FaCog,
} from "react-icons/fa";
import {
  deleteTraktor,
  updateTraktor,
  getTraktorsAdmin,
  Traktor,
} from "@/actions/categories/FarmequipmentAction";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

export default function TraktorsPage() {
  const [items, setItems] = useState<Traktor[]>([]);
  const [loading, setLoading] = useState(true);

  // Multi-level filter states
  const [activeMainCategory, setActiveMainCategory] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [activeSubCategory, setActiveSubCategory] = useState("");

  const loadData = async () => {
    setLoading(true);
    const data = await getTraktorsAdmin();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTogglePaid = async (tractor: Traktor) => {
    const nextStatus = !tractor.isPaid;
    const originalItems = [...items];

    setItems((prev) =>
      prev.map((t) =>
        t._id === tractor._id ? { ...t, isPaid: nextStatus } : t,
      ),
    );

    const res = await updateTraktor(tractor._id, {
      isPaid: nextStatus,
      maGaday: nextStatus,
    });

    if (!res.success) {
      setItems(originalItems);
      toast.error(res.message || "Cusbooneysiinta waa fashilantay");
    } else {
      toast.success(nextStatus ? "Waa la bixiyay" : "Waa laga noqday");
    }
  };

  // --- Filtering Logic ---
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

  // --- Unique Filter Values ---
  const uniqueMainCategories = Array.from(
    new Set(items.map((i) => i.mainCategory)),
  ).filter(Boolean);

  const uniqueCategories = Array.from(
    new Set(
      items
        .filter((i) => i.mainCategory === activeMainCategory)
        .flatMap((i) =>
          Array.isArray(i.category) ? i.category : [i.category],
        ),
    ),
  ).filter(Boolean);

  const uniqueSubCategories = Array.from(
    new Set(
      items
        .filter((i) =>
          Array.isArray(i.category)
            ? i.category.includes(activeCategory)
            : i.category === activeCategory,
        )
        .flatMap((i) =>
          Array.isArray(i.subcategory) ? i.subcategory : [i.subcategory],
        ),
    ),
  ).filter(Boolean);

  const getChipClass = (isActive: boolean) =>
    `flex items-center justify-center px-4 py-2 rounded-xl text-sm font-bold transition-all border shadow-sm ${
      isActive
        ? "bg-blue-600 text-white border-blue-600"
        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
    }`;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer position="bottom-right" />

      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            Tractor Management
          </h1>
          <p className="text-gray-500 font-medium">
            Showing {filtered.length} of {items.length} units
          </p>
        </div>
        <button
          onClick={loadData}
          className="p-3 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-all"
        >
          <FaSync className={loading ? "animate-spin" : "text-xl"} />
        </button>
      </div>

      {/* Filter Sections */}
      <div className="space-y-6 mb-8">
        {/* Main Categories */}
        <div>
          <h2 className="text-xs font-bold uppercase text-gray-400 mb-3 ml-1 tracking-widest">
            Main Category
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setActiveMainCategory("");
                setActiveCategory("");
                setActiveSubCategory("");
              }}
              className={getChipClass(!activeMainCategory)}
            >
              <FaList className="mr-2" /> All
            </button>
            {uniqueMainCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveMainCategory(cat);
                  setActiveCategory("");
                  setActiveSubCategory("");
                }}
                className={getChipClass(activeMainCategory === cat)}
              >
                <FaTractor className="mr-2" /> {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        {activeMainCategory && uniqueCategories.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase text-gray-400 mb-3 ml-1 tracking-widest">
              Categories in {activeMainCategory}
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setActiveCategory("");
                  setActiveSubCategory("");
                }}
                className={getChipClass(activeCategory === "")}
              >
                All
              </button>
              {uniqueCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setActiveSubCategory("");
                  }}
                  className={getChipClass(activeCategory === cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Subcategories */}
        {activeCategory && uniqueSubCategories.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase text-gray-400 mb-3 ml-1 tracking-widest">
              Subcategories in {activeCategory}
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveSubCategory("")}
                className={getChipClass(activeSubCategory === "")}
              >
                All
              </button>
              {uniqueSubCategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveSubCategory(sub)}
                  className={getChipClass(activeSubCategory === sub)}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-5 text-xs font-bold uppercase text-gray-500">
                  Equipment
                </th>
                <th className="p-5 text-xs font-bold uppercase text-gray-500">
                  Seller / User
                </th>
                <th className="p-5 text-xs font-bold uppercase text-gray-500">
                  Region
                </th>
                <th className="p-5 text-xs font-bold uppercase text-gray-500">
                  City
                </th>
                <th className="p-5 text-xs font-bold uppercase text-gray-500 text-center">
                  Status
                </th>
                <th className="p-5 text-xs font-bold uppercase text-gray-500 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.images?.[0] || "https://placehold.co/80x80"}
                        className="w-16 h-16 rounded-xl object-cover border shadow-sm"
                        alt=""
                      />
                      <div className="flex flex-col">
                        <span className="font-extrabold text-gray-900 leading-tight">
                          {item.title}
                        </span>
                        <span className="text-blue-700 font-black text-sm mt-1">
                          ${item.price?.toLocaleString()}
                        </span>
                        <div className="flex gap-2 mt-1">
                          <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-bold uppercase">
                            {item.subcategory?.[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-col gap-1 bg-gray-50 p-2 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                        <FaUser className="text-blue-500" size={12} />{" "}
                        {item.user?.username || "N/A"}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 font-bold">
                        <FaPhoneAlt className="text-green-500" size={10} />{" "}
                        {item.user?.phone || "N/A"}
                      </div>
                    </div>
                  </td>
                  <td className="p-5 font-bold text-gray-700 text-sm">
                    {item.region}
                  </td>
                  <td className="p-5">
                    <span className="flex items-center gap-2 text-sm font-bold text-gray-700">
                      <FaMapMarkerAlt className="text-red-400" size={14} />{" "}
                      {item.city}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleTogglePaid(item)}
                        className="flex flex-col items-center active:scale-95 transition-transform"
                      >
                        <div
                          className={`p-2 rounded-xl ${item.isPaid ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}
                        >
                          {item.isPaid ? (
                            <FaCheckCircle size={20} />
                          ) : (
                            <FaTimesCircle size={20} />
                          )}
                        </div>
                        <span
                          className={`text-[10px] font-black mt-1 uppercase ${item.isPaid ? "text-green-600" : "text-red-500"}`}
                        >
                          {item.isPaid ? "Paid" : "Unpaid"}
                        </span>
                      </button>
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/traktors/${item._id}?type=tractor`}
                        className="p-2 bg-gray-50 text-gray-400 hover:text-blue-600 rounded-lg"
                      >
                        <FaCog />
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm("Ma hubtaa?"))
                            deleteTraktor(item._id).then(() => loadData());
                        }}
                        className="p-2 bg-gray-50 text-red-300 hover:text-red-600 rounded-lg"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && !loading && (
          <div className="p-20 text-center">
            <FaTractor className="mx-auto text-gray-200 text-6xl mb-4" />
            <p className="text-gray-400 font-bold">
              Ma jiraan xog waafaqsan shaandhayntan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import {
  FaTrashAlt,
  FaEdit,
  FaList,
  FaSync,
  FaCheckCircle,
  FaTimesCircle,
  FaTractor,
  FaCog,
} from "react-icons/fa";

import { traktorSubCategories } from "@/app/(links)/storeFrontLinks/subCategories";
import Link from "next/link";
import {
  getTraktors,
  deleteTraktor as deleteTraktorAction,
  updateTraktor,
  Traktor,
} from "@/actions/categories/tractorActions";

export default function TraktorsPage() {
  const [items, setItems] = useState<Traktor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");

  const loadData = async () => {
    setLoading(true);
    const data = await getTraktors();
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Ma hubtaa inaad tirtirto traktorkan?")) return;
    const res = await deleteTraktorAction(id, "YOUR_TOKEN");
    if (res.success) {
      setItems((prev) => prev.filter((item) => item._id !== id));
    }
  };

  const handleTogglePaid = async (tractor: Traktor) => {
    const currentPaid = (tractor as any).isPaid;
    const res = await updateTraktor(
      tractor._id,
      { isPaid: !currentPaid } as any,
      "YOUR_TOKEN",
    );
    if (res.success) {
      setItems((prev) =>
        prev.map((t) =>
          t._id === tractor._id ? { ...t, isPaid: !currentPaid } : t,
        ),
      );
    }
  };

  const filtered =
    activeCategory === ""
      ? items
      : items.filter((i: any) => i.subCategory === activeCategory);

  const getChipClass = (isActive: boolean) =>
    `flex items-center justify-center px-5 py-2 rounded-lg text-base font-semibold transition border ${
      isActive
        ? "bg-blue-600 text-white border-blue-600 shadow-md"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
    }`;

  return (
    <div className="p-4 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Maamulka Traktarada (Tractors)
        </h1>
        <button
          onClick={loadData}
          className="p-2 text-gray-500 hover:text-blue-600 transition"
        >
          <FaSync className={`text-2xl ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("")}
            className={getChipClass(activeCategory === "")}
          >
            <FaList className="mr-2" /> Dhammaan
          </button>
          {traktorSubCategories.map((cat) => (
            <button
              key={cat.so}
              onClick={() => setActiveCategory(cat.so)}
              className={getChipClass(activeCategory === cat.so)}
            >
              <FaTractor className="mr-2 text-lg" /> {cat.so}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b border-gray-200 text-gray-600">
            <tr>
              <th className="p-4 text-lg font-bold uppercase tracking-tight">
                Traktarka
              </th>
              <th className="p-4 text-lg font-bold uppercase tracking-tight">
                Qiimaha
              </th>
              <th className="p-4 text-lg font-bold uppercase tracking-tight">
                Magaalada
              </th>
              <th className="p-4 text-lg font-bold uppercase tracking-tight">
                Status
              </th>
              <th className="p-4 text-lg font-bold uppercase tracking-tight text-right">
                Ficil
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((tractor) => (
              <tr
                key={tractor._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={tractor.images?.[0] || "https://placehold.co/60x60"}
                      className="w-14 h-14 rounded-lg object-cover shadow-sm"
                      alt=""
                    />
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 text-lg truncate max-w-[250px]">
                        {tractor.title}
                      </span>
                      <span className="text-sm text-blue-600 font-bold uppercase">
                        {(tractor as any).subCategory || tractor.category}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-blue-700 font-extrabold text-xl">
                  ${Number(tractor.price).toLocaleString()}
                </td>
                <td className="p-4 text-gray-600 text-lg font-medium">
                  {tractor.city}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleTogglePaid(tractor)}
                    className="text-2xl"
                  >
                    {(tractor as any).isPaid ? (
                      <FaCheckCircle className="text-green-500" />
                    ) : (
                      <FaTimesCircle className="text-red-400" />
                    )}
                  </button>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-4 text-2xl">
                    <Link
                      href={`/traktors/${tractor._id}?type=tractor`}
                      className="text-gray-400 hover:text-blue-600 transition"
                    >
                      <FaCog />
                    </Link>
                    <button className="text-blue-500 hover:text-blue-700">
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(tractor._id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && !loading && (
          <div className="p-10 text-center text-gray-400 text-xl font-bold">
            Lama helin traktaradan.
          </div>
        )}
      </div>
    </div>
  );
}

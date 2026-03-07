"use client";

import React, { JSX, useEffect, useState } from "react";
import {
  FaTrash,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaShip,
  FaCar,
  FaHome,
  FaMotorcycle,
  FaTractor,
  FaShoppingBag,
  FaBriefcase,
  FaNewspaper,
  FaFilter,
  FaTimes,
} from "react-icons/fa";
import ManagerLoading from "@/app/(managers)/managers/ManagerLoading";
import {
  deletePayment,
  getAllPayments,
  Payment,
} from "@/actions/categories/paymentAction";

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadPayments();
  }, []);

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredPayments(payments);
    } else {
      setFilteredPayments(
        payments.filter(
          (p) => p.status?.toLowerCase() === statusFilter.toLowerCase(),
        ),
      );
    }
  }, [payments, statusFilter]);

  async function loadPayments() {
    setLoading(true);
    const data = await getAllPayments();
    setPayments(data.payments || []);
    setFilteredPayments(data.payments || []);
    setTotal(data.total || 0);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Ma u hubaataa inaad tirtirto lacag bixintan?")) return;

    setDeletingId(id);
    const result = await deletePayment(id);
    if (result.success) {
      setPayments((prev) => prev.filter((p) => p.id !== id));
      setTotal((prev) => prev - 1);
    } else {
      alert(result.message);
    }
    setDeletingId(null);
  }

  const getCategoryFromPayment = (
    payment: Payment,
  ): { name: string; icon: JSX.Element } => {
    if (payment.boatId)
      return { name: "Boat", icon: <FaShip className="text-blue-500" /> };
    if (payment.carId)
      return { name: "Car", icon: <FaCar className="text-green-500" /> };
    if (payment.realEstateId)
      return {
        name: "Real Estate",
        icon: <FaHome className="text-purple-500" />,
      };
    if (payment.motorcycleId)
      return {
        name: "Motorcycle",
        icon: <FaMotorcycle className="text-orange-500" />,
      };
    if (payment.farmequipmentId)
      return {
        name: "Farm Equipment",
        icon: <FaTractor className="text-yellow-700" />,
      };
    if (payment.marketplaceId)
      return {
        name: "Marketplace",
        icon: <FaShoppingBag className="text-pink-500" />,
      };
    if (payment.jobId)
      return { name: "Job", icon: <FaBriefcase className="text-indigo-500" /> };
    if (payment.subscriptionId)
      return {
        name: "Subscription",
        icon: <FaNewspaper className="text-teal-500" />,
      };
    return {
      name: "General",
      icon: <FaShoppingBag className="text-gray-500" />,
    };
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-700 border-red-200";
      case "refunded":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusCount = (status: string) => {
    return payments.filter(
      (p) => p.status?.toLowerCase() === status.toLowerCase(),
    ).length;
  };

  if (loading)
    return (
      <div className="flex justify-center p-20">
        <ManagerLoading />
      </div>
    );

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Maareynta Lacag Bixinta
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden p-2 bg-gray-100 rounded-lg"
          >
            <FaFilter size={16} />
          </button>
          <span className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-sm font-semibold">
            Total: {total}
          </span>
        </div>
      </div>

      {/* Status Filter Chips */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            statusFilter === "all"
              ? "bg-gray-800 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All ({payments.length})
        </button>
        <button
          onClick={() => setStatusFilter("completed")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            statusFilter === "completed"
              ? "bg-green-600 text-white"
              : "bg-green-50 text-green-600 hover:bg-green-100"
          }`}
        >
          Completed ({getStatusCount("completed")})
        </button>
        <button
          onClick={() => setStatusFilter("pending")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            statusFilter === "pending"
              ? "bg-yellow-600 text-white"
              : "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
          }`}
        >
          Pending ({getStatusCount("pending")})
        </button>
        <button
          onClick={() => setStatusFilter("failed")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            statusFilter === "failed"
              ? "bg-red-600 text-white"
              : "bg-red-50 text-red-600 hover:bg-red-100"
          }`}
        >
          Failed ({getStatusCount("failed")})
        </button>
        <button
          onClick={() => setStatusFilter("refunded")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            statusFilter === "refunded"
              ? "bg-purple-600 text-white"
              : "bg-purple-50 text-purple-600 hover:bg-purple-100"
          }`}
        >
          Refunded ({getStatusCount("refunded")})
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 text-sm uppercase tracking-wider">
              <th className="py-4 px-4 font-medium">User / Email</th>
              <th className="py-4 px-4 font-medium">Category</th>
              <th className="py-4 px-4 font-medium">Amount</th>
              <th className="py-4 px-4 font-medium">Status</th>
              <th className="py-4 px-4 font-medium">Date</th>
              <th className="py-4 px-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => {
                const category = getCategoryFromPayment(payment);
                return (
                  <tr
                    key={payment.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="py-4 px-4">
                      <div className="font-semibold text-gray-900">
                        {payment.user?.username || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {payment.user?.email || "No email"}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {category.icon}
                        <span className="text-sm text-gray-600 capitalize">
                          {category.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-gray-900">
                        {payment.totalAmount?.toLocaleString() || 0}{" "}
                        {payment.currency || "USD"}
                      </div>
                      <div className="text-[10px] text-gray-400 uppercase">
                        {payment.paymentMethod || "N/A"}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(payment.status)}`}
                      >
                        {payment.status?.toLowerCase() === "completed" && (
                          <FaCheckCircle className="mr-1" />
                        )}
                        {payment.status?.toLowerCase() === "pending" && (
                          <FaClock className="mr-1" />
                        )}
                        {payment.status?.toLowerCase() === "failed" && (
                          <FaExclamationTriangle className="mr-1" />
                        )}
                        {payment.status}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {payment.createdAt
                        ? new Date(payment.createdAt).toLocaleDateString(
                            "en-GB",
                          )
                        : "N/A"}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleDelete(payment.id)}
                        disabled={deletingId === payment.id}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                      >
                        {deletingId === payment.id ? "..." : <FaTrash />}
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-20 text-gray-400">
                  {statusFilter !== "all"
                    ? `Wax lacag bixin ah oo ${statusFilter} ah lama helin.`
                    : "Wax lacag bixin ah lama helin."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

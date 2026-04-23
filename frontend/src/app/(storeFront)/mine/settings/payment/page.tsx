"use client";
export const dynamic = "force-dynamic";

import { getMyPayments } from "@/actions/categories/paymentActions";
import { useAuth } from "@/context/AuthContext";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import {
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaShip,
  FaCar,
  FaHome,
  FaMotorcycle,
  FaTractor,
  FaShoppingBag,
  FaBriefcase,
  FaMobileAlt,
  FaReceipt,
  FaUserCircle,
  FaEnvelope,
} from "react-icons/fa";
import Image from "next/image";

interface PaymentItem {
  id: string;
  totalAmount?: number;
  currency: string;
  status: string;
  paymentMethod?: string;
  transactionId?: string;
  createdAt: string;
  paidAt?: string;
  boatId?: string | null;
  carId?: string | null;
  marketplaceId?: string | null;
  realEstateId?: string | null;
  motorcycleId?: string | null;
  farmequipmentId?: string | null;
  jobId?: string | null;
  subscriptionId?: string | null;
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  completed: { label: "Completed", color: "text-green-700", bg: "bg-green-50 border-green-200", icon: <FaCheckCircle className="text-green-500" /> },
  success: { label: "Completed", color: "text-green-700", bg: "bg-green-50 border-green-200", icon: <FaCheckCircle className="text-green-500" /> },
  pending: { label: "Pending", color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200", icon: <FaClock className="text-yellow-500" /> },
  failed: { label: "Failed", color: "text-red-700", bg: "bg-red-50 border-red-200", icon: <FaTimesCircle className="text-red-500" /> },
  declined: { label: "Failed", color: "text-red-700", bg: "bg-red-50 border-red-200", icon: <FaTimesCircle className="text-red-500" /> },
};

const CATEGORY_MAP = (p: PaymentItem): { label: string; icon: React.ReactNode } => {
  if (p.boatId) return { label: "Boat", icon: <FaShip className="text-blue-500" /> };
  if (p.carId) return { label: "Car", icon: <FaCar className="text-green-500" /> };
  if (p.realEstateId) return { label: "Real Estate", icon: <FaHome className="text-purple-500" /> };
  if (p.motorcycleId) return { label: "Motorcycle", icon: <FaMotorcycle className="text-orange-500" /> };
  if (p.farmequipmentId) return { label: "Farm Equipment", icon: <FaTractor className="text-yellow-700" /> };
  if (p.marketplaceId) return { label: "Marketplace", icon: <FaShoppingBag className="text-pink-500" /> };
  if (p.jobId) return { label: "Job", icon: <FaBriefcase className="text-indigo-500" /> };
  if (p.subscriptionId) return { label: "Subscription", icon: <FaReceipt className="text-teal-500" /> };
  return { label: "General", icon: <FaShoppingBag className="text-gray-400" /> };
};

export default function PaymentPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  const fetchPayments = useCallback(async () => {
    try {
      const data = await getMyPayments();
      setPayments((data as PaymentItem[]) || []);
    } catch {
      setPayments([]);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace("/login"); return; }
    fetchPayments();
  }, [user, authLoading, router, fetchPayments]);

  if (authLoading || isFetching) {
    return <div className="min-h-[60vh] flex items-center justify-center"><Loading /></div>;
  }

  if (!user) return null;

  const totalPaid = payments
    .filter((p) => ["completed", "success"].includes(p.status?.toLowerCase()))
    .reduce((sum, p) => sum + (p.totalAmount || 0), 0);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <FaReceipt className="text-blue-500" />
        My Payments
      </h1>

      <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
        {user.profileImage ? (
          <Image
            src={user.profileImage}
            alt={user.username || "User"}
            width={56}
            height={56}
            className="rounded-full object-cover border border-gray-200"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <FaUserCircle className="text-blue-400" size={32} />
          </div>
        )}
        <div className="min-w-0">
          <p className="font-bold text-gray-900 text-lg truncate">
            {user.username || user.name || "—"}
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1.5 truncate">
            <FaEnvelope size={11} className="text-gray-400" />
            {user.email || "—"}
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
            <FaMobileAlt size={11} className="text-gray-400" />
            {user.phone || "No phone set"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Total Paid</p>
          <p className="text-2xl font-extrabold text-blue-600">${totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Transactions</p>
          <p className="text-2xl font-extrabold text-gray-800">{payments.length}</p>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <FaReceipt className="mx-auto text-gray-300 mb-3" size={36} />
          <p className="text-gray-500 font-medium">No payments yet</p>
          <p className="text-gray-400 text-sm mt-1">Your payment history will appear here after your first purchase.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Payment History
          </div>

          <div className="divide-y divide-gray-50">
            {payments.map((p) => {
              const status = STATUS_MAP[p.status?.toLowerCase()] ?? {
                label: p.status,
                color: "text-gray-600",
                bg: "bg-gray-50 border-gray-200",
                icon: null,
              };
              const category = CATEGORY_MAP(p);
              const date = p.paidAt || p.createdAt;
              return (
                <div key={p.id} className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                      {category.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 text-sm">{category.label}</p>
                      {p.transactionId && (
                        <p className="text-[11px] text-gray-400 font-mono truncate">{p.transactionId}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6 text-sm shrink-0">
                    <div className="text-right">
                      <p className="font-bold text-gray-900">${(p.totalAmount || 0).toLocaleString()}</p>
                      <p className="text-[10px] text-gray-400 uppercase">{p.paymentMethod || "mobile"}</p>
                    </div>

                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${status.bg} ${status.color}`}>
                      {status.icon}
                      {status.label}
                    </div>

                    <p className="text-xs text-gray-400 w-20 text-right hidden sm:block">
                      {date ? new Date(date).toLocaleDateString("en-GB") : "—"}
                    </p>
                  </div>

                  <p className="text-xs text-gray-400 sm:hidden">
                    {date ? new Date(date).toLocaleDateString("en-GB") : "—"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

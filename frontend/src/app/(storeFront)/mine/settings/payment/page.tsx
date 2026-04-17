"use client";
export const dynamic = "force-dynamic";

import { getMyPayments } from "@/actions/categories/paymentActions";
import { useAuth } from "@/context/AuthContext";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";

interface PaymentItem {
  id: string;
  totalAmount?: number;
  currency: string;
  status: string;
  paymentMethod: string;
  transactionId?: string;
  createdAt: string;
  boatId?: string | null;
  carId?: string | null;
  marketplaceId?: string | null;
  realEstateId?: string | null;
  motorcycleId?: string | null;
  farmequipmentId?: string | null;
  jobId?: string | null;
  subscriptionId?: string | null;
}

const PaymentPage: React.FC = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  const fetchPayments = useCallback(async () => {
    try {
      const myPayments = await getMyPayments();
      setPayments((myPayments as PaymentItem[]) || []);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace("/login");
      } else {
        fetchPayments();
      }
    }
  }, [user, authLoading, router, fetchPayments]);

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (["completed", "success", "approved"].includes(s))
      return "text-green-600";
    if (s === "pending") return "text-yellow-600";
    if (["failed", "declined"].includes(s)) return "text-red-600";
    if (s === "refunded") return "text-purple-600";
    return "text-gray-600";
  };

  const getStatusText = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (["completed", "success", "approved"].includes(s)) return "SUCCESS";
    if (s === "pending") return "PENDING";
    if (["failed", "declined"].includes(s)) return "FAILED";
    return status?.toUpperCase() || "UNKNOWN";
  };

  const getItemType = (p: PaymentItem) => {
    if (p.boatId) return "Boat";
    if (p.carId) return "Car";
    if (p.marketplaceId) return "Marketplace";
    if (p.realEstateId) return "Real Estate";
    if (p.motorcycleId) return "Motorcycle";
    if (p.farmequipmentId) return "Farm Equipment";
    if (p.jobId) return "Job";
    if (p.subscriptionId) return "Subscription";
    return "General";
  };

  if (authLoading || isFetching) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Payment Details</h1>

      <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-3">Your Information</h2>
        <div className="space-y-1">
          <p className="text-sm sm:text-base">
            <span className="font-semibold">Email:</span> {user.email || "N/A"}
          </p>
          <p className="text-sm sm:text-base">
            <span className="font-semibold">Phone:</span> {user.phone || "N/A"}
          </p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Payment History</h2>

      {payments.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
          No payment history found
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="sm:hidden space-y-3 p-3">
            {payments.map((p) => (
              <div key={p.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono text-gray-500">
                    ID: {p.id.slice(0, 8)}
                  </span>
                  <span
                    className={`text-xs font-bold ${getStatusColor(p.status)}`}
                  >
                    {getStatusText(p.status)}
                  </span>
                </div>
                <p className="font-medium text-gray-900">{getItemType(p)}</p>
                <p className="text-sm text-gray-600">
                  {(p.totalAmount || 0).toLocaleString()} {p.currency}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(p.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>

          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Item Type</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-gray-600">
                      {p.id.slice(0, 8)}...
                    </td>
                    <td className="py-3 px-4 text-gray-900">
                      {getItemType(p)}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {(p.totalAmount || 0).toLocaleString()} {p.currency}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {p.paymentMethod}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-bold ${getStatusColor(p.status)}`}>
                        {getStatusText(p.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;

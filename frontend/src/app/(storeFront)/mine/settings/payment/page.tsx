"use client";

import { getMyPayments } from "@/actions/categories/paymentAction";
import { verifySession } from "@/actions/core/authAction";
import React, { useEffect, useState } from "react";

interface PaymentItem {
  id: string;
  totalAmount: number;
  planAmount?: number;
  feeAmount?: number;
  taxAmount?: number;
  platformFee?: number;
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

const Payment: React.FC = () => {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const session = await verifySession();
        setUser(session);

        const myPayments = await getMyPayments();
        setPayments(myPayments);
      } catch (error) {
        console.error("Failed to fetch payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "completed":
      case "success":
      case "approved":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "failed":
      case "declined":
        return "text-red-600";
      case "refunded":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusText = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "completed":
      case "success":
      case "approved":
        return "SUCCESS";
      case "pending":
        return "PENDING";
      case "failed":
      case "declined":
        return "FAILED";
      case "refunded":
        return "REFUNDED";
      default:
        return status.toUpperCase();
    }
  };

  const getItemType = (payment: PaymentItem) => {
    if (payment.boatId) return "Boat";
    if (payment.carId) return "Car";
    if (payment.marketplaceId) return "Marketplace";
    if (payment.realEstateId) return "Real Estate";
    if (payment.motorcycleId) return "Motorcycle";
    if (payment.farmequipmentId) return "Farm Equipment";
    if (payment.jobId) return "Job";
    if (payment.subscriptionId) return "Subscription";
    return "General";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
        Payment Details
      </h1>

      <div className="mb-6 sm:mb-8 bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
          Your Information
        </h2>
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <span className="font-semibold">Email:</span>{" "}
            {user?.email || "Not available"}
          </p>
          <p className="text-sm sm:text-base">
            <span className="font-semibold">Phone:</span>{" "}
            {user?.phone || "Not available"}
          </p>
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
        Payment History
      </h2>

      {payments.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No payment history found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="block sm:hidden space-y-3 p-3">
            {payments.map((payment) => (
              <div key={payment.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono text-gray-500">
                    ID: {payment.id.substring(0, 8)}
                  </span>
                  <span
                    className={`text-xs font-bold ${getStatusColor(payment.status)}`}
                  >
                    {getStatusText(payment.status)}
                  </span>
                </div>
                <p className="font-medium text-gray-900 mb-1">
                  {getItemType(payment)}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Amount: {payment.totalAmount.toLocaleString()}{" "}
                  {payment.currency}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Method: {payment.paymentMethod}
                </p>
                {payment.transactionId && (
                  <p className="text-xs text-gray-500 mb-1">
                    TX: {payment.transactionId.substring(0, 12)}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  {formatDate(payment.createdAt)}
                </p>
              </div>
            ))}
          </div>

          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Item Type
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-600 font-mono">
                      {payment.id.substring(0, 8)}...
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {getItemType(payment)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {formatDate(payment.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      {payment.totalAmount.toLocaleString()} {payment.currency}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {payment.paymentMethod}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500 font-mono">
                      {payment.transactionId
                        ? payment.transactionId.substring(0, 12) + "..."
                        : "-"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs font-bold ${getStatusColor(payment.status)}`}
                      >
                        {getStatusText(payment.status)}
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

export default Payment;

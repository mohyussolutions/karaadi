import React from "react";
import { FaUser, FaEye, FaTrash, FaDollarSign } from "react-icons/fa";
import StatBox from "./StatBox";
import { Payment, PaymentStats } from "@/actions/categories/paymentActions";

interface TransactionTableProps {
  payments: Payment[];
  stats: PaymentStats | null;
  onDelete: (id: string) => void;
  onUserClick: (userId: string) => void;
  onItemClick?: (itemId: string, itemType: string) => void;
}

export default function TransactionTable({
  payments,
  stats,
  onDelete,
  onUserClick,
  onItemClick,
}: TransactionTableProps) {
  const cur = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val || 0);

  const getMethodStyle = (method: string) => {
    const m = method?.toUpperCase();
    switch (m) {
      case "WAAFI":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "EVC_PLUS":
      case "EVCPLUS":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "SAHAL":
        return "bg-orange-50 text-orange-600 border-orange-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  const getItemType = (payment: Payment): string => {
    if (payment.carId) return "Car";
    if (payment.realEstateId) return "Real Estate";
    if (payment.boatId) return "Boat";
    if (payment.motorcycleId) return "Motorcycle";
    if (payment.traktorId) return "Tractor";
    if (payment.marketplaceId) return "Marketplace";
    if (payment.subscriptionId) return "Subscription";
    return "Unknown";
  };

  const getItemId = (payment: Payment): string | null => {
    if (payment.carId) return payment.carId;
    if (payment.realEstateId) return payment.realEstateId;
    if (payment.boatId) return payment.boatId;
    if (payment.motorcycleId) return payment.motorcycleId;
    if (payment.traktorId) return payment.traktorId;
    if (payment.marketplaceId) return payment.marketplaceId;
    if (payment.subscriptionId) return payment.subscriptionId;
    return null;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatBox
          label="Total Volume"
          value={cur(stats?.summary.totalAmount || 0)}
          icon={<FaDollarSign className="h-5 w-5" />}
        />
        <StatBox
          label="Platform Profit"
          value={cur(stats?.summary.totalPlatformFee || 0)}
          color="text-emerald-600"
          icon={<FaDollarSign className="h-5 w-5" />}
        />
        <StatBox
          label="Listing Fees"
          value={cur(stats?.summary.totalFee || 0)}
          color="text-indigo-600"
          icon={<FaDollarSign className="h-5 w-5" />}
        />
        <StatBox
          label="Settlements"
          value={stats?.summary.totalPayments.toString() || "0"}
          icon={<FaDollarSign className="h-5 w-5" />}
        />
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <th className="px-8 py-6">Customer</th>
                <th className="px-8 py-6">Payment Method</th>
                <th className="px-8 py-6">Amount</th>
                <th className="px-8 py-6">Item Type</th>
                <th className="px-8 py-6">Transaction ID</th>
                <th className="px-8 py-6">Date</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((p) => {
                const itemType = getItemType(p);
                const itemId = getItemId(p);

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/30 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 leading-none mb-1">
                          {p.user?.username || "Guest"}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium lowercase">
                          {p.user?.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-wider ${getMethodStyle(
                          p.paymentMethod,
                        )}`}
                      >
                        {p.paymentMethod?.replace("_", " ") || "UNSPECIFIED"}
                      </span>
                    </td>
                    <td className="px-8 py-6 font-black text-slate-900">
                      {cur(p.totalAmount)}
                      <div className="text-[11px] text-slate-500 mt-1">
                        Platform: {cur(p.platformFee)} | Tax: {cur(p.taxAmount)}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wide">
                        {itemType}
                      </span>
                      <div className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest mt-1">
                        {p.listingType === "premium" ? "Priority" : "Standard"}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <code className="text-[10px] font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded">
                        {p.transactionId || "N/A"}
                      </code>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm text-slate-600">
                        {new Date(
                          p.createdAt as string | Date,
                        ).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-2 items-center">
                        <button
                          onClick={() => onUserClick(p.userId)}
                          className="px-3 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[9px] font-black uppercase hover:bg-indigo-600 hover:text-white transition-all active:scale-95 shadow-sm whitespace-nowrap flex items-center gap-1"
                        >
                          <FaUser className="h-3 w-3" />
                          User
                        </button>
                        {itemId && onItemClick && (
                          <button
                            onClick={() => {
                              const itemTypeSlug = itemType
                                .toLowerCase()
                                .replace(" ", "-");
                              onItemClick(itemId, itemTypeSlug);
                            }}
                            className="px-3 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-black uppercase hover:bg-emerald-600 hover:text-white transition-all active:scale-95 shadow-sm whitespace-nowrap flex items-center gap-1"
                          >
                            <FaEye className="h-3 w-3" />
                            View
                          </button>
                        )}
                        <button
                          onClick={() => onDelete(p.id)}
                          className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all active:scale-90"
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { Payment, PaymentStats } from "@/actions/categories/paymentActions";
import StatBox from "./StatBox";

interface TransactionTableProps {
  payments: Payment[];
  stats: PaymentStats | null;
  onDelete: (id: string) => void;
  onUserClick: (userId: string) => void;
}

export default function TransactionTable({
  payments,
  stats,
  onDelete,
  onUserClick,
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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatBox
          label="Total Volume"
          value={cur(stats?.summary.totalAmount || 0)}
        />
        <StatBox
          label="Platform Profit"
          value={cur(stats?.summary.totalPlatformFee || 0)}
          color="text-emerald-600"
        />
        <StatBox
          label="Listing Fees"
          value={cur(stats?.summary.totalFee || 0)}
          color="text-indigo-600"
        />
        <StatBox
          label="Settlements"
          value={stats?.summary.totalPayments.toString() || "0"}
          isCurr={false}
        />
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <th className="px-8 py-6">Customer</th>
                <th className="px-8 py-6">Method</th>
                <th className="px-8 py-6">Amount</th>
                <th className="px-8 py-6">Items Involved</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((p) => (
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
                        p.paymentMethod
                      )}`}
                    >
                      {p.paymentMethod?.replace("_", " ") || "UNSPECIFIED"}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-black text-slate-900">
                    {cur(p.totalAmount)}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">
                        {p.listingType === "premium" ? "Priority" : "Standard"}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-end gap-2 items-center">
                      <button
                        onClick={() => onUserClick(p.userId)}
                        className="px-3 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[9px] font-black uppercase hover:bg-indigo-600 hover:text-white transition-all active:scale-95 shadow-sm whitespace-nowrap"
                      >
                        User Details
                      </button>
                      <button
                        onClick={() => onDelete(p.id)}
                        className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all active:scale-90"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaTrash, FaDollarSign, FaList } from "react-icons/fa";
import StatBox from "./StatBox";
import { Payment, PaymentStats } from "@/app/utils/types/payment";

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
}: TransactionTableProps) {
  const router = useRouter();

  const cur = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val || 0);

  const getItemInfo = (p: Payment) => {
    const id =
      p.carId ||
      p.realEstateId ||
      p.boatId ||
      p.motorcycleId ||
      p.traktorId ||
      p.marketplaceId ||
      p.subscriptionId;
    let type = "Unknown";
    if (p.carId) type = "Car";
    else if (p.realEstateId) type = "Real Estate";
    else if (p.boatId) type = "Boat";
    else if (p.motorcycleId) type = "Motorcycle";
    else if (p.traktorId) type = "Tractor";
    else if (p.marketplaceId) type = "Marketplace";
    else if (p.subscriptionId) type = "Subscription";
    return { id, type };
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatBox
          label="Total Volume"
          value={cur(stats?.summary.totalAmount || 0)}
          icon={<FaDollarSign />}
        />
        <StatBox
          label="Net Profit"
          value={cur(stats?.summary.totalPlatformFee || 0)}
          color="text-emerald-600"
          icon={<FaDollarSign />}
        />
        <StatBox
          label="Total Fees"
          value={cur(stats?.summary.totalFee || 0)}
          color="text-indigo-600"
          icon={<FaList />}
        />
        <StatBox
          label="Count"
          value={stats?.summary.totalPayments || 0}
          icon={<FaList />}
        />
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <th className="px-8 py-6">Customer</th>
                <th className="px-8 py-6">Method / Tax</th>
                <th className="px-8 py-6">Total Amount</th>
                <th className="px-8 py-6">Item Reference</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((p) => {
                const item = getItemInfo(p);
                return (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/30 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">
                          {p.user?.username || "Guest"}
                        </span>
                        <span className="text-[11px] text-slate-400 lowercase">
                          {p.user?.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded w-fit">
                          {p.paymentMethod}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">
                          Tax: {cur(p.taxAmount)}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900">
                          {cur(p.totalAmount)}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-bold">
                          Fee: {cur(p.platformFee)}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[11px] font-bold text-slate-700 block">
                        {item.type}
                      </span>
                      <code className="text-[9px] text-slate-400 bg-slate-50 px-1 rounded">
                        {item.id || "N/A"}
                      </code>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-2 items-center">
                        <button
                          onClick={() => {
                            if (item.id) {
                              router.push(`/dashboard/payments/${item.id}`);
                            }
                          }}
                          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase hover:bg-indigo-600 transition-all flex items-center gap-2"
                        >
                          <FaEye /> Details
                        </button>
                        <button
                          onClick={() => onDelete(p.id)}
                          className="p-2 text-slate-300 hover:text-rose-600 transition-all"
                        >
                          <FaTrash />
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

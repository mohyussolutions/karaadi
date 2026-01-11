"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Payment, getAllPayments } from "@/actions/categories/paymentActions";
import StatBox from "../../StatBox";

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [userPayments, setUserPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserHistory = async () => {
    try {
      setLoading(true);
      const data = await getAllPayments({ page: 1, limit: 100 });
      const filtered = data.payments.filter((p) => p.userId === id);
      setUserPayments(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserHistory();
  }, [id]);

  const totalSpent = userPayments.reduce((sum, p) => sum + p.totalAmount, 0);
  const cur = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-center">
          Accessing User Vault
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 text-slate-900">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black uppercase text-[10px] tracking-widest mb-10 transition-colors group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 transition-transform group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Ledger
        </button>

        <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl relative">
              {userPayments[0]?.user?.username?.charAt(0).toUpperCase() || "U"}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-[#F8FAFC] rounded-full" />
            </div>
            <div>
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-1">
                Account Holder
              </p>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter capitalize mb-1">
                {userPayments[0]?.user?.username || "Guest User"}
              </h1>
              <p className="text-slate-500 font-bold text-sm tracking-tight">
                {userPayments[0]?.user?.email}
              </p>
            </div>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <StatBox
              label="Lifetime Spend"
              value={cur(totalSpent)}
              color="text-indigo-600"
            />
            <StatBox
              label="Transactions"
              value={userPayments.length.toString()}
              isCurr={false}
            />
          </div>
        </section>

        <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden">
          <header className="px-10 py-8 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
            <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">
              Purchase Log
            </h3>
            <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-3 py-1 rounded-full uppercase">
              ID: {id}
            </span>
          </header>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">
                  <th className="px-10 py-5">Product/Type</th>
                  <th className="px-10 py-5">Gateway</th>
                  <th className="px-10 py-5 text-right">Settled Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {userPayments.map((p) => (
                  <tr
                    key={p.id}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-10 py-6">
                      <p className="text-sm font-black text-slate-800 uppercase tracking-tight">
                        {p.listingType}
                      </p>
                      <p className="text-[10px] font-mono text-slate-400 tracking-tighter">
                        {p.transactionId}
                      </p>
                    </td>
                    <td className="px-10 py-6">
                      <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase">
                        {p.paymentMethod}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <p className="font-black text-slate-900 text-lg">
                        {cur(p.totalAmount)}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {userPayments.length === 0 && (
            <div className="py-32 text-center bg-slate-50/20">
              <p className="text-slate-300 font-black uppercase text-xs tracking-[0.3em]">
                No Transaction History
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

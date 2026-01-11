"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAllPayments,
  getPaymentStats,
  deletePayment,
  Payment,
  PaymentStats,
} from "@/actions/categories/paymentActions";
import TransactionTable from "./TransactionTable";
import AnalyticsCharts from "./AnalyticsCharts";

export default function PaymentDashboard() {
  const router = useRouter();
  const [view, setView] = useState<"list" | "stats">("list");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pData, sData] = await Promise.all([
        getAllPayments({ page: 1, limit: 50 }),
        getPaymentStats(),
      ]);
      setPayments(pData.payments);
      setStats(sData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onDelete = async (id: string) => {
    if (!confirm("Confirm permanent deletion of this record?")) return;
    try {
      await deletePayment(id);
      await loadData();
    } catch (err: any) {
      alert(err.message || "Failed to delete payment");
    }
  };

  const onUserClick = (userId: string) => {
    router.push(`/dashboard/payments/users/${userId}`);
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-xs">
          Syncing Ledger
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Finance <span className="text-indigo-600">Core</span>
              </h1>
            </div>
            <p className="text-slate-400 text-sm font-medium tracking-tight">
              Real-time settlement & ecosystem analytics
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200/60">
            <nav className="flex gap-1">
              <TabButton
                active={view === "list"}
                onClick={() => setView("list")}
                label="Ledger"
                icon={<path d="M4 6h16M4 10h16M4 14h16M4 18h16" />}
              />
              <TabButton
                active={view === "stats"}
                onClick={() => setView("stats")}
                label="Insights"
                icon={
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                }
              />
            </nav>
            <div className="w-[1px] h-6 bg-slate-200 mx-1" />
            <button
              onClick={loadData}
              className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </header>

        <main>
          {view === "list" ? (
            <TransactionTable
              payments={payments}
              stats={stats}
              onDelete={onDelete}
              onUserClick={onUserClick}
            />
          ) : (
            <AnalyticsCharts stats={stats} />
          )}
        </main>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${
        active
          ? "bg-slate-900 text-white shadow-lg"
          : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        {icon}
      </svg>
      {label}
    </button>
  );
}

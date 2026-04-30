"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getDashboardStats } from "@/actions/categories/getDashboardStats";

const BarChart = dynamic(() => import("@/app/(managers)/managers/BarChart").then((m) => ({ default: m.ProjectProgressChart })), { ssr: false });
const LineChart = dynamic(() => import("@/app/(managers)/managers/LineChart").then((m) => ({ default: m.TeamPerformanceChart })), { ssr: false });

type Stats = {
  users: number;
  visitors: number;
  messages: number;
  ads: number;
  subscriptions: number;
  regions: number;
  cities: number;
};

const STAT_CARDS = [
  { key: "users" as keyof Stats, label: "Total Users", color: "bg-indigo-50 text-indigo-700 border-indigo-100" },
  { key: "visitors" as keyof Stats, label: "Total Visitors", color: "bg-sky-50 text-sky-700 border-sky-100" },
  { key: "messages" as keyof Stats, label: "Support Tickets (Today)", color: "bg-amber-50 text-amber-700 border-amber-100" },
  { key: "ads" as keyof Stats, label: "Active Ads", color: "bg-violet-50 text-violet-700 border-violet-100" },
  { key: "subscriptions" as keyof Stats, label: "Subscriptions", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  { key: "regions" as keyof Stats, label: "Regions", color: "bg-rose-50 text-rose-700 border-rose-100" },
  { key: "cities" as keyof Stats, label: "Cities", color: "bg-orange-50 text-orange-700 border-orange-100" },
];

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full min-h-screen p-6 md:p-8 lg:p-10 space-y-8 bg-gray-50">
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">
          Analytics
        </h1>
        <p className="text-slate-500 font-medium text-sm">
          Platform performance metrics and insights.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {STAT_CARDS.map(({ key, label, color }) => (
          <div
            key={key}
            className={`p-5 rounded-2xl border ${color} flex flex-col gap-2`}
          >
            <p className="text-xs font-black uppercase tracking-wide opacity-70">{label}</p>
            {loading ? (
              <div className="h-8 bg-current opacity-10 rounded-lg animate-pulse" />
            ) : (
              <p className="text-3xl font-black">{stats?.[key] ?? 0}</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-black text-slate-800 mb-4">Category Progress</h2>
          <BarChart />
        </div>
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-black text-slate-800 mb-4">Team Performance</h2>
          <LineChart />
        </div>
      </div>
    </div>
  );
}

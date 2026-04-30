"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { CONTACT_ENDPOINTS, REPORT_ENDPOINTS } from "@/actions/constant/constant";

type DailyCount = { day: string; count: number };
type WeeklyCount = { week: string; count: number };

function groupByDay(items: { createdAt?: string }[]): DailyCount[] {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const counts = Object.fromEntries(days.map((d) => [d, 0]));
  items.forEach((item) => {
    if (item.createdAt) {
      const day = days[new Date(item.createdAt).getDay()];
      counts[day] = (counts[day] || 0) + 1;
    }
  });
  return days.map((d) => ({ day: d, count: counts[d] }));
}

function groupByWeek(items: { createdAt?: string }[]): WeeklyCount[] {
  const weeks: Record<string, number> = { "Week 1": 0, "Week 2": 0, "Week 3": 0, "Week 4": 0 };
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  items.forEach((item) => {
    if (!item.createdAt) return;
    const date = new Date(item.createdAt);
    if (date < startOfMonth) return;
    const dayOfMonth = date.getDate();
    const weekKey =
      dayOfMonth <= 7 ? "Week 1" :
      dayOfMonth <= 14 ? "Week 2" :
      dayOfMonth <= 21 ? "Week 3" : "Week 4";
    weeks[weekKey]++;
  });
  return Object.entries(weeks).map(([week, count]) => ({ week, count }));
}

export default function SupportCharts() {
  const [mounted, setMounted] = useState(false);
  const [reportsData, setReportsData] = useState<DailyCount[]>([]);
  const [messagesData, setMessagesData] = useState<WeeklyCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);

    async function fetchChartData() {
      try {
        const [reportsRes, ticketsRes] = await Promise.all([
          fetch(REPORT_ENDPOINTS.GET_ALL, { cache: "no-store" }).catch(() => null),
          fetch(CONTACT_ENDPOINTS.TICKETS, { cache: "no-store" }).catch(() => null),
        ]);

        const reports = reportsRes?.ok ? await reportsRes.json() : [];
        const tickets = ticketsRes?.ok ? await ticketsRes.json() : [];

        const reportsArr = Array.isArray(reports) ? reports : reports?.reports ?? [];
        const ticketsArr = Array.isArray(tickets) ? tickets : [];

        setReportsData(groupByDay(reportsArr));
        setMessagesData(groupByWeek(ticketsArr));
      } catch {
        // keep empty charts on error
      } finally {
        setLoading(false);
      }
    }

    fetchChartData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="bg-white shadow-md p-6 rounded-2xl border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Weekly User Reports (by day)</h3>
        <div className="h-72">
          {!mounted || loading ? (
            <div className="h-full bg-slate-50 rounded-xl animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" name="Reports" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white shadow-md p-6 rounded-2xl border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Monthly Support Tickets (this month)</h3>
        <div className="h-72">
          {!mounted || loading ? (
            <div className="h-full bg-slate-50 rounded-xl animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={messagesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Tickets"
                  stroke="#22C55E"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SUPPORT_LINKS } from "@/app/(links)/supportLinks/supportLinks";
import { CONTACT_ENDPOINTS, REPORT_ENDPOINTS } from "@/actions/constant/constant";

type SupportLink = {
  label?: string;
  name?: string;
  labelKey?: string;
  icon?: React.ReactElement<{ size?: number }>;
  href?: string;
  dashboardIcon?:
    | React.ReactElement<{ size?: number }>
    | ((props: { size?: number }) => React.ReactNode);
};

type SectionCounts = Record<string, number>;

type SupportStats = {
  total: number;
  today: number;
};

type RecentItem = {
  id: string | number;
  subject?: string;
  senderName?: string;
  status?: string;
  createdAt?: string;
  section: string;
};

function SupportCard({
  title,
  icon,
  onClick,
  count = 0,
}: {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
  count?: number;
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all flex items-center gap-6 cursor-pointer group"
    >
      <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-black text-slate-900 truncate">{title}</h2>
        <p className="text-sm text-slate-500 font-bold">{count} active items</p>
      </div>
    </div>
  );
}

export default function StreamlinedDashboard() {
  const router = useRouter();
  const [sectionCounts, setSectionCounts] = useState<SectionCounts>({});
  const [stats, setStats] = useState<SupportStats>({ total: 0, today: 0 });
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [ticketsRes, statsRes, reportsRes] = await Promise.all([
        fetch(CONTACT_ENDPOINTS.TICKETS, { cache: "no-store" }).catch(() => null),
        fetch(CONTACT_ENDPOINTS.STATS, { cache: "no-store" }).catch(() => null),
        fetch(REPORT_ENDPOINTS.GET_ALL, { cache: "no-store" }).catch(() => null),
      ]);

      const tickets = ticketsRes?.ok ? await ticketsRes.json() : [];
      const statsData = statsRes?.ok ? await statsRes.json() : { total: 0, today: 0 };
      const reports = reportsRes?.ok ? await reportsRes.json() : [];

      setStats(statsData);

      const counts: SectionCounts = {
        reports: Array.isArray(reports) ? reports.length : 0,
        messages: Array.isArray(tickets)
          ? tickets.filter((t: { status?: string }) => t.status === "NEW").length
          : 0,
      };
      setSectionCounts(counts);

      const recent: RecentItem[] = [
        ...(Array.isArray(tickets)
          ? tickets.slice(0, 3).map((t: RecentItem) => ({ ...t, section: "messages" }))
          : []),
        ...(Array.isArray(reports)
          ? reports.slice(0, 3).map((r: RecentItem) => ({ ...r, section: "reports" }))
          : []),
      ]
        .sort((a, b) => ((b.createdAt || "") > (a.createdAt || "") ? 1 : -1))
        .slice(0, 6);

      setRecentItems(recent);
    } catch {
      // keep defaults on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalItems = Object.values(sectionCounts).reduce((s, n) => s + n, 0);

  return (
    <div className="flex flex-col gap-10 p-10 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Support Overview
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Real-time status of platform management.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-3xl border border-slate-100 shadow-sm">
          <div className="px-6 py-3 text-center border-r border-slate-100">
            <p className="text-[12px] uppercase font-black text-slate-400 tracking-widest">
              Total Tickets
            </p>
            <p className="text-3xl font-black text-indigo-600">
              {loading ? "—" : stats.total}
            </p>
          </div>
          <div className="px-6 py-3 text-center border-r border-slate-100">
            <p className="text-[12px] uppercase font-black text-slate-400 tracking-widest">
              Today
            </p>
            <p className="text-3xl font-black text-emerald-600">
              {loading ? "—" : stats.today}
            </p>
          </div>
          <div className="px-6 py-3 text-center">
            <p className="text-[12px] uppercase font-black text-slate-400 tracking-widest">
              Active Items
            </p>
            <p className="text-3xl font-black text-slate-900">
              {loading ? "—" : totalItems}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {SUPPORT_LINKS.filter((link) => {
          const title = (link.label || link.labelKey || "").toString();
          return title.toLowerCase() !== "home";
        }).map((link: SupportLink) => {
          const title = (link.label || link.labelKey || "").toString();
          const IconContent = link.dashboardIcon || link.icon;
          const count = sectionCounts[title.toLowerCase()] ?? 0;

          let iconNode: React.ReactNode;
          if (typeof IconContent === "function") {
            iconNode = IconContent({ size: 28 });
          } else if (React.isValidElement(IconContent)) {
            iconNode = React.cloneElement(
              IconContent as React.ReactElement<{ size?: number }>,
              { size: 28 },
            );
          } else {
            iconNode = IconContent;
          }

          return (
            <SupportCard
              key={title}
              title={title}
              count={count}
              onClick={() => router.push(link.href || "/")}
              icon={iconNode}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900">Recent Activity</h2>
            <button
              onClick={fetchData}
              className="text-sm font-black text-indigo-600 px-5 py-2 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-slate-50 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <ul className="divide-y divide-slate-50">
              {recentItems.length === 0 ? (
                <li className="py-8 text-center text-slate-400 font-medium">
                  No recent activity
                </li>
              ) : (
                recentItems.map((item, idx) => (
                  <li
                    key={item.id || idx}
                    className="py-6 flex justify-between items-center group"
                  >
                    <div className="flex items-center gap-6">
                      <div
                        className={`w-3 h-3 rounded-full shadow-sm ${
                          item.status === "NEW"
                            ? "bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]"
                            : item.status === "IN_PROGRESS"
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                        }`}
                      />
                      <div>
                        <p className="text-lg font-bold text-slate-800">
                          {item.subject || item.senderName || "Request Update"}
                        </p>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-tight">
                          Section:{" "}
                          <span className="text-indigo-500">{item.section}</span>
                          {item.status && (
                            <span className="ml-3 text-slate-300">
                              · {item.status.replace("_", " ")}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}

          <button
            onClick={() => router.push("/support/messages")}
            className="w-full mt-10 py-5 bg-slate-900 text-white text-sm font-black rounded-2xl hover:bg-black transition shadow-xl shadow-slate-200"
          >
            View All Tickets
          </button>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col gap-6">
          <h2 className="text-xl font-black text-slate-900">Quick Stats</h2>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-2xl">
              <span className="text-sm font-bold text-indigo-700">Total Tickets</span>
              <span className="text-2xl font-black text-indigo-600">
                {loading ? "—" : stats.total}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-2xl">
              <span className="text-sm font-bold text-emerald-700">New Today</span>
              <span className="text-2xl font-black text-emerald-600">
                {loading ? "—" : stats.today}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-amber-50 rounded-2xl">
              <span className="text-sm font-bold text-amber-700">Open Reports</span>
              <span className="text-2xl font-black text-amber-600">
                {loading ? "—" : sectionCounts.reports ?? 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-rose-50 rounded-2xl">
              <span className="text-sm font-bold text-rose-700">Unread Messages</span>
              <span className="text-2xl font-black text-rose-600">
                {loading ? "—" : sectionCounts.messages ?? 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

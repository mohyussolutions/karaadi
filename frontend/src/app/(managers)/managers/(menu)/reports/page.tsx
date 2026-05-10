"use client";

import { useEffect, useState, useCallback } from "react";
import { REPORT_ENDPOINTS } from "@/actions/constant/constant";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";

type Report = {
  id: string | number;
  reason?: string;
  description?: string;
  status?: string;
  category?: string;
  createdAt?: string;
  itemId?: string;
  reportedBy?: string;
};

type ReportStats = {
  total?: number;
  pending?: number;
  resolved?: number;
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  RESOLVED: "bg-emerald-100 text-emerald-700",
  DISMISSED: "bg-slate-100 text-slate-500",
  REVIEWED: "bg-indigo-100 text-indigo-700",
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<ReportStats>({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const h = await getAuthHeaders();
      const [reportsRes, statsRes] = await Promise.all([
        fetch(REPORT_ENDPOINTS.GET_ALL, { cache: "no-store", headers: h as HeadersInit }),
        fetch(REPORT_ENDPOINTS.STATS, { cache: "no-store", headers: h as HeadersInit }).catch(() => null),
      ]);

      if (reportsRes.ok) {
        const data = await reportsRes.json();
        setReports(Array.isArray(data) ? data : data?.reports ?? []);
      }
      if (statsRes?.ok) {
        setStats(await statsRes.json());
      }
    } catch {
      // keep empty on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered =
    statusFilter === "ALL"
      ? reports
      : reports.filter((r) => r.status === statusFilter);

  return (
    <div className="w-full min-h-screen p-6 md:p-8 lg:p-10 space-y-6 bg-gray-50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">
            Reports
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            User-submitted content reports.
          </p>
        </div>
        <button
          onClick={load}
          className="text-sm font-bold text-indigo-600 px-5 py-2.5 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition self-start sm:self-auto"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-black uppercase tracking-wide text-slate-400">Total Reports</p>
          {loading ? (
            <div className="h-8 bg-slate-100 rounded-lg mt-2 animate-pulse" />
          ) : (
            <p className="text-3xl font-black text-slate-900 mt-1">
              {stats.total ?? reports.length}
            </p>
          )}
        </div>
        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm">
          <p className="text-xs font-black uppercase tracking-wide text-amber-400">Pending</p>
          {loading ? (
            <div className="h-8 bg-amber-50 rounded-lg mt-2 animate-pulse" />
          ) : (
            <p className="text-3xl font-black text-amber-600 mt-1">
              {stats.pending ?? reports.filter((r) => r.status === "PENDING").length}
            </p>
          )}
        </div>
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
          <p className="text-xs font-black uppercase tracking-wide text-emerald-400">Resolved</p>
          {loading ? (
            <div className="h-8 bg-emerald-50 rounded-lg mt-2 animate-pulse" />
          ) : (
            <p className="text-3xl font-black text-emerald-600 mt-1">
              {stats.resolved ?? reports.filter((r) => r.status === "RESOLVED").length}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 ring-indigo-500/20 bg-white font-medium"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="RESOLVED">Resolved</option>
          <option value="DISMISSED">Dismissed</option>
          <option value="REVIEWED">Reviewed</option>
        </select>
        <span className="text-sm text-slate-400 font-medium">
          {filtered.length} report{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-white rounded-2xl animate-pulse border border-slate-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-16 text-center">
          <p className="text-slate-400 font-bold text-lg">No reports found</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((r) => (
            <li
              key={String(r.id)}
              className="p-5 border border-slate-100 rounded-2xl bg-white hover:shadow-sm hover:border-indigo-100 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-base font-bold text-slate-800 truncate">
                      {r.reason || r.description || `Report #${r.id}`}
                    </h3>
                    {r.status && (
                      <span className={`shrink-0 px-2.5 py-0.5 rounded-lg text-xs font-black ${STATUS_COLOR[r.status] ?? "bg-slate-100 text-slate-500"}`}>
                        {r.status}
                      </span>
                    )}
                  </div>
                  {r.category && (
                    <p className="text-sm text-slate-400 font-medium capitalize">
                      Category: {r.category}
                    </p>
                  )}
                  {r.createdAt && (
                    <p className="text-xs text-slate-300 mt-1 font-medium">
                      {new Date(r.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

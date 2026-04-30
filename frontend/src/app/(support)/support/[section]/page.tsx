"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CONTACT_ENDPOINTS, REPORT_ENDPOINTS } from "@/actions/constant/constant";

type Ticket = {
  id: string | number;
  subject?: string;
  senderName?: string;
  senderEmail?: string;
  status?: string;
  priority?: string;
  createdAt?: string;
  body?: string;
};

type Report = {
  id: string | number;
  reason?: string;
  description?: string;
  status?: string;
  createdAt?: string;
  itemId?: string;
  category?: string;
};

type SupportItem = Ticket | Report;

const STATUS_COLOR: Record<string, string> = {
  NEW: "bg-indigo-100 text-indigo-700",
  IN_PROGRESS: "bg-amber-100 text-amber-700",
  DONE: "bg-emerald-100 text-emerald-700",
  RESOLVED: "bg-green-100 text-green-700",
  CLOSED: "bg-slate-100 text-slate-500",
};

async function fetchSectionData(section: string): Promise<SupportItem[]> {
  try {
    if (section === "messages") {
      const res = await fetch(CONTACT_ENDPOINTS.TICKETS, { cache: "no-store" });
      return res.ok ? await res.json() : [];
    }
    if (section === "reports") {
      const res = await fetch(REPORT_ENDPOINTS.GET_ALL, { cache: "no-store" });
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : data?.reports ?? [];
    }
    return [];
  } catch {
    return [];
  }
}

export default function SupportSectionPage() {
  const params = useParams() as { section?: string };
  const section = params?.section || "unknown";
  const [items, setItems] = useState<SupportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetchSectionData(section);
    setItems(data);
    setLoading(false);
  }, [section]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered =
    statusFilter === "ALL"
      ? items
      : items.filter((it) => (it as Ticket).status === statusFilter);

  const isTicket = section === "messages";
  const isReport = section === "reports";
  const hasFilters = isTicket || isReport;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 capitalize">
            {section.replace(/-/g, " ")}
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            {items.length} total item{items.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-3">
          {hasFilters && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 ring-indigo-500/20 bg-white font-medium"
            >
              <option value="ALL">All Status</option>
              <option value="NEW">New</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          )}
          <button
            onClick={load}
            className="text-sm font-bold text-indigo-600 px-4 py-2 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition"
          >
            Refresh
          </button>
          {isTicket && (
            <Link
              href={`/support/${section}/create`}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition"
            >
              Create Ticket
            </Link>
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-white rounded-2xl animate-pulse border border-slate-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-16 text-center">
          <p className="text-slate-400 font-bold text-lg">
            No {statusFilter === "ALL" ? "" : statusFilter.toLowerCase() + " "}items for{" "}
            <span className="text-indigo-500 capitalize">{section}</span>
          </p>
          {isTicket && (
            <Link
              href={`/support/${section}/create`}
              className="mt-4 inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition"
            >
              Create First Ticket
            </Link>
          )}
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((it) => {
            const ticket = it as Ticket;
            const report = it as Report;
            const status = ticket.status;
            return (
              <li
                key={String(it.id)}
                className="p-5 border border-slate-100 rounded-2xl bg-white hover:shadow-sm hover:border-indigo-100 transition group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-base font-bold text-slate-800 truncate">
                        {isTicket
                          ? ticket.subject || ticket.senderName || `Ticket #${it.id}`
                          : report.reason || report.description || `Report #${it.id}`}
                      </h3>
                      {status && (
                        <span
                          className={`shrink-0 px-2.5 py-0.5 rounded-lg text-xs font-black ${STATUS_COLOR[status] ?? "bg-slate-100 text-slate-500"}`}
                        >
                          {status.replace("_", " ")}
                        </span>
                      )}
                    </div>
                    {isTicket && ticket.senderEmail && (
                      <p className="text-sm text-slate-400 font-medium">
                        From: {ticket.senderName} · {ticket.senderEmail}
                      </p>
                    )}
                    {isReport && report.category && (
                      <p className="text-sm text-slate-400 font-medium capitalize">
                        Category: {report.category}
                      </p>
                    )}
                    {it.createdAt && (
                      <p className="text-xs text-slate-300 mt-1 font-medium">
                        {new Date(it.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>
                  {isTicket && ticket.priority && (
                    <span
                      className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-black ${
                        ticket.priority === "HIGH" || ticket.priority === "URGENT"
                          ? "bg-rose-50 text-rose-600"
                          : "bg-slate-50 text-slate-400"
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

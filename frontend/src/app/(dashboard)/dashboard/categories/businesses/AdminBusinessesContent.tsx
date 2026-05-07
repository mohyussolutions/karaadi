"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import {
  RefreshCw, Building2, CheckCircle, Clock, XCircle,
  ChevronDown, ChevronUp, BarChart2, Pencil, Check, X,
  Zap, Trash2, User,
} from "lucide-react";
import { IoIosBusiness } from "react-icons/io";
import type { Business } from "@/actions/categories/businessActions";
import {
  adminGetAllBusinesses,
  adminUpdateBusinessStatus,
  adminDeleteBusiness,
  adminAssignPlanDirect,
  adminSetPostLimitDirect,
  adminGetListingsByBusiness,
  adminDeleteListing,
} from "@/actions/categories/adminBusinessApi";
import { useBusinessStatus } from "../../components/hooks/useBusinessStatus";

function computeStats(businesses: Business[]) {
  const now = new Date();
  return {
    total: businesses.length,
    pending: businesses.filter((b) => b.status === "pending").length,
    active: businesses.filter((b) => b.status === "active").length,
    suspended: businesses.filter((b) => b.status === "suspended").length,
    canPost: businesses.filter(
      (b) =>
        b.status === "active" &&
        b.isVerified &&
        b.isAdminEnabled !== false &&
        !!b.planId &&
        !!b.expiryDate &&
        new Date(b.expiryDate) > now,
    ).length,
  };
}

export default function AdminBusinessesContent() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminGetAllBusinesses();
      setBusinesses(data.businesses);
      setPlans(data.plans);
    } catch {
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleStatusUpdate = async (id: string, status: string, isVerified: boolean) => {
    setUpdating(id);
    try {
      const res = await adminUpdateBusinessStatus(id, status, isVerified);
      if (res?.business || res?.success)
        setBusinesses((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: status as any, isVerified } : b)),
        );
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await adminDeleteBusiness(id);
    if (ok) setBusinesses((prev) => prev.filter((b) => b.id !== id));
  };

  const handleAssignPlan = async (businessId: string, planId: string) => {
    setUpdating(businessId);
    try {
      const res = await adminAssignPlanDirect(businessId, planId);
      if (res?.success && res?.business)
        setBusinesses((prev) =>
          prev.map((b) => (b.id === businessId ? { ...b, ...res.business } : b)),
        );
    } finally {
      setUpdating(null);
    }
  };

  const handleSetPostLimit = async (businessId: string, limit: number | null) => {
    setUpdating(businessId);
    try {
      const res = await adminSetPostLimitDirect(businessId, limit);
      if (res?.success && res?.business)
        setBusinesses((prev) =>
          prev.map((b) =>
            b.id === businessId
              ? { ...b, maxListingsOverride: res.business.maxListingsOverride }
              : b,
          ),
        );
    } finally {
      setUpdating(null);
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return businesses.filter((b) => {
      const matchSearch =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q) ||
        b.phone.includes(q) ||
        (b.owner?.username ?? "").toLowerCase().includes(q) ||
        (b.owner?.email ?? "").toLowerCase().includes(q);
      return matchSearch && (!statusFilter || b.status === statusFilter);
    });
  }, [businesses, search, statusFilter]);

  const stats = useMemo(() => computeStats(businesses), [businesses]);

  return (
    <div className="w-full min-h-screen bg-gray-50 space-y-6">
      <PageHeader onRefresh={fetchAll} />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total" value={stats.total} Icon={Building2} color="from-indigo-600 to-indigo-800" />
        <StatCard label="Pending" value={stats.pending} Icon={Clock} color="from-yellow-500 to-yellow-700" />
        <StatCard label="Active" value={stats.active} Icon={CheckCircle} color="from-emerald-500 to-emerald-700" />
        <StatCard label="Suspended" value={stats.suspended} Icon={XCircle} color="from-red-500 to-red-700" />
        <StatCard label="Can Post" value={stats.canPost} Icon={Zap} color="from-teal-500 to-teal-700" />
      </div>

      <SearchBar search={search} setSearch={setSearch} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />

      <div className="space-y-3">
        {loading ? (
          <Spinner />
        ) : filtered.length === 0 ? (
          <Empty />
        ) : (
          filtered.map((b) => (
            <BusinessRow
              key={b.id}
              b={b}
              plans={plans}
              updating={updating === b.id}
              onStatusUpdate={handleStatusUpdate}
              onDelete={handleDelete}
              onAssignPlan={handleAssignPlan}
              onSetPostLimit={handleSetPostLimit}
            />
          ))
        )}
      </div>

      <p className="text-sm text-gray-400 text-right pb-2">
        {filtered.length} / {businesses.length} businesses
      </p>
    </div>
  );
}

function PageHeader({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-indigo-700 rounded-2xl flex items-center justify-center shadow-md">
          <IoIosBusiness className="text-white text-3xl" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Businesses</h1>
          <p className="text-base text-gray-500 mt-0.5">Verify and manage</p>
        </div>
      </div>
      <button
        onClick={onRefresh}
        className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 rounded-xl hover:bg-indigo-50 transition shadow-sm text-sm font-medium text-gray-700 self-start sm:self-auto"
      >
        <RefreshCw className="h-4 w-4" />
        Refresh
      </button>
    </div>
  );
}

function StatCard({ label, value, Icon, color }: { label: string; value: number; Icon: React.ElementType; color: string }) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white shadow-md`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-widest opacity-80">{label}</span>
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="text-5xl font-extrabold">{value}</div>
    </div>
  );
}

function SearchBar({ search, setSearch, statusFilter, setStatusFilter }: {
  search: string; setSearch: (v: string) => void;
  statusFilter: string; setStatusFilter: (v: string) => void;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 p-5 flex flex-col sm:flex-row gap-4 shadow-sm">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, email, phone, or owner..."
        className="flex-1 border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="border rounded-xl px-4 py-3 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[180px]"
      >
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="suspended">Suspended</option>
      </select>
    </div>
  );
}

function Spinner() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 p-20 flex items-center justify-center">
      <div className="animate-spin rounded-full h-14 w-14 border-4 border-indigo-600 border-t-transparent" />
    </div>
  );
}

function Empty() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 p-20 text-center text-gray-400">
      <IoIosBusiness className="text-7xl mx-auto mb-4 opacity-20" />
      <p className="text-lg font-medium">No businesses found</p>
    </div>
  );
}

function StepTracker({ b }: { b: Business }) {
  const now = new Date();
  const isApproved = b.status === "active" && b.isVerified;
  const hasPlan = !!b.planId && !!b.expiryDate && new Date(b.expiryDate) > now;
  const hasPosted = (b.currentListings ?? 0) > 0;

  const steps = [
    { label: "Apply", done: true },
    { label: "Approval", done: isApproved },
    { label: "Plan", done: hasPlan },
    { label: "Post", done: hasPosted, count: b.currentListings ?? 0 },
  ];

  return (
    <div className="flex items-center gap-0 w-full">
      {steps.map((step, i) => (
        <React.Fragment key={step.label}>
          <div className="flex flex-col items-center gap-1 flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${step.done ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white dark:bg-gray-800 border-gray-300 text-gray-400"}`}>
              {step.done ? <Check className="w-3.5 h-3.5" /> : <span>{i + 1}</span>}
            </div>
            <span className={`text-[10px] font-semibold whitespace-nowrap ${step.done ? "text-emerald-600" : "text-gray-400"}`}>
              {step.label}{"count" in step && step.done ? ` · ${step.count}` : ""}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-0.5 flex-1 mb-4 transition-colors ${steps[i + 1].done || step.done ? "bg-emerald-400" : "bg-gray-200"}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function BusinessRow({ b, plans, updating, onStatusUpdate, onDelete, onAssignPlan, onSetPostLimit }: {
  b: Business; plans: any[]; updating: boolean;
  onStatusUpdate: (id: string, status: string, isVerified: boolean) => void;
  onDelete: (id: string) => void;
  onAssignPlan: (businessId: string, planId: string) => void;
  onSetPostLimit: (businessId: string, limit: number | null) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [listings, setListings] = useState<any[]>([]);
  const [loadingListings, setLoadingListings] = useState(false);

  const isApproved = b.status === "active" && b.isVerified;
  const effectiveMax = b.maxListingsOverride ?? b.plan?.maxListings ?? 0;
  const used = b.currentListings ?? 0;
  const usagePct = effectiveMax > 0 ? Math.min(100, Math.round((used / effectiveMax) * 100)) : 0;

  const toggleListings = async () => {
    if (!expanded && listings.length === 0) {
      setLoadingListings(true);
      try {
        const items = await adminGetListingsByBusiness(b.id);
        setListings(items);
      } finally {
        setLoadingListings(false);
      }
    }
    setExpanded((v) => !v);
  };

  const handleDeleteListing = async (listingId: string, mainCategory: string) => {
    const ok = await adminDeleteListing(listingId, mainCategory);
    if (ok) setListings((prev) => prev.filter((l) => l.id !== listingId));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-5 space-y-4">
        <BusinessHeader b={b} updating={updating} onStatusUpdate={onStatusUpdate} onDelete={onDelete} />
        <StepTracker b={b} />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Post Limit</p>
            <PostLimitEditor businessId={b.id} current={b.maxListingsOverride} planMax={b.plan?.maxListings} disabled={updating || !isApproved} onSave={onSetPostLimit} />
            {b.plan && b.maxListingsOverride == null && <p className="text-[10px] text-gray-400">Plan: {b.plan.name}</p>}
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Used</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-gray-900">{used}</span>
              <span className="text-xs text-gray-400">/ {effectiveMax > 0 ? effectiveMax : <span className="italic">∞</span>}</span>
            </div>
            {effectiveMax > 0 ? (
              <>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${usagePct >= 90 ? "bg-red-500" : usagePct >= 70 ? "bg-orange-400" : "bg-blue-500"}`} style={{ width: `${usagePct}%` }} />
                </div>
                <p className="text-[10px] text-gray-400 flex items-center gap-1">
                  <BarChart2 className="w-2.5 h-2.5" />
                  {usagePct}% · {Math.max(0, effectiveMax - used)} remaining
                </p>
              </>
            ) : (
              <p className="text-[10px] text-amber-500">Assign a plan</p>
            )}
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Plan</p>
            {!isApproved && <p className="text-[10px] text-amber-500 italic">Approve first</p>}
            <select
              disabled={updating || !isApproved}
              value={b.planId ?? ""}
              onChange={(e) => e.target.value && onAssignPlan(b.id, e.target.value)}
              className={`w-full text-xs border rounded-lg px-2 py-1.5 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${!b.planId ? "border-amber-300" : "border-gray-200"}`}
            >
              <option value="">— Choose plan —</option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>{p.name} · {p.maxListings} posts · {p.durationDays}d</option>
              ))}
            </select>
            {b.expiryDate ? (
              <p className="text-[10px] text-gray-400">Expires: {new Date(b.expiryDate).toLocaleDateString()}</p>
            ) : (
              <p className="text-[10px] text-amber-500">No plan assigned</p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button onClick={toggleListings} className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition">
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {expanded ? "Hide listings" : "View listings"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50 p-4">
          {loadingListings ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent" />
            </div>
          ) : listings.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No listings yet</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {listings.map((item) => (
                <ListingRow key={item.id} item={item} owner={b.owner} onDelete={handleDeleteListing} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BusinessHeader({ b, updating, onStatusUpdate, onDelete }: {
  b: Business; updating: boolean;
  onStatusUpdate: (id: string, status: string, isVerified: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const { getStatusColor } = useBusinessStatus();
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-indigo-100 flex items-center justify-center">
        {(b.images as string[] | undefined)?.[0] ? (
          <Image src={(b.images as string[])[0]} alt={b.name} width={48} height={48} className="w-full h-full object-cover" />
        ) : (
          <IoIosBusiness className="text-indigo-700 text-xl" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-gray-900 text-sm">{b.name}</span>
          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${getStatusColor(b.status)}`}>{b.status}</span>
          {b.isVerified && (
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">Verified</span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{b.email} · {b.phone}</p>

        {b.owner && (
          <div className="flex items-center gap-1.5 mt-1.5 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 w-fit">
            {b.owner.profileImage ? (
              <Image src={b.owner.profileImage} alt={b.owner.username} width={18} height={18} className="rounded-full object-cover" />
            ) : (
              <User className="w-3.5 h-3.5 text-gray-400" />
            )}
            <span className="text-[11px] font-semibold text-gray-700">{b.owner.username}</span>
            <span className="text-[11px] text-gray-400">{b.owner.email}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-1 mt-1.5">
          {b.categories.map((cat) => (
            <span key={cat} className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-full font-medium">{cat}</span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 items-end flex-shrink-0">
        {b.status === "pending" && (
          <button onClick={() => onStatusUpdate(b.id, "active", true)} disabled={updating} className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition">
            {updating ? "…" : "Approve"}
          </button>
        )}
        {b.status === "active" && (
          <button onClick={() => onStatusUpdate(b.id, "suspended", b.isVerified)} disabled={updating} className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-red-600 disabled:opacity-50 transition">
            {updating ? "…" : "Suspend"}
          </button>
        )}
        {(b.status === "suspended" || b.status === "inactive") && (
          <button onClick={() => onStatusUpdate(b.id, "active", true)} disabled={updating} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition">
            {updating ? "…" : "Reactivate"}
          </button>
        )}
        {!b.isVerified && b.status !== "pending" && (
          <button onClick={() => onStatusUpdate(b.id, b.status, true)} disabled={updating} className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition">
            Verify
          </button>
        )}

        {confirmDelete ? (
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-red-600 font-semibold">Delete?</span>
            <button onClick={() => { onDelete(b.id); setConfirmDelete(false); }} className="text-[11px] bg-red-600 text-white px-2 py-1 rounded-lg font-bold hover:bg-red-700 transition">Yes</button>
            <button onClick={() => setConfirmDelete(false)} className="text-[11px] bg-gray-100 text-gray-600 px-2 py-1 rounded-lg font-bold hover:bg-gray-200 transition">No</button>
          </div>
        ) : (
          <button onClick={() => setConfirmDelete(true)} className="flex items-center gap-1 text-xs bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg font-semibold transition">
            <Trash2 className="w-3 h-3" /> Delete
          </button>
        )}
      </div>
    </div>
  );
}

function PostLimitEditor({ businessId, current, planMax, disabled, onSave }: {
  businessId: string; current: number | null | undefined;
  planMax: number | undefined; disabled: boolean;
  onSave: (id: string, limit: number | null) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(current != null ? String(current) : "");

  const effective: number | null = current ?? planMax ?? null;
  const hasLimit = effective !== null;

  const save = () => {
    const num = value.trim() === "" ? null : parseInt(value, 10);
    if (num !== null && (isNaN(num) || num < 0)) return;
    onSave(businessId, num);
    setEditing(false);
  };

  const cancel = () => { setValue(current != null ? String(current) : ""); setEditing(false); };

  if (!editing) {
    return (
      <div className="flex items-center gap-2">
        <div>
          {hasLimit ? (
            <>
              <span className="text-sm font-bold text-gray-900">{effective}</span>
              <span className="text-xs text-gray-400 ml-1">posts</span>
              {current != null && <span className="ml-1 text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full font-semibold">custom</span>}
            </>
          ) : (
            <span className="text-xs text-gray-400 italic">Assign plan first</span>
          )}
        </div>
        <button onClick={() => setEditing(true)} disabled={disabled} className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 disabled:opacity-40 whitespace-nowrap">
          <Pencil className="w-3 h-3" /> {hasLimit ? "Edit" : "Set"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <input
        type="number" min={1} value={value} onChange={(e) => setValue(e.target.value)}
        placeholder="e.g. 10" autoFocus
        className="w-24 text-sm border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") cancel(); }}
      />
      <button onClick={save} className="p-1 text-green-600 hover:text-green-800"><Check className="w-4 h-4" /></button>
      <button onClick={cancel} className="p-1 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
    </div>
  );
}

function ListingRow({ item, owner, onDelete }: {
  item: any; owner?: Business["owner"];
  onDelete: (id: string, mainCategory: string) => void;
}) {
  const [confirm, setConfirm] = useState(false);
  const img = item.images?.[0];
  const category =
    typeof item.category === "string" ? item.category
    : Array.isArray(item.category) ? item.category[0]
    : (item.mainCategory ?? "");

  return (
    <div className="flex items-center gap-3 py-3 px-1">
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
        {img ? (
          <Image src={img} alt={item.title ?? ""} fill className="object-cover" sizes="48px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-[9px] uppercase text-center px-1">{category}</div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{item.title}</p>
        <p className="text-xs text-gray-400 capitalize">{category}{item.city ? ` · ${item.city}` : ""}</p>
        {owner && (
          <div className="flex items-center gap-1 mt-0.5">
            <User className="w-3 h-3 text-gray-300" />
            <span className="text-[11px] text-gray-400">{owner.username}</span>
            <span className="text-[11px] text-gray-300">·</span>
            <span className="text-[11px] text-gray-400">{owner.email}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {item.price != null && <span className="text-sm font-bold text-gray-900">${Number(item.price).toLocaleString()}</span>}
        {item.maGaday && <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-full">SOLD</span>}
        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-medium capitalize">{item.mainCategory ?? "—"}</span>
        {confirm ? (
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-red-600 font-semibold">Delete?</span>
            <button onClick={() => { onDelete(item.id, item.mainCategory ?? ""); setConfirm(false); }} className="text-[11px] bg-red-600 text-white px-2 py-0.5 rounded font-bold hover:bg-red-700 transition">Yes</button>
            <button onClick={() => setConfirm(false)} className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-bold hover:bg-gray-200 transition">No</button>
          </div>
        ) : (
          <button onClick={() => setConfirm(true)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition" title="Delete listing">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

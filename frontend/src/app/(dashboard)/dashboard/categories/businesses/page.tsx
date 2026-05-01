"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import {
  RefreshCw,
  Building2,
  CheckCircle,
  Clock,
  XCircle,
  ChevronDown,
  ChevronUp,
  BarChart2,
  Pencil,
  Check,
  X,
  Zap,
} from "lucide-react";
import { IoIosBusiness } from "react-icons/io";
import {
  getAllBusinessesAdmin,
  updateBusinessStatus,
  deleteBusiness,
  getListingsByBusinessOwner,
  adminAssignPlan,
  adminSetPostLimit,
  type Business,
  getAllBusinessPlans,
} from "@/actions/categories/businessActions";
import { useBusinessStatus } from "../../components/hooks/useBusinessStatus";

async function loadAdminData() {
  const [bizRes, planRes] = await Promise.all([
    getAllBusinessesAdmin() as any,
    getAllBusinessPlans() as any,
  ]);
  return {
    businesses: (bizRes?.businesses ?? []) as Business[],
    plans: ((planRes?.plans ?? []) as any[]).filter((p) => p.isActive),
  };
}

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

export default function AdminBusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const data = await loadAdminData();
      setBusinesses(data.businesses);
      setPlans(data.plans);
    } catch {
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleStatusUpdate = async (
    id: string,
    status: string,
    isVerified: boolean,
  ) => {
    setUpdating(id);
    try {
      const res = (await updateBusinessStatus(id, {
        status,
        isVerified,
      })) as any;
      if (res?.business || res?.success)
        setBusinesses((prev) =>
          prev.map((b) =>
            b.id === id ? { ...b, status: status as any, isVerified } : b,
          ),
        );
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tirtir ganacsigan? / Delete this business?")) return;
    await deleteBusiness(id);
    setBusinesses((prev) => prev.filter((b) => b.id !== id));
  };

  const handleAssignPlan = async (businessId: string, planId: string) => {
    setUpdating(businessId);
    try {
      const res = (await adminAssignPlan(businessId, planId)) as any;
      if (res?.success && res?.business)
        setBusinesses((prev) =>
          prev.map((b) =>
            b.id === businessId ? { ...b, ...res.business } : b,
          ),
        );
    } finally {
      setUpdating(null);
    }
  };

  const handleSetPostLimit = async (
    businessId: string,
    limit: number | null,
  ) => {
    setUpdating(businessId);
    try {
      const res = (await adminSetPostLimit(businessId, limit)) as any;
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
        b.phone.includes(q);
      return matchSearch && (!statusFilter || b.status === statusFilter);
    });
  }, [businesses, search, statusFilter]);

  const stats = useMemo(() => computeStats(businesses), [businesses]);

  return (
    <div
      className="w-full min-h-screen bg-gray-50 space-y-6"
      suppressHydrationWarning
    >
      <PageHeader onRefresh={fetchAll} />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          so="Wadarta"
          en="Total"
          value={stats.total}
          Icon={Building2}
          color="from-indigo-600 to-indigo-800"
        />
        <StatCard
          so="Sugitaanka"
          en="Pending"
          value={stats.pending}
          Icon={Clock}
          color="from-yellow-500 to-yellow-700"
        />
        <StatCard
          so="Firfircoon"
          en="Active"
          value={stats.active}
          Icon={CheckCircle}
          color="from-emerald-500 to-emerald-700"
        />
        <StatCard
          so="Xanniday"
          en="Suspended"
          value={stats.suspended}
          Icon={XCircle}
          color="from-red-500 to-red-700"
        />
        <StatCard
          so="Daabici kara"
          en="Can Post"
          value={stats.canPost}
          Icon={Zap}
          color="from-teal-500 to-teal-700"
        />
      </div>

      <SearchBar
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

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
        {filtered.length} / {businesses.length} Ganacsiyada (Businesses)
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
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Ganacsiyada{" "}
            <span className="text-gray-400 font-normal text-xl">
              / Businesses
            </span>
          </h1>
          <p className="text-base text-gray-500 mt-0.5">
            Xaqiiji oo maamul · Verify and manage
          </p>
        </div>
      </div>
      <button
        onClick={onRefresh}
        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 rounded-xl hover:bg-indigo-50 transition shadow-sm text-sm font-medium text-gray-700 self-start sm:self-auto"
      >
        <RefreshCw className="h-4 w-4" />
        Cusboonaysii / Refresh
      </button>
    </div>
  );
}

function StatCard({
  so,
  en,
  value,
  Icon,
  color,
}: {
  so: string;
  en: string;
  value: number;
  Icon: React.ElementType;
  color: string;
}) {
  return (
    <div
      className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white shadow-md`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-widest opacity-80">
          {so} / {en}
        </span>
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="text-5xl font-extrabold">{value}</div>
    </div>
  );
}

function SearchBar({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
}: {
  search: string;
  setSearch: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col sm:flex-row gap-4 shadow-sm">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Raadi · Search..."
        className="flex-1 border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="border rounded-xl px-4 py-3 text-base bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[200px]"
      >
        <option value="">Dhammaan Xaaladaha · All Statuses</option>
        <option value="pending">Sugitaanka · Pending</option>
        <option value="active">Firfircoon · Active</option>
        <option value="inactive">Aan firfircoon · Inactive</option>
        <option value="suspended">Xanniday · Suspended</option>
      </select>
    </div>
  );
}

function Spinner() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-20 flex items-center justify-center">
      <div className="animate-spin rounded-full h-14 w-14 border-4 border-indigo-600 border-t-transparent" />
    </div>
  );
}

function Empty() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-20 text-center text-gray-400">
      <IoIosBusiness className="text-7xl mx-auto mb-4 opacity-20" />
      <p className="text-lg font-medium">
        Ganacsi lama helin · No businesses found
      </p>
    </div>
  );
}

function BusinessRow({
  b,
  plans,
  updating,
  onStatusUpdate,
  onDelete,
  onAssignPlan,
  onSetPostLimit,
}: {
  b: Business;
  plans: any[];
  updating: boolean;
  onStatusUpdate: (id: string, status: string, isVerified: boolean) => void;
  onDelete: (id: string) => void;
  onAssignPlan: (businessId: string, planId: string) => void;
  onSetPostLimit: (businessId: string, limit: number | null) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [listings, setListings] = useState<any[]>([]);
  const [loadingListings, setLoadingListings] = useState(false);
  const { getStatusColor } = useBusinessStatus();

  const effectiveMax = b.maxListingsOverride ?? b.plan?.maxListings ?? 0;
  const used = b.currentListings ?? 0;
  const usagePct =
    effectiveMax > 0
      ? Math.min(100, Math.round((used / effectiveMax) * 100))
      : 0;

  const toggleListings = async () => {
    if (!expanded && listings.length === 0) {
      setLoadingListings(true);
      try {
        const items = await getListingsByBusinessOwner(b.userId);
        setListings(items);
      } finally {
        setLoadingListings(false);
      }
    }
    setExpanded((v) => !v);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-5 space-y-4">
        <BusinessHeader
          b={b}
          updating={updating}
          onStatusUpdate={onStatusUpdate}
          onDelete={onDelete}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Xad · Post Limit
            </p>
            <PostLimitEditor
              businessId={b.id}
              current={b.maxListingsOverride}
              planMax={b.plan?.maxListings}
              disabled={updating}
              onSave={onSetPostLimit}
            />
            {b.plan && b.maxListingsOverride == null && (
              <p className="text-[10px] text-gray-400">
                Qorshaha: {b.plan.name}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              La Isticmaalay · Used
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-gray-900">{used}</span>
              <span className="text-xs text-gray-400">
                /{" "}
                {effectiveMax > 0 ? (
                  effectiveMax
                ) : (
                  <span className="italic">∞</span>
                )}
              </span>
            </div>
            {effectiveMax > 0 ? (
              <>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${usagePct >= 90 ? "bg-red-500" : usagePct >= 70 ? "bg-orange-400" : "bg-blue-500"}`}
                    style={{ width: `${usagePct}%` }}
                  />
                </div>
                <p className="text-[10px] text-gray-400 flex items-center gap-1">
                  <BarChart2 className="w-2.5 h-2.5" />
                  {usagePct}% · {Math.max(0, effectiveMax - used)} remaining
                </p>
              </>
            ) : (
              <p className="text-[10px] text-amber-500">
                Ku dar qorshe · Assign a plan
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Qorshe · Plan
            </p>
            <select
              disabled={updating}
              value={b.planId ?? ""}
              onChange={(e) =>
                e.target.value && onAssignPlan(b.id, e.target.value)
              }
              className={`w-full text-xs border rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 ${!b.planId ? "border-amber-300" : "border-gray-200"}`}
            >
              <option value="">— Dooro qorshe · Choose plan —</option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} · {p.maxListings} posts · {p.durationDays}d
                </option>
              ))}
            </select>
            {b.expiryDate ? (
              <p className="text-[10px] text-gray-400">
                Dhammaan: {new Date(b.expiryDate).toLocaleDateString()}
              </p>
            ) : (
              <p className="text-[10px] text-amber-500">
                Qorshe lama taabicin · No plan assigned
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={toggleListings}
            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition"
          >
            {expanded ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
            {expanded ? "Qari Liisaska · Hide" : "Arag Liisaska · View"}
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
            <p className="text-sm text-gray-400 text-center py-4">
              Liis lama abuurin · No listings yet
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {listings.map((item) => (
                <ListingRow key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BusinessHeader({
  b,
  updating,
  onStatusUpdate,
  onDelete,
}: {
  b: Business;
  updating: boolean;
  onStatusUpdate: (id: string, status: string, isVerified: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const { getStatusColor } = useBusinessStatus();

  return (
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-indigo-100 flex items-center justify-center">
        {(b.images as string[] | undefined)?.[0] ? (
          <Image
            src={(b.images as string[])[0]}
            alt={b.name}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        ) : (
          <IoIosBusiness className="text-indigo-700 text-xl" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-gray-900 text-sm">{b.name}</span>
          <span
            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${getStatusColor(b.status)}`}
          >
            {b.status}
          </span>
          {b.isVerified && (
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
              Xaqiijiyay · Verified
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-0.5">
          {b.email} · {b.phone}
        </p>
        <div className="flex flex-wrap gap-1 mt-1">
          {b.categories.map((cat) => (
            <span
              key={cat}
              className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-full font-medium"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 items-end flex-shrink-0">
        {b.status === "pending" && (
          <button
            onClick={() => onStatusUpdate(b.id, "active", true)}
            disabled={updating}
            className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition"
          >
            {updating ? "…" : "Ansix · Approve"}
          </button>
        )}
        {b.status === "active" && (
          <button
            onClick={() => onStatusUpdate(b.id, "suspended", b.isVerified)}
            disabled={updating}
            className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-red-600 disabled:opacity-50 transition"
          >
            {updating ? "…" : "La joojiyo · Suspend"}
          </button>
        )}
        {(b.status === "suspended" || b.status === "inactive") && (
          <button
            onClick={() => onStatusUpdate(b.id, "active", true)}
            disabled={updating}
            className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {updating ? "…" : "Dib u Hawlgeli · Reactivate"}
          </button>
        )}
        {!b.isVerified && b.status !== "pending" && (
          <button
            onClick={() => onStatusUpdate(b.id, b.status, true)}
            disabled={updating}
            className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            Xaqiiji · Verify
          </button>
        )}
        <button
          onClick={() => onDelete(b.id)}
          className="flex items-center gap-1 text-xs bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg font-semibold transition"
        >
          <X className="w-3 h-3" /> Delete
        </button>
      </div>
    </div>
  );
}

function PostLimitEditor({
  businessId,
  current,
  planMax,
  disabled,
  onSave,
}: {
  businessId: string;
  current: number | null | undefined;
  planMax: number | undefined;
  disabled: boolean;
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

  const cancel = () => {
    setValue(current != null ? String(current) : "");
    setEditing(false);
  };

  if (!editing) {
    return (
      <div className="flex items-center gap-2">
        <div>
          {hasLimit ? (
            <>
              <span className="text-sm font-bold text-gray-900">
                {effective}
              </span>
              <span className="text-xs text-gray-400 ml-1">posts</span>
              {current != null && (
                <span className="ml-1 text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full font-semibold">
                  custom
                </span>
              )}
            </>
          ) : (
            <span className="text-xs text-gray-400 italic">
              Qorshe ku dar · Assign plan first
            </span>
          )}
        </div>
        <button
          onClick={() => setEditing(true)}
          disabled={disabled}
          className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 disabled:opacity-40 whitespace-nowrap"
        >
          <Pencil className="w-3 h-3" /> {hasLimit ? "Edit" : "Set"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <input
        type="number"
        min={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="e.g. 10"
        autoFocus
        className="w-24 text-sm border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") cancel();
        }}
      />
      <button
        onClick={save}
        className="p-1 text-green-600 hover:text-green-800"
      >
        <Check className="w-4 h-4" />
      </button>
      <button
        onClick={cancel}
        className="p-1 text-gray-400 hover:text-gray-600"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function ListingRow({ item }: { item: any }) {
  const img = item.images?.[0];
  const category =
    typeof item.category === "string"
      ? item.category
      : Array.isArray(item.category)
        ? item.category[0]
        : (item.mainCategory ?? "");

  return (
    <div className="flex items-center gap-3 py-2.5 px-1">
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
        {img ? (
          <Image
            src={img}
            alt={item.title ?? ""}
            fill
            className="object-cover"
            sizes="48px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-[9px] uppercase text-center px-1">
            {category}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">
          {item.title}
        </p>
        <p className="text-xs text-gray-400 capitalize">
          {category}
          {item.city ? ` · ${item.city}` : ""}
        </p>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        {item.price != null && (
          <span className="text-sm font-bold text-gray-900">
            ${Number(item.price).toLocaleString()}
          </span>
        )}
        {item.maGaday && (
          <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-full">
            SOLD
          </span>
        )}
      </div>
    </div>
  );
}

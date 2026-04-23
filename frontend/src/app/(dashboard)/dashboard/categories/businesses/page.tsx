"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { RefreshCw, Building2, CheckCircle, Clock, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { IoIosBusiness } from "react-icons/io";
import {
  getAllBusinessesAdmin,
  updateBusinessStatus,
  deleteBusiness,
  getListingsByBusinessOwner,
  type Business,
} from "@/actions/categories/businessActions";

const STATUS_COLORS: Record<string, string> = {
  pending:   "bg-yellow-100 text-yellow-800 border-yellow-200",
  active:    "bg-green-100 text-green-800 border-green-200",
  inactive:  "bg-gray-100 text-gray-700 border-gray-200",
  suspended: "bg-red-100 text-red-800 border-red-200",
};

export default function AdminBusinessesPage() {
  const { t } = useTranslation();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchBusinesses = useCallback(async () => {
    setLoading(true);
    try {
      const res = (await getAllBusinessesAdmin()) as any;
      setBusinesses(res?.businesses ?? []);
    } catch {
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBusinesses(); }, [fetchBusinesses]);

  const handleStatusUpdate = async (id: string, status: string, isVerified: boolean) => {
    setUpdating(id);
    try {
      const res = (await updateBusinessStatus(id, { status, isVerified })) as any;
      if (res?.business || res?.success) {
        setBusinesses((prev) =>
          prev.map((b) => b.id === id ? { ...b, status: status as any, isVerified } : b)
        );
      }
    } catch {
      alert("Update failed");
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this business?")) return;
    try {
      await deleteBusiness(id);
      setBusinesses((prev) => prev.filter((b) => b.id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return businesses.filter((b) => {
      const matchSearch = !q || b.name.toLowerCase().includes(q) || b.email.toLowerCase().includes(q) || b.phone.includes(q);
      const matchStatus = !statusFilter || b.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [businesses, search, statusFilter]);

  const stats = useMemo(() => ({
    total:     businesses.length,
    pending:   businesses.filter((b) => b.status === "pending").length,
    active:    businesses.filter((b) => b.status === "active").length,
    suspended: businesses.filter((b) => b.status === "suspended").length,
  }), [businesses]);

  return (
    <div className="w-full min-h-screen bg-gray-50 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-700 rounded-2xl flex items-center justify-center shadow-md">
            <IoIosBusiness className="text-white text-3xl" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{t("adminTable.businesses")}</h1>
            <p className="text-base text-gray-500 mt-0.5">{t("adminTable.verifyManage")}</p>
          </div>
        </div>
        <button
          onClick={fetchBusinesses}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 rounded-xl hover:bg-indigo-50 transition shadow-sm text-sm font-medium text-gray-700 self-start sm:self-auto"
        >
          <RefreshCw className="h-4 w-4" />
          {t("adminTable.refresh")}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t("adminTable.total"),     value: stats.total,     icon: Building2,   color: "from-indigo-600 to-indigo-800" },
          { label: t("adminTable.pending"),   value: stats.pending,   icon: Clock,       color: "from-yellow-500 to-yellow-700" },
          { label: t("adminTable.active"),    value: stats.active,    icon: CheckCircle, color: "from-emerald-500 to-emerald-700" },
          { label: t("adminTable.suspend"),   value: stats.suspended, icon: XCircle,     color: "from-red-500 to-red-700" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white shadow-md`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold uppercase tracking-widest opacity-80">{label}</span>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <div className="text-5xl font-extrabold">{value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col sm:flex-row gap-4 shadow-sm">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("adminTable.search") + "..."}
          className="flex-1 border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-xl px-4 py-3 text-base bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[180px]"
        >
          <option value="">{t("adminTable.allStatuses")}</option>
          <option value="pending">{t("adminTable.pending")}</option>
          <option value="active">{t("adminTable.active")}</option>
          <option value="inactive">{t("adminTable.inactive")}</option>
          <option value="suspended">{t("adminTable.suspend")}</option>
        </select>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-20 flex items-center justify-center">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-indigo-600 border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-20 text-center text-gray-400">
            <IoIosBusiness className="text-7xl mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">{t("adminTable.noBusinesses")}</p>
          </div>
        ) : (
          filtered.map((b) => (
            <BusinessCard
              key={b.id}
              b={b}
              updating={updating === b.id}
              onStatusUpdate={handleStatusUpdate}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      <p className="text-sm text-gray-400 text-right pb-2">{filtered.length} of {businesses.length} {t("adminTable.businesses").toLowerCase()}</p>
    </div>
  );
}

function BusinessCard({
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
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [listings, setListings] = useState<any[]>([]);
  const [loadingListings, setLoadingListings] = useState(false);

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
      <div className="flex items-start gap-4 p-5">
        <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-indigo-100 flex items-center justify-center">
          {(b.images as string[] | undefined)?.[0] ? (
            <Image src={(b.images as string[])[0]} alt={b.name} width={56} height={56} className="w-full h-full object-cover" />
          ) : (
            <IoIosBusiness className="text-indigo-700 text-2xl" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-gray-900 text-base">{b.name}</span>
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${STATUS_COLORS[b.status] ?? STATUS_COLORS.inactive}`}>
              {b.status}
            </span>
            {b.isVerified && (
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">Verified</span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-0.5">{b.email} · {b.phone}</p>
          {b.address && <p className="text-xs text-gray-400">{b.address}</p>}
          <div className="flex flex-wrap gap-1 mt-1.5">
            {b.categories.map((cat) => (
              <span key={cat} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">{cat}</span>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1">{new Date(b.createdAt).toLocaleDateString()}</p>
        </div>

        <div className="flex flex-col gap-2 flex-shrink-0 items-end">
          <div className="flex gap-2 flex-wrap justify-end">
            {b.status === "pending" && (
              <button onClick={() => onStatusUpdate(b.id, "active", true)} disabled={updating}
                className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition">
                {updating ? "…" : t("adminTable.approve")}
              </button>
            )}
            {b.status === "active" && (
              <button onClick={() => onStatusUpdate(b.id, "suspended", b.isVerified)} disabled={updating}
                className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-red-600 disabled:opacity-50 transition">
                {updating ? "…" : t("adminTable.suspend")}
              </button>
            )}
            {(b.status === "suspended" || b.status === "inactive") && (
              <button onClick={() => onStatusUpdate(b.id, "active", true)} disabled={updating}
                className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition">
                {updating ? "…" : t("adminTable.reactivate")}
              </button>
            )}
            {!b.isVerified && b.status !== "pending" && (
              <button onClick={() => onStatusUpdate(b.id, b.status, true)} disabled={updating}
                className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition">
                {t("adminTable.verify")}
              </button>
            )}
            <button onClick={() => onDelete(b.id)}
              className="text-xs text-red-400 hover:text-red-600 font-medium transition px-1 py-1.5">
              {t("adminTable.delete")}
            </button>
          </div>
          <button
            onClick={toggleListings}
            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition"
          >
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {expanded ? t("adminTable.hideListings") : t("adminTable.viewListings")}
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
            <p className="text-sm text-gray-400 text-center py-4">{t("adminTable.noListings")}</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {listings.map((item) => (
                <ListingCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ListingCard({ item }: { item: any }) {
  const img = item.images?.[0];
  const category =
    typeof item.category === "string" ? item.category
    : Array.isArray(item.category) ? item.category[0]
    : item.mainCategory ?? "";

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="aspect-[4/3] relative bg-gray-100">
        {img ? (
          <Image src={img} alt={item.title ?? ""} fill className="object-cover" sizes="200px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs uppercase tracking-wider px-2 text-center">
            {category}
          </div>
        )}
        {item.maGaday && (
          <span className="absolute top-1.5 left-1.5 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">SOLD</span>
        )}
      </div>
      <div className="p-2">
        <p className="text-xs font-semibold text-gray-800 line-clamp-1">{item.title}</p>
        <p className="text-xs text-gray-400 mt-0.5 capitalize">{category}</p>
        {item.price != null && (
          <p className="text-xs font-bold text-gray-900 mt-0.5">${Number(item.price).toLocaleString()}</p>
        )}
        {item.city && <p className="text-[10px] text-gray-400">{item.city}</p>}
      </div>
    </div>
  );
}

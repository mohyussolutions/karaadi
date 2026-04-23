"use client";

import React, { JSX, useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import {
  FaTrash,
  FaCheckCircle,
  FaClock,
  FaShip,
  FaCar,
  FaHome,
  FaMotorcycle,
  FaTractor,
  FaShoppingBag,
  FaBriefcase,
  FaNewspaper,
  FaSearch,
  FaDollarSign,
  FaTimesCircle,
  FaImage,
  FaExclamationTriangle,
  FaChevronLeft,
  FaChevronRight,
  FaUser,
  FaPhone,
} from "react-icons/fa";

import {
  deletePayment,
  getAllPayments,
  getPaymentStats,
} from "@/actions/categories/paymentActions";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import { Payment } from "@/app/utils/types/payment";

const STATUS_FILTERS = ["all", "COMPLETED", "PENDING", "FAILED"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

const LIMIT = 20;

function getCategoryInfo(payment: Payment): {
  name: string;
  icon: JSX.Element;
  title: string;
  image?: string;
} {
  if (payment.boatId)
    return { name: "Boat", icon: <FaShip className="text-blue-500" />, title: payment.boat?.title || "Boat listing", image: payment.boat?.images?.[0] };
  if (payment.carId)
    return { name: "Car", icon: <FaCar className="text-green-500" />, title: payment.car?.title || "Car listing", image: payment.car?.images?.[0] };
  if (payment.realEstateId)
    return { name: "Real Estate", icon: <FaHome className="text-purple-500" />, title: payment.realEstate?.title || "Property listing", image: payment.realEstate?.images?.[0] };
  if (payment.motorcycleId)
    return { name: "Motorcycle", icon: <FaMotorcycle className="text-orange-500" />, title: payment.motorcycle?.title || "Motorcycle listing", image: payment.motorcycle?.images?.[0] };
  if (payment.farmequipmentId)
    return { name: "Farm Equipment", icon: <FaTractor className="text-yellow-700" />, title: payment.farmequipment?.title || "Equipment listing", image: payment.farmequipment?.images?.[0] };
  if (payment.marketplaceId)
    return { name: "Marketplace", icon: <FaShoppingBag className="text-pink-500" />, title: payment.marketplace?.title || "Marketplace listing", image: payment.marketplace?.images?.[0] };
  if (payment.jobId)
    return { name: "Job", icon: <FaBriefcase className="text-indigo-500" />, title: payment.job?.title || "Job listing" };
  if (payment.subscriptionId)
    return { name: "Subscription", icon: <FaNewspaper className="text-teal-500" />, title: "Subscription plan" };
  return { name: "General", icon: <FaShoppingBag className="text-gray-400" />, title: "Payment" };
}

const METHOD_LABELS: Record<string, { label: string; color: string }> = {
  waafi:   { label: "Waafi",    color: "bg-blue-100 text-blue-700 border-blue-200" },
  evc:     { label: "EVC Plus", color: "bg-orange-100 text-orange-700 border-orange-200" },
  zaad:    { label: "Zaad",     color: "bg-green-100 text-green-700 border-green-200" },
  edahab:  { label: "E-Dahab",  color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  sahal:   { label: "Sahal",    color: "bg-teal-100 text-teal-700 border-teal-200" },
  mobile:  { label: "Mobile",   color: "bg-gray-100 text-gray-700 border-gray-200" },
};

function MethodBadge({ method }: { method?: string }) {
  const key = method?.toLowerCase() || "";
  const m = METHOD_LABELS[key] || { label: method || "—", color: "bg-gray-100 text-gray-600 border-gray-200" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${m.color}`}>
      {m.label}
    </span>
  );
}

function UserAvatar({ user }: { user?: { username?: string; profileImage?: string } }) {
  const initials = user?.username?.slice(0, 2).toUpperCase() || "?";
  return user?.profileImage ? (
    <Image
      src={user.profileImage}
      alt={user.username || ""}
      width={36}
      height={36}
      className="w-full h-full object-cover rounded-full"
    />
  ) : (
    <span className="text-xs font-bold text-gray-500">{initials}</span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = status?.toUpperCase();
  if (s === "COMPLETED")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-green-100 text-green-700 border border-green-200">
        <FaCheckCircle size={9} /> Completed
      </span>
    );
  if (s === "PENDING")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
        <FaClock size={9} /> Pending
      </span>
    );
  if (s === "FAILED")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-700 border border-red-200">
        <FaTimesCircle size={9} /> Failed
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600 border border-gray-200">
      {status}
    </span>
  );
}

export default function Payments() {
  const { t } = useTranslation();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(async (s: StatusFilter, p: number) => {
    setLoading(true);
    try {
      const [data, st] = await Promise.all([
        getAllPayments({ page: p, limit: LIMIT, status: s === "all" ? undefined : s }),
        getPaymentStats().catch(() => null),
      ]);
      setPayments(data?.items || []);
      setTotal(data?.total || 0);
      setStats(st);
    } catch {
      setPayments([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(statusFilter, page);
  }, [statusFilter, page, load]);

  const filtered = search.trim()
    ? payments.filter(
        (p) =>
          p.user?.username?.toLowerCase().includes(search.toLowerCase()) ||
          p.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
          p.transactionId?.toLowerCase().includes(search.toLowerCase()),
      )
    : payments;

  const totalPages = Math.ceil(total / LIMIT);

  async function handleDelete(id: string) {
    if (!confirm("Delete this payment record?")) return;
    setDeletingId(id);
    const result = await deletePayment(id);
    if (result.success) {
      setPayments((prev) => prev.filter((p) => p.id !== id));
      setTotal((prev) => prev - 1);
    }
    setDeletingId(null);
  }

  function setFilter(s: StatusFilter) {
    setStatusFilter(s);
    setPage(1);
  }

  return (
    <div className="space-y-4 pb-6">

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label={t("adminTable.revenue")}
          value={`$${(stats?.totalRevenue ?? 0).toLocaleString()}`}
          icon={<FaDollarSign size={14} />}
          color="blue"
        />
        <StatCard
          label={t("adminTable.completed")}
          value={stats?.successful ?? 0}
          icon={<FaCheckCircle size={14} />}
          color="green"
          active={statusFilter === "COMPLETED"}
          onClick={() => setFilter("COMPLETED")}
        />
        <StatCard
          label={t("adminTable.pending")}
          value={stats?.pending ?? 0}
          icon={<FaClock size={14} />}
          color="amber"
          active={statusFilter === "PENDING"}
          onClick={() => setFilter("PENDING")}
        />
        <StatCard
          label={t("adminTable.failed")}
          value={stats?.failed ?? 0}
          icon={<FaExclamationTriangle size={14} />}
          color="red"
          active={statusFilter === "FAILED"}
          onClick={() => setFilter("FAILED")}
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex flex-col gap-3">
        <div className="relative w-full">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
          <input
            type="text"
            placeholder={t("adminTable.search") + "..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-gray-50"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
          {STATUS_FILTERS.map((s) => {
            const active = statusFilter === s;
            const base = "flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap";
            const style =
              active
                ? s === "all"        ? `${base} bg-gray-900 text-white`
                  : s === "COMPLETED" ? `${base} bg-green-600 text-white`
                  : s === "PENDING"   ? `${base} bg-amber-500 text-white`
                  :                     `${base} bg-red-600 text-white`
                : `${base} bg-gray-100 text-gray-600 hover:bg-gray-200`;
            return (
              <button key={s} onClick={() => setFilter(s)} className={style}>
                {s === "all"
                  ? `All · ${total}`
                  : s === "COMPLETED" ? `✓ Completed`
                  : s === "PENDING"   ? `⏳ Pending`
                  :                    `✕ Failed`}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loading />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">{t("adminTable.noPayments")}</div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-hidden">
              <table className="w-full text-left table-fixed">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] text-gray-400 uppercase tracking-wider">
                    <th className="py-3 px-4 font-medium w-[18%]">{t("adminTable.user")}</th>
                    <th className="py-3 px-4 font-medium w-[16%]">{t("adminTable.paidFrom")}</th>
                    <th className="py-3 px-4 font-medium w-[26%]">{t("adminTable.listing")}</th>
                    <th className="py-3 px-4 font-medium w-[12%]">{t("adminTable.amount")}</th>
                    <th className="py-3 px-4 font-medium w-[11%]">{t("adminTable.method")}</th>
                    <th className="py-3 px-4 font-medium w-[10%]">{t("adminTable.status")}</th>
                    <th className="py-3 px-4 font-medium w-[7%]">{t("adminTable.date")}</th>
                    <th className="py-3 px-2 w-[5%]" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((payment) => {
                    const cat = getCategoryInfo(payment);
                    const payPhone = payment.payerPhone || payment.user?.phone;
                    return (
                      <tr key={payment.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-200">
                              <UserAvatar user={payment.user} />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-sm text-gray-900 truncate">{payment.user?.username || "—"}</p>
                              <p className="text-[11px] text-gray-400 truncate">{payment.user?.email || "—"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-xl px-2.5 py-2">
                            <FaPhone size={11} className="text-blue-500 flex-shrink-0" />
                            <span className="font-bold text-blue-700 text-sm truncate">
                              {payPhone || "—"}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                              {cat.image ? (
                                <Image src={cat.image} alt={cat.title} width={40} height={40} className="w-full h-full object-cover" />
                              ) : (
                                <FaImage className="text-gray-300" size={14} />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold mb-0.5">
                                {cat.icon} {cat.name}
                              </div>
                              <p className="text-sm font-semibold text-gray-800 truncate">{cat.title}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-green-50 border border-green-200">
                            <FaDollarSign size={9} className="text-green-600" />
                            <span className="font-extrabold text-green-700 text-sm">{(payment.totalAmount ?? 0).toLocaleString()}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4"><MethodBadge method={payment.paymentMethod} /></td>
                        <td className="py-3 px-4"><StatusBadge status={payment.status} /></td>
                        <td className="py-3 px-4 text-[11px] text-gray-400 whitespace-nowrap">
                          {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }) : "—"}
                        </td>
                        <td className="py-3 px-2 text-right">
                          <button
                            onClick={() => handleDelete(payment.id)}
                            disabled={deletingId === payment.id}
                            className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-40"
                          >
                            {deletingId === payment.id ? <span className="text-xs">…</span> : <FaTrash size={11} />}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-gray-50">
              {filtered.map((payment) => {
                const cat = getCategoryInfo(payment);
                const payPhone = payment.payerPhone || payment.user?.phone;
                return (
                  <div key={payment.id} className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                        {cat.image ? (
                          <Image src={cat.image} alt={cat.title} width={56} height={56} className="w-full h-full object-cover" />
                        ) : (
                          <FaImage className="text-gray-300" size={18} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold mb-0.5">
                          {cat.icon} {cat.name}
                        </div>
                        <p className="font-bold text-gray-900 text-sm truncate">{cat.title}</p>
                        <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-lg bg-green-50 border border-green-200">
                          <FaDollarSign size={9} className="text-green-600" />
                          <span className="font-extrabold text-green-700 text-sm">{(payment.totalAmount ?? 0).toLocaleString()}</span>
                          <span className="text-[10px] text-green-500">{payment.currency || "USD"}</span>
                        </span>
                      </div>
                      <StatusBadge status={payment.status} />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-200">
                        <UserAvatar user={payment.user} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">{payment.user?.username || "—"}</p>
                        <p className="text-[10px] text-gray-400 truncate">{payment.user?.email || ""}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        {payPhone && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 text-[11px] font-bold">
                            <FaPhone size={8} />
                            {payPhone}
                          </span>
                        )}
                        <MethodBadge method={payment.paymentMethod} />
                        <span className="text-[10px] text-gray-400">
                          {payment.createdAt
                            ? new Date(payment.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" })
                            : "—"}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDelete(payment.id)}
                        disabled={deletingId === payment.id}
                        className="flex-shrink-0 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-40"
                      >
                        {deletingId === payment.id ? <span className="text-[10px]">…</span> : <FaTrash size={11} />}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">
                  {t("adminTable.page")} {page} of {totalPages} · {total} {t("adminTable.total").toLowerCase()}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition"
                  >
                    <FaChevronLeft size={10} /> {t("adminTable.previous")}
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition"
                  >
                    {t("adminTable.next")} <FaChevronRight size={10} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label, value, icon, color, onClick, active,
}: {
  label: string;
  value: string | number;
  icon: JSX.Element;
  color: "blue" | "green" | "amber" | "red";
  onClick?: () => void;
  active?: boolean;
}) {
  const iconBg = {
    blue:  "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    amber: "bg-amber-100 text-amber-600",
    red:   "bg-red-100 text-red-600",
  }[color];
  const ring = {
    blue:  "ring-2 ring-blue-400",
    green: "ring-2 ring-green-400",
    amber: "ring-2 ring-amber-400",
    red:   "ring-2 ring-red-400",
  }[color];

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`w-full text-left p-3.5 bg-white border border-gray-100 rounded-2xl shadow-sm transition-all ${
        active ? ring : "hover:shadow-md"
      } ${onClick ? "cursor-pointer" : "cursor-default"}`}
    >
      <div className={`inline-flex p-2 rounded-xl ${iconBg} mb-2.5`}>{icon}</div>
      <p className="text-xl font-extrabold text-gray-900 leading-none">{value}</p>
      <p className="text-[11px] text-gray-500 mt-1">{label}</p>
    </button>
  );
}

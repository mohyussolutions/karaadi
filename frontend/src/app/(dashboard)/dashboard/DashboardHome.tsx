"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/slices/hooks/hooks";
import { fetchDashboard, fetchDashboardGeo } from "@/store/slices/reducers/dashboardSlice";
import { LineChartBlock } from "./analytics/LineChartBlock";
import { BarChartBlock } from "./analytics/BarChartBlock";
import {
  FaUsers, FaEye, FaComments, FaBullhorn, FaCreditCard,
  FaMapMarkerAlt, FaCity, FaStore, FaCar, FaShip,
  FaMotorcycle, FaHome, FaTractor, FaChartLine,
} from "react-icons/fa";

function fmtMonth(s: string) {
  const [y, m] = s.split("-");
  return new Date(Number(y), Number(m) - 1).toLocaleString("default", { month: "short" });
}

const STAT_CONFIG = [
  { key: "users",         label: "Users",         icon: FaUsers,        color: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",     border: "border-blue-100 dark:border-blue-900/40" },
  { key: "visitors",      label: "Visitors",      icon: FaEye,          color: "bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400", border: "border-violet-100 dark:border-violet-900/40" },
  { key: "messages",      label: "Messages",      icon: FaComments,     color: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400", border: "border-emerald-100 dark:border-emerald-900/40" },
  { key: "ads",           label: "Ads",           icon: FaBullhorn,     color: "bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",  border: "border-orange-100 dark:border-orange-900/40" },
  { key: "subscriptions", label: "Subscriptions", icon: FaCreditCard,   color: "bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",        border: "border-pink-100 dark:border-pink-900/40" },
  { key: "regions",       label: "Regions",       icon: FaMapMarkerAlt, color: "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400",        border: "border-teal-100 dark:border-teal-900/40" },
  { key: "cities",        label: "Cities",        icon: FaCity,         color: "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400", border: "border-indigo-100 dark:border-indigo-900/40" },
] as const;

const CATEGORY_CONFIG = [
  { key: "marketplace",   label: "Marketplace",  icon: FaStore,      href: "/dashboard/categories/marketplace",   color: "from-blue-500 to-blue-600" },
  { key: "realEstate",    label: "Real Estate",  icon: FaHome,       href: "/dashboard/categories/real-estate",   color: "from-emerald-500 to-emerald-600" },
  { key: "cars",          label: "Cars",         icon: FaCar,        href: "/dashboard/categories/cars",           color: "from-orange-500 to-orange-600" },
  { key: "motorcycles",   label: "Motorcycles",  icon: FaMotorcycle, href: "/dashboard/categories/motorcycles",   color: "from-violet-500 to-violet-600" },
  { key: "boats",         label: "Boats",        icon: FaShip,       href: "/dashboard/categories/boats",          color: "from-cyan-500 to-cyan-600" },
  { key: "farmEquipment", label: "Farm Equip.",  icon: FaTractor,    href: "/dashboard/categories/farmequipment", color: "from-lime-500 to-lime-600" },
] as const;

function StatSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
      ))}
    </div>
  );
}

function CategorySkeleton() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-28 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="h-72 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
      <div className="h-72 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
    </div>
  );
}

function RegionCitySkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
      <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
    </div>
  );
}

export default function DashboardHome() {
  const dispatch = useAppDispatch();
  const { data, status, geo, geoStatus } = useAppSelector((s) => s.dashboard);

  useEffect(() => {
    if (status === "idle") dispatch(fetchDashboard());
  }, [dispatch, status]);

  useEffect(() => {
    if (geoStatus === "idle") dispatch(fetchDashboardGeo());
  }, [dispatch, geoStatus]);

  const loading = status === "idle" || status === "loading";
  const geoLoading = geoStatus === "idle" || geoStatus === "loading";

  const revenue = (data?.revenue ?? []).map((d) => ({ ...d, month: fmtMonth(d.month) }));
  const signups = (data?.signups ?? []).map((d) => ({ ...d, month: fmtMonth(d.month) }));

  const totalListings = data
    ? Object.values(data.categoryTotals).reduce((a, b) => a + b, 0)
    : 0;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-800 dark:text-gray-100">Dashboard</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">{today}</p>
        </div>
        <button
          onClick={() => dispatch(fetchDashboard())}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl active:scale-95 transition-all"
        >
          <FaChartLine className="text-sm" />
          Refresh
        </button>
      </div>

      {loading ? <StatSkeleton /> : (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {STAT_CONFIG.map(({ key, label, icon: Icon, color, border }) => (
            <div key={key} className={`bg-white dark:bg-gray-800 rounded-2xl border ${border} shadow-sm p-4 flex flex-col gap-2 transition-colors duration-200`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color} flex-shrink-0`}>
                <Icon className="text-base" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide leading-tight">
                  {label}
                </p>
                <p className="text-2xl font-black text-gray-800 dark:text-gray-100 leading-none mt-1">
                  {(data?.stats[key] ?? 0).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading ? <CategorySkeleton /> : (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              Listings by Category
            </h2>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
              {totalListings.toLocaleString()} total
            </span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {CATEGORY_CONFIG.map(({ key, label, icon: Icon, href, color }) => (
              <Link
                key={key}
                href={href}
                className="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600 transition-all active:scale-[0.97]"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                  <Icon className="text-white text-lg" />
                </div>
                <div className="text-center">
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold leading-tight">{label}</p>
                  <p className="text-xl font-black text-gray-800 dark:text-gray-100 mt-0.5">
                    {(data?.categoryTotals[key] ?? 0).toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {loading ? <ChartSkeleton /> : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-colors duration-200">
            <LineChartBlock
              title="Revenue by Month"
              subtitle="All time"
              data={revenue}
              dataKey="revenue"
              stroke="#6366f1"
              isCurrency
            />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-colors duration-200">
            <BarChartBlock
              title="User Signups by Month"
              subtitle="New registrations per month + cumulative total"
              data={signups}
              dataKey="users"
              barColor="#0ea5e9"
              secondaryDataKey="totalUsers"
              secondaryLabel="Total Users"
              secondaryColor="#f59e0b"
            />
          </div>
        </div>
      )}

      {geoLoading ? <RegionCitySkeleton /> : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Top Regions by Listings</p>
            <p className="text-xs text-slate-300 mb-4">Where most listings are posted</p>
            {(geo?.regionListings ?? []).length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No data yet</p>
            ) : (
              <div className="space-y-2.5">
                {(geo?.regionListings ?? []).slice(0, 8).map((r, i) => {
                  const max = geo!.regionListings[0]?.buyers || 1;
                  const pct = Math.round((r.buyers / max) * 100);
                  return (
                    <div key={r.name} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-400 w-4 text-right flex-shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">{r.name}</span>
                          <span className="text-xs font-bold text-indigo-600 ml-2 flex-shrink-0">{r.buyers.toLocaleString()}</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Top Cities by Listings</p>
            <p className="text-xs text-slate-300 mb-4">Cities with the most active listings</p>
            {(geo?.cityListings ?? []).length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No data yet</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {(geo?.cityListings ?? []).slice(0, 10).map((c, i) => (
                  <div key={c.name} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl px-3 py-2">
                    <span className="text-xs font-black text-gray-300 dark:text-gray-500 w-4 flex-shrink-0">#{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate">{c.name}</p>
                      <p className="text-sm font-black text-emerald-600">{c.buyers.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

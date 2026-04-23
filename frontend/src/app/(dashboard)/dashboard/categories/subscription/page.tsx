"use client";

import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useTranslation } from "react-i18next";
import {
  Download,
  RefreshCw,
  Users,
  Activity,
  Bell,
  TrendingUp,
  Filter,
  X,
} from "lucide-react";
import StatsCard from "@/app/(storeFront)/components/Cards/NormalCards/StatsCardSubscription";
import FilterSection from "@/app/(storeFront)/components/Filters/FilterSectionForSubscriptions";
import SubscriptionTable from "@/app/(storeFront)/components/Cards/NormalCards/SubscriptionTable";
import {
  deleteSubscriptionAdmin,
  getAllSubscriptionsAdmin,
  updateSubscriptionStatus,
} from "@/actions/categories/subscriptionsActions";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import Pagination from "@/app/(dashboard)/dashboard/components/Pagination";
import {
  Subscription,
  SubscriptionFilters,
} from "@/app/utils/types/subscription";
import dynamic from "next/dynamic";

const SubscriptionDetailModal = dynamic(
  () =>
    import("@/app/(storeFront)/components/shared/modals/SubscriptionDetailModal"),
  { ssr: false },
);

const INITIAL_FILTERS: SubscriptionFilters = {
  search: "",
  status: "",
  region: "",
  category: "",
  dateFrom: "",
  dateTo: "",
};

function mapSubscriptions(subs: any[]): Subscription[] {
  return subs.map((sub: any) => ({
    id: sub._id || sub.id,
    _id: sub._id || sub.id,
    userId: sub.userId?._id
      ? sub.userId
      : sub.user
        ? {
            _id: sub.user._id || sub.user.id || "",
            username: sub.user.username || "Unknown",
            email: sub.user.email || "",
            phone: sub.user.phone || "",
          }
        : sub.userId || "",
    title: sub.title || "",
    category: sub.category || "",
    subCategory: sub.subCategory || "",
    region: sub.region || "",
    cities: sub.cities || [],
    isPaid: sub.isPaid || false,
    isActive: sub.isActive || false,
    status: sub.status || "inactive",
    createdAt: sub.createdAt || new Date().toISOString(),
    updatedAt: sub.updatedAt || new Date().toISOString(),
    priceMin: sub.priceMin,
    priceMax: sub.priceMax,
    notificationCount: sub.notificationCount || 0,
  }));
}

function computeStats(subscriptions: Subscription[]) {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const activeCount = subscriptions.filter(
    (s) => s.status === "active" || s.isActive,
  ).length;
  return {
    total: subscriptions.length,
    active: activeCount,
    inactive: subscriptions.length - activeCount,
    recent: subscriptions.filter((s) => new Date(s.createdAt || 0) >= weekAgo)
      .length,
  };
}

export default function AdminSubscriptionsPageComponent() {
  const { t } = useTranslation();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<SubscriptionFilters>(INITIAL_FILTERS);
  const [visibleCount, setVisibleCount] = useState(20);
  const [loadingMore, setLoadingMore] = useState(false);

  const isMounted = useRef(true);

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    try {
      const subs = await getAllSubscriptionsAdmin(filters as any);
      if (isMounted.current) setSubscriptions(mapSubscriptions(subs));
    } catch (error) {
      console.error(error);
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    isMounted.current = true;
    fetchSubscriptions();
    return () => {
      isMounted.current = false;
    };
  }, [fetchSubscriptions]);

  const filteredSubscriptions = useMemo(() => {
    const s = filters.search?.toLowerCase() || "";
    return subscriptions.filter((sub) => {
      const user = typeof sub.userId === "object" ? sub.userId : null;
      const matchesSearch =
        !s ||
        sub.title?.toLowerCase().includes(s) ||
        user?.username?.toLowerCase().includes(s) ||
        user?.email?.toLowerCase().includes(s) ||
        sub.region?.toLowerCase().includes(s) ||
        sub.cities?.some((city) => city.toLowerCase().includes(s));

      const matchesRegion = !filters.region || sub.region === filters.region;
      const matchesCategory =
        !filters.category || sub.category === filters.category;
      const matchesStatus =
        !filters.status ||
        (filters.status === "active"
          ? sub.status === "active" || sub.isActive
          : sub.status !== "active" && !sub.isActive);

      return matchesSearch && matchesRegion && matchesCategory && matchesStatus;
    });
  }, [subscriptions, filters]);

  const visibleSubscriptions = filteredSubscriptions.slice(0, visibleCount);
  const hasMore = filteredSubscriptions.length > visibleCount;

  const handleLoadMore = useCallback(() => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 20);
      setLoadingMore(false);
    }, 300);
  }, []);

  useEffect(() => {
    setVisibleCount(20);
  }, [filters]);

  const regions = useMemo(
    () =>
      Array.from(new Set(subscriptions.map((s) => s.region))).filter(Boolean),
    [subscriptions],
  );
  const categories = useMemo(
    () =>
      Array.from(new Set(subscriptions.map((s) => s.category))).filter(Boolean),
    [subscriptions],
  );
  const stats = useMemo(() => computeStats(subscriptions), [subscriptions]);

  const handleUpdateStatus = useCallback(
    async (id: string | undefined, newStatus: string) => {
      if (!id) return;
      try {
        await updateSubscriptionStatus(id, { status: newStatus });
        setSubscriptions((prev) =>
          prev.map((s) =>
            s._id === id
              ? {
                  ...s,
                  status: newStatus as any,
                  isActive: newStatus === "active",
                }
              : s,
          ),
        );
      } catch {
        alert("Update failed");
      }
    },
    [],
  );

  const handleDeleteSubscription = useCallback(
    async (id: string | undefined) => {
      if (!id || !confirm("Delete subscription?")) return;
      try {
        await deleteSubscriptionAdmin(id);
        setSubscriptions((prev) => prev.filter((sub) => sub._id !== id));
      } catch {
        alert("Delete failed");
      }
    },
    [],
  );

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((p) => ({ ...p, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => setFilters(INITIAL_FILTERS), []);

  const handleBulkStatus = useCallback(
    (status: "active" | "inactive") => {
      filteredSubscriptions.forEach(
        (sub) => sub._id && handleUpdateStatus(sub._id, status),
      );
    },
    [filteredSubscriptions, handleUpdateStatus],
  );

  const handleExportCSV = useCallback(() => {
    setExporting(true);
    const headers =
      "ID,User,Email,Title,Category,Region,Cities,Status,Created\n";
    const rows = filteredSubscriptions
      .map((s) => {
        const user = typeof s.userId === "object" ? s.userId : null;
        return `${s._id},${user?.username || "N/A"},${user?.email || "N/A"},"${s.title}",${s.category},${s.region},"${s.cities?.join("|")}",${s.status},${s.createdAt}`;
      })
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscriptions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    setExporting(false);
  }, [filteredSubscriptions]);

  if (loading)
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
        <Loading />
      </div>
    );

  return (
    <div className="w-full min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6">
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-4 sm:gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-800 uppercase tracking-tight">
                {t("adminTable.subscriptions")}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                {t("adminTable.manageSubscriptions")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearFilters}
                className="px-3 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition text-xs sm:text-sm"
              >
                {t("adminTable.clear")}
              </button>
              <button
                onClick={fetchSubscriptions}
                className="p-2 bg-white border border-gray-300 rounded-full hover:bg-blue-50 transition-all shadow-sm"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="sm:hidden flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm"
              >
                <Filter className="h-3 w-3" />
                {mobileFiltersOpen ? t("adminTable.hide") : t("adminTable.filters")}
              </button>
              <button
                onClick={handleExportCSV}
                disabled={exporting || filteredSubscriptions.length === 0}
                className="px-3 py-2 bg-blue-600 text-white font-bold rounded-lg disabled:opacity-50 flex items-center gap-1 text-xs sm:text-sm shadow-sm transition"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{exporting ? "..." : "CSV"}</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
            <StatsCard
              title={t("adminTable.total")}
              value={stats.total}
              icon={Users}
              gradientFrom="from-blue-600"
              gradientTo="to-blue-800"
            />
            <StatsCard
              title={t("adminTable.active")}
              value={stats.active}
              icon={Activity}
              gradientFrom="from-emerald-500"
              gradientTo="to-emerald-700"
            />
            <StatsCard
              title={t("adminTable.inactive")}
              value={stats.inactive}
              icon={Bell}
              gradientFrom="from-rose-500"
              gradientTo="to-rose-700"
            />
            <StatsCard
              title={t("adminTable.thisWeek")}
              value={stats.recent}
              icon={TrendingUp}
              gradientFrom="from-indigo-500"
              gradientTo="to-purple-700"
            />
          </div>
          <div
            className={`${mobileFiltersOpen ? "block" : "hidden"} sm:block bg-white rounded-xl border border-gray-200 p-4 w-full`}
          >
            <div className="flex justify-between items-center sm:hidden mb-3">
              <h3 className="font-bold text-gray-700 text-sm">Filters</h3>
              <X
                className="h-4 w-4 text-gray-500"
                onClick={() => setMobileFiltersOpen(false)}
              />
            </div>
            <FilterSection
              filters={filters}
              regions={regions as string[]}
              categories={categories as string[]}
              filteredCount={filteredSubscriptions.length}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              onBulkActivate={() => handleBulkStatus("active")}
              onBulkDeactivate={() => handleBulkStatus("inactive")}
            />
          </div>
          <div className="bg-white rounded-xl border border-gray-200 w-full overflow-hidden">
            <SubscriptionTable
              subscriptions={visibleSubscriptions}
              onViewDetails={setSelectedSubscription}
              onDelete={handleDeleteSubscription}
              onUpdateStatus={handleUpdateStatus}
              formatDate={(d) =>
                new Date(d ?? "").toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              }
              formatPrice={(p) => (p ? `$${p.toLocaleString()}` : "N/A")}
            />
          </div>{" "}
          <Pagination
            hasMore={hasMore}
            onSeeMore={handleLoadMore}
            loading={loadingMore}
          />
          {selectedSubscription && (
            <SubscriptionDetailModal
              subscription={selectedSubscription}
              onClose={() => setSelectedSubscription(null)}
              onDelete={handleDeleteSubscription}
              onUpdateStatus={handleUpdateStatus}
            />
          )}
        </div>
      </div>
    </div>
  );
}

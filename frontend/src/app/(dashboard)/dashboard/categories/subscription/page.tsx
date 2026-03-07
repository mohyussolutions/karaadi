"use client";

import React, { JSX, useEffect, useState } from "react";
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
import StatsCard from "@/app/(storeFront)/components/Cards/StatsCardSubscription";
import FilterSection from "@/app/(storeFront)/components/Filters/FilterSectionForSubscriptions";
import SubscriptionTable from "@/app/(storeFront)/components/Cards/SubscriptionTable";
import SubscriptionDetailModal from "@/app/(storeFront)/components/shared/modals/SubscriptionDetailModal";
import {
  Subscription,
  SubscriptionFilters,
} from "@/app/utils/types/subscription";
import {
  deleteSubscriptionAdmin,
  getAllSubscriptionsAdmin,
  updateSubscriptionStatus,
} from "@/actions/categories/subscriptionsActions";
import { verifySession } from "@/actions/core/authAction";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";

function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<
    Subscription[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState<SubscriptionFilters>({
    search: "",
    status: "",
    region: "",
    category: "",
    dateFrom: "",
    dateTo: "",
  });

  const [regions, setRegions] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    recent: 0,
  });

  useEffect(() => {
    const fetchTokenAndData = async () => {
      const user = await verifySession();
      const token = user?.accessToken || user?.token;
      setAccessToken(token);
      await fetchSubscriptions(token);
    };
    fetchTokenAndData();
  }, []);

  useEffect(() => {
    const s = filters.search.toLowerCase();
    let filtered = subscriptions.filter((sub) => {
      const user = typeof sub.userId === "object" ? sub.userId : null;
      const username = user?.username?.toLowerCase() || "";
      const email = user?.email?.toLowerCase() || "";

      const matchesSearch =
        !s ||
        sub.title.toLowerCase().includes(s) ||
        username.includes(s) ||
        email.includes(s) ||
        sub.region.toLowerCase().includes(s) ||
        sub.cities?.some((city) => city.toLowerCase().includes(s));

      const matchesRegion = !filters.region || sub.region === filters.region;
      const matchesCategory =
        !filters.category || sub.category === filters.category;

      return matchesSearch && matchesRegion && matchesCategory;
    });

    if (filters.status) {
      filtered = filtered.filter((sub) =>
        filters.status === "active"
          ? sub.status === "active" || sub.isActive
          : sub.status !== "active" && !sub.isActive,
      );
    }
    setFilteredSubscriptions(filtered);
  }, [filters, subscriptions]);

  const fetchSubscriptions = async (tokenOverride?: string) => {
    try {
      setLoading(true);
      const subs = await getAllSubscriptionsAdmin(
        filters as Record<string, any>,
        tokenOverride || accessToken,
      );
      const mapped: Subscription[] = subs.map((sub: any) => ({
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
        priceMin: sub.priceMin,
        priceMax: sub.priceMax,
        notificationCount: sub.notificationCount || 0,
      })) as Subscription[];

      setSubscriptions(mapped);
      setRegions(
        Array.from(new Set(mapped.map((s) => s.region))).filter(Boolean),
      );
      setCategories(
        Array.from(new Set(mapped.map((s) => s.category))).filter(Boolean),
      );

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const activeCount = mapped.filter(
        (s) => s.status === "active" || s.isActive,
      ).length;

      setStats({
        total: mapped.length,
        active: activeCount,
        inactive: mapped.length - activeCount,
        recent: mapped.filter((s) => new Date(s.createdAt) >= weekAgo).length,
      });
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateSubscriptionStatus(id, { status: newStatus });
      setSubscriptions((prev) =>
        prev.map((s) =>
          s._id === id
            ? { ...s, status: newStatus, isActive: newStatus === "active" }
            : s,
        ),
      );
    } catch (error) {
      alert("Update failed");
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    if (!confirm("Delete subscription?")) return;
    try {
      await deleteSubscriptionAdmin(id);
      setSubscriptions((prev) => prev.filter((sub) => sub._id !== id));
      if (selectedSubscription?._id === id) setSelectedSubscription(null);
    } catch (error) {
      alert("Delete failed");
    }
  };

  const handleExportCSV = () => {
    setExporting(true);
    try {
      const headers =
        "ID,User,Email,Title,Category,Region,Cities,Status,Created\n";
      const rows = filteredSubscriptions
        .map((s) => {
          const user = typeof s.userId === "object" ? s.userId : null;
          return `${s._id},${user?.username || "N/A"},${user?.email || "N/A"},"${s.title}",${s.category},${s.region},"${s.cities?.join("|")}",${s.status},${s.createdAt}`;
        })
        .join("\n");
      const blob = new Blob([headers + rows], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `subscriptions-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
    } finally {
      setExporting(false);
    }
  };

  if (loading)
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-50 overflow-hidden">
        <Loading />
      </div>
    );

  return (
    <div className="w-screen min-h-screen bg-gray-50 overflow-hidden">
      <div className="w-full h-full px-3 sm:px-4 md:px-6 py-4 sm:py-6 overflow-y-auto">
        <div className="w-full max-w-full mx-auto flex flex-col gap-4 sm:gap-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-800 break-words uppercase tracking-tight">
                Subscriptions
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
                Manage automated user alerts and preferences
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchSubscriptions()}
                className="p-2 bg-white border border-gray-300 rounded-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-400 transition-all shadow-sm"
                title="Refresh"
              >
                <RefreshCw className="h-4 w-4" />
              </button>

              <button
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="sm:hidden flex items-center justify-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm"
              >
                <Filter className="h-3 w-3" />
                {mobileFiltersOpen ? "Hide" : "Filters"}
              </button>

              <button
                onClick={handleExportCSV}
                disabled={exporting || filteredSubscriptions.length === 0}
                className="px-3 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-1 shadow-sm transition text-xs sm:text-sm"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                {exporting ? "Exporting..." : "Export CSV"}
              </button>
            </div>
          </div>

          {/* Stats Cards - Full width stack */}
          <div className="grid grid-cols-1 gap-3 w-full">
            <StatsCard
              title="Total"
              value={stats.total}
              icon={Users}
              gradientFrom="from-blue-600"
              gradientTo="to-blue-800"
            />
            <StatsCard
              title="Active"
              value={stats.active}
              icon={Activity}
              gradientFrom="from-emerald-500"
              gradientTo="to-emerald-700"
            />
            <StatsCard
              title="Inactive"
              value={stats.inactive}
              icon={Bell}
              gradientFrom="from-rose-500"
              gradientTo="to-rose-700"
            />
            <StatsCard
              title="This Week"
              value={stats.recent}
              icon={TrendingUp}
              gradientFrom="from-indigo-500"
              gradientTo="to-purple-700"
            />
          </div>

          {/* Desktop Filter Section */}
          <div className="hidden sm:block bg-white rounded-xl border border-gray-200 p-4 w-full">
            <FilterSection
              filters={filters}
              regions={regions}
              categories={categories}
              filteredCount={filteredSubscriptions.length}
              onFilterChange={(k, v) => setFilters((p) => ({ ...p, [k]: v }))}
              onClearFilters={() =>
                setFilters({
                  search: "",
                  status: "",
                  region: "",
                  category: "",
                  dateFrom: "",
                  dateTo: "",
                })
              }
              onBulkActivate={() =>
                filteredSubscriptions.forEach((sub) =>
                  handleUpdateStatus(sub._id, "active"),
                )
              }
              onBulkDeactivate={() =>
                filteredSubscriptions.forEach((sub) =>
                  handleUpdateStatus(sub._id, "inactive"),
                )
              }
            />
          </div>

          {/* Mobile Filter Section */}
          {mobileFiltersOpen && (
            <div className="sm:hidden bg-white rounded-xl border border-gray-200 p-4 w-full">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-gray-700 text-sm">Filters</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <FilterSection
                filters={filters}
                regions={regions}
                categories={categories}
                filteredCount={filteredSubscriptions.length}
                onFilterChange={(k, v) => setFilters((p) => ({ ...p, [k]: v }))}
                onClearFilters={() =>
                  setFilters({
                    search: "",
                    status: "",
                    region: "",
                    category: "",
                    dateFrom: "",
                    dateTo: "",
                  })
                }
                onBulkActivate={() =>
                  filteredSubscriptions.forEach((sub) =>
                    handleUpdateStatus(sub._id, "active"),
                  )
                }
                onBulkDeactivate={() =>
                  filteredSubscriptions.forEach((sub) =>
                    handleUpdateStatus(sub._id, "inactive"),
                  )
                }
              />
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden w-full">
            <SubscriptionTable
              subscriptions={filteredSubscriptions}
              onViewDetails={setSelectedSubscription}
              onDelete={handleDeleteSubscription}
              onUpdateStatus={handleUpdateStatus}
              formatDate={(d) =>
                new Date(d).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              }
              formatPrice={(p) => (p ? `$${p.toLocaleString()}` : "N/A")}
            />
          </div>

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

export default AdminSubscriptionsPage;

"use client";

import React, { useEffect, useState } from "react";
import {
  Download,
  RefreshCw,
  Users,
  Activity,
  Bell,
  TrendingUp,
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

function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<
    Subscription[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);

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
    fetchSubscriptions();
  }, []);

  useEffect(() => {
    const s = filters.search.toLowerCase();
    let filtered = subscriptions.filter(
      (sub) =>
        (!s ||
          sub.title.toLowerCase().includes(s) ||
          sub.userId?.username?.toLowerCase().includes(s) ||
          sub.region.toLowerCase().includes(s)) &&
        (!filters.region || sub.region === filters.region) &&
        (!filters.category || sub.category === filters.category),
    );

    if (filters.status) {
      filtered = filtered.filter((sub) =>
        filters.status === "active"
          ? sub.status === "active" || sub.isActive
          : sub.status !== "active" && !sub.isActive,
      );
    }
    setFilteredSubscriptions(filtered);
  }, [filters, subscriptions]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const subs = await getAllSubscriptionsAdmin(filters);
      const mapped = subs.map((sub: any) => ({
        _id: sub.id,
        userId: {
          _id: sub.user?.id || "",
          username: sub.user?.username || "Unknown",
          email: sub.user?.email || "",
          phone: sub.user?.phone || "",
        },
        title: sub.title,
        category: sub.category,
        region: sub.region,
        isActive: sub.isActive,
        status: sub.status,
        createdAt: sub.createdAt,
        notificationCount: sub.notificationCount || 0,
      }));

      setSubscriptions(mapped);
      setRegions(
        Array.from(new Set(mapped.map((s: any) => s.region))).filter(
          Boolean,
        ) as string[],
      );
      setCategories(
        Array.from(new Set(mapped.map((s: any) => s.category))).filter(
          Boolean,
        ) as string[],
      );

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const activeCount = mapped.filter(
        (s: any) => s.status === "active" || s.isActive,
      ).length;
      setStats({
        total: mapped.length,
        active: activeCount,
        inactive: mapped.length - activeCount,
        recent: mapped.filter((s: any) => new Date(s.createdAt) >= weekAgo)
          .length,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateSubscriptionStatus(id, { status: newStatus as any });
      setSubscriptions((prev) =>
        prev.map((s) =>
          s._id === id
            ? ({
                ...s,
                status: newStatus,
                isActive: newStatus === "active",
              } as any)
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
      const headers = "ID,User,Title,Category,Region,Status,Date\n";
      const rows = filteredSubscriptions
        .map(
          (s) =>
            `${s._id},${s.userId?.username},"${s.title}",${s.category},${s.region},${s.status},${s.createdAt}`,
        )
        .join("\n");

      const blob = new Blob([headers + rows], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `subscriptions-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
    } catch (err) {
      alert("Export failed");
    } finally {
      setExporting(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center font-bold text-2xl">
        LOADING DASHBOARD...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8 w-full">
      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight">
              Subscriptions
            </h1>
            <p className="text-lg text-gray-500 font-medium">
              Manage automated user alerts and preferences
            </p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button
              onClick={fetchSubscriptions}
              className="p-3 bg-white border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:text-indigo-600 transition shadow-sm"
            >
              <RefreshCw className="h-6 w-6" />
            </button>
            <button
              onClick={handleExportCSV}
              disabled={exporting || filteredSubscriptions.length === 0}
              className="flex-1 md:flex-none px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg transition uppercase tracking-wider text-sm"
            >
              <Download className="h-5 w-5" />{" "}
              {exporting ? "Exporting..." : "Export CSV"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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

        <div className="w-full bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm">
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

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 mt-8 overflow-hidden w-full">
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
  );
}

export default AdminSubscriptionsPage;

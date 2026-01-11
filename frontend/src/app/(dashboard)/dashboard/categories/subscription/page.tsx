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
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  useEffect(() => {
    filterSubscriptions();
  }, [filters, subscriptions]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const subs = await getAllSubscriptionsAdmin({
        search: filters.search,
        category: filters.category,
        region: filters.region,
        status: filters.status,
      });

      const mappedSubscriptions = subs.map((sub: any) => ({
        _id: sub.id,
        userId: {
          _id: sub.user?.id || "",
          username: sub.user?.username || "Unknown",
          email: sub.user?.email || "",
          phone: sub.user?.phone || "",
        },
        title: sub.title,
        category: sub.category,
        subCategory: sub.subCategory || "",
        region: sub.region,
        city: sub.city,
        priceMin: sub.priceMin,
        priceMax: sub.priceMax,
        isActive: sub.isActive,
        status: sub.status,
        createdAt: sub.createdAt,
        updatedAt: sub.updatedAt,
        lastNotified: sub.lastNotified,
        notificationCount: sub.notificationCount || 0,
      }));

      setSubscriptions(mappedSubscriptions);
      setRegions(
        Array.from(
          new Set(mappedSubscriptions.map((s: any) => s.region))
        ).filter(Boolean) as string[]
      );
      setCategories(
        Array.from(
          new Set(mappedSubscriptions.map((s: any) => s.category))
        ).filter(Boolean) as string[]
      );
      calculateStats(mappedSubscriptions);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: Subscription[]) => {
    const total = data.length;
    const active = data.filter(
      (sub: any) => sub.status === "active" || sub.isActive
    ).length;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recent = data.filter(
      (sub) => new Date(sub.createdAt) >= weekAgo
    ).length;
    setStats({ total, active, inactive: total - active, recent });
  };

  const filterSubscriptions = () => {
    let filtered = [...subscriptions];
    if (filters.search) {
      const s = filters.search.toLowerCase();
      filtered = filtered.filter(
        (sub) =>
          sub.title.toLowerCase().includes(s) ||
          sub.userId?.username?.toLowerCase().includes(s) ||
          sub.region.toLowerCase().includes(s)
      );
    }
    if (filters.status) {
      filtered = filtered.filter((sub: any) =>
        filters.status === "active"
          ? sub.status === "active" || sub.isActive
          : sub.status !== "active" && !sub.isActive
      );
    }
    if (filters.region)
      filtered = filtered.filter((sub) => sub.region === filters.region);
    if (filters.category)
      filtered = filtered.filter((sub) => sub.category === filters.category);
    setFilteredSubscriptions(filtered);
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateSubscriptionStatus(id, {
        status: newStatus as "active" | "inactive" | "paused",
      });

      setSubscriptions((prev) =>
        prev.map((s) =>
          s._id === id
            ? ({
                ...s,
                status: newStatus,
                isActive: newStatus === "active",
              } as any)
            : s
        )
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

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Subscription Management</h1>
            <p className="text-gray-600">
              Monitor and manage user subscriptions
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchSubscriptions}
              className="p-2 bg-white border rounded-lg hover:bg-gray-50 transition"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                if (filteredSubscriptions.length === 0) {
                  alert("No data to export");
                  return;
                }
                handleExportCSV();
              }}
              disabled={exporting}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Download className="h-4 w-4" />{" "}
              {exporting ? "Exporting..." : "Export CSV"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total"
            value={stats.total}
            icon={Users}
            gradientFrom="from-blue-500"
            gradientTo="to-blue-600"
          />
          <StatsCard
            title="Active"
            value={stats.active}
            icon={Activity}
            gradientFrom="from-green-500"
            gradientTo="to-green-600"
          />
          <StatsCard
            title="Inactive"
            value={stats.inactive}
            icon={Bell}
            gradientFrom="from-red-500"
            gradientTo="to-red-600"
          />
          <StatsCard
            title="This Week"
            value={stats.recent}
            icon={TrendingUp}
            gradientFrom="from-purple-500"
            gradientTo="to-purple-600"
          />
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
          onBulkActivate={() => {
            if (filteredSubscriptions.length === 0) {
              alert("No subscriptions to activate");
              return;
            }
            filteredSubscriptions.forEach((sub) => {
              handleUpdateStatus(sub._id, "active");
            });
          }}
          onBulkDeactivate={() => {
            if (filteredSubscriptions.length === 0) {
              alert("No subscriptions to deactivate");
              return;
            }
            filteredSubscriptions.forEach((sub) => {
              handleUpdateStatus(sub._id, "inactive");
            });
          }}
        />

        <div className="bg-white rounded-2xl shadow-lg mt-6 overflow-hidden">
          <SubscriptionTable
            subscriptions={filteredSubscriptions}
            onViewDetails={setSelectedSubscription}
            onDelete={handleDeleteSubscription}
            onUpdateStatus={handleUpdateStatus}
            formatDate={(d) => new Date(d).toLocaleDateString()}
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

// Helper function for CSV export
const handleExportCSV = () => {
  alert("Export functionality would be implemented here");
};

export default AdminSubscriptionsPage;

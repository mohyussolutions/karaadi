"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Loading from "@/app/ui/loading/Loading";
import {
  getReportsSummary,
  updateReportStatus,
  deleteReport,
} from "@/actions/categories/reportAction";
import { format, formatDistanceToNow, subDays } from "date-fns";

interface Report {
  id: string;
  reason: string;
  details: string | null;
  description: string | null;
  status: string;
  itemType: string;
  itemId: string;
  reporterId: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  resolution: string | null;
  createdAt: string;
  user: {
    id: string;
    username: string;
    email: string;
    profileImage: string | null;
  };
  item?: {
    id: string;
    title: string;
    price?: number;
    images?: string[];
  } | null;
}

interface Stats {
  total: number;
  new: number;
  inProgress: number;
  done: number;
  resolved: number;
  closed: number;
  byItemType: Array<{ itemType: string; _count: number }>;
  topReasons: Array<{ reason: string; _count: number }>;
}

interface DailyReport {
  date: string;
  count: number;
  reports: Report[];
}

interface ReportParams {
  page: number;
  limit: number;
  status?: string;
  itemType?: string;
  search?: string;
  fromDate?: string;
  toDate?: string;
}

export default function AdminReportsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [totalReports, setTotalReports] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: "",
    itemType: "",
    search: "",
    fromDate: "",
    toDate: "",
  });
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const fetchSummary = async () => {
    const params: ReportParams = {
      page,
      limit: 10,
      status: filters.status || undefined,
      itemType: filters.itemType || undefined,
      search: filters.search || undefined,
    };
    if (filters.fromDate) params.fromDate = filters.fromDate;
    if (filters.toDate) params.toDate = filters.toDate;

    try {
      const result = await getReportsSummary(params);
      if (result.success) {
        setReports(result.data.reports);
        setTotalPages(result.data.pagination.pages);
        setTotalReports(result.data.stats?.total ?? 0);
        setStats(result.data.stats);
        groupReportsByDay(result.data.reports);
      }
    } catch (error) {
      console.error("Failed to fetch reports summary:", error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await fetchSummary();
      } catch {
        router.back();
      } finally {
        setLoading(false);
      }
    })();
  }, [page, filters, router]);

  const groupReportsByDay = (reportsList: Report[]) => {
    const grouped: { [key: string]: Report[] } = {};

    reportsList.forEach((report) => {
      const date = format(new Date(report.createdAt), "yyyy-MM-dd");
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(report);
    });

    const daily = Object.keys(grouped)
      .map((date) => ({
        date,
        count: grouped[date].length,
        reports: grouped[date],
      }))
      .sort((a, b) => b.date.localeCompare(a.date));

    setDailyReports(daily);
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const result = await updateReportStatus(id, { status: newStatus });
      if (result.success) {
        fetchSummary();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this report?")) {
      try {
        const result = await deleteReport(id);
        if (result.success) {
          fetchSummary();
        }
      } catch (error) {
        console.error("Failed to delete report:", error);
      }
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
    setPage(1);
  };

  const viewReportDetails = (report: Report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800";
      case "DONE":
        return "bg-green-100 text-green-800";
      case "RESOLVED":
        return "bg-purple-100 text-purple-800";
      case "CLOSED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTodayReports = () => {
    const today = format(new Date(), "yyyy-MM-dd");
    return dailyReports.find((d) => d.date === today)?.count || 0;
  };

  const getYesterdayReports = () => {
    const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");
    return dailyReports.find((d) => d.date === yesterday)?.count || 0;
  };

  const getThisWeekReports = () => {
    const today = new Date();
    const weekAgo = subDays(today, 7);
    let count = 0;

    dailyReports.forEach((day) => {
      const dayDate = new Date(day.date);
      if (dayDate >= weekAgo && dayDate <= today) {
        count += day.count;
      }
    });

    return count;
  };

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8 py-4 sm:py-5 md:py-6 lg:py-7 xl:py-8">
        <div className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-5 sm:mb-6 md:mb-7 lg:mb-8">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight truncate">
                {t("adminTable.reportsManagement")}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                {t("adminTable.totalReportsLabel")}:{" "}
                <span className="text-blue-600 font-bold">{totalReports}</span>
              </p>
            </div>
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="sm:hidden flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
            >
              <span>{t("adminTable.filters")}</span>
            </button>
          </div>

          {stats && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6">
                <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 border border-gray-100">
                  <p className="text-[10px] sm:text-xs text-gray-400 font-medium mb-1 sm:mb-2">
                    Total
                  </p>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 border border-gray-100">
                  <p className="text-[10px] sm:text-xs text-blue-600 font-medium mb-1 sm:mb-2">
                    New
                  </p>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-blue-600">
                    {stats.new}
                  </p>
                </div>
                <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 border border-gray-100">
                  <p className="text-[10px] sm:text-xs text-yellow-600 font-medium mb-1 sm:mb-2">
                    In Progress
                  </p>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-yellow-600">
                    {stats.inProgress}
                  </p>
                </div>
                <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 border border-gray-100">
                  <p className="text-[10px] sm:text-xs text-green-600 font-medium mb-1 sm:mb-2">
                    Done
                  </p>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-green-600">
                    {stats.done}
                  </p>
                </div>
                <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 border border-gray-100">
                  <p className="text-[10px] sm:text-xs text-purple-600 font-medium mb-1 sm:mb-2">
                    Resolved
                  </p>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-purple-600">
                    {stats.resolved}
                  </p>
                </div>
                <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 border border-gray-100">
                  <p className="text-[10px] sm:text-xs text-gray-600 font-medium mb-1 sm:mb-2">
                    Closed
                  </p>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-gray-600">
                    {stats.closed}
                  </p>
                </div>
                <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 border border-gray-100">
                  <p className="text-[10px] sm:text-xs text-indigo-600 font-medium mb-1 sm:mb-2">
                    Active
                  </p>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-indigo-600">
                    {stats.new + stats.inProgress}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-6 md:mb-7 lg:mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-blue-200">
                  <p className="text-xs sm:text-sm text-blue-600 font-medium mb-1 sm:mb-2">
                    Today
                  </p>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-black text-blue-600">
                    {getTodayReports()}
                  </p>
                  <p className="text-[10px] sm:text-xs text-blue-500 mt-1 sm:mt-2">
                    reports today
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-purple-200">
                  <p className="text-xs sm:text-sm text-purple-600 font-medium mb-1 sm:mb-2">
                    Yesterday
                  </p>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-black text-purple-600">
                    {getYesterdayReports()}
                  </p>
                  <p className="text-[10px] sm:text-xs text-purple-500 mt-1 sm:mt-2">
                    reports yesterday
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-green-200">
                  <p className="text-xs sm:text-sm text-green-600 font-medium mb-1 sm:mb-2">
                    This Week
                  </p>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-black text-green-600">
                    {getThisWeekReports()}
                  </p>
                  <p className="text-[10px] sm:text-xs text-green-500 mt-1 sm:mt-2">
                    reports in last 7 days
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="hidden sm:block bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 mb-5 sm:mb-6 md:mb-7 lg:mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4">
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-xs sm:text-sm"
              >
                <option value="">All Status</option>
                <option value="NEW">New</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>

              <select
                value={filters.itemType}
                onChange={(e) => handleFilterChange("itemType", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-xs sm:text-sm"
              >
                <option value="">All Types</option>
                <option value="MARKETPLACE">Marketplace</option>
                <option value="REAL_ESTATE">Real Estate</option>
                <option value="CAR">Car</option>
                <option value="BOAT">Boat</option>
                <option value="MOTORCYCLE">Motorcycle</option>
                <option value="TRAKTOR">Farm Equipment</option>
              </select>

              <input
                type="date"
                value={filters.fromDate}
                onChange={(e) => handleFilterChange("fromDate", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-xs sm:text-sm"
                placeholder="From Date"
              />

              <input
                type="date"
                value={filters.toDate}
                onChange={(e) => handleFilterChange("toDate", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-xs sm:text-sm"
                placeholder="To Date"
              />

              <input
                type="text"
                placeholder="Search by reason or reporter..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-xs sm:text-sm"
              />
            </div>
          </div>

          {mobileFiltersOpen && (
            <div className="sm:hidden bg-white rounded-xl p-4 border border-gray-100 mb-5">
              <div className="space-y-3">
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                >
                  <option value="">All Status</option>
                  <option value="NEW">New</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>

                <select
                  value={filters.itemType}
                  onChange={(e) =>
                    handleFilterChange("itemType", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                >
                  <option value="">All Types</option>
                  <option value="MARKETPLACE">Marketplace</option>
                  <option value="REAL_ESTATE">Real Estate</option>
                  <option value="CAR">Car</option>
                  <option value="BOAT">Boat</option>
                  <option value="MOTORCYCLE">Motorcycle</option>
                  <option value="TRAKTOR">Farm Equipment</option>
                </select>

                <input
                  type="date"
                  value={filters.fromDate}
                  onChange={(e) =>
                    handleFilterChange("fromDate", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />

                <input
                  type="date"
                  value={filters.toDate}
                  onChange={(e) => handleFilterChange("toDate", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />

                <input
                  type="text"
                  placeholder="Search..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />

                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-bold"
                >
                  {t("adminTable.applyFilters")}
                </button>
              </div>
            </div>
          )}

          {dailyReports.length > 0 && (
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 mb-5 sm:mb-6 md:mb-7 lg:mb-8">
              <h3 className="text-base sm:text-lg font-black text-gray-900 mb-3 sm:mb-4">
                {t("adminTable.reportsByDay")}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
                {dailyReports.slice(0, 7).map((day) => (
                  <button
                    key={day.date}
                    onClick={() =>
                      setSelectedDay(selectedDay === day.date ? null : day.date)
                    }
                    className={`p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border transition-all ${
                      selectedDay === day.date
                        ? "bg-blue-500 border-blue-600 text-white"
                        : "bg-gray-50 border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <p className="text-[8px] sm:text-xs font-medium mb-0.5 sm:mb-1">
                      {format(new Date(day.date), "MMM dd")}
                    </p>
                    <p
                      className={`text-base sm:text-lg md:text-xl font-black ${selectedDay === day.date ? "text-white" : "text-gray-900"}`}
                    >
                      {day.count}
                    </p>
                    <p className="text-[8px] sm:text-xs mt-0.5 sm:mt-1">
                      reports
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="hidden lg:block bg-white rounded-xl sm:rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left py-3 sm:py-4 px-3 sm:px-4 md:px-5 lg:px-6 text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400">
                      {t("adminTable.reporter")}
                    </th>
                    <th className="text-left py-3 sm:py-4 px-3 sm:px-4 md:px-5 lg:px-6 text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400">
                      {t("adminTable.reason")}
                    </th>
                    <th className="text-left py-3 sm:py-4 px-3 sm:px-4 md:px-5 lg:px-6 text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400">
                      {t("adminTable.itemType")}
                    </th>
                    <th className="text-left py-3 sm:py-4 px-3 sm:px-4 md:px-5 lg:px-6 text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400">
                      {t("adminTable.status")}
                    </th>
                    <th className="text-left py-3 sm:py-4 px-3 sm:px-4 md:px-5 lg:px-6 text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400">
                      {t("adminTable.date")}
                    </th>
                    <th className="text-left py-3 sm:py-4 px-3 sm:px-4 md:px-5 lg:px-6 text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400">
                      {t("adminTable.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reports.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-8 sm:py-10 md:py-12 text-center text-gray-400 font-medium text-xs sm:text-sm"
                      >
                        No reports found
                      </td>
                    </tr>
                  ) : (
                    reports.map((report) => (
                      <tr
                        key={report.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 sm:py-4 px-3 sm:px-4 md:px-5 lg:px-6">
                          <div className="flex items-center gap-2 sm:gap-3">
                            {report.user?.profileImage ? (
                              <img
                                src={report.user.profileImage}
                                alt={report.user.username}
                                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-[8px] sm:text-[10px] md:text-xs font-bold text-gray-500">
                                  {report.user?.username
                                    ?.charAt(0)
                                    .toUpperCase() || "U"}
                                </span>
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-bold text-gray-900 text-xs sm:text-sm truncate">
                                {report.user?.username || "Unknown"}
                              </p>
                              <p className="text-[8px] sm:text-[10px] text-gray-400 truncate">
                                {report.user?.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 sm:py-4 px-3 sm:px-4 md:px-5 lg:px-6">
                          <p className="font-bold text-gray-900 text-xs sm:text-sm">
                            {report.reason}
                          </p>
                          {report.details && (
                            <p className="text-[8px] sm:text-[10px] text-gray-400 truncate max-w-[120px] sm:max-w-[150px]">
                              {report.details}
                            </p>
                          )}
                        </td>
                        <td className="py-3 sm:py-4 px-3 sm:px-4 md:px-5 lg:px-6">
                          <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gray-100 rounded-full text-[8px] sm:text-[10px] font-bold text-gray-600">
                            {report.itemType}
                          </span>
                        </td>
                        <td className="py-3 sm:py-4 px-3 sm:px-4 md:px-5 lg:px-6">
                          <select
                            value={report.status}
                            onChange={(e) =>
                              handleStatusUpdate(report.id, e.target.value)
                            }
                            className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-bold border-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(report.status)}`}
                          >
                            <option value="NEW">New</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="DONE">Done</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="CLOSED">Closed</option>
                          </select>
                        </td>
                        <td className="py-3 sm:py-4 px-3 sm:px-4 md:px-5 lg:px-6">
                          <p className="text-[8px] sm:text-[10px] text-gray-500">
                            {formatDistanceToNow(new Date(report.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                          <p className="text-[8px] text-gray-400">
                            {format(new Date(report.createdAt), "MMM dd, yyyy")}
                          </p>
                        </td>
                        <td className="py-3 sm:py-4 px-3 sm:px-4 md:px-5 lg:px-6">
                          <div className="flex gap-1 sm:gap-2">
                            <button
                              onClick={() => viewReportDetails(report)}
                              className="px-2 sm:px-3 py-1 bg-blue-500 text-white text-[8px] sm:text-[10px] font-bold rounded-lg hover:bg-blue-600"
                            >
                              {t("adminTable.viewDetails")}
                            </button>
                            <button
                              onClick={() => handleDelete(report.id)}
                              className="px-2 sm:px-3 py-1 bg-red-500 text-white text-[8px] sm:text-[10px] font-bold rounded-lg hover:bg-red-600"
                            >
                              {t("adminTable.delete")}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="block lg:hidden space-y-3">
            {reports.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center text-gray-400 font-medium text-sm">
                No reports found
              </div>
            ) : (
              reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    {report.user?.profileImage ? (
                      <img
                        src={report.user.profileImage}
                        alt={report.user.username}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-500">
                          {report.user?.username?.charAt(0).toUpperCase() ||
                            "U"}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm truncate">
                        {report.user?.username || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {report.user?.email}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-[8px] font-bold text-gray-600">
                      {report.itemType}
                    </span>
                  </div>

                  <div className="mb-3">
                    <p className="font-bold text-gray-900 text-sm">
                      {report.reason}
                    </p>
                    {report.details && (
                      <p className="text-xs text-gray-400 line-clamp-2">
                        {report.details}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs text-gray-500">
                      <p>
                        {formatDistanceToNow(new Date(report.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {format(new Date(report.createdAt), "MMM dd, yyyy")}
                      </p>
                    </div>
                    <select
                      value={report.status}
                      onChange={(e) =>
                        handleStatusUpdate(report.id, e.target.value)
                      }
                      className={`px-2 py-1 rounded-full text-[8px] font-bold border-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(report.status)}`}
                    >
                      <option value="NEW">New</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="DONE">Done</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => viewReportDetails(report)}
                      className="flex-1 py-2 bg-blue-500 text-white text-xs font-bold rounded-lg hover:bg-blue-600"
                    >
                      {t("adminTable.viewDetails")}
                    </button>
                    <button
                      onClick={() => handleDelete(report.id)}
                      className="flex-1 py-2 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600"
                    >
                      {t("adminTable.delete")}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 sm:gap-4 mt-5 sm:mt-6 md:mt-7 lg:mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-lg font-bold text-xs sm:text-sm text-gray-500 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("adminTable.previous")}
              </button>
              <span className="text-xs sm:text-sm text-gray-500 font-medium">
                {t("adminTable.page")} {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-lg font-bold text-xs sm:text-sm text-gray-500 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("adminTable.next")}
              </button>
            </div>
          )}

          {stats && stats.topReasons.length > 0 && (
            <div className="mt-5 sm:mt-6 md:mt-7 lg:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100">
                <h3 className="text-base sm:text-lg font-black text-gray-900 mb-3 sm:mb-4">
                  {t("adminTable.topReasons")}
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {stats.topReasons.map((item) => (
                    <div
                      key={item.reason}
                      className="flex items-center justify-between"
                    >
                      <span className="text-xs sm:text-sm text-gray-700 font-medium capitalize truncate pr-2">
                        {item.reason}
                      </span>
                      <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-100 text-blue-600 rounded-full text-[8px] sm:text-xs font-bold">
                        {item._count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100">
                <h3 className="text-base sm:text-lg font-black text-gray-900 mb-3 sm:mb-4">
                  {t("adminTable.reportsByType")}
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {stats.byItemType.map((item) => (
                    <div
                      key={item.itemType}
                      className="flex items-center justify-between"
                    >
                      <span className="text-xs sm:text-sm text-gray-700 font-medium truncate pr-2">
                        {item.itemType}
                      </span>
                      <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-green-100 text-green-600 rounded-full text-[8px] sm:text-xs font-bold">
                        {item._count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showModal && selectedReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-[32px] max-w-2xl w-full max-h-[90vh] overflow-y-auto my-4">
            <div className="p-4 sm:p-5 md:p-6 lg:p-8">
              <div className="flex justify-between items-center mb-4 sm:mb-5 md:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-black text-gray-900">
                  {t("adminTable.viewDetails")}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                <div>
                  <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 sm:mb-2">
                    Reporter
                  </p>
                  <div className="flex items-center gap-2 sm:gap-3">
                    {selectedReport.user?.profileImage ? (
                      <img
                        src={selectedReport.user.profileImage}
                        alt={selectedReport.user.username}
                        className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-xs sm:text-sm font-bold text-gray-500">
                          {selectedReport.user?.username
                            ?.charAt(0)
                            .toUpperCase() || "U"}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-gray-900 text-sm sm:text-base">
                        {selectedReport.user?.username}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-400">
                        {selectedReport.user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 sm:mb-2">
                    Reason
                  </p>
                  <p className="font-bold text-gray-900 text-sm sm:text-base">
                    {selectedReport.reason}
                  </p>
                </div>

                {selectedReport.details && (
                  <div>
                    <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 sm:mb-2">
                      Details
                    </p>
                    <p className="text-xs sm:text-sm text-gray-700">
                      {selectedReport.details}
                    </p>
                  </div>
                )}

                {selectedReport.description && (
                  <div>
                    <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 sm:mb-2">
                      Description
                    </p>
                    <p className="text-xs sm:text-sm text-gray-700">
                      {selectedReport.description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 sm:mb-2">
                      Item Type
                    </p>
                    <span className="px-2 sm:px-3 py-1 bg-gray-100 rounded-full text-[8px] sm:text-xs font-bold text-gray-600">
                      {selectedReport.itemType}
                    </span>
                  </div>
                  <div>
                    <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 sm:mb-2">
                      Item ID
                    </p>
                    <p className="text-xs sm:text-sm text-gray-700 truncate">
                      {selectedReport.itemId}
                    </p>
                  </div>
                </div>

                {selectedReport.item && (
                  <div>
                    <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 sm:mb-2">
                      Reported Item
                    </p>
                    <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <p className="font-bold text-gray-900 text-sm sm:text-base">
                        {selectedReport.item.title}
                      </p>
                      {selectedReport.item.price && (
                        <p className="text-xs sm:text-sm text-gray-600">
                          ${selectedReport.item.price}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 sm:mb-2">
                    Status
                  </p>
                  <select
                    value={selectedReport.status}
                    onChange={(e) => {
                      handleStatusUpdate(selectedReport.id, e.target.value);
                      setSelectedReport({
                        ...selectedReport,
                        status: e.target.value,
                      });
                    }}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold border-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(selectedReport.status)}`}
                  >
                    <option value="NEW">New</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>

                {selectedReport.resolution && (
                  <div>
                    <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 sm:mb-2">
                      Resolution
                    </p>
                    <p className="text-xs sm:text-sm text-gray-700">
                      {selectedReport.resolution}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
                  <div>
                    <p>
                      Created:{" "}
                      {new Date(selectedReport.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {selectedReport.reviewedAt && (
                    <div>
                      <p>
                        Reviewed:{" "}
                        {new Date(selectedReport.reviewedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full sm:flex-1 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 border border-gray-200 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm text-gray-500 hover:text-gray-900"
                  >
                    {t("adminTable.cancel")}
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(selectedReport.id);
                      setShowModal(false);
                    }}
                    className="w-full sm:flex-1 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 bg-red-500 text-white font-bold rounded-lg sm:rounded-xl hover:bg-red-600 text-xs sm:text-sm"
                  >
                    {t("adminTable.deleteReport")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

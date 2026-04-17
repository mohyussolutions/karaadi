import React from "react";
import { LineChartBlock } from "../LineChartBlock";
import { BarChartBlock } from "../BarChartBlock";
import {
  getRevenueData,
  getUserSignupData,
} from "@/actions/categories/RegionsAndCityCharts";

function fmtMonth(monthStr: string) {
  const [year, m] = monthStr.split("-");
  return new Date(Number(year), Number(m) - 1).toLocaleString("default", {
    month: "short",
  });
}

export default async function DashboardChartBlock() {
  const [revenueData, userSignups] = await Promise.all([
    getRevenueData(),
    getUserSignupData(),
  ]);

  const safeRevenue = Array.isArray(revenueData) ? revenueData : [];
  const safeSignups = Array.isArray(userSignups) ? userSignups : [];

  const revenue = safeRevenue.map((d) => ({ ...d, month: fmtMonth(d.month) }));
  const signups = safeSignups.map((d) => ({ ...d, month: fmtMonth(d.month) }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <LineChartBlock
          title="Revenue by Month"
          subtitle="All time"
          data={revenue}
          dataKey="revenue"
          stroke="#6366f1"
          isCurrency
        />
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <BarChartBlock
          title="User Signups by Month"
          subtitle="All time"
          data={signups}
          dataKey="users"
          barColor="#0ea5e9"
          secondaryDataKey="totalUsers"
          secondaryLabel="Total Users"
          secondaryColor="#f59e0b"
        />
      </div>
    </div>
  );
}

"use client";

import React, { FC } from "react";
import { LineChartBlock } from "../LineChartBlock";

export const DashboardChartBlock: FC = () => {
  const revenueData = [
    { month: "Jan", revenue: 8000 },
    { month: "Feb", revenue: 9500 },
    { month: "Mar", revenue: 7200 },
    { month: "Apr", revenue: 11200 },
    { month: "May", revenue: 13000 },
    { month: "Jun", revenue: 14500 },
  ];

  const listingsTrend = [
    { month: "Jan", listings: 1400 },
    { month: "Feb", listings: 1500 },
    { month: "Mar", listings: 1700 },
    { month: "Apr", listings: 1900 },
    { month: "May", listings: 2100 },
    { month: "Jun", listings: 2300 },
  ];

  const userSignups = [
    { month: "Jan", users: 800 },
    { month: "Feb", users: 950 },
    { month: "Mar", users: 1100 },
    { month: "Apr", users: 1200 },
    { month: "May", users: 1350 },
    { month: "Jun", users: 1500 },
  ];
  const pieColors = [
    "#6366F1",
    "#60A5FA",
    "#10B981",
    "#FBBF24",
    "#EF4444",
    "#F87171",
  ];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChartBlock
          title="Revenue Growth"
          data={revenueData}
          dataKey="revenue"
          stroke="#6366F1"
        />
        <LineChartBlock
          title="Active Listings Trend"
          data={listingsTrend}
          dataKey="listings"
          stroke="#10B981"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChartBlock
          title="User Signups Trend"
          data={userSignups}
          dataKey="users"
          stroke="#3B82F6"
        />
      </div>
    </>
  );
};

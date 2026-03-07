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

  const userSignups = [
    { month: "Jan", users: 800 },
    { month: "Feb", users: 950 },
    { month: "Mar", users: 1100 },
    { month: "Apr", users: 1200 },
    { month: "May", users: 1350 },
    { month: "Jun", users: 1500 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-2 shadow-sm pointer-events-none">
          <LineChartBlock
            title="REVENUE SCALING TRAJECTORY"
            data={revenueData}
            dataKey="revenue"
            stroke="#6366F1"
          />
        </div>

        <div className="bg-white rounded-xl border p-2 shadow-sm pointer-events-none">
          <LineChartBlock
            title="USER ACQUISITION VELOCITY"
            data={userSignups}
            dataKey="users"
            stroke="#3B82F6"
          />
        </div>
      </div>
    </div>
  );
};

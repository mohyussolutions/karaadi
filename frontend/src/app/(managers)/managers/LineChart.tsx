"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const teamData = [
  { month: "Jan", performance: 72 },
  { month: "Feb", performance: 78 },
  { month: "Mar", performance: 81 },
  { month: "Apr", performance: 79 },
  { month: "May", performance: 85 },
  { month: "Jun", performance: 88 },
];

export function TeamPerformanceChart() {
  return (
    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-gray-200 h-80">
      <h3 className="text-lg font-semibold mb-4">Team Performance</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={teamData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="performance"
            stroke="#2563eb"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

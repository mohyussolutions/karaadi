"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const documentData = [
  { month: "Jan", uploads: 120 },
  { month: "Feb", uploads: 140 },
  { month: "Mar", uploads: 160 },
  { month: "Apr", uploads: 150 },
  { month: "May", uploads: 200 },
  { month: "Jun", uploads: 230 },
];

export function DocumentActivityChart() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-gray-200 h-80">
      <h3 className="text-lg font-semibold mb-4">Document Activity</h3>
      {mounted ? (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={documentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="uploads"
              stroke="#f59e0b"
              fill="#fcd34d"
              fillOpacity={0.5}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full" />
      )}
    </div>
  );
}

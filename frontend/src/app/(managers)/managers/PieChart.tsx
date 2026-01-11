"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const resourceData = [
  { name: "Servers", value: 35 },
  { name: "Finance", value: 20 },
  { name: "HR", value: 15 },
  { name: "IT", value: 30 },
];

const COLORS = ["#6366f1", "#22c55e", "#f97316", "#06b6d4"];

export function ResourceAllocationChart() {
  return (
    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-gray-200 h-80">
      <h3 className="text-lg font-semibold mb-4">Resource Allocation</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={resourceData} dataKey="value" outerRadius={110} label>
            {resourceData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const projectData = [
  { name: "Alpha", progress: 90 },
  { name: "Beta", progress: 65 },
  { name: "Gamma", progress: 40 },
  { name: "Delta", progress: 75 },
];

export function ProjectProgressChart() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-gray-200 h-80">
      <h3 className="text-lg font-semibold mb-4">Project Progress</h3>
      {mounted ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={projectData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="progress" fill="#10b981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full" />
      )}
    </div>
  );
}

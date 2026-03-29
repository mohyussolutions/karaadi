"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

const reportsData = [
  { day: "Mon", reports: 12 },
  { day: "Tue", reports: 19 },
  { day: "Wed", reports: 8 },
  { day: "Thu", reports: 15 },
  { day: "Fri", reports: 22 },
  { day: "Sat", reports: 9 },
  { day: "Sun", reports: 13 },
];

const messagesData = [
  { week: "Week 1", count: 120 },
  { week: "Week 2", count: 90 },
  { week: "Week 3", count: 160 },
  { week: "Week 4", count: 130 },
];

export default function SupportCharts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      
      <div className="bg-white shadow-md p-6 rounded-2xl border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Weekly User Reports</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reportsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="reports" fill="#6366F1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      
      <div className="bg-white shadow-md p-6 rounded-2xl border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Monthly Support Messages</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={messagesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#22C55E"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

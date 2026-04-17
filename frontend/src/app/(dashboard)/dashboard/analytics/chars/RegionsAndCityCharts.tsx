"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LabelList,
} from "recharts";
import type { ChartData as ActionChartData } from "@/actions/categories/RegionsAndCityCharts";

interface RegionsAndCityChartsProps {
  regionData: ActionChartData[];
  cityData: ActionChartData[];
}

function VerticalBarCard({
  title,
  data,
  color,
}: {
  title: string;
  data: ActionChartData[];
  color: string;
}) {
  const sorted = [...data]
    .filter((d) => typeof d.buyers === "number" && d.buyers > 0)
    .sort((a, b) => (b.buyers as number) - (a.buyers as number))
    .slice(0, 20);

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col p-6 h-full">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
          {title}
        </p>
        <p className="text-xs text-slate-300 mb-4">All time</p>
        <div className="flex flex-1 items-center justify-center min-h-[300px] rounded-xl bg-slate-50 border border-dashed border-slate-200">
          <p className="text-sm text-slate-400">No data available yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
        {title}
      </p>
      <p className="text-xs text-slate-300 mb-5">All time</p>
      <ResponsiveContainer
        width="100%"
        height={Math.max(320, sorted.length * 28)}
      >
        <BarChart
          data={sorted}
          margin={{ top: 16, right: 8, bottom: 64, left: 8 }}
        >
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 11 }}
            interval={0}
            angle={-35}
            textAnchor="end"
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            tickFormatter={(v) => Math.round(v).toLocaleString("en-US")}
          />
          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.03)" }}
            contentStyle={{
              borderRadius: "10px",
              border: "1px solid #f1f5f9",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.08)",
              padding: "10px 14px",
              fontSize: "13px",
            }}
            labelStyle={{ color: "#64748b", fontWeight: 600, marginBottom: 2 }}
            formatter={(value: any) => [
              typeof value === "number"
                ? Math.round(value).toLocaleString("en-US")
                : value,
              "Listings",
            ]}
          />
          <Bar
            dataKey="buyers"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
            animationDuration={1200}
          >
            {sorted.map((_, i) => (
              <Cell key={i} fill={color} fillOpacity={1 - i * 0.07} />
            ))}
            <LabelList
              dataKey="buyers"
              position="top"
              style={{ fill: "#94a3b8", fontSize: 11 }}
              formatter={(v: unknown) =>
                Math.round(Number(v)).toLocaleString("en-US")
              }
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export const RegionsAndCityCharts = ({
  regionData,
  cityData,
}: RegionsAndCityChartsProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <VerticalBarCard
        title="Regions with Most Listings"
        data={regionData}
        color="#6366f1"
      />
    </div>
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <VerticalBarCard
        title="Cities with Most Listings"
        data={cityData}
        color="#10b981"
      />
    </div>
  </div>
);

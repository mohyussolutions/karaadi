"use client";

import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export type ChartData = {
  name?: string;
  [key: string]: string | number | undefined;
};

export interface BarChartBlockProps {
  title: string;
  subtitle?: string;
  data: ChartData[];
  dataKey: string;
  barColor: string;
  secondaryDataKey?: string;
  secondaryLabel?: string;
  secondaryColor?: string;
}

export const BarChartBlock: React.FC<BarChartBlockProps> = ({
  title,
  subtitle = "All time",
  data,
  dataKey,
  barColor,
  secondaryDataKey,
  secondaryLabel = "Total",
  secondaryColor = "#f59e0b",
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col p-6 h-full">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
          {title}
        </p>
        <p className="text-xs text-slate-300 mb-4">{subtitle}</p>
        <div className="flex flex-1 items-center justify-center h-[300px] rounded-xl bg-slate-50 border border-dashed border-slate-200">
          <p className="text-sm text-slate-400">No data available yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
        {title}
      </p>
      <p className="text-xs text-slate-300 mb-3 sm:mb-5">{subtitle}</p>
      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart
          data={data}
          margin={{ top: 8, right: 4, bottom: 0, left: 0 }}
        >
          <CartesianGrid
            strokeDasharray="0"
            vertical={false}
            stroke="#f1f5f9"
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            tickFormatter={(v) => Math.round(v).toLocaleString("en-US")}
            allowDecimals={false}
            width={40}
          />
          {secondaryDataKey && (
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickFormatter={(v) => Math.round(v).toLocaleString("en-US")}
              allowDecimals={false}
              width={44}
            />
          )}
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
            formatter={(value: any, name: any) => [
              typeof value === "number"
                ? Math.round(value).toLocaleString("en-US")
                : value,
              name === dataKey ? "New Signups" : secondaryLabel,
            ]}
          />
          {secondaryDataKey && (
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
          )}
          <Bar
            dataKey={dataKey}
            name="New Signups"
            fill={barColor}
            radius={[4, 4, 0, 0]}
            maxBarSize={48}
            animationDuration={1200}
          />
          {secondaryDataKey && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey={secondaryDataKey}
              name={secondaryLabel}
              stroke={secondaryColor}
              strokeWidth={2}
              dot={{ r: 3, fill: secondaryColor }}
              activeDot={{ r: 5 }}
              animationDuration={1200}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

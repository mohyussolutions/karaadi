"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export interface LineChartBlockProps<T = any> {
  title: string;
  subtitle?: string;
  data: T[];
  dataKey: string;
  stroke: string;
  isCurrency?: boolean;
}

const fmtCurrency = (v: number) => "$" + Math.round(v).toLocaleString("en-US");
const fmtNumber = (v: number) => Math.round(v).toLocaleString("en-US");

export const LineChartBlock = <T extends Record<string, any>>({
  title,
  subtitle = "All time",
  data,
  dataKey,
  stroke,
  isCurrency = false,
}: LineChartBlockProps<T>) => {
  const formatValue = isCurrency ? fmtCurrency : fmtNumber;
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

  const gradientId = `grad-${dataKey}`;

  return (
    <div className="p-6">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
        {title}
      </p>
      <p className="text-xs text-slate-300 mb-5">{subtitle}</p>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: 10 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={stroke} stopOpacity={0.25} />
              <stop offset="95%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
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
            tickFormatter={(v) => formatValue(v)}
            width={64}
          />
          <Tooltip
            cursor={{ stroke: stroke, strokeWidth: 1, strokeDasharray: "4 4" }}
            contentStyle={{
              borderRadius: "10px",
              border: "1px solid #f1f5f9",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.08)",
              padding: "10px 14px",
              fontSize: "13px",
            }}
            labelStyle={{ color: "#64748b", fontWeight: 600, marginBottom: 2 }}
            formatter={(value: any) => [
              typeof value === "number" ? formatValue(value) : value,
              title,
            ]}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={stroke}
            strokeWidth={2.5}
            fillOpacity={1}
            fill={`url(#${gradientId})`}
            activeDot={{ r: 5, strokeWidth: 0, fill: stroke }}
            animationDuration={1200}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

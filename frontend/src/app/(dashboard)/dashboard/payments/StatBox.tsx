import React from "react";

interface StatBoxProps {
  label: string;
  value: string;
  color?: string;
  isCurr?: boolean;
}

export default function StatBox({
  label,
  value,
  color = "text-slate-900",
  isCurr = true,
}: StatBoxProps) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm transition-all hover:shadow-md">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
        {label}
      </p>
      <p className={`text-2xl font-black tracking-tight ${color}`}>{value}</p>
    </div>
  );
}

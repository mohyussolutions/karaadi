import React from "react";

interface StatBoxProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  isCurr?: boolean;
}

export default function StatBox({
  label,
  value,
  icon,
  color,
  isCurr,
}: StatBoxProps) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm flex items-center gap-4">
      <div
        className={`p-3 rounded-2xl bg-slate-50 ${color || "text-slate-600"}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          {label}
        </p>
        <p className={`text-xl font-black ${color || "text-slate-900"}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

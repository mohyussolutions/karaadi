"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  gradientFrom: string;
  gradientTo: string;
}

const StatsCardSubscription = ({
  title,
  value,
  icon: Icon,
  gradientFrom,
  gradientTo,
}: StatsCardProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div
        className={`p-4 rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} text-white shadow-lg`}
      >
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
          {title}
        </p>
        <h3 className="text-2xl font-black text-gray-900">{value}</h3>
      </div>
    </div>
  );
};

export default StatsCardSubscription;

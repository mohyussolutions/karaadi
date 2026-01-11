// app/(storeFront)/components/Cards/StatsCardSubscription.tsx
"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  gradientFrom: string;
  gradientTo: string;
  icon: LucideIcon;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  gradientFrom,
  gradientTo,
  icon: Icon,
}) => {
  return (
    <div
      className={`p-6 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-2xl shadow-lg text-white`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">{title}</p>
          <p className="text-3xl font-bold mt-2">{value.toLocaleString()}</p>
        </div>
        <Icon className="h-10 w-10 opacity-80" />
      </div>
    </div>
  );
};

export default StatsCard;

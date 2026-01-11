"use client";

import { ProjectProgressChart } from "./BarChart";
import { TeamPerformanceChart } from "./LineChart";
import { ResourceAllocationChart } from "./PieChart";
import {
  backToLinks,
  managerManagementLinks,
} from "@/app/(links)/managmentLinks/managerLinks";
import Link from "next/link";

export default function ManagerPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-3">
        {backToLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs font-semibold text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition shadow-sm"
          >
            <link.icon className="size-3" />
            <span>{link.name}</span>
          </Link>
        ))}
      </div>

      <div className="space-y-3">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
          Item Management
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
          {managerManagementLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center p-4 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-md transition-all group"
            >
              <div className="p-3 rounded-lg bg-gray-50 group-hover:bg-blue-50 transition-colors">
                <item.icon className="size-6 text-gray-400 group-hover:text-blue-600" />
              </div>
              <span className="mt-3 text-xs font-bold text-gray-600 group-hover:text-gray-900 text-center">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <TeamPerformanceChart />
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <ProjectProgressChart />
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
          <ResourceAllocationChart />
        </div>
      </div>
    </div>
  );
}

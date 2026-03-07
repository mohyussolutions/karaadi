"use client";

import Link from "next/link";
import { managerTotalLinks } from "@/app/(links)/managmentLinks/managerLinks";
import { TeamPerformanceChart } from "./LineChart";
import { ProjectProgressChart } from "./BarChart";
import { DocumentActivityChart } from "./AreaChart";

export default function ManagerPage() {
  const managementLinks = managerTotalLinks.filter((i) =>
    ["inventory", "backoffice"].includes(i.category),
  );

  return (
    <div className="p-6 md:p-8 lg:p-10 min-h-screen bg-gray-200">
      <section className="flex flex-col gap-6">
        <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em]">
          Management Grid
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {managementLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group flex flex-col items-center justify-center p-10 bg-white border border-gray-200 rounded-[2.5rem] hover:border-blue-400 hover:shadow-2xl transition-all duration-300"
            >
              <div className="p-6 rounded-3xl bg-gray-100 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300 shadow-sm group-hover:shadow-blue-200">
                <item.icon className="size-10 text-gray-500 group-hover:text-white" />
              </div>
              <span className="mt-6 text-lg font-black text-gray-700 group-hover:text-blue-600 text-center tracking-tight">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
        <TeamPerformanceChart />
        <ProjectProgressChart />
        <DocumentActivityChart />
      </section>
    </div>
  );
}

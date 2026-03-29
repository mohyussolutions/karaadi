"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SUPPORT_LINKS } from "@/app/(links)/supportLinks/supportLinks";

function SupportCard({
  title,
  icon,
  onClick,
  count = 0,
}: {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
  count?: number;
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all flex items-center gap-6 cursor-pointer group"
    >
      <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-black text-slate-900 truncate">{title}</h2>
        <p className="text-sm text-slate-500 font-bold">{count} active items</p>
      </div>
    </div>
  );
}

export default function StreamlinedDashboard() {
  const router = useRouter();
  const [sections, setSections] = useState<Record<string, any[]>>({});

  useEffect(() => {

    setSections({});
  }, []);

  const totalItems = Object.values(sections).reduce((s, a) => s + a.length, 0);

  return (
    <div className="flex flex-col gap-10 p-10 w-full">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Support Overview
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Real-time status of platform management.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-3xl border border-slate-100 shadow-sm">
          <div className="px-6 py-3 text-center border-r border-slate-100">
            <p className="text-[12px] uppercase font-black text-slate-400 tracking-widest">
              Total Items
            </p>
            <p className="text-3xl font-black text-indigo-600">{totalItems}</p>
          </div>
          <div className="px-6 py-3 text-center">
            <p className="text-[12px] uppercase font-black text-slate-400 tracking-widest">
              Active Sections
            </p>
            <p className="text-3xl font-black text-slate-900">
              {Object.keys(sections).length}
            </p>
          </div>
        </div>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {SUPPORT_LINKS.filter((link) => {
          const title = link.label || link.name || "";
          return title.toLowerCase() !== "home";
        }).map((link: any) => {
          const title = link.label || link.name;
          const IconContent = link.dashboardIcon || link.icon;
          const count = sections[title.toLowerCase()]?.length || 0;

          return (
            <SupportCard
              key={title}
              title={title}
              count={count}
              onClick={() => router.push(link.href)}
              icon={
                typeof IconContent === "function" ? (
                  <IconContent size={28} />
                ) : React.isValidElement(IconContent) ? (
                  React.cloneElement(IconContent as React.ReactElement<any>, {
                    size: 28,
                  })
                ) : (
                  IconContent
                )
              }
            />
          );
        })}
      </div>

      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900">
              Recent Activity
            </h2>
            <div className="flex gap-3">
              <input
                type="date"
                className="text-sm border-slate-200 border rounded-xl px-4 py-2 outline-none focus:ring-2 ring-indigo-500/20"
              />
              <button className="text-sm font-black text-indigo-600 px-5 py-2 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition">
                Filter Data
              </button>
            </div>
          </div>

          <ul className="divide-y divide-slate-50">
            {Object.entries(sections)
              .flatMap(([section, arr]) =>
                arr.map((it: any) => ({ ...it, section })),
              )
              .sort((a, b) =>
                (b.createdAt || "") > (a.createdAt || "") ? 1 : -1,
              )
              .slice(0, 6)
              .map((item: any, idx) => (
                <li
                  key={item.id || idx}
                  className="py-6 flex justify-between items-center group"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]" />
                    <div>
                      <p className="text-lg font-bold text-slate-800">
                        {item.title || "Request Update"}
                      </p>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-tight">
                        Section:{" "}
                        <span className="text-indigo-500">{item.section}</span>
                      </p>
                    </div>
                  </div>
                </li>
              ))}
          </ul>

          <button className="w-full mt-10 py-5 bg-slate-900 text-white text-sm font-black rounded-2xl hover:bg-black transition shadow-xl shadow-slate-200">
            Download Full Report
          </button>
        </div>
      </div>
    </div>
  );
}

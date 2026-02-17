"use client";

import React, { useState } from "react";
import SupportSidebar from "./SupportSidebar";
import SupportNavbar from "./SupportNavbar";
import SupportCharts from "./SupportCharts";
import SupportRoute from "@/app/common/Guard/SupportRoute";

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex w-full min-h-screen bg-slate-50 overflow-hidden">
      <div
        className={`${
          open ? "fixed inset-y-0 left-0 w-72 z-50" : "hidden"
        } md:relative md:block md:w-72 flex-shrink-0 border-r border-zinc-800/50`}
      >
        <SupportSidebar />
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex flex-col flex-grow min-w-0">
        <SupportNavbar toggleSidebar={() => setOpen(!open)} user={undefined} />
        <main className="p-6 md:p-10 flex flex-col gap-8">
          {children}
          <SupportCharts />
        </main>
      </div>
    </div>
  );
}

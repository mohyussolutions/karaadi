"use client";
import React, { useState } from "react";
import SupportSidebar from "./SupportSidebar";
import SupportNavbar from "./SupportNavbar";
import SupportCharts from "./SupportCharts";
import SupportRoute from "@/app/Guard/SupportRoute";

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  return (
    <SupportRoute>
      <div className="flex w-full min-h-screen bg-slate-50 overflow-hidden">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden transition-opacity"
            onClick={closeSidebar}
          />
        )}
        <SupportSidebar open={sidebarOpen} onClose={closeSidebar} />
        <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
          <SupportNavbar toggleSidebar={toggleSidebar} user={null} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 flex flex-col gap-8">
            {children}
            <SupportCharts />
          </main>
        </div>
      </div>
    </SupportRoute>
  );
}

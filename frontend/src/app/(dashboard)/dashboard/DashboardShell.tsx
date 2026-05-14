"use client";

import { useState, useCallback } from "react";
import { useAppSelector } from "@/store/slices/hooks/hooks";
import ThemeApplier from "@/app/ui/Providers/ThemeApplier";
import Sidebar from "./components/sidebar/Sidebar";
import Navbar from "./components/navbar/Navbar";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const isDark = useAppSelector((s) => (s.theme?.mode ?? "light") === "dark");

  return (
    <div
      suppressHydrationWarning
      className={`flex h-screen overflow-hidden text-gray-900 dark:text-white${isDark ? " bg-gray-950" : " bg-gray-50"}`}
    >
      <ThemeApplier />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={closeSidebar} />
      <div suppressHydrationWarning className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar toggleSidebar={openSidebar} />
        <main
          suppressHydrationWarning
          className={`flex-1 overflow-y-auto mt-16 p-2 sm:p-4 lg:p-6${isDark ? " bg-gray-950" : " bg-gray-50"}`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

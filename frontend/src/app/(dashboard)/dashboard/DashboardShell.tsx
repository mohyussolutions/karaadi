"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useAppSelector } from "@/store/slices/hooks/hooks";
import ThemeApplier from "@/app/ui/Providers/ThemeApplier";

const Sidebar = dynamic(() => import("./components/sidebar/Sidebar"), {
  ssr: false,
  loading: () => <div className="w-72 flex-shrink-0 hidden md:block" />,
});

const Navbar = dynamic(() => import("./components/navbar/Navbar"), {
  ssr: false,
  loading: () => <div className="fixed top-0 right-0 left-0 z-40 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 md:ml-72" />,
});

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
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
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

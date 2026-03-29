"use client";
import React, { useState } from "react";
import ManagerSidebar from "@/app/(managers)/managers/ManagerSidebar";
import ManagerNavbar from "@/app/(managers)/managers/ManagerNavbar";
import ManagerRoute from "@/app/Guard/ManagerRoute";

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  return (
    <ManagerRoute>
      <div className="flex min-h-screen w-full bg-slate-100 flex-nowrap">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden transition-opacity"
            onClick={closeSidebar}
          />
        )}
        <ManagerSidebar open={sidebarOpen} onClose={closeSidebar} />
        <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
          <ManagerNavbar toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto bg-slate-100">
            {children}
          </main>
        </div>
      </div>
    </ManagerRoute>
  );
}

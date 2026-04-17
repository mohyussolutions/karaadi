"use client";

import React, { useState } from "react";
import ManagerSidebar from "@/app/(managers)/managers/ManagerSidebar";
import ManagerNavbar from "@/app/(managers)/managers/ManagerNavbar";

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex min-h-screen w-full bg-slate-100 flex-nowrap">
      <ManagerSidebar open={sidebarOpen} onClose={closeSidebar} />
      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
        <ManagerNavbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto bg-slate-100 p-4 relative">
          {children}
        </main>
      </div>
    </div>
  );
}

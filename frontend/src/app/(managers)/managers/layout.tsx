"use client";

import { useState } from "react";
import ProtectedRoute from "@/app/ProtectedRoute/ProtectedRoute";
import ManagerNavbar from "@/app/(dashboard)/dashboard/managment/ManagerNavbar";
import ManagerSidebar from "@/app/(dashboard)/dashboard/managment/ManagerSidebar";

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const handleCreateItem = () => {
    console.log("Opening creation modal...");
  };

  return (
    <ProtectedRoute manager={true}>
      <div className="flex min-h-screen w-full bg-gray-50 flex-nowrap">
        {open && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden transition-opacity"
            onClick={() => setOpen(false)}
          />
        )}

        <aside
          className={`
            fixed top-0 left-0 z-40
            h-screen w-72 
            bg-white shadow-2xl border-r border-gray-200 
            transform transition-transform duration-300 ease-in-out
            md:static md:translate-x-0 md:flex-shrink-0
            ${open ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <ManagerSidebar userRole="manager" />
        </aside>

        <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
          <ManagerNavbar
            userRole="manager"
            onCreateItem={handleCreateItem}
            onMenuClick={() => setOpen(true)}
          />

          <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

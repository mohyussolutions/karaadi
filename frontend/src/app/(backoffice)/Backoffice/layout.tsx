"use client";

import React, { useState } from "react";
import ManagerNavbar from "./ManagerNavbar";
import ManagerSidebar from "./ManagerSidebar";
import { usePathname } from "next/navigation";
import { AdminRoute } from "@/app/ProtectedRoute/ProtectedRoute";

export default function ManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const userRole: "devices" | "manager" | "support" = pathname?.startsWith(
    "/devices",
  )
    ? "devices"
    : pathname?.startsWith("/managers")
      ? "manager"
      : pathname?.startsWith("/support")
        ? "support"
        : "manager";

  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-slate-50 overflow-hidden">
        <aside
          id="backoffice-sidebar"
          className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-[#09090b] transition-transform duration-300 ease-in-out md:relative md:translate-x-0 shrink-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="h-full flex flex-col">
            <div className="p-4 md:hidden flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="text-zinc-400 hover:text-white p-2"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <ManagerSidebar userRole={userRole} />
            </div>
          </div>
        </aside>

        {open && (
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
          />
        )}

        <div className="flex flex-col flex-1 min-w-0">
          <ManagerNavbar
            userRole={userRole}
            onMenuClick={() => setOpen((v) => !v)}
          />

          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="w-full">{children}</div>
          </main>
        </div>
      </div>
    </AdminRoute>
  );
}

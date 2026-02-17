"use client";

import React, { useState, useMemo, useEffect } from "react";
import ManagerSidebar from "./ManagerSidebar";
import ManagerNavbar from "./ManagerNavbar";
import { usePathname } from "next/navigation";
import { getActiveRole } from "./useUserRole";

export default function ManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const userRole = useMemo(() => getActiveRole(pathname || ""), [pathname]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-hidden relative">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-[#09090b] transition-transform duration-300 ease-in-out md:relative md:translate-x-0 shrink-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ManagerSidebar userRole={userRole} />
      </aside>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-sm"
        />
      )}

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ManagerNavbar
          userRole={userRole as any}
          onMenuClick={() => setOpen(true)}
        />
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-12 max-w-[1600px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}

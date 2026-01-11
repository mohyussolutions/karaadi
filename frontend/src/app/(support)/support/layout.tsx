"use client";

import React, { useState } from "react";
import SupportSidebar from "./SupportSidebar";
import SupportNavbar from "./SupportNavbar";
import SupportCharts from "./SupportCharts";
import ProtectedRoute from "@/app/ProtectedRoute/ProtectedRoute";

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <ProtectedRoute support>
      <div className="flex w-full min-h-screen bg-gray-100 overflow-hidden">
        <div className={`md:block z-40 ${open ? "block" : "hidden"}`}>
          <SupportSidebar />
        </div>

        {open && (
          <div
            className="fixed inset-0 bg-black/30 z-30 md:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        <div className="flex flex-col flex-1 md:ml-64 transition-all duration-300">
          <SupportNavbar
            toggleSidebar={() => setOpen(!open)}
            user={undefined}
          />
          <main className="p-12 flex flex-col gap-12">
            {children}
            <SupportCharts />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

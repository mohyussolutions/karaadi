"use client";

import React, { useState, ReactNode } from "react";
import Sidebar from "./sidebar/Sidebar";
import Navbar from "./navbar/Navbar";
import { useAuth } from "./AuthProvider";

interface DashboardViewProps {
  children: ReactNode;
}

function DashboardView({ children }: DashboardViewProps) {
  const { user, isLoading } = useAuth();
  const [open, setOpen] = useState(true);

  if (isLoading) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen font-inter">
      <Sidebar isOpen={open} toggleSidebar={() => setOpen(!open)} />

      {open && (
        <div
          className="fixed inset-0 bg-black/75 z-30 md:hidden transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex flex-col flex-1 transition-all duration-300">
        <Navbar
          user={user}
          toggleSidebar={() => setOpen(!open)}
          className="sticky top-0 z-40 shadow-lg bg-white"
        />

        <main className={`flex-1 overflow-y-auto `}>
          <div className="max-w-full mx-0 p-6 md:p-10 m-0">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default DashboardView;

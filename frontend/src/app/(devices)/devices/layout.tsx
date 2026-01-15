"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";
import { FaBell, FaBars, FaCog, FaUserCircle } from "react-icons/fa";
import Sidebar from "./Sidebar/Sidebar";
import { backToDashboard } from "@/app/(links)/devicesLinks/devicesLinks";
import ProtectedRoute from "@/app/ProtectedRoute/ProtectedRoute";

interface DevicesLayoutProps {
  children: ReactNode;
}

export default function DevicesLayout({ children }: DevicesLayoutProps) {
  const [open, setOpen] = useState(false);

  return (
    <ProtectedRoute admin>
      <div className="h-screen w-full flex overflow-hidden bg-gray-100">
      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1 flex flex-col h-full md:ml-64 transition-all duration-300">
        <header className="w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
          <div className="flex items-center gap-4 px-6 py-2 bg-gray-50 border-b border-gray-100 overflow-x-auto">
            {backToDashboard.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-indigo-600 whitespace-nowrap transition"
              >
                <link.icon size={12} />
                {link.name}
              </Link>
            ))}
          </div>

          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setOpen(!open)}
                className="md:hidden text-gray-600 hover:text-indigo-600 transition"
              >
                <FaBars size={24} />
              </button>

              <h1 className="text-xl md:text-2xl font-bold text-gray-700">
                Device Management
              </h1>
            </div>

            <nav className="flex items-center space-x-6">
              <button className="text-gray-500 hover:text-indigo-600 relative">
                <FaBell size={20} />
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                  3
                </span>
              </button>
              <button className="text-gray-500 hover:text-indigo-600">
                <FaCog size={20} />
              </button>
              <FaUserCircle size={30} className="text-gray-400" />
            </nav>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
    </ProtectedRoute>
  );
}

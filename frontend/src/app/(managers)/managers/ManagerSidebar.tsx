"use client";

import { useLogout } from "@/app/(dashboard)/dashboard/navbar/Navbar";
import {
  managerManagementLinks,
  managerNavItems,
  managerAccountLinks,
} from "@/app/(links)/managmentLinks/managerLinks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FaChevronDown,
  FaChevronRight,
  FaUserCircle,
  FaSpinner,
} from "react-icons/fa";

interface ManagerSidebarProps {
  userRole: "admin" | "manager" | "support";
}

export default function ManagerSidebar({ userRole }: ManagerSidebarProps) {
  const pathname = usePathname();
  const logout = useLogout();
  const [isLoading, setIsLoading] = useState(false);
  const [openSections, setOpenSections] = useState({
    management: true,
    analytics: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleLogout = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      // Call logout hook if it exists
      if (logout && typeof logout === "function") {
        await logout();
      }

      // Clear local storage
      localStorage.clear();

      // Redirect to home page
      window.location.href = "/";
    } catch (error) {
      // If anything fails, still redirect to home
      localStorage.clear();
      window.location.href = "/";
    }
  };

  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col shadow-xl">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <FaUserCircle className="w-10 h-10 text-blue-400" />
          <div className="overflow-hidden">
            <h1 className="text-lg font-bold truncate">Manager Portal</h1>
            <p className="text-xs text-gray-400 capitalize">
              {userRole} Access
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest px-3 py-2 font-bold">
            Main Menu
          </p>
          <div className="space-y-1">
            {managerNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-lg transition text-sm ${
                  pathname === item.href
                    ? "bg-blue-600 text-white"
                    : "hover:bg-blue-900/30 text-gray-300 hover:text-white"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <button
            onClick={() => toggleSection("management")}
            className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-800 transition text-sm text-gray-300 hover:text-white"
          >
            <span className="font-medium">Manage Items</span>
            {openSections.management ? (
              <FaChevronDown size={12} />
            ) : (
              <FaChevronRight size={12} />
            )}
          </button>

          {openSections.management && (
            <div className="ml-4 mt-1 border-l border-gray-800 pl-2 space-y-1">
              {managerManagementLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 p-2 rounded-lg transition text-xs ${
                    pathname === item.href
                      ? "text-blue-400 font-bold"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <item.icon className="w-3 h-3" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-gray-800">
          {managerAccountLinks.map((item) => (
            <button
              key={item.name}
              disabled={isLoading}
              onClick={handleLogout}
              className="flex items-center gap-3 w-full p-3 rounded-lg text-gray-400 hover:bg-red-400/10 hover:text-red-400 transition text-sm disabled:opacity-50"
            >
              {isLoading ? (
                <FaSpinner className="animate-spin w-4 h-4" />
              ) : (
                <item.icon className="w-4 h-4" />
              )}
              <span>{isLoading ? "Signing out..." : item.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-800 bg-gray-950">
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="flex items-center gap-3 w-full p-3 rounded-lg text-red-400 hover:bg-red-400/10 transition font-medium text-sm text-left disabled:opacity-50"
        >
          {isLoading ? (
            <FaSpinner className="animate-spin w-4 h-4" />
          ) : (
            "Logout"
          )}
        </button>
      </div>
    </div>
  );
}

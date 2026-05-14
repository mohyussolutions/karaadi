"use client";

import { logout } from "@/actions/core/authAction";
import DashboardSearch from "@/app/(dashboard)/dashboard/components/search/DashboardSearch";
import Link from "next/link";
import React, { Suspense, useCallback, useState } from "react";
import { FaUser, FaBars } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import Lang from "@/i18n/Lang";

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, setUser } = useAuth();
  const { t } = useTranslation();
  const handleLogged = useCallback(async () => {
    setUser(null);
    await logout();
    window.location.href = "/login";
  }, [setUser]);

  const toggleDropdown = useCallback(() => setShowDropdown((p) => !p), []);
  const closeDropdown = useCallback(() => setShowDropdown(false), []);

  return (
    <header
      suppressHydrationWarning
      className="fixed top-0 right-0 left-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 md:ml-72 transition-colors duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="text-gray-600 dark:text-gray-300 md:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Toggle sidebar"
          >
            <FaBars className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100" suppressHydrationWarning>
            {t("dashboard.title")}
          </h2>
          <div className="hidden md:block text-sm text-gray-500 dark:text-gray-400 ml-4" suppressHydrationWarning>
            {user?.username || user?.email || "Admin"}
          </div>
        </div>

        <div suppressHydrationWarning className="flex items-center gap-3">
          <Suspense>
            <DashboardSearch />
          </Suspense>

          <Lang />

<div className="relative">
            <button
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
              onClick={toggleDropdown}
              aria-label="User menu"
            >
              <FaUser className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            </button>

            {showDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={closeDropdown} />
                <div className="absolute right-0 mt-2 w-48 min-w-[160px] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 z-50">
                  <div className="p-2">
                    <div className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 border-b dark:border-gray-700 truncate" suppressHydrationWarning>
                      {user?.username || user?.email || "Admin"}
                    </div>
                    <Link href="/dashboard/profile" className="block px-4 py-2 text-sm text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 mt-1" onClick={closeDropdown} suppressHydrationWarning>
                      {t("dashboard.nav.profile")}
                    </Link>
                    <Link href="/dashboard/settings" className="block px-4 py-2 text-sm text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" onClick={closeDropdown} suppressHydrationWarning>
                      {t("dashboard.nav.settings")}
                    </Link>
                    <button onClick={handleLogged} className="w-full px-4 py-2 text-sm text-left text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 mt-1 border-t border-gray-100 dark:border-gray-700 pt-2" suppressHydrationWarning>
                      {t("dashboard.nav.logout")}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";

import { logout } from "@/actions/core/authAction";
import DashboardSearch from "@/app/(dashboard)/dashboard/components/search/DashboardSearch";
import Link from "next/link";
import React, { Suspense, useCallback, useState } from "react";
import { FaUser, FaBars } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import Lang from "@/i18n/Lang";
import { useAppDispatch, useAppSelector } from "@/store/slices/hooks/hooks";
import { toggleTheme } from "@/store/slices/reducers/themeSlice";

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, setUser } = useAuth();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const mode = useAppSelector((s) => s.theme?.mode ?? "light");

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

          <button
            onClick={() => dispatch(toggleTheme())}
            aria-label="Toggle theme"
            suppressHydrationWarning
            className="flex items-center gap-1 p-2 rounded-xl border-2 border-indigo-200 dark:border-yellow-500/50 bg-indigo-50 dark:bg-yellow-500/10 hover:bg-indigo-100 dark:hover:bg-yellow-500/20 transition-all"
          >
            {mode === "dark" ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-400">
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.166 17.834a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 001.061-1.06l-1.59-1.591zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.166 6.166a.75.75 0 001.06 1.06l1.591-1.59a.75.75 0 00-1.06-1.061L6.166 6.166z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-indigo-600">
                <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
              </svg>
            )}
            <span className="hidden sm:block text-xs font-bold text-indigo-700 dark:text-yellow-400">
              {mode === "dark" ? "Light" : "Dark"}
            </span>
          </button>

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

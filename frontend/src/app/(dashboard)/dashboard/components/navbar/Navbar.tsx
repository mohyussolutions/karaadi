"use client";

import { logout, clearAuthCookies } from "@/actions/core/authAction";
import DashboardSearch from "@/app/(dashboard)/dashboard/components/search/DashboardSearch";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { FaUser, FaBars } from "react-icons/fa";
import { Sun, Moon } from "lucide-react";
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
  const router = useRouter();
  const { user, setUser } = useAuth();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const mode = useAppSelector((s) => s.theme.mode);

  useEffect(() => {
    router.prefetch("/login");
  }, [router]);

  const handleLogged = useCallback(() => {
    clearAuthCookies();
    sessionStorage.removeItem("user");
    setUser(null);
    router.push("/login");
    logout();
  }, [router, setUser]);

  const toggleDropdown = useCallback(() => setShowDropdown((p) => !p), []);
  const closeDropdown = useCallback(() => setShowDropdown(false), []);

  return (
    <header className="fixed top-0 right-0 left-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 md:ml-72 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="text-gray-600 dark:text-gray-300 md:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Toggle sidebar"
          >
            <FaBars className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {t("dashboard.title")}
          </h2>
          <div className="hidden md:block text-sm text-gray-500 dark:text-gray-400 ml-4">
            {user?.username || user?.email || "Admin"}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Suspense>
            <DashboardSearch />
          </Suspense>

          <Lang />

          <button
            onClick={() => dispatch(toggleTheme())}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            aria-label="Toggle theme"
          >
            {mode === "dark" ? (
              <Sun className="w-4 h-4 text-yellow-400" />
            ) : (
              <Moon className="w-4 h-4 text-gray-600" />
            )}
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
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 z-50">
                  <div className="p-2">
                    <div className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 border-b dark:border-gray-700 truncate">
                      {user?.username || user?.email || "Admin"}
                    </div>
                    <Link
                      href="/dashboard/profile"
                      className="block px-4 py-2 text-sm text-gray-800 dark:text-gray-200 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={closeDropdown}
                    >
                      {t("dashboard.nav.profile")}
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="block px-4 py-2 text-sm text-gray-800 dark:text-gray-200 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={closeDropdown}
                    >
                      {t("dashboard.nav.settings")}
                    </Link>
                    <button
                      onClick={handleLogged}
                      className="w-full px-4 py-2 text-sm text-left text-red-600 dark:text-red-400 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
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

"use client";

import { logout, clearAuthCookies } from "@/actions/core/authAction";
import DashboardSearch from "@/app/(dashboard)/dashboard/components/search/DashboardSearch";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { FaUser, FaBars } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import Lang from "@/i18n/Lang";

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const { user, setUser } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    router.prefetch("/login");
  }, [router]);

  const handleLogged = useCallback(() => {
    clearAuthCookies();
    sessionStorage.removeItem("user");
    setUser(null);
    router.push("/login");
    logout().catch(() => {});
  }, [router, setUser]);

  const toggleDropdown = useCallback(
    () => setShowDropdown((prev) => !prev),
    [],
  );
  const closeDropdown = useCallback(() => setShowDropdown(false), []);

  return (
    <header className="fixed top-0 right-0 left-0 z-40 bg-white p-4 border-b border-gray-200 md:ml-72">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="text-gray-600 md:hidden p-1 rounded-md hover:bg-gray-100 transition"
            aria-label="Toggle sidebar"
          >
            <FaBars className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800">
            {t("dashboard.title")}
          </h2>
          <div className="hidden md:block text-sm text-gray-500 ml-4">
            {user?.username || user?.email || "Admin"}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <DashboardSearch />
          <Lang />

          <div className="relative">
            <button
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
              onClick={toggleDropdown}
              aria-label="User menu"
            >
              <FaUser className="w-4 h-4 text-gray-700" />
            </button>

            {showDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={closeDropdown} />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-50">
                  <div className="p-2">
                    <div className="px-4 py-2 text-sm text-gray-600 border-b truncate">
                      {user?.username || user?.email || "Admin"}
                    </div>
                    <Link
                      href="/dashboard/profile"
                      className="block px-4 py-2 text-sm text-black rounded hover:bg-gray-100"
                      onClick={closeDropdown}
                    >
                      {t("dashboard.nav.profile")}
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="block px-4 py-2 text-sm text-black rounded hover:bg-gray-100"
                      onClick={closeDropdown}
                    >
                      {t("dashboard.nav.settings")}
                    </Link>
                    <button
                      onClick={handleLogged}
                      className="w-full px-4 py-2 text-sm text-left text-red-600 rounded hover:bg-gray-100"
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

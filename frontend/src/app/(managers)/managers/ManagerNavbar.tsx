"use client";

import { logout } from "@/actions/core/authAction";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaUser, FaBars } from "react-icons/fa";

interface ManagerNavbarProps {
  toggleSidebar: () => void;
  user?: any;
}

export default function ManagerNavbar({
  toggleSidebar,
  user,
}: ManagerNavbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="bg-[#0f172a] border-b border-slate-800 shadow-lg sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="text-slate-300 md:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Toggle sidebar"
          >
            <FaBars className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <h1 className="text-lg md:text-xl font-bold text-white">
              Manager Panel
            </h1>
            {user && (
              <span className="hidden sm:inline-block text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full font-semibold border border-blue-500/30">
                {user.username || user.email?.split("@")[0]}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer border border-slate-700"
              onClick={() => setShowDropdown(!showDropdown)}
              aria-label="User menu"
            >
              <FaUser className="w-4 h-4 text-slate-300" />
            </button>

            <div
              className={`absolute right-0 mt-2 w-48 rounded-xl bg-slate-800 border border-slate-700 shadow-xl z-50 transition-all duration-200 origin-top-right
                ${showDropdown ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"}`}
            >
              <div className="p-2 space-y-1">
                {user && (
                  <div className="px-3 py-2 border-b border-slate-700 mb-2">
                    <p className="text-sm font-semibold text-white truncate">
                      {user.username || user.email?.split("@")[0]}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {user.email}
                    </p>
                  </div>
                )}
                <Link
                  href="/managers/profile"
                  className="block px-3 py-2 text-sm text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/managers/settings"
                  className="block px-3 py-2 text-sm text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-red-400 rounded-lg hover:bg-red-500/10 hover:text-red-300 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDropdown && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </header>
  );
}

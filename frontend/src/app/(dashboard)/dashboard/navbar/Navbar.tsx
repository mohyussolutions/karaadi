import Link from "next/link";
import React, { useState } from "react";
import { FaBell, FaUser, FaBars } from "react-icons/fa";
import SearchInput from "@/app/(storeFront)/components/shared/search/SearchInput";
import { apiService } from "@/actions/core/authAction";

interface NavbarProps {
  user: any;
  toggleSidebar: () => void;
  className?: string;
}

export function useLogout() {
  return async () => {
    await apiService.logout();
    window.location.href = "/";
  };
}

export default function Navbar({
  user,
  toggleSidebar,
  className,
}: NavbarProps) {
  const logout = useLogout();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className={`bg-white p-4 transition-all duration-300 ${className}`}>
      <div className="flex items-center justify-between mx-auto">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="text-gray-600 transition-colors md:hidden p-1 rounded-md"
            aria-label="Toggle Sidebar"
          >
            <FaBars className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-semibold text-gray-800 hidden sm:block">
            Welcome,{" "}
            <span className="text-indigo-600">{user?.email || "Admin"}</span>
          </h2>
        </div>

        <div className="flex items-center gap-6 text-gray-700">
          <div className="flex-1 min-w-0">
            <SearchInput />
          </div>

          <button className="relative p-1 transition-colors hidden sm:block">
            <FaBell className="w-5 h-5" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
          </button>

          <div
            className="relative cursor-pointer p-1"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <FaUser
              className={`w-5 h-5 transition-colors ${
                showDropdown ? "text-indigo-600" : "text-gray-700"
              }`}
            />

            <div
              className={`absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-xl z-40 origin-top-right transition-all duration-200 
                ${
                  showDropdown
                    ? "opacity-100 scale-100 visible"
                    : "opacity-0 scale-95 invisible"
                }
              `}
            >
              <Link
                href="/dashboard/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </Link>
              <Link
                href="/dashboard/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Settings
              </Link>
              <button
                onClick={logout}
                className="block px-4 py-2 text-sm text-red-500 border-t hover:bg-red-50 w-full text-left"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

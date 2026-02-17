"use client";

import { logout } from "@/actions/core/authAction";
import SearchInput from "@/app/(search)/SearchInput";
import { User } from "@/app/(storeFront)/store/slices/boatsSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaUser, FaBars } from "react-icons/fa";

interface NavbarProps {
  toggleSidebar: () => void;
  className?: string;
  user?: User | null;
}

export default function Navbar({
  toggleSidebar,
  className,
  user,
}: NavbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const handleLogged = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header
      className={`bg-white p-4 border-b border-gray-200 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between mx-auto">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="text-gray-600 md:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <FaBars className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800 hidden sm:block">
            Dashboard
          </h2>
          <p className="text-black text-sm hidden sm:block px-2 py-1 rounded border border-green-500">
            {user?.username || user?.email}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="px-2 py-1">
            <SearchInput />
          </div>

          <div className="relative">
            <div
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <FaUser className="w-4 h-4 text-gray-700" />
            </div>

            <div
              className={`absolute right-0 mt-2 w-auto rounded-lg shadow-lg z-40 transition-all duration-150
    ${showDropdown ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"}
  `}
            >
              <div className="flex gap-2 p-2">
                <Link
                  href="/dashboard/profile"
                  className="px-4 py-2 text-sm border border-green-500 text-black rounded hover:bg-green-50"
                >
                  Profile
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="px-4 py-2 text-sm border border-green-500 text-black rounded hover:bg-green-50"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogged}
                  className="px-4 py-2 text-sm border border-green-500 text-black rounded hover:bg-green-50"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

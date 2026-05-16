"use client";

import {
  FiMenu,
  FiBell,
  FiSearch,
  FiLogOut,
  FiUser,
  FiSettings,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout, clearAuthCookies } from "@/actions/core/authAction";
import { useAuth } from "@/context/AuthContext";

interface SupportNavbarProps {
  toggleSidebar: () => void;
}

export default function SupportNavbar({ toggleSidebar }: SupportNavbarProps) {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white transition-all duration-300 border-b border-gray-200 px-5 py-3 flex items-center justify-between ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <button
        onClick={toggleSidebar}
        className="md:hidden bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition"
      >
        <FiMenu size={22} />
      </button>

      <div className="flex items-center bg-gray-100 px-4 py-2 rounded-xl gap-2 shadow-inner flex-1 max-w-lg mx-4">
        <FiSearch className="text-gray-500" size={18} />
        <input
          placeholder="Search..."
          className="bg-transparent outline-none text-sm flex-1"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
            }}
            className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
          >
            <FiBell size={20} />
          </button>

          {notifOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setNotifOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-xl rounded-xl border border-gray-200 z-50">
                <div className="px-4 py-3 border-b font-semibold text-sm">
                  Notifications
                </div>
                <div className="p-4 text-gray-600 text-sm text-center">
                  No new notifications
                </div>
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
            }}
            className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold hover:scale-105 transition"
          >
            {user?.username?.[0]?.toUpperCase() ||
              user?.email?.[0]?.toUpperCase() ||
              "U"}
          </button>

          {profileOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setProfileOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-44 bg-white shadow-xl rounded-xl border border-gray-200 z-50">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    router.push("/support/profile");
                  }}
                  className="w-full px-4 py-3 text-sm flex items-center gap-2 hover:bg-gray-100 rounded-t-xl"
                >
                  <FiUser size={16} /> Profile
                </button>

                <button
                  onClick={() => {
                    setProfileOpen(false);
                    router.push("/support/settings");
                  }}
                  className="w-full px-4 py-3 text-sm flex items-center gap-2 hover:bg-gray-100"
                >
                  <FiSettings size={16} /> Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-sm flex items-center gap-2 text-red-600 hover:bg-gray-100 rounded-b-xl"
                >
                  <FiLogOut size={16} /> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

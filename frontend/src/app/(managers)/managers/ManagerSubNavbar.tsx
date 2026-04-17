"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  FaChevronDown,
  FaChevronRight,
  FaSignOutAlt,
  FaUserCircle,
  FaSpinner,
  FaCircle,
} from "react-icons/fa";

import { logout } from "@/actions/core/authAction";
import { managerTotalLinks } from "@/app/(links)/management/managerLinks";
import { useAuth } from "@/context/AuthContext";

export default function ManagerSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading: authLoading } = useAuth();

  const [hasMounted, setHasMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [openSections, setOpenSections] = useState({
    management: true,
    auth: false,
  });

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!hasMounted) return null;

  const roleLabel = user?.isAdmin
    ? "Admin"
    : user?.isManager
      ? "Manager"
      : "Staff";

  return (
    <aside className="w-80 bg-[#0f172a] text-slate-200 h-screen flex flex-col border-r border-slate-800 shadow-2xl">
      <div className="p-8 border-b border-slate-800/50">
        <div className="flex flex-col items-center gap-4 p-6 rounded-3xl bg-slate-800/40 border border-white/5 shadow-inner">
          <div className="relative">
            {authLoading ? (
              <FaSpinner className="w-16 h-16 text-slate-600 animate-spin" />
            ) : (
              <>
                <FaUserCircle className="w-16 h-16 text-blue-500 shadow-lg" />
                <FaCircle className="absolute bottom-1 right-1 text-emerald-500 border-4 border-[#1e293b] rounded-full text-[10px]" />
              </>
            )}
          </div>
          <div className="text-center w-full">
            <h2 className="text-lg font-black text-white tracking-tight truncate px-2">
              {authLoading ? "Checking..." : user?.username || "Guest"}
            </h2>
            <span className="inline-block text-[10px] bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full font-bold tracking-widest uppercase border border-blue-500/30">
              {roleLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-8 overflow-y-auto custom-scrollbar">
        <section className="space-y-2">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-4 mb-4">
            Core Menu
          </p>
          {managerTotalLinks
            .filter((i) => i.category === "core")
            .map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                  pathname === item.href
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                <item.icon className="size-5" />
                <span>{item.name}</span>
              </Link>
            ))}
        </section>

        <section className="space-y-2">
          <button
            onClick={() => toggleSection("management")}
            className="flex items-center justify-between w-full px-4 py-2 text-slate-500 hover:text-slate-300 transition"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Backoffice
            </span>
            {openSections.management ? (
              <FaChevronDown size={10} />
            ) : (
              <FaChevronRight size={10} />
            )}
          </button>

          {openSections.management && (
            <div className="space-y-1 mt-2">
              {managerTotalLinks
                .filter((i) => i.category === "backoffice")
                .map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                      pathname === item.href
                        ? "bg-slate-700 text-white"
                        : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                    }`}
                  >
                    <item.icon className="size-5" />
                    <span>{item.name}</span>
                  </Link>
                ))}
            </div>
          )}
        </section>
      </div>

      <div className="p-6 border-t border-slate-800/50 bg-[#0c1222]">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-4 w-full p-4 rounded-2xl text-red-400 hover:bg-red-400/10 transition-all font-bold text-sm disabled:opacity-50 group"
        >
          <div className="p-2 rounded-lg bg-red-400/10 group-hover:bg-red-400/20 transition-colors">
            {isLoggingOut ? (
              <FaSpinner className="animate-spin size-5" />
            ) : (
              <FaSignOutAlt className="size-5" />
            )}
          </div>
          <div className="flex flex-col items-start">
            <span className="text-white">Sign Out</span>
            <span className="text-[10px] text-red-400/60 font-medium">
              Terminate Session
            </span>
          </div>
        </button>
      </div>
    </aside>
  );
}

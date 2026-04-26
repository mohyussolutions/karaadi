"use client";

import React from "react";
import Link from "next/link";
import { SUPPORT_LINKS } from "@/app/(links)/supportLinks/supportLinks";
import { useRouter, usePathname } from "next/navigation";
import { FiSearch, FiHeadphones, FiLogOut, FiX } from "react-icons/fi";
import { logout, clearAuthCookies } from "@/actions/core/authAction";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";

interface SupportSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function SupportSidebar({ open, onClose }: SupportSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser } = useAuth();
  const { t } = useTranslation();

  const isActive = (href: string) => pathname === href;

  const handleLogout = () => {
    logout();
    setUser(null);
    router.push("/login");
  };

  return (
    <aside
      className={`fixed md:static inset-y-0 left-0 z-40 w-72 h-screen bg-[#09090b] border-r border-zinc-800/50 flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
    >
      <div className="md:hidden flex justify-end p-4">
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          aria-label="Close sidebar"
        >
          <FiX size={20} />
        </button>
      </div>

      <div className="p-7 pt-0 md:pt-7 space-y-8">
        <div className="flex items-center gap-4 px-1">
          <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-600/20">
            <FiHeadphones size={22} />
          </div>
          <span className="text-xl font-black tracking-tight text-zinc-100">
            Support Hub
          </span>
        </div>

        {user && (
          <div className="flex flex-col gap-3 p-4 bg-zinc-900/40 rounded-3xl border border-zinc-800/50 shadow-inner">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-sm border border-indigo-500/20">
                {user.username?.[0]?.toUpperCase() ||
                  user.email?.[0]?.toUpperCase() ||
                  "U"}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-black text-indigo-500/80 uppercase tracking-widest">
                  {user.isAdmin
                    ? "Admin"
                    : user.isManager
                      ? "Manager"
                      : "Support"}
                </span>
              </div>
            </div>
            <div className="bg-zinc-900/60 px-3 py-2 rounded-xl border border-zinc-800/30">
              <p className="text-[11px] font-medium text-zinc-400 break-all leading-tight">
                {user.username || user.email}
              </p>
            </div>
          </div>
        )}

        <div className="relative group px-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
          <input
            type="text"
            placeholder="Search tools..."
            className="w-full pl-11 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm text-zinc-200 placeholder:text-zinc-600 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all"
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-5 space-y-3 custom-scrollbar">
        <p className="px-4 text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-6 mt-4">
          Operations
        </p>

        {SUPPORT_LINKS.map((item: any) => {
          const title = item.labelKey
            ? t(item.labelKey)
            : item.label || item.name || "";
          const Icon = item.dashboardIcon || item.icon;
          const active = isActive(item.href || "");

          return (
            <Link
              key={title}
              href={item.href || "/"}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-200 group mb-1 ${
                active
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 translate-x-1"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 hover:translate-x-1"
              }`}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`${active ? "text-white" : "text-zinc-500 group-hover:text-indigo-400"}`}
                >
                  {typeof Icon === "function" ? Icon({ size: 20 }) : Icon}
                </span>
                <span className="text-sm font-bold tracking-wide">{title}</span>
              </div>

              {title === "Reports" && !active && (
                <span className="bg-rose-500/10 text-rose-500 text-[10px] px-2 py-0.5 rounded-lg font-black border border-rose-500/20">
                  12
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-8 bg-zinc-950/50 border-t border-zinc-800/50">
        <div className="space-y-4">
          <div className="flex items-center gap-3 px-3">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.4)] animate-pulse" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Live Connection
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 text-zinc-500 hover:bg-rose-500/10 hover:text-rose-400 rounded-2xl transition-all font-bold text-sm border border-transparent hover:border-rose-500/20"
          >
            <FiLogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

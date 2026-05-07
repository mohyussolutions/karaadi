"use client";

import React, { FC, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaTimes } from "react-icons/fa";
import { allCategoriesDashbaord } from "@/app/(links)/dashboardLinks/allCategories";
import { useAppDispatch, useAppSelector } from "@/store/slices/hooks/hooks";
import { toggleTheme } from "@/store/slices/reducers/themeSlice";

interface SidebarProps {
  isOpen?: boolean;
  toggleSidebar?: () => void;
}

const BASE_ASIDE = "fixed inset-y-0 left-0 z-50 w-72 bg-indigo-700 dark:bg-gray-900 border-r border-indigo-600/30 dark:border-gray-700 text-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 h-screen flex flex-col shadow-xl";
const LINK_BASE = "flex items-center gap-4 px-4 py-3 rounded-lg transition-all mb-1";
const LINK_ACTIVE = "bg-indigo-800 dark:bg-gray-700 text-white shadow-inner";
const LINK_IDLE = "text-indigo-100 dark:text-gray-300 hover:bg-indigo-600 dark:hover:bg-gray-800 hover:text-white";

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.166 17.834a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 001.061-1.06l-1.59-1.591zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.166 6.166a.75.75 0 001.06 1.06l1.591-1.59a.75.75 0 00-1.06-1.061L6.166 6.166z" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
  </svg>
);

const Sidebar: FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const mode = useAppSelector((s) => s.theme?.mode ?? "light");
  const isDark = mode === "dark";

  const handleLinkClick = useCallback(() => {
    if (window.innerWidth < 768 && toggleSidebar) toggleSidebar();
  }, [toggleSidebar]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={toggleSidebar} />
      )}
      <aside
        suppressHydrationWarning
        className={BASE_ASIDE + " " + (isOpen ? "translate-x-0" : "-translate-x-full")}
      >
        <div className="px-4 pt-4 pb-3 border-b border-indigo-500/30 dark:border-gray-700 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold tracking-wider uppercase text-white">Admin Panel</span>
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 hover:bg-indigo-600 dark:hover:bg-gray-800 rounded transition text-white"
              aria-label="Close sidebar"
            >
              <FaTimes size={18} />
            </button>
          </div>

          <button
            suppressHydrationWarning
            onClick={() => dispatch(toggleTheme())}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all border border-white/20 dark:border-gray-600"
          >
            <div className="flex items-center gap-3">
              <span className={isDark ? "text-yellow-300" : "text-white"}>
                {isDark ? <SunIcon /> : <MoonIcon />}
              </span>
              <span className="text-sm font-semibold text-white">
                {isDark ? "Light Mode" : "Dark Mode"}
              </span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${isDark ? "bg-yellow-400/20 text-yellow-300" : "bg-white/20 text-white"}`}>
              {isDark ? "ON" : "OFF"}
            </span>
          </button>
        </div>

        <nav className="mt-4 px-4 flex-1 overflow-y-auto">
          {allCategoriesDashbaord.map((item: any, i: number) => {
            const href = item.link || item.href || item.dashboardLink;
            const Icon = item.icon || item.dashboardIcon;
            const isActive = pathname === href;
            return (
              <Link
                key={i}
                href={href}
                onClick={handleLinkClick}
                className={LINK_BASE + " " + (isActive ? LINK_ACTIVE : LINK_IDLE)}
              >
                {Icon && <Icon className="text-xl flex-shrink-0" />}
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

"use client";

import React, { FC, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaTimes } from "react-icons/fa";
import { allCategoriesDashbaord } from "@/app/(links)/dashboardLinks/allCategories";

interface SidebarProps {
  isOpen?: boolean;
  toggleSidebar?: () => void;
}

const Sidebar: FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname();

  const handleLinkClick = useCallback(() => {
    if (window.innerWidth < 768 && toggleSidebar) {
      toggleSidebar();
    }
  }, [toggleSidebar]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72
          bg-indigo-700 dark:bg-gray-900
          border-r border-indigo-600/30 dark:border-gray-700
          text-white transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          h-screen flex flex-col shadow-xl
        `}
      >
        <div className="h-20 flex items-center justify-between px-6 py-4 border-b border-indigo-500/30 dark:border-gray-700">
          <span className="text-lg font-bold tracking-wider uppercase text-white dark:text-gray-100">
            Admin Panel
          </span>
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 hover:bg-indigo-600 dark:hover:bg-gray-800 rounded transition"
            aria-label="Close sidebar"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <nav className="mt-6 px-4 flex-1 overflow-y-auto">
          {allCategoriesDashbaord.map((item: any, i: number) => {
            const href = item.link || item.href || item.dashboardLink;
            const Icon = item.icon || item.dashboardIcon;
            const isActive = pathname === href;

            return (
              <Link
                key={i}
                href={href}
                onClick={handleLinkClick}
                className={`
                  flex items-center gap-4 px-4 py-3 rounded-lg transition-all mb-2
                  ${
                    isActive
                      ? "bg-indigo-800 dark:bg-gray-700 text-white shadow-inner"
                      : "text-indigo-100 dark:text-gray-300 hover:bg-indigo-600 dark:hover:bg-gray-800 hover:text-white dark:hover:text-white"
                  }
                `}
              >
                {Icon && <Icon className="text-xl" />}
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

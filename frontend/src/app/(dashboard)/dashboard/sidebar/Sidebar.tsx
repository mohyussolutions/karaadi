"use client";

import React, { FC } from "react";
import Link from "next/link";
import { FaTimes } from "react-icons/fa";
import { sidebarLinks } from "@/app/(links)/storeFrontLinks/categories";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <aside
      className={`fixed z-50 top-0 inset-x-0 h-4/5 md:relative md:h-auto md:w-64 transform transition-transform duration-300 bg-indigo-700 text-white flex flex-col p-4 
      ${isOpen ? "translate-y-0" : "-translate-y-full md:translate-y-0"}`}
    >
      <div className="flex items-center justify-between mb-5 md:mb-3">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button onClick={toggleSidebar} className="md:hidden text-2xl">
          <FaTimes />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto pb-4 grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-col gap-4 md:gap-3">
        {sidebarLinks.map((c, i) => (
          <Link
            prefetch={false}
            key={i}
            href={c.link}
            onClick={toggleSidebar}
            className="flex flex-col items-center justify-center p-3 text-center rounded-xl bg-indigo-600/50 text-sm hover:bg-indigo-600 transition 
              md:flex-row md:items-center md:justify-start md:p-6 md:bg-transparent md:text-lg md:rounded-lg"
          >
            <div className="text-2xl mb-4 md:text-xl md:mr-4 md:mb-0">
              <c.icon />
            </div>
            <span className="font-medium">{c.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

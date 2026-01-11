"use client";

import { managerNavItems } from "@/app/(links)/managmentLinks/managerLinks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";

interface ManagerSidebarProps {
  userRole: "admin" | "manager" | "support";
}

export default function ManagerSidebar({ userRole }: ManagerSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-300 w-full">
      <div className="p-6 flex items-center gap-3 border-b border-gray-800">
        <FaUserCircle className="size-8 text-blue-500" />
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-white truncate">
            Manager Portal
          </h2>
          <p className="text-xs text-gray-500 capitalize">{userRole}</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
          Main Menu
        </p>
        {managerNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-800 hover:text-white"
              }`}
            >
              <item.icon
                className={`size-4 ${
                  isActive ? "text-white" : "text-gray-500"
                }`}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800 space-y-2">
        <button className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors">
          <FaSignOutAlt className="size-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

"use client";

import { managerManagementLinks } from "@/app/(links)/managmentLinks/managerLinks";
import {
  FaBell,
  FaSearch,
  FaCog,
  FaUserCircle,
  FaPlus,
  FaBars,
} from "react-icons/fa";

interface ManagerNavbarProps {
  userRole?: "admin" | "manager" | "support";
  onCreateItem?: (itemType: string) => void;
  onMenuClick?: () => void;
}

export default function ManagerNavbar({
  userRole = "manager",
  onCreateItem,
  onMenuClick,
}: ManagerNavbarProps) {
  return (
    <header className="bg-white border-b sticky top-0 z-30">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="md:hidden text-gray-500 hover:text-blue-600 transition p-2"
            >
              <FaBars size={20} />
            </button>

            <h1 className="text-xl font-bold text-gray-800 hidden sm:block">
              {userRole === "admin"
                ? "Admin"
                : userRole === "manager"
                ? "Manager"
                : "Support"}
            </h1>

            <div className="hidden md:block relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-3" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-1.5 text-sm border rounded-full focus:ring-2 focus:ring-blue-500 w-48 lg:w-64 bg-gray-50"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            {(userRole === "admin" || userRole === "manager") && (
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm font-medium shadow-sm">
                  <FaPlus size={12} />
                  <span className="hidden lg:inline">Create New</span>
                </button>

                <div className="absolute hidden group-hover:block bg-white shadow-xl border rounded-md mt-2 w-56 z-50 right-0 py-2 max-h-[70vh] overflow-y-auto">
                  <p className="px-4 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Select Category
                  </p>
                  {managerManagementLinks?.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => onCreateItem?.(item.name)}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-blue-50 text-gray-700 transition-colors"
                    >
                      <item.icon className="text-gray-400 size-4" />
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 border-l pl-4">
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
                <FaBell size={18} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>

              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full hidden sm:block">
                <FaCog size={18} />
              </button>

              <div className="flex items-center gap-2 ml-2">
                <div className="text-right hidden xl:block">
                  <p className="text-xs font-bold leading-none capitalize">
                    {userRole}
                  </p>
                </div>
                <FaUserCircle className="size-8 text-gray-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

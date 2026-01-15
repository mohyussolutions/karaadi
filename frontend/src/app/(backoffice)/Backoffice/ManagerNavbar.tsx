"use client";

import { FaBars, FaBell, FaCog, FaPlus } from "react-icons/fa";
import linksForBackoffice from "./(LinksforManagment)/links";

interface ManagerNavbarProps {
  userRole?: "devices" | "manager" | "support";
  onCreateItem?: (itemType: string) => void;
  onMenuClick?: () => void;
}

export default function ManagerNavbar({
  userRole = "manager",
  onCreateItem,
  onMenuClick,
}: ManagerNavbarProps) {
  const roleLabel = userRole === "devices" ? "Devices" : userRole === "manager" ? "Manager" : "Support";

  return (
    <header className="sticky top-0 z-30 bg-white border-b">
      <div className="relative flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <button onClick={onMenuClick} className="md:hidden p-2 text-gray-500">
            <FaBars />
          </button>

          <h1 className="hidden sm:block text-xl font-bold text-gray-800">{roleLabel} Dashboard</h1>
        </div>

        <div className="flex items-center gap-4">
          {(userRole === "devices" || userRole === "manager") && (
            <div className="relative group">
              <div className="absolute right-0 hidden group-hover:block w-56 mt-2 bg-white border rounded-md shadow-lg">
                {linksForBackoffice.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onCreateItem?.(item.name)}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-blue-50"
                  >
                    <item.icon className="w-4 h-4 text-gray-400" />
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button className="p-2 text-gray-500">
            <FaBell />
          </button>

          <button className="hidden sm:block p-2 text-gray-500">
            <FaCog />
          </button>
        </div>
      </div>
    </header>
  );
}

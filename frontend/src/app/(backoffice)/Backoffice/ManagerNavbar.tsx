"use client";

import { FaBars, FaBell, FaCog } from "react-icons/fa";
import linksForBackoffice from "./(LinksforManagment)/links";
import CartBadge from "./CartBadge";
interface ManagerNavbarProps {
  userRole?: "devices" | "manager" | "support";
  onCreateItem?: (itemType: string) => void;
  onMenuClick?: () => void;
  cartCount?: number;
}

export default function ManagerNavbar({
  userRole = "manager",
  onCreateItem,
  onMenuClick,
  cartCount = 0,
}: ManagerNavbarProps) {
  const roleLabel =
    userRole === "devices"
      ? "Devices"
      : userRole === "manager"
        ? "Manager"
        : "Support";

  return (
    <header className="sticky top-0 z-30 bg-white border-b w-full">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
          >
            <FaBars />
          </button>
          <h1 className="hidden sm:block text-xl font-bold text-gray-800">
            {roleLabel} Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-2">
            <CartBadge />
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaSignOutAlt,
  FaUserCircle,
  FaCircleNotch,
  FaBars,
} from "react-icons/fa";
import linksForBackoffice, {
  dashboardRoles,
} from "./(LinksforManagment)/links";
import { logout } from "@/actions/core/authAction";

export default function ManagerSidebar({
  userRole: initialUserRole,
  open = true,
  setOpen,
  width = 280,
}: any) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [userRole, setUserRole] = useState<string>("Support");
  const [userName, setUserName] = useState<string>("Loading...");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedUserName = localStorage.getItem("userName") || "User";
    setUserName(storedUserName);
    setUserRole(initialUserRole || "Support");
  }, [initialUserRole]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      localStorage.removeItem("userName");
      router.push("/");
      router.refresh();
    } catch {
      setIsLoggingOut(false);
    }
  };

  if (!mounted) return null;

  return (
    <aside
      className="flex flex-col h-full bg-[#09090b] border-r border-zinc-800 text-zinc-300"
      style={{ width: open ? width : 0, minWidth: open ? width : 0 }}
    >
      <div className="flex flex-col gap-6 p-8 border-b border-zinc-800/50">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <FaUserCircle className="w-12 h-12 text-indigo-500" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#09090b] rounded-full" />
          </div>
          <div className="flex flex-col min-w-0">
            <h2 className="text-xl font-black text-white tracking-tight uppercase italic">
              Backoffice
            </h2>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.25em] mt-0.5">
              {userRole}
            </span>
          </div>
        </div>
        <div className="bg-zinc-900/40 px-4 py-3 rounded-xl border border-zinc-800/30">
          <p className="text-xs font-medium text-zinc-400 break-all leading-tight">
            {userName}
          </p>
        </div>
      </div>

      <nav className="flex-1 px-6 py-8 space-y-3 overflow-y-auto">
        {linksForBackoffice
          .filter((item) => !item.id.startsWith("go-"))
          .map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 translate-x-2"
                    : "hover:bg-zinc-900/80 hover:text-white"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${isActive ? "text-white" : "text-zinc-500"}`}
                />
                <span className="text-sm font-bold tracking-wide">
                  {item.name}
                </span>
              </Link>
            );
          })}
      </nav>

      <div className="p-8 bg-zinc-950/50 border-t border-zinc-800/50">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-4 w-full px-5 py-4 text-sm font-bold text-zinc-500 rounded-2xl hover:bg-rose-500/10 hover:text-rose-400 transition-all disabled:opacity-50"
        >
          {isLoggingOut ? (
            <FaCircleNotch className="animate-spin" />
          ) : (
            <FaSignOutAlt />
          )}
          <span>{isLoggingOut ? "Signing Out..." : "Sign Out"}</span>
        </button>
      </div>
    </aside>
  );
}

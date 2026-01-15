"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import linksForBackoffice, { dashboardRoles } from "./(LinksforManagment)/links";
import { getCurrentUser } from "./userRole/userRole";

interface ManagerSidebarProps {
  userRole?: string;
}

export default function ManagerSidebar({ userRole: initialUserRole }: ManagerSidebarProps) {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string>(initialUserRole ?? "Support");
  const [userName, setUserName] = useState<string>("User");

  useEffect(() => {
    let mounted = true;
    getCurrentUser()
      .then((res) => {
        if (!mounted || !res) return;
        
        const name = res.user?.username ?? res.user?.email ?? "User";
        setUserName(name);

        const role = res.role?.toLowerCase();
        if (role === "admin") setUserRole("Admin");
        else if (role === "manager") setUserRole("Manager");
        else setUserRole("Support");
      })
      .catch(() => {
        setUserRole("Support");
      });
    return () => {
      mounted = false;
    };
  }, [initialUserRole]);

  return (
    <aside className="flex flex-col h-screen w-full bg-[#09090b] border-r border-zinc-800 text-zinc-300">
      <div className="flex flex-col gap-4 p-6 border-b border-zinc-800/50">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <FaUserCircle className="w-10 h-10 text-indigo-500" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#09090b] rounded-full" />
          </div>
          <div className="flex flex-col min-w-0">
            <h2 className="text-lg font-black text-white tracking-tight uppercase italic">
              Backoffice
            </h2>
            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em]">
              {userRole}
            </span>
          </div>
        </div>
        
        <div className="bg-zinc-900/40 px-3 py-2 rounded-xl border border-zinc-800/30">
          <p className="text-[11px] font-medium text-zinc-400 break-all leading-tight">
            {userName}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 px-6 py-3 bg-zinc-950/30 border-b border-zinc-800/50">
        {dashboardRoles.map((r) => (
          <Link
            key={r.id}
            href={r.href}
            className="text-[9px] font-black px-2 py-1 rounded-md bg-zinc-800 text-zinc-500 hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-wider border border-zinc-700/30"
          >
            {r.name}
          </Link>
        ))}
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        <p className="px-4 mb-3 text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">
          Navigation
        </p>

        {linksForBackoffice
          .filter((item) => !item.id.startsWith("go-"))
          .map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 translate-x-1" 
                    : "hover:bg-zinc-900 hover:text-white hover:translate-x-1"
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? "text-white" : "text-zinc-500 group-hover:text-indigo-400"}`} />
                <span className="text-[13px] font-bold tracking-wide">{item.name}</span>
              </Link>
            );
          })}
      </nav>

      <div className="p-6 bg-zinc-950/50 border-t border-zinc-800/50">
        <button className="flex items-center gap-3.5 w-full px-4 py-3 text-[13px] font-bold text-zinc-500 rounded-xl hover:bg-rose-500/10 hover:text-rose-400 transition-all border border-transparent hover:border-rose-500/20">
          <FaSignOutAlt className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
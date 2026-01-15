"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUserCircle, FaSignOutAlt, FaCircle, FaLifeRing } from "react-icons/fa";
import { managerTotalLinks } from "@/app/(links)/managmentLinks/managerLinks";
import { useLogout } from "@/app/(dashboard)/dashboard/navbar/Navbar";
import { apiService } from "@/actions/core/authAction";

export default function ManagerSidebar() {
  const pathname = usePathname();
  const logout = useLogout();
  const [hasMounted, setHasMounted] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setHasMounted(true);
    const getSession = async () => {
      const session = await apiService.verifySession();
      setUser(session);
    };
    getSession();
  }, []);

  if (!hasMounted) return null;

  return (
    <aside className="w-80 h-screen bg-[#0f172a] text-slate-200 flex flex-col border-r border-slate-800 shadow-2xl">
      <div className="p-8">
        <div className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-slate-800/40 border border-white/5 shadow-inner">
          <div className="relative">
            <FaUserCircle className="w-16 h-16 text-blue-500 shadow-lg" />
            <FaCircle className="absolute bottom-1 right-1 text-emerald-500 border-4 border-[#1e293b] rounded-full text-[10px]" />
          </div>
          
          <div className="text-center w-full">
            {user && (
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white truncate px-2">
                  {user.username || user.email?.split('@')[0]}
                </h2>
                <span className="inline-block text-[9px] bg-blue-500/20 text-blue-400 px-3 py-0.5 rounded-full font-black tracking-widest uppercase border border-blue-500/30">
                  {user.isAdmin ? "Admin" : user.isManager ? "Manager" : "Support"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 space-y-8 overflow-y-auto pb-10">
        <section className="space-y-1">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-4 mb-2">Core</p>
          {managerTotalLinks.filter(i => i.category === "core").map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                pathname === item.href
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <item.icon className="size-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </section>

        <section className="space-y-1">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-4 mb-2">Backoffice</p>
          {managerTotalLinks.filter(i => i.category === "backoffice").map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                pathname === item.href
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <item.icon className="size-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </section>

        <section className="space-y-1">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-4 mb-2">Access</p>
          <Link
            href="/support"
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
              pathname?.startsWith("/support")
                ? "bg-blue-600 text-white shadow-lg"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
            }`}
          >
            <FaLifeRing className="size-5" />
            <span>Support Panel</span>
          </Link>
        </section>

        <section className="space-y-1 pt-4 border-t border-slate-800/50">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-4 mb-2">System</p>
          {managerTotalLinks
            .filter(i => i.category === "system" || i.category === "navigation")
            .filter(i => i.action !== "logout") 
            .map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all"
              >
                <item.icon className="size-5" />
                <span>{item.name}</span>
              </Link>
            ))}

          <button
            onClick={logout}
            className="flex w-full items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all mt-4"
          >
            <FaSignOutAlt className="size-5" />
            <span>Logout</span>
          </button>
        </section>
      </div>
    </aside>
  );
}
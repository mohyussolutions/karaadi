"use client";

import React, { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { verifySession } from "@/actions/core/authAction";
import Sidebar from "./sidebar/Sidebar";
import Navbar from "./navbar/Navbar";
import { User } from "@/app/utils/types/user";
import { AdminRedirect } from "@/app/Guard/AdminRoute";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [open, setOpen] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const currentUser = await verifySession();
        if (!currentUser) {
          router.replace("/login");
          return;
        }
        if (!currentUser.isAdmin) {
          router.replace("/");
          return;
        }
        setUser(currentUser as User);
        setAuthorized(true);
        if (window.location.pathname !== "/dashboard") {
          router.replace("/dashboard");
        }
      } catch {
        router.replace("/login");
      }
    }
    checkAuth();
  }, [router]);

  if (!authorized) {
    return;
  }

  return (
    <>
      <AdminRedirect />
      <div className="flex h-screen font-inter">
        <Sidebar isOpen={open} toggleSidebar={() => setOpen(!open)} />
        {open && (
          <div
            className="fixed inset-0 bg-black/75 z-30 md:hidden"
            onClick={() => setOpen(false)}
          />
        )}
        <div className="flex flex-col flex-1 min-h-0">
          <Navbar toggleSidebar={() => setOpen(!open)} user={user} />
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}

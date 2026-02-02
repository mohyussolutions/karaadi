"use client";

import React, { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { verifySession } from "@/actions/core/authAction";
import Sidebar from "./sidebar/Sidebar";
import Navbar from "./navbar/Navbar";
import { User } from "@/app/utils/types/user";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [open, setOpen] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const currentUser = await verifySession();
      if (!currentUser?.isAdmin) {
        router.replace("/");
      } else {
        setUser(currentUser);
        setAllowed(true);
      }
    })();
  }, [router]);

  if (!allowed) return null;

  return (
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
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import DashboardShell from "./DashboardShell";
import "@/app/utils/style/dashboard/dashboard.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="flex h-screen bg-gray-50 dark:bg-gray-950" />;
  return <DashboardShell>{children}</DashboardShell>;
}

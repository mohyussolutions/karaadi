"use client";

import { ReactNode } from "react";
import ProtectedRoute from "@/app/ProtectedRoute/ProtectedRoute";
import DashboardView from "./DashboardView";
import { AuthProvider } from "./AuthProvider";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthProvider>
      <ProtectedRoute admin>
        <DashboardView>{children}</DashboardView>
      </ProtectedRoute>
    </AuthProvider>
  );
}

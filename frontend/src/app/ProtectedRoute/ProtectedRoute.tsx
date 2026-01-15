"use client";

import { apiService } from "@/actions/core/authAction";
import { useEffect, useState } from "react";

type ProtectedRouteProps = {
  children: React.ReactNode;
  admin?: boolean;
  manager?: boolean;
  support?: boolean;
};

export default function ProtectedRoute({
  children,
  admin = false,
  manager = false,
  support = false,
}: ProtectedRouteProps) {
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  const isStorefront = !admin && !manager && !support;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const user = await apiService.verifySession();
        if (!mounted) return;

        if (!user) {
          if (isStorefront) {
            setAllowed(true);
          } else {
            window.location.replace("/login");
          }
          return;
        }

        if (!isStorefront) {
          const hasAdminAccess = admin && user.isAdmin;
          const hasManagerAccess = manager && user.isManager;
          const hasSupportAccess = support && user.isSupport;

          if (!hasAdminAccess && !hasManagerAccess && !hasSupportAccess) {
            return window.location.replace("/");
          }
        }

        if (isStorefront) {
          if (user.isAdmin) return window.location.replace("/dashboard");
          if (user.isManager) return window.location.replace("/managers");
          if (user.isSupport) return window.location.replace("/support");
        }

        setAllowed(true);
      } catch (error) {
        if (!isStorefront) window.location.replace("/login");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [admin, manager, support, isStorefront]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#09090b]/10 backdrop-blur-md z-50">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-t-2 border-b-2 border-indigo-500 animate-spin"></div>
          <div className="absolute inset-0 h-12 w-12 rounded-full border-l-2 border-r-2 border-indigo-200/20 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!allowed) return null;

  return <>{children}</>;
}
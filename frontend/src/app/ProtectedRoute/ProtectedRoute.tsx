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

        if (admin && !user.isAdmin) return window.location.replace("/");
        if (manager && !user.isManager) return window.location.replace("/");
        if (support && !user.isSupport) return window.location.replace("/");

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
      <div className="fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!allowed) return null;

  return <>{children}</>;
}

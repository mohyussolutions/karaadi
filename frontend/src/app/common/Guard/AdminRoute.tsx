"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import { verifySession } from "@/actions/core/authAction";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";

export default function AdminRoute({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function checkAuth() {
      try {
        const session = await verifySession();

        const isDashboardPath = pathname?.startsWith("/dashboard") || false;

        if (session?.isAdmin) {
          setIsAdmin(true);
          if (!isDashboardPath) {
            router.replace("/dashboard");
            return;
          }
          setLoading(false);
          return;
        }

        if (isDashboardPath) {
          router.replace("/login");
          return;
        }

        router.replace("/");
      } catch {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [pathname, router]);

  if (loading) return <Loading />;
  if (!isAdmin) return null;
  return <>{children}</>;
}

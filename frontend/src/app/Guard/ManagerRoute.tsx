"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import { verifySession } from "@/actions/core/authAction";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";

export default function ManagerRoute({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isManager, setIsManager] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let active = true;
    async function checkAuth() {
      try {
        const session = await verifySession();
        const isManagerPath = pathname?.startsWith("/managers") || false;
        if (session?.isSupport) {
          router.replace("/support");
          return;
        }
        if (session?.isManager) {
          setIsManager(true);
          if (!isManagerPath) {
            router.replace("/managers");
            return;
          }
          if (active) setLoading(false);
          return;
        }
        if (isManagerPath) {
          router.replace("/login");
          return;
        }
        router.replace("/login");
      } catch {
        router.replace("/login");
      }
    }
    checkAuth();
    return () => {
      active = false;
    };
  }, [pathname, router]);

  if (loading) return <Loading />;
  if (!isManager) return null;
  return <>{children}</>;
}

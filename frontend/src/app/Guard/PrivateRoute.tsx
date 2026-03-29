"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import { verifySession } from "@/actions/core/authAction";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";

export default function PrivateRoute({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const session = await verifySession();

        if (!session) {
          router.replace("/");
          return;
        }

        if (session.isAdmin) {
          router.replace("/dashboard");
          return;
        }

        if (session.isManager) {
          router.replace("/managers");
          return;
        }

        if (session.isSupport) {
          router.replace("/support");
          return;
        }

        setIsLoggedIn(true);
      } catch {
        router.replace("/");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  if (loading) return <Loading />;
  if (!isLoggedIn) return null;
  return <>{children}</>;
}

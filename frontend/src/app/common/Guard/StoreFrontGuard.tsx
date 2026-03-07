"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import { verifySession } from "@/actions/core/authAction";

export default function StoreFrontGuard({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const session = await verifySession();

        if (session?.isAdmin) {
          router.replace("/dashboard");
          return;
        }

        if (session?.isManager) {
          router.replace("/managers");
          return;
        }

        if (session?.isSupport) {
          router.replace("/support");
          return;
        }

        setReady(true);
      } catch {
        setReady(true);
      }
    }
    checkAuth();
  }, [router]);

  if (!ready) return null;

  return <>{children}</>;
}

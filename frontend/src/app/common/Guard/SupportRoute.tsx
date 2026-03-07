"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import { verifySession } from "@/actions/core/authAction";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";

export default function SupportRoute({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isSupport, setIsSupport] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function checkAuth() {
      try {
        const session = await verifySession();

        const isSupportPath = pathname?.startsWith("/support") || false;

        if (session?.isSupport || session?.isManager) {
          setIsSupport(true);
          if (!isSupportPath && !session?.isManager) {
            router.replace("/support");
            return;
          }
          setLoading(false);
          return;
        }

        if (isSupportPath) {
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
  if (!isSupport) return null;
  return <>{children}</>;
}

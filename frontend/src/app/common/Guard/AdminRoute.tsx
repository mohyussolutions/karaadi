"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import { verifySession } from "@/actions/core/authAction";
import { ALL_PROTECTED_PATHS } from "@/app/(links)/roleConfig/roleConfig";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";

export default function AdminRoute({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function checkAuth() {
      const session = await verifySession();
      const isProtected = ALL_PROTECTED_PATHS.some((r) =>
        pathname.startsWith(r.path),
      );

      if (session?.isAdmin && !isProtected) {
        router.replace("/dashboard");
        return;
      }

      if (!isProtected) {
        setLoading(false);
        return;
      }

      if (!session || !session.isAdmin) {
        router.replace(session ? "/" : "/login");
      } else {
        setLoading(false);
      }
    }
    checkAuth();
  }, [pathname, router]);

  if (loading) return <Loading />;
  return <>{children}</>;
}

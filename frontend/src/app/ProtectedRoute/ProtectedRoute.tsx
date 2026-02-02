"use client";

import { verifySession } from "@/actions/core/authAction";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function useRoleGuard(check: (user: any) => boolean, redirectTo: string) {
  const [allowed, setAllowed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const user = await verifySession();
      if (!check(user)) {
        router.replace(redirectTo);
      } else {
        setAllowed(true);
      }
    })();
  }, [router, check, redirectTo]);

  return allowed;
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const allowed = useRoleGuard((user) => user?.isAdmin, "/");
  if (!allowed) return null;
  return <>{children}</>;
}

export function ManagerRoute({ children }: { children: React.ReactNode }) {
  const allowed = useRoleGuard((user) => user?.isManager, "/");
  if (!allowed) return null;
  return <>{children}</>;
}

export function SupportRoute({ children }: { children: React.ReactNode }) {
  const allowed = useRoleGuard((user) => user?.isSupport, "/");
  if (!allowed) return null;
  return <>{children}</>;
}

export function StoreFrontRoute({ children }: { children: React.ReactNode }) {
  const allowed = useRoleGuard(
    (user) => !user?.isAdmin && !user?.isManager && !user?.isSupport,
    "/",
  );
  if (!allowed) return null;
  return <>{children}</>;
}

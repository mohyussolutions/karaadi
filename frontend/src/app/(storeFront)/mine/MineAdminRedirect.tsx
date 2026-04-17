"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function MineAdminRedirect({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && user.isAdmin) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  return <>{children}</>;
}

"use client";

import { useAuth } from "@/context/AuthContext";
import LoginForm from "./LoginForm";
import Loading from "@/app/ui/loading/Loading";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!loading && user) {
      const next = searchParams.get("next");
      const safeNext =
        next && next.startsWith("/") && !next.startsWith("//") ? next : null;
      if (user.isAdmin) {
        router.push("/dashboard");
      } else if (user.isManager) {
        router.push("/managers");
      } else if (user.isSupport) {
        router.push("/support");
      } else {
        router.push(safeNext ?? "/");
      }
    }
  }, [loading, user, router, searchParams]);

  if (loading) {
    return <Loading />;
  }

  if (user) {
    return null;
  }

  return <LoginForm />;
}

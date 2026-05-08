"use client";

import { useAuth } from "@/context/AuthContext";
import LoginForm from "./LoginForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (user.isAdmin) {
        router.push("/dashboard");
      } else if (user.isManager) {
        router.push("/managers");
      } else if (user.isSupport) {
        router.push("/support");
      } else {
        router.push("/");
      }
    }
  }, [loading, user, router]);

  if (user) return null;

  return <LoginForm />;
}

"use client";

import ProfileCard from "./ProfileCard";
import AccountOptionsClient from "./AccountOptionsClient";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function MyAccountCards() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return null;
  }

  const accessToken = user.token || "";

  return (
    <>
      <ProfileCard user={user as any} accessToken={accessToken} />
      <AccountOptionsClient user={user as any} />
    </>
  );
}

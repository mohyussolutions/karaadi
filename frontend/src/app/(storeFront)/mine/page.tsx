"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfileCard from "./ProfileCard";
import AccountOptionsClient from "./AccountOptionsClient";
import { useAuth } from "@/context/AuthContext";

export default function MyAccountCards() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      for (const name of ["accessToken", "user-role"]) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
      router.replace("/login?next=/mine");
    }
  }, [loading, user, router]);

  if (loading || !user)
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );

  return (
    <>
      <ProfileCard user={user as any} accessToken={user.token || ""} />
      <AccountOptionsClient user={user as any} />
    </>
  );
}

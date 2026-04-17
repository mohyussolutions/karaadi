"use client";
import { useRouter } from "next/navigation";
import ProfileCard from "./ProfileCard";
import AccountOptionsClient from "./AccountOptionsClient";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function ProfileClientWrapper({
  accessToken,
  locale,
}: {
  accessToken: string;
  locale: string;
}) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <>
      <ProfileCard user={user} accessToken={accessToken} />
      <AccountOptionsClient user={user} />
    </>
  );
}

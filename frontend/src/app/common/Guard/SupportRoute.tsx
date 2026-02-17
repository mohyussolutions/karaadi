"use client";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function SupportRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userInfo } = useSelector((state: any) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!userInfo || !(userInfo.isAdmin || userInfo.isSupport)) {
      router.push("/login");
    }
  }, [userInfo, router]);

  if (!userInfo || !(userInfo.isAdmin || userInfo.isSupport)) {
    return null;
  }

  return <>{children}</>;
}

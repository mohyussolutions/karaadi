"use client";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function ManagerRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userInfo } = useSelector((state: any) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!userInfo || !(userInfo.isAdmin || userInfo.isManager)) {
      router.push("/");
    }
  }, [userInfo, router]);

  return userInfo?.isAdmin || userInfo?.isManager ? <>{children}</> : null;
}

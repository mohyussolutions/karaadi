"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { verifySession } from "@/actions/core/authAction";
export default function AdminRedirect() {
  const router = useRouter();
  const called = useRef(false);
  useEffect(() => {
    if (called.current) return;
    called.current = true;
    let active = true;
    (async () => {
      const user = await verifySession();
      if (active && user && user.isAdmin) {
        router.replace("/dashboard");
      }
    })();
    return () => {
      active = false;
    };
  }, [router]);
  return null;
}

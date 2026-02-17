// components/AuthGuard.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/(storeFront)/store/store";
import { useAuthSession } from "./useAuthSession";
import Loading from "../shared/Loading/Loading";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { isLoading } = useAuthSession();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return <>{children}</>;
}

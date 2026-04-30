"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { IoBusiness } from "react-icons/io5";

export default function BusinessPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    router.replace("/business/Apply");
  }, [user, loading, router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center animate-pulse">
          <IoBusiness className="text-3xl text-blue-400" />
        </div>
        <p className="text-sm text-gray-400 animate-pulse">
          {t("mine.businesses.loading", "Loading…")}
        </p>
      </div>
    </div>
  );
}

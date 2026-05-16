"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SocialShare from "./SocialShare";
import type { ShareData } from "./types";
import { SOCIAL_STORAGE_KEY } from "./constants";

export default function SocialMediaPage() {
  const router = useRouter();
  const [data, setData] = useState<ShareData | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SOCIAL_STORAGE_KEY);
      if (!raw) { router.replace("/marketplace"); return; }
      const parsed: ShareData = JSON.parse(raw);
      sessionStorage.removeItem(SOCIAL_STORAGE_KEY);
      setData(parsed);
    } catch {
      router.replace("/marketplace");
    }
  }, [router]);

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
    </div>
  );

  return <SocialShare {...data} />;
}

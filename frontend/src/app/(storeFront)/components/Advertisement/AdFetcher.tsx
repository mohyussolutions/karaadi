"use client";

import React, { useEffect, useState } from "react";
import { getAdvertisements } from "@/actions/categories/advertisementService";
import BackgroundAdWrapper from "./BackgroundAdWrapper";
import SideAds from "./SideAds";

export default function AdFetcher({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [backgroundAd, setBackgroundAd] = useState<any>(null);
  const [sidebarAd, setSidebarAd] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    getAdvertisements("background", 1)
      .then((ads) => setBackgroundAd(ads?.[0] ?? null))
      .catch(() => {});
    getAdvertisements("sidebar", 1)
      .then((ads) => setSidebarAd(ads?.[0] ?? null))
      .catch(() => {});
  }, [mounted]);

  return (
    <BackgroundAdWrapper ad={backgroundAd}>
      <div className="min-h-screen relative">
        {children}
        <SideAds ad={sidebarAd} />
      </div>
    </BackgroundAdWrapper>
  );
}

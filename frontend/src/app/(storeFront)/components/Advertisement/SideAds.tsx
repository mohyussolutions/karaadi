"use client";

import React from "react";
import AdvertisementComponent, { SingleAd } from "./Advertisement";

interface SideAdsProps {
  ad: SingleAd | null;
}

const SideAds = ({ ad }: SideAdsProps) => {
  if (!ad?.imageUrl) return null;

  return (
    <aside className="fixed top-24 w-50 h-[550px] hidden lg:flex items-center justify-center z-30 left-[calc((100%-64.5rem)/2+63.5rem+1rem)]">
      <AdvertisementComponent ads={[ad]} />
    </aside>
  );
};

export default SideAds;

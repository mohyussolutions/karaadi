"use client";

import React from "react";
import AdvertisementComponent, { SingleAd } from "./Advertisement";

interface SideAdsProps {
  ad: SingleAd | null;
}

const SideAds = ({ ad }: SideAdsProps) => {
  return (
    <aside className="fixed top-24 w-[300px] h-[600px] hidden lg:flex items-start justify-center z-30 left-[calc((100%-64.5rem)/2+64.5rem+1rem)]">
      {ad?.imageUrl ? (
        <div className="animate-in fade-in duration-500 w-full">
          <AdvertisementComponent ads={[ad]} />
        </div>
      ) : (
        <div className="w-full h-full bg-transparent" />
      )}
    </aside>
  );
};

export default SideAds;

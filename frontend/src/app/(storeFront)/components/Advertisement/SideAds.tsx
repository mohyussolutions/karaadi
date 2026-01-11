"use client";

import React, { useEffect, useState } from "react";
import Advertisement from "./Advertisement";
import { getAdvertisements } from "@/actions/categories/advertisementService";

const SideAds = () => {
  const [hasAd, setHasAd] = useState(false);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const data = await getAdvertisements("sidebar", 1);
        setHasAd(data?.[0]?.imageUrl ? true : false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAds();
  }, []);

  if (!hasAd) {
    return null;
  }

  return (
    <aside className="fixed top-24 w-50 h-[550px] hidden lg:flex items-center justify-center text-white/50 text-xs font-bold uppercase tracking-widest z-30 left-[calc((100%-64.5rem)/2+63.5rem+1rem)]">
      <Advertisement />
    </aside>
  );
};

export default SideAds;

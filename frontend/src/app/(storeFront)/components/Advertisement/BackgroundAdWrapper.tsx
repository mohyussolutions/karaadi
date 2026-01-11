"use client";

import React, { useEffect, useState } from "react";
import {
  getAdvertisements,
  trackAdClick,
} from "@/actions/categories/advertisementService";

const BackgroundAdWrapper = ({ children }: { children: React.ReactNode }) => {
  const [ad, setAd] = useState<any>(null);

  useEffect(() => {
    const fetchBgAd = async () => {
      try {
        const data = await getAdvertisements("background", 1);
        if (data?.[0]) setAd(data[0]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBgAd();
  }, []);

  const handleBgClick = () => {
    if (ad?.link) {
      trackAdClick(ad.id);
      const link = ad.link.startsWith("http") ? ad.link : `https://${ad.link}`;
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };

  if (ad?.imageUrl) {
    return (
      <div
        onClick={handleBgClick}
        className="min-h-screen w-full bg-fixed bg-center bg-no-repeat bg-cover relative flex flex-col"
        style={{
          backgroundColor: ad?.imageUrl,
          backgroundImage: ad?.imageUrl ? `url("${ad.imageUrl}")` : undefined,
          cursor: ad?.link ? "pointer" : "default",
        }}
      >
        {children}
      </div>
    );
  }

  return <>{children}</>;
};

export default BackgroundAdWrapper;

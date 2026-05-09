"use client";

import React, { useState, useEffect } from "react";
import { trackAdClick } from "@/actions/categories/advertisementService";

interface AdProps {
  children: React.ReactNode;
  ad: any;
}

const BackgroundAdWrapper = ({ children, ad }: AdProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!ad?.imageUrl) return;
    const img = new Image();
    img.src = ad.imageUrl;
    img.onload = () => setIsLoaded(true);
  }, [ad?.imageUrl]);

  const handleAdClick = () => {
    if (!ad?.link) return;
    trackAdClick(ad.id);
    window.open(
      ad.link.startsWith("http") ? ad.link : `https://${ad.link}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const active = isLoaded && !!ad?.imageUrl;

  return (
    <div
      className={active ? "min-h-screen w-full bg-fixed bg-center bg-no-repeat bg-cover relative flex transition-opacity duration-700" : "min-h-screen relative"}
      style={active ? { backgroundImage: `url("${ad.imageUrl}")` } : {}}
    >
      {active && ad?.link && (
        <>
          <div
            onClick={handleAdClick}
            className="hidden xl:block fixed left-0 top-0 h-full w-[calc((100vw-1280px)/2)] cursor-pointer z-10"
          />
          <div
            onClick={handleAdClick}
            className="hidden xl:block fixed right-0 top-0 h-full w-[calc((100vw-1280px)/2)] cursor-pointer z-10"
          />
        </>
      )}
      <div className={active ? "flex-1 w-full relative z-20" : ""}>{children}</div>
    </div>
  );
};

export default BackgroundAdWrapper;

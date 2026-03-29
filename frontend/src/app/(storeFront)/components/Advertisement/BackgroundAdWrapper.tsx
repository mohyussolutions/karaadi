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
    if (ad?.imageUrl) {
      const img = new Image();
      img.src = ad.imageUrl;
      img.onload = () => setIsLoaded(true);
    }
  }, [ad?.imageUrl]);

  const handleAdClick = () => {
    if (!ad?.link) return;
    trackAdClick(ad.id);
    const link = ad.link.startsWith("http") ? ad.link : `https://${ad.link}`;
    window.open(link, "_blank", "noopener,noreferrer");
  };

  if (!ad?.imageUrl) return <>{children}</>;

  return (
    <div
      className={`min-h-screen w-full bg-fixed bg-center bg-no-repeat bg-cover relative flex transition-opacity duration-700 ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
      style={{ backgroundImage: isLoaded ? `url("${ad.imageUrl}")` : "none" }}
    >
      {ad?.link && (
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
      <div className="flex-1 w-full relative z-20">{children}</div>
    </div>
  );
};

export default BackgroundAdWrapper;

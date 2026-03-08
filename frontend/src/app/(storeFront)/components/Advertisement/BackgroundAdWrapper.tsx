"use client";

import React from "react";
import { trackAdClick } from "@/actions/categories/advertisementService";

interface AdProps {
  children: React.ReactNode;
  ad: any;
}

const BackgroundAdWrapper = ({ children, ad }: AdProps) => {
  const handleAdClick = () => {
    if (!ad?.link) return;
    trackAdClick(ad.id);
    const link = ad.link.startsWith("http") ? ad.link : `https://${ad.link}`;
    window.open(link, "_blank", "noopener,noreferrer");
  };

  if (!ad?.imageUrl) return <>{children}</>;

  return (
    <div
      className="min-h-screen w-full bg-fixed bg-center bg-no-repeat bg-cover relative flex transition-opacity duration-500"
      style={{ backgroundImage: `url("${ad.imageUrl}")` }}
    >
      {ad?.link && (
        <>
          <div
            onClick={handleAdClick}
            className="hidden xl:block fixed left-0 top-0 h-full w-[calc((100vw-1280px)/2)] cursor-pointer z-10"
            title="Advertisement"
          />
          <div
            onClick={handleAdClick}
            className="hidden xl:block fixed right-0 top-0 h-full w-[calc((100vw-1280px)/2)] cursor-pointer z-10"
            title="Advertisement"
          />
        </>
      )}
      <div className="flex-1 w-full relative z-20">{children}</div>
    </div>
  );
};

export default BackgroundAdWrapper;

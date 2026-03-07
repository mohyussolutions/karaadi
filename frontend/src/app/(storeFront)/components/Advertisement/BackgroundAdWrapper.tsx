"use client";

import React from "react";
import { trackAdClick } from "@/actions/categories/advertisementService";

interface AdProps {
  children: React.ReactNode;
  ad: any;
}

const BackgroundAdWrapper = ({ children, ad }: AdProps) => {
  const handleBgClick = () => {
    if (!ad?.link) return;
    trackAdClick(ad.id);
    const link = ad.link.startsWith("http") ? ad.link : `https://${ad.link}`;
    window.open(link, "_blank", "noopener,noreferrer");
  };

  if (!ad?.imageUrl) return <>{children}</>;

  return (
    <div
      onClick={handleBgClick}
      className="min-h-screen w-full bg-fixed bg-center bg-no-repeat bg-cover relative flex flex-col transition-opacity duration-500"
      style={{
        backgroundImage: `url("${ad.imageUrl}")`,
        cursor: ad?.link ? "pointer" : "default",
      }}
    >
      {children}
    </div>
  );
};

export default BackgroundAdWrapper;

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { trackAdClick } from "@/actions/categories/advertisementService";

export interface SingleAd {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  buttonText: string;
}

interface AdvertisementProps {
  ads: SingleAd[];
}

const AdvertisementComponent: React.FC<AdvertisementProps> = ({ ads }) => {
  const [imgLoading, setImgLoading] = useState(true);

  const handleAdClick = (adId: string, link: string) => {
    trackAdClick(adId).catch(console.error);
    const formattedLink = link.startsWith("http") ? link : `https://${link}`;
    window.open(formattedLink, "_blank", "noopener,noreferrer");
  };

  if (!ads.length) return null;

  return (
    <div className="flex flex-col gap-4 w-full h-full max-w-[300px]">
      {ads.map((ad) => (
        <div
          key={ad.id}
          onClick={() => handleAdClick(ad.id, ad.link)}
          className="bg-white rounded-lg overflow-hidden border border-gray-200 cursor-pointer transition-all hover:shadow-lg flex flex-col h-[600px]"
        >
          <div className="relative w-full h-[350px] bg-gray-100">
            <Image
              src={ad.imageUrl}
              alt={ad.title}
              fill
              className={`object-cover transition-opacity duration-500 ${
                imgLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoadingComplete={() => setImgLoading(false)}
              priority
            />
          </div>
          <div className="p-4 flex flex-col flex-grow justify-between">
            <div>
              <h2 className="text-sm font-bold text-gray-900 uppercase truncate">
                {ad.title}
              </h2>
              <p className="text-xs text-gray-500 mt-2 line-clamp-4">
                {ad.description}
              </p>
            </div>
            <div className="mt-4 text-[10px] bg-blue-600 text-white py-3 rounded font-bold text-center uppercase">
              {ad.buttonText || "Learn More"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdvertisementComponent;

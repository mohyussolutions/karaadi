"use client";

import React from "react";
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
  const handleAdClick = (adId: string, link: string) => {
    trackAdClick(adId).catch(console.error);
    const formattedLink = link.startsWith("http") ? link : `https://${link}`;
    window.open(formattedLink, "_blank", "noopener,noreferrer");
  };

  if (!ads.length) return null;

  return (
    <div className="flex flex-col gap-4 w-full px-1 py-4 h-full">
      {ads.map((ad) => (
        <div
          key={ad.id}
          onClick={() => handleAdClick(ad.id, ad.link)}
          className="bg-white rounded-lg overflow-hidden border border-gray-200 cursor-pointer transition hover:shadow-md flex flex-col h-full min-h-[500px]"
        >
          <div className="relative w-full aspect-[4/5] min-h-[250px]">
            <Image
              src={ad.imageUrl}
              alt={ad.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 300px"
              priority
            />
          </div>
          <div className="p-4 flex flex-col flex-grow justify-between bg-white">
            <div>
              <h2 className="text-base font-black text-gray-900 leading-tight mb-2 uppercase">
                {ad.title}
              </h2>
              <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                {ad.description}
              </p>
            </div>
            <div className="mt-4 text-[10px] bg-blue-600 text-white px-4 py-3 rounded-md text-center font-black uppercase tracking-widest">
              {ad.buttonText || "Learn More"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdvertisementComponent;

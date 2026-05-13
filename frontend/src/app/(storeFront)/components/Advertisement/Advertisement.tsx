"use client";

import React, { useState, useCallback } from "react";
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

function AdCard({ ad }: { ad: SingleAd }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  const href = ad.link.startsWith("http") ? ad.link : `https://${ad.link}`;

  const handleClick = useCallback(() => {
    trackAdClick(ad.id).catch(() => {});
  }, [ad.id]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="block bg-white rounded-lg overflow-hidden border border-gray-200 cursor-pointer transition-shadow hover:shadow-lg flex flex-col h-[600px] no-underline"
    >
      <div className="relative w-full h-[350px] bg-gray-100">
        <div
          className={`absolute inset-0 bg-gray-200 animate-pulse transition-opacity duration-300 ${
            imgLoaded ? "opacity-0" : "opacity-100"
          }`}
        />
        <Image
          src={ad.imageUrl}
          alt={ad.title}
          fill
          className={`object-cover transition-opacity duration-500 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImgLoaded(true)}
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
    </a>
  );
}

const AdvertisementComponent: React.FC<AdvertisementProps> = ({ ads }) => {
  if (!ads.length) return null;
  return (
    <div className="flex flex-col gap-4 w-full max-w-[260px]">
      {ads.map((ad) => (
        <AdCard key={ad.id} ad={ad} />
      ))}
    </div>
  );
};

export default AdvertisementComponent;

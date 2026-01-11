"use client";

import React, { useEffect, useState } from "react";
import {
  getAdvertisements,
  trackAdClick,
} from "@/actions/categories/advertisementService";

interface SingleAd {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  buttonText: string;
}

const AdvertisementComponent: React.FC<{
  position?: string;
  limit?: number;
  ads?: SingleAd[];
}> = ({ position, limit = 1, ads: staticAds }) => {
  const [ads, setAds] = useState<SingleAd[]>([]);
  const [loading, setLoading] = useState(!staticAds);

  useEffect(() => {
    if (staticAds) {
      setAds(staticAds);
      return;
    }
    const fetchAds = async () => {
      try {
        const data = await getAdvertisements(position, limit);
        setAds(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, [position, limit, staticAds]);

  const handleAdClick = async (adId: string, link: string) => {
    try {
      await trackAdClick(adId);
    } catch (error) {
      console.error(error);
    }
    window.open(link, "_blank");
  };

  if (loading)
    return (
      <div className="w-full h-[600px] bg-white/10 animate-pulse rounded-lg" />
    );
  if (!ads.length) return null;

  return (
    <div className="flex flex-col gap-4 w-full px-1 py-4 h-full">
      {ads.map((ad) => (
        <div
          key={ad.id}
          onClick={() => handleAdClick(ad.id, ad.link)}
          className="bg-white rounded-lg overflow-hidden border border-gray-200 cursor-pointer transition hover:shadow-md flex flex-col h-full min-h-[500px]"
        >
          <div className="relative w-full h-1/2 min-h-[250px]">
            <img
              src={ad.imageUrl}
              alt={ad.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4 flex flex-col flex-grow justify-between bg-white">
            <div>
              <h2 className="text-base font-black text-gray-900 leading-tight mb-2 uppercase">
                {ad.title}
              </h2>
              <p className="text-xs text-gray-600 leading-relaxed overflow-hidden">
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

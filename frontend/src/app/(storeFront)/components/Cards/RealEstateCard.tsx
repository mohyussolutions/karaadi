"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AiOutlineHeart } from "react-icons/ai";

interface RealEstateCardProps {
  id?: string;
  title: string;
  price: number;
  city: string;
  region?: string;
  purpose?: string;
  area?: string;
  rooms?: number;
  images?: string[];
  description?: string | string[];
  maGaday?: boolean;
}

const getValidSrc = (src?: string | null): string => {
  if (!src) return "";
  if (
    src.startsWith("data:") ||
    src.startsWith("http") ||
    src.startsWith("/")
  ) {
    return src;
  }
  return `/${src}`;
};

export default function RealEstateCard({
  id,
  title,
  price,
  city,
  region,
  purpose,
  area,
  rooms,
  images,
  description,
  maGaday,
}: RealEstateCardProps) {
  const [imgError, setImgError] = useState(false);
  const placeholder = "not-found-image";
  const primaryImage = getValidSrc(images?.[0]);
  const url = id ? `/real-estate/${id}` : null;

  const truncateDescription = (desc?: string | string[]) => {
    if (!desc) return "";
    let text = Array.isArray(desc) ? desc.join(" ") : desc;
    return text.length <= 80 ? text : text.substring(0, 80) + "...";
  };

  return (
    <div className="group border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
      <Link
        href={url || "#"}
        className={`flex flex-col h-full ${!url && "cursor-default"}`}
      >
        <div className="relative w-full h-48 overflow-hidden bg-gray-100">
          <Image
            src={imgError || !primaryImage ? placeholder : primaryImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />

          <div className="absolute top-2 right-2 z-10">
            <button className="bg-white/80 backdrop-blur-sm p-2 rounded-full text-gray-600 hover:text-red-500 transition-colors">
              <AiOutlineHeart size={18} />
            </button>
          </div>

          {purpose && (
            <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-md shadow-sm">
              {purpose}
            </span>
          )}
        </div>

        <div className="p-4 flex flex-col flex-grow">
          {maGaday && (
            <span className="text-[10px] font-bold text-orange-600 uppercase bg-orange-50 px-2 py-0.5 rounded border border-orange-100 w-fit mb-2">
              Waa la gatay
            </span>
          )}

          <h3 className="font-bold text-gray-900 text-base line-clamp-1 mb-1">
            {title}
          </h3>

          <p className="text-xs text-gray-500 line-clamp-2 mb-3 h-8">
            {truncateDescription(description)}
          </p>

          <div className="mt-auto">
            <div className="flex items-center gap-1 text-green-700 text-xs font-medium mb-1">
              <span className="truncate">
                {city}
                {region ? `, ${region}` : ""}
              </span>
            </div>

            <div className="flex justify-between items-end">
              <span className="text-lg font-black text-blue-600">
                ${price?.toLocaleString()}
              </span>
              <div className="flex gap-2 text-[10px] text-gray-400">
                {area && <span>{area} m²</span>}
                {rooms && <span>{rooms} Qol</span>}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

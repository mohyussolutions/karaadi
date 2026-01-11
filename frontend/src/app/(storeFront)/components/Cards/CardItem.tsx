"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AiOutlineHeart } from "react-icons/ai";

interface CardItemProps {
  id: string;
  title: string;
  description?: string | string[];
  city?: string;
  price?: number;
  images?: string[] | null;
  jobType?: string;
  maGaday?: boolean;
}

const getValidSrc = (src?: string | null): string | null => {
  if (!src || src.trim() === "" || src === "undefined") return null;
  if (src.startsWith("http")) return src;
  if (src.startsWith("/")) return src;
  return `/${src}`;
};

export default function CardItem({
  id,
  title,
  description,
  city,
  price,
  images,
  maGaday,
}: CardItemProps) {
  const [imgError, setImgError] = useState(false);
  const primaryImage = getValidSrc(images?.[0]);
  const url = `/item-details/${id}`;
  const MAX_LENGTH = 70;

  const getTruncatedDescription = () => {
    if (!description) return null;
    const descText = Array.isArray(description)
      ? description[0] || ""
      : description;
    return descText.length <= MAX_LENGTH
      ? descText
      : `${descText.substring(0, MAX_LENGTH)}...`;
  };

  const truncatedDescription = getTruncatedDescription();

  return (
    <div className="border border-gray-200 rounded-lg shadow-sm flex flex-col overflow-hidden bg-white h-full transition-shadow hover:shadow-md">
      <Link prefetch={false} href={url} className="block flex flex-col h-full">
        <div className="relative w-full h-44 overflow-hidden border-b border-gray-200 bg-gray-50">
          {primaryImage && !imgError ? (
            <Image
              src={primaryImage}
              alt={title || "Listing image"}
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1224px) 100vw, 53vw"
              className="object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gray-400 text-xs">Sawir lama helin</span>
            </div>
          )}

          <div className="absolute top-2 right-2 rounded-full p-1.5 bg-white/90 backdrop-blur-[1px] z-10 shadow-sm transition-transform hover:scale-110">
            <AiOutlineHeart className="text-gray-600 w-5 h-5 transition-colors hover:text-red-500" />
          </div>
        </div>

        <div className="flex-grow flex flex-col p-3">
          {maGaday === true && (
            <div className="bg-orange-100 rounded px-2 py-1 mb-2 w-fit">
              <h6 className="text-xs md:text-sm m-0 font-bold text-orange-800">
                waa la gatay
              </h6>
            </div>
          )}

          <h3 className="text-base font-semibold mb-1 line-clamp-2 leading-snug text-gray-900">
            {title}
          </h3>

          <div className="flex justify-between items-center mb-2">
            {price !== undefined && price !== null ? (
              <span className="font-bold text-blue-800 text-lg">
                {price.toLocaleString()} kr
              </span>
            ) : (
              <span className="font-semibold text-gray-500 text-sm">
                Pris på forespørsel
              </span>
            )}
          </div>

          {city && (
            <p className="text-green-700 font-medium text-sm mb-1">{city}</p>
          )}

          {truncatedDescription && (
            <p className="text-gray-600 text-xs mb-1 line-clamp-2">
              {truncatedDescription}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}

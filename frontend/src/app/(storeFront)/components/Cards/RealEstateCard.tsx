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
  purpose?: "iib" | "kiro" | "ganacsi";
  area?: string;
  rooms?: number;
  images?: string[];
  description?: string | string[];
  maGaday?: boolean;
}

const getValidSrc = (src?: string | null): string | null => {
  if (!src || src.length === 0) return null;
  if (!src.startsWith("http") && !src.startsWith("/")) {
    return `/${src}`;
  }
  return src;
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
  const rawPrimaryImage = images?.[0];
  const primaryImage = getValidSrc(rawPrimaryImage);
  const [imgError, setImgError] = useState(false);
  const url = id ? `/real-estate/${id}` : null;

  const getPurposeDisplay = (purpose?: string) => {
    if (!purpose) return "";

    switch (purpose.toLowerCase()) {
      case "iib":
      case "for sale":
        return "For Sale";
      case "kiro":
      case "for rent":
        return "For Rent";
      case "ganacsi":
        return "Ganacsi";
      default:
        return purpose;
    }
  };

  const truncateDescription = (desc?: string | string[]) => {
    if (!desc) return "";

    let text = "";
    if (Array.isArray(desc)) {
      text = desc.join(" ");
    } else {
      text = desc;
    }

    if (text.length <= 100) return text;
    return text.substring(0, 100) + "...";
  };

  const purposeDisplay = getPurposeDisplay(purpose);
  const truncatedDescription = truncateDescription(description);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm transition-shadow duration-300">
      {url ? (
        <Link prefetch={false} href={url} className="block">
          <div className="relative w-full h-44 sm:h-52 md:h-64 lg:h-60 group overflow-hidden border-b-2 border-gray-300">
            {primaryImage ? (
              <Image
                src={imgError ? "/logo.jpg" : primaryImage}
                alt={title || "Real Estate Listing Image"}
                fill
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-300"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
                No Image
              </div>
            )}

            <div className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md cursor-pointer hover:scale-110 transition">
              <AiOutlineHeart
                className="text-gray-600 hover:text-red-500"
                size={20}
              />
            </div>

            {purposeDisplay && (
              <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {purposeDisplay}
              </span>
            )}
          </div>
          <div className="flex-grow flex flex-col p-3">
            {maGaday === true && (
              <div className="bg-[oklch(92%_0.3_91.605)] rounded px-2 py-1 mb-2 w-fit">
                <h6 className="text-xs md:text-sm m-0 font-medium text-gray-900">
                  waa la gatay
                </h6>
              </div>
            )}

            <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>

            {truncatedDescription && (
              <p className="text-sm text-gray-600 font-normal mt-1 mb-2 line-clamp-2">
                {truncatedDescription}
              </p>
            )}

            <p className="text-gray-500 text-sm font-normal">
              {city && (
                <span className="text-green-600 font-semibold">{city}</span>
              )}
              {region && city && !city.includes(region) && (
                <span className="text-green-600 font-semibold">{`, ${region}`}</span>
              )}
              {region && !city && (
                <span className="text-green-600 font-semibold">{region}</span>
              )}
            </p>

            <p className="text-xl font-bold text-blue-600 mt-2">
              ${price.toLocaleString()}
            </p>

            <div className="flex justify-between text-sm text-gray-500 font-normal mt-2">
              {area && <span>{area} m²</span>}
              {rooms && <span>{rooms} rooms</span>}
            </div>
          </div>
        </Link>
      ) : (
        <div className="block cursor-not-allowed">
          <div className="relative w-full h-44 sm:h-52 md:h-64 lg:h-60 group overflow-hidden border-b-2 border-gray-300">
            {primaryImage ? (
              <Image
                src={imgError ? "/logo.jpg" : primaryImage}
                alt={title || "Real Estate Listing Image"}
                fill
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
                No Image
              </div>
            )}
            {purposeDisplay && (
              <span className="absolute top-3 left-3 bg-gray-400 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {purposeDisplay}
              </span>
            )}
          </div>
          <div className="flex-grow flex flex-col p-3">
            <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>
            {truncatedDescription && (
              <p className="text-sm text-gray-600 font-normal mt-1 mb-2 line-clamp-2">
                {truncatedDescription}
              </p>
            )}
            <p className="text-gray-500 text-sm font-normal">
              <span>{city}</span>
              {region && city && !city.includes(region) && (
                <span className="text-green-600 font-semibold">{`, ${region}`}</span>
              )}
              {region && !city && (
                <span className="text-green-600 font-semibold">{region}</span>
              )}
            </p>
            <p className="text-xl font-bold text-blue-600 mt-2">
              ${price.toLocaleString()}
            </p>
            <div className="flex justify-between text-sm text-gray-500 font-normal mt-2">
              {area && <span>{area} m²</span>}
              {rooms && <span>{rooms} rooms</span>}
            </div>
            <span className="mt-2 text-xs text-gray-500">ID unavailable</span>
          </div>
        </div>
      )}
    </div>
  );
}

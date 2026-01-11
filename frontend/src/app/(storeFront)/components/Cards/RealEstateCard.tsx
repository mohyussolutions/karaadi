"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { AiOutlineHeart } from "react-icons/ai";

interface RealEstateCardProps {
  id: string;
  title: string;
  price: number;
  city: string;
  region?: string;
  purpose?: "iib" | "kiro" | "ganacsi"; // Keep the original types
  area?: string;
  rooms?: number;
  images?: string[];
  description?: string | string[];
  maGaday?: boolean; // Add this prop
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
  maGaday, // Add this prop
}: RealEstateCardProps) {
  const rawPrimaryImage = images?.[0];
  const primaryImage = getValidSrc(rawPrimaryImage);
  const url = `/real-estate/${id}`;

  // Helper function to translate purpose values
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

  const purposeDisplay = getPurposeDisplay(purpose);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm transition-shadow duration-300">
      <Link prefetch={false} href={url} className="block">
        <div className="relative w-full h-44 sm:h-52 md:h-64 lg:h-60 group overflow-hidden border-b-2 border-gray-300">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={title || "Real Estate Listing Image"}
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300"
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
              <h6 className="text-xs md:text-sm m-0 font-bold text-gray-900">
                waa la gatay
              </h6>
            </div>
          )}

          <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>
          <p className="text-gray-500 text-sm">
            {city}
            {region && `, ${region}`}
          </p>

          <p className="text-xl font-bold text-blue-600">
            ${price.toLocaleString()}
          </p>

          <div className="flex justify-between text-sm text-gray-500 mt-2">
            {area && <span>{area} m²</span>}
            {rooms && <span>{rooms} rooms</span>}
          </div>
        </div>
      </Link>
    </div>
  );
}

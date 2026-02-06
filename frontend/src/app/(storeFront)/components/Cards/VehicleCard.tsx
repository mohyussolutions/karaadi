"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AiOutlineHeart } from "react-icons/ai";

interface VehicleCardProps {
  id: string | null;
  title: string;
  price: number;
  city: string;
  images?: string[];
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  description?: string[];
}

const getValidSrc = (src?: string | null): string | null => {
  if (!src || src.length === 0) return null;
  if (!src.startsWith("http") && !src.startsWith("/")) {
    return `/${src}`;
  }
  return src;
};

export default function VehicleCard({
  id,
  title,
  price,
  city,
  images,
  make,
  model,
  year,
  mileage,
  description,
}: VehicleCardProps) {
  const rawPrimaryImage = images?.[0];
  const primaryImage = getValidSrc(rawPrimaryImage);
  const [imgError, setImgError] = useState(false);
  const url = id ? `/vehicles/${id}` : "#";

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm transition-shadow hover:shadow-md flex flex-col h-full">
      <Link href={url} className="block flex-grow">
        <div className="relative w-full h-36 group overflow-hidden border-b border-gray-200">
          {primaryImage ? (
            <Image
              src={imgError ? "/logo.jpg" : primaryImage}
              alt={title}
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
              No Image
            </div>
          )}

          <div className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md cursor-pointer hover:scale-110 transition">
            <AiOutlineHeart
              className="text-gray-600 hover:text-red-500"
              size={20}
            />
          </div>
        </div>

        <div className="p-3 space-y-1">
          <p className="text-green-700 font-medium text-xs uppercase tracking-wide">
            {city}
          </p>

          <h3 className="text-sm font-semibold line-clamp-1 leading-snug">
            {make} {model} {title} {year ? `(${year})` : ""}
          </h3>

          {description && description.length > 0 && (
            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mt-1">
              {description.join(" ")}
            </p>
          )}

          <p className="text-lg font-bold text-blue-800 pt-1">
            {price.toLocaleString()} kr
          </p>

          <div className="flex justify-start text-[10px] uppercase font-bold text-gray-400 pt-2 space-x-3 border-t border-gray-50 mt-2">
            {mileage !== undefined && mileage !== null && (
              <span>{mileage.toLocaleString()} km</span>
            )}
            {year && <span>{year}</span>}
          </div>
        </div>
      </Link>
    </div>
  );
}

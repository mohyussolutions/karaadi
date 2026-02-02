"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { AiOutlineHeart } from "react-icons/ai";

interface VehicleCardProps {
  id: string;
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
}: VehicleCardProps) {
  const rawPrimaryImage = images?.[0];
  const primaryImage = getValidSrc(rawPrimaryImage);
  const url = `/vehicle-details/${id}`;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link href={url} className="block">
        <div className="relative w-full h-36 group overflow-hidden border-b border-gray-200">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={title}
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
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
          <p className="text-green-700 font-medium text-sm">{city}</p>

          <h3 className="text-base font-semibold line-clamp-2 leading-snug">
            {make} {model} {year ? `(${year})` : ""}
          </h3>

          <p className="text-lg font-bold text-blue-800">
            {price.toLocaleString()} kr
          </p>

          <div className="flex justify-start text-xs text-gray-500 pt-1 space-x-3">
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

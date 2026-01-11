"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { AiOutlineHeart } from "react-icons/ai";

interface VehicleCardProps {
  id: string | null;
  title: string;
  price: number;
  city: string;
  images?: string[] | File[];
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  description?: string[];
  maGaday?: boolean; // Add this prop
}

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
  maGaday,
}: VehicleCardProps) {
  const getImageSrc = () => {
    if (!images || images.length === 0) return null;
    const first = images[0];
    if (typeof first === "string") return first;
    if (first instanceof File) return URL.createObjectURL(first);
    return null;
  };

  const imageSrc = getImageSrc();

  return (
    <div className="border border-gray-200 rounded-lg transition-shadow bg-white overflow-hidden">
      <Link prefetch={false} href={`/vehicles/${id}`} className="block">
        <div className="relative w-full h-44 sm:h-52 md:h-64 lg:h-60 group overflow-hidden border-b-2 border-gray-300">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={title || "Vehicle image"}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No Image</span>
            </div>
          )}
          <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow hover:scale-110 transition">
            <AiOutlineHeart className="text-gray-600 hover:text-red-500" />
          </div>
        </div>

        <div className="flex-grow flex flex-col p-3">
          {maGaday === true && (
            <div className="bg-[oklch(92%_0.3_91.605)] rounded px-2 py-1 mb-2 w-fit">
              <h6 className="text-xs md:text-sm m-0 font-bold text-gray-900">
                waa la gatay
              </h6>
            </div>
          )}

          <span className="block text-blue-600 font-bold text-lg mb-1">
            ${price.toLocaleString()}
          </span>
          <h3 className="text-md font-semibold mb-2 line-clamp-1">{title}</h3>

          <div className="text-sm text-gray-600 mb-3">
            {make && <span>{make} </span>}
            {model && <span>{model} </span>}
            {year && <span>• {year}</span>}
          </div>

          {mileage !== undefined && (
            <p className="text-sm text-gray-500">Mileage: {mileage} km</p>
          )}

          {description && description.length > 0 && (
            <ul className="text-sm text-gray-700 mb-3 list-disc list-inside max-h-20 overflow-auto">
              {description.map((desc, index) => (
                <p key={index}>{desc.slice(0, 50)}</p>
              ))}
            </ul>
          )}

          <div className="text-green-700 font-medium text-sm mt-3">{city}</div>
        </div>
      </Link>
    </div>
  );
}

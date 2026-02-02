"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { AiOutlineHeart } from "react-icons/ai";

const BASE_URL = "http://localhost:8080";

interface UniversalCardProps {
  id: string;
  title: string;
  price: number;
  city: string;
  images: string[];
  category: string;
  maGaday?: boolean;
  description?: string;
  make?: string;
  year?: number;
  rooms?: number;
  area?: string;
}

export default function UniversalCard(item: UniversalCardProps) {
  const getDetailUrl = () => {
    switch (item.category) {
      case "cars":
      case "boats":
      case "motorcycles":
      case "tractors":
        return `/vehicles/${item.id}`;
      case "real-estate":
        return `/real-estate/${item.id}`;
      case "jobs":
        return `/jobs/${item.id}`;
      default:
        return `/item-details/${item.id}`;
    }
  };

  const getSafeImagePath = () => {
    const img = item.images?.[0];

    if (
      !img ||
      typeof img !== "string" ||
      img.trim() === "" ||
      img === "undefined"
    ) {
      return "/placeholder.png"; // Ensure this exists in your public folder
    }

    if (img.startsWith("http")) {
      return img;
    }

    // If it's a relative path like "uploads/image.jpg", add the base URL
    return `${BASE_URL}/${img.startsWith("/") ? img.slice(1) : img}`;
  };

  const imageSrc = getSafeImagePath();

  return (
    <div className="group border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      <Link
        href={getDetailUrl()}
        className="relative h-52 w-full overflow-hidden block bg-gray-50"
      >
        <Image
          src={imageSrc}
          alt={item.title || "Listing Image"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // Backup if the URL is valid but the image file is missing on server
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.png";
          }}
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm z-10">
          <AiOutlineHeart className="text-gray-600 hover:text-red-500 transition-colors" />
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        {item.maGaday && (
          <div className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase mb-2 w-fit">
            waa la gatay
          </div>
        )}

        <h3 className="text-blue-800 font-bold text-lg mb-1">
          {item.price?.toLocaleString()}{" "}
          {item.category === "marketplace" ? "kr" : "$"}
        </h3>

        <h4 className="text-gray-800 text-sm font-semibold line-clamp-2 mb-2 min-h-[40px]">
          {item.title}
        </h4>

        <div className="flex flex-wrap gap-2 text-[11px] text-gray-500 mb-3">
          {item.make && (
            <span className="bg-gray-100 px-2 py-1 rounded">{item.make}</span>
          )}
          {item.year && (
            <span className="bg-gray-100 px-2 py-1 rounded">{item.year}</span>
          )}
          {item.rooms && (
            <span className="bg-gray-100 px-2 py-1 rounded">
              {item.rooms} Rms
            </span>
          )}
          {item.area && (
            <span className="bg-gray-100 px-2 py-1 rounded">
              {item.area} m²
            </span>
          )}
        </div>

        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
          <span className="text-green-700 font-medium">{item.city}</span>
          <span className="text-gray-400 capitalize">{item.category}</span>
        </div>
      </div>
    </div>
  );
}

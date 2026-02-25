"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AiOutlineHeart } from "react-icons/ai";

interface UniversalCardProps {
  id: string | number;
  title: string;
  price: number;
  city: string;
  images: string[];
  category: any;
  description?: string;
  maGaday?: boolean;
  make?: string;
  year?: number;
  rooms?: number;
  area?: string;
  priority?: boolean;
}

const ROUTE_MAP: Record<string, string> = {
  cars: "vehicles",
  boats: "vehicles",
  motorcycles: "vehicles",
  farmequipment: "vehicles",
  vehicle: "vehicles",
  "real-estate": "real-estate",
  property: "real-estate",
  jobs: "jobs",
  careers: "jobs",
  marketplace: "item-details",
  "item-details": "item-details",
  subscribetions: "subscriptions",
};

export default function UniversalCard(item: UniversalCardProps) {
  const [imgSrc, setImgSrc] = useState<string>("/placeholder.png");

  const detailUrl = useMemo(() => {
    let rawCategory = Array.isArray(item.category)
      ? item.category[0]
      : item.category;
    if (typeof rawCategory === "string") {
      rawCategory = rawCategory.trim().toLowerCase();
    } else {
      rawCategory = "";
    }
    const segment = ROUTE_MAP[rawCategory] || "item-details";
    // Debug log
    console.log(
      "UniversalCard category:",
      item.category,
      "mapped:",
      rawCategory,
      "segment:",
      segment,
    );
    return `/${segment}/${item.id}`;
  }, [item.category, item.id]);

  useEffect(() => {
    const rawImg = item.images?.[0];
    if (
      rawImg &&
      rawImg !== "undefined" &&
      rawImg.trim() !== "" &&
      !rawImg.includes("unsplo-")
    ) {
      setImgSrc(rawImg);
    }
  }, [item.images]);

  const displayCategory = Array.isArray(item.category)
    ? item.category[0]
    : item.category;

  return (
    <div className="group border border-gray-100 rounded-2xl overflow-hidden bg-white hover:shadow-xl transition-all duration-500 flex flex-col h-full">
      <Link
        href={detailUrl}
        className="relative h-56 w-full overflow-hidden block bg-gray-50"
      >
        <Image
          src={imgSrc}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          priority={item.priority}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          onError={() => setImgSrc("/placeholder.png")}
        />
        <div className="absolute top-3 right-3 z-10">
          <button className="bg-white/80 backdrop-blur-md p-2 rounded-full shadow-sm hover:bg-white transition-colors">
            <AiOutlineHeart
              className="text-gray-600 hover:text-red-500 transition-colors"
              size={18}
            />
          </button>
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-grow space-y-2">
        {item.maGaday && (
          <div className="bg-orange-50 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase w-fit">
            waa la gatay
          </div>
        )}

        <div className="flex items-baseline gap-1">
          <span className="text-blue-700 font-bold text-xl">
            {item.price?.toLocaleString()}
          </span>
          <span className="text-blue-700 font-semibold text-sm">
            {displayCategory === "marketplace" ? "kr" : "$"}
          </span>
        </div>

        <h3 className="text-gray-900 font-semibold text-sm line-clamp-1 group-hover:text-blue-700 transition-colors">
          {item.title}
        </h3>

        <p className="text-gray-500 text-xs line-clamp-2 h-8">
          {item.description || "No description available"}
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          <MetaBadge value={item.make} />
          <MetaBadge value={item.year} />
          <MetaBadge value={item.rooms} suffix=" Rms" />
          <MetaBadge value={item.area} suffix=" m²" />
        </div>

        <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
          <span className="text-emerald-600 font-semibold text-[11px] uppercase tracking-wider">
            {item.city}
          </span>
          <span className="text-gray-400 text-[10px] uppercase font-medium">
            {String(displayCategory)}
          </span>
        </div>
      </div>
    </div>
  );
}

function MetaBadge({
  value,
  suffix = "",
}: {
  value?: string | number;
  suffix?: string;
}) {
  if (!value) return null;
  return (
    <span className="bg-gray-50 text-gray-600 text-[10px] px-2 py-1 rounded-md font-medium">
      {value}
      {suffix}
    </span>
  );
}

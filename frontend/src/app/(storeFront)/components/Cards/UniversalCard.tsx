"use client";

import React, { useState, memo, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { AiOutlineHeart } from "react-icons/ai";
import { useGetRoute } from "../hooks/useGetRoute";

export interface UniversalCardProps {
  id: string | number;
  title?: string;
  price?: number;
  city?: string;
  images?: string[];
  description?: string | string[];
  maGaday?: boolean;
  make?: string;
  year?: string | number;
  model?: string;
  mileage?: number | string;
  area?: string;
  category?: string;
  priority?: boolean;
  renderBadges?: () => React.ReactNode;
  renderMeta?: () => React.ReactNode;
  renderFooter?: () => React.ReactNode;
  imageHeight?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

const PLACEHOLDER_IMAGE = "/placeholder.png";

const isValidUrl = (url: string): boolean => {
  if (!url || typeof url !== "string") return false;
  if (url.startsWith("/") || url.startsWith("./") || url.startsWith("../"))
    return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const UniversalCard = memo((props: UniversalCardProps) => {
  const {
    id,
    title = "Untitled",
    price,
    city,
    images,
    description,
    maGaday,
    category = "marketplace",
    priority = false,
    renderBadges,
    renderMeta,
    renderFooter,
    imageHeight = "h-64 md:h-56",
    children,
  } = props;

  const [imgError, setImgError] = useState(false);
  const routePath = useGetRoute({ category });
  const href = id ? `${routePath}/${id}` : "#";

  const validFirstImage = images?.find(isValidUrl);
  const imgSrc =
    imgError || !validFirstImage ? PLACEHOLDER_IMAGE : validFirstImage;
  const displayDescription = Array.isArray(description)
    ? description.join(" ")
    : description || "";

  const CardContent = (
    <>
      <div
        className={`relative w-full ${imageHeight} overflow-hidden bg-gray-100 rounded-2xl`}
      >
        <Image
          src={imgSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={priority}
          className="object-cover"
          onError={() => setImgError(true)}
          loading={priority ? "eager" : "lazy"}
          unoptimized={imgSrc.startsWith("/") ? false : true}
        />

        <div className="absolute top-3 right-3 z-10">
          <button
            type="button"
            className="bg-white/90 p-2.5 rounded-full shadow-sm hover:bg-white transition-colors"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <AiOutlineHeart className="text-gray-900" size={22} />
          </button>
        </div>

        {renderBadges?.() ||
          (maGaday && (
            <span className="absolute top-3 left-3 bg-orange-700 text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wide shadow-md">
              waa la gatay
            </span>
          ))}
      </div>

      <div className="py-3 px-1 flex flex-col flex-grow space-y-2">
        {price !== undefined && (
          <div className="flex items-center w-fit">
            <div className="bg-blue-50 text-blue-800 font-black px-2.5 py-1 rounded-lg flex items-baseline gap-1 border border-blue-100">
              <span className="text-xl md:text-lg">
                {price.toLocaleString()}
              </span>
              <span className="text-[10px] uppercase">
                {category === "marketplace" ? "kr" : "$"}
              </span>
            </div>
          </div>
        )}

        <h3 className="text-black font-black text-base md:text-sm line-clamp-1 leading-tight tracking-tight">
          {title}
        </h3>

        {displayDescription && (
          <p className="text-gray-800 text-sm md:text-xs font-bold line-clamp-2 leading-snug">
            {displayDescription}
          </p>
        )}

        {renderMeta?.()}

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
          {renderFooter ? (
            renderFooter()
          ) : (
            <>
              <span className="bg-emerald-50 text-emerald-800 font-black text-[11px] md:text-[10px] px-2.5 py-1 rounded-md uppercase tracking-widest border border-emerald-100">
                {city || "Lama yaqaan"}
              </span>
              <span className="bg-gray-100 text-gray-900 text-[11px] md:text-[10px] px-2.5 py-1 rounded-md uppercase font-black tracking-tighter border border-gray-200">
                {category}
              </span>
            </>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="bg-white flex flex-col h-full w-full md:max-w-[320px] rounded-2xl p-1 hover:shadow-lg transition-shadow duration-200">
      {children ? (
        <div className="relative block flex-grow cursor-pointer">
          {CardContent}
          {children}
        </div>
      ) : (
        <Link href={href} className="relative block flex-grow">
          {CardContent}
        </Link>
      )}
    </div>
  );
});

UniversalCard.displayName = "UniversalCard";
export default UniversalCard;

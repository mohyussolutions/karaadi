"use client";

import React, { useState, useMemo, memo } from "react";
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
  category?: string;
  priority?: boolean;
  renderBadges?: () => React.ReactNode;
  renderMeta?: () => React.ReactNode;
  renderFooter?: () => React.ReactNode;
  imageHeight?: string;
  children?: React.ReactNode;

  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  area?: string;
  rooms?: number;
  company?: string;
  location?: string;
  employmentType?: string;
}

const UniversalCard = memo(
  ({
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
    imageHeight = "h-56",
    children,
  }: UniversalCardProps) => {
    const [imgSrc, setImgSrc] = useState<string>(
      images?.[0] || "/placeholder.png",
    );

    const routePath = useGetRoute({ category });
    const href = id ? `${routePath}/${id}` : "#";

    const displayDescription = useMemo(() => {
      if (!description) return "";
      return Array.isArray(description) ? description.join(" ") : description;
    }, [description]);

    const CardBody = (
      <>
        <div
          className={`relative w-full ${imageHeight} overflow-hidden bg-gray-50`}
        >
          <Image
            src={imgSrc}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgSrc("/placeholder.png")}
          />

          <div className="absolute top-3 right-3 z-10">
            <button
              className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <AiOutlineHeart
                className="text-gray-600 hover:text-red-500"
                size={18}
              />
            </button>
          </div>

          {renderBadges
            ? renderBadges()
            : maGaday && (
                <span className="absolute top-3 left-3 bg-orange-50 text-orange-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                  waa la gatay
                </span>
              )}
        </div>

        <div className="p-4 flex flex-col flex-grow space-y-2">
          {price !== undefined && (
            <div className="flex items-baseline gap-1 text-blue-700 font-bold">
              <span className="text-xl">{price.toLocaleString()}</span>
              <span className="text-sm">
                {category === "marketplace" ? "kr" : "$"}
              </span>
            </div>
          )}

          <h3 className="text-gray-900 font-semibold text-sm line-clamp-1 group-hover:text-blue-700 transition-colors">
            {title}
          </h3>

          {displayDescription && (
            <p className="text-gray-500 text-xs line-clamp-2 h-8 leading-relaxed">
              {displayDescription}
            </p>
          )}

          {renderMeta && renderMeta()}

          <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
            {renderFooter ? (
              renderFooter()
            ) : (
              <>
                <span className="text-emerald-600 font-bold text-[11px] uppercase tracking-wider">
                  {city || "Somalia"}
                </span>
                <span className="text-gray-400 text-[10px] uppercase font-bold">
                  {category}
                </span>
              </>
            )}
          </div>
        </div>
      </>
    );

    return (
      <div className="group border border-gray-100 rounded-2xl overflow-hidden bg-white hover:shadow-xl transition-all duration-300 flex flex-col h-full">
        {children ? (
          <div className="relative block flex-grow cursor-pointer">
            {CardBody}
            {children}
          </div>
        ) : (
          <Link href={href} className="relative block flex-grow">
            {CardBody}
          </Link>
        )}
      </div>
    );
  },
);

UniversalCard.displayName = "UniversalCard";
export default UniversalCard;

"use client";

import Link from "next/link";
import { getDetailRoute } from "@/app/utils/getDetailRoute";
import Image from "next/image";
import { useState } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { UniversalCardProps } from "@/app/utils/types/universalCard.types";
import { formatPrice, getValidImageUrl, truncateText } from "./cardUtils";

const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNlNWU3ZWIiLz48L3N2Zz4=";

type Props =
  | { item: UniversalCardProps; priority?: boolean }
  | (UniversalCardProps & { item?: never; priority?: boolean });

export default function UniversalCard(props: Props) {
  const priority = props.priority ?? false;
  const data: UniversalCardProps =
    "item" in props && props.item ? props.item : (props as UniversalCardProps);

  if (!data) return null;

  const { title = "", price, city = "", images, description = "", category = "", maGaday, type, sellerName, linkHref, href } = data;

  const detailRoute = (linkHref || href || getDetailRoute(data)) as string;
  const allUrls = (images ?? []).filter(Boolean);
  const [imgIndex, setImgIndex] = useState(0);
  const currentUrl = allUrls[imgIndex] ? getValidImageUrl(allUrls[imgIndex]) : null;
  const showImage = currentUrl !== null && imgIndex < allUrls.length;

  const handleImgError = () => {
    if (imgIndex + 1 < allUrls.length) {
      setImgIndex((i) => i + 1);
    } else {
      setImgIndex(allUrls.length);
    }
  };

  return (
    <Link href={detailRoute} className="block h-full no-underline">
      <div className="relative flex flex-col h-full bg-white border border-[#E8E8E8] rounded-xl hover:shadow-md transition-shadow duration-200 overflow-hidden">

        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
          {showImage ? (
            currentUrl!.startsWith("data:") ? (
              <img
                src={currentUrl!}
                alt={title}
                className="w-full h-full object-cover"
                onError={handleImgError}
              />
            ) : (
              <Image
                src={currentUrl!}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={priority}
                loading={priority ? "eager" : "lazy"}
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                onError={handleImgError}
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-3 text-center">
                {category}
              </span>
            </div>
          )}

          {maGaday && (
            <div className="absolute top-2 left-2 z-20 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
              SOLD
            </div>
          )}

          <div className="absolute top-2 right-2 z-20 p-1 bg-white/80 rounded-full">
            <AiOutlineHeart size={18} className="text-gray-400" />
          </div>
        </div>

        <div className="p-2 sm:p-2.5 flex flex-col flex-grow">
          <h3 className="text-xs sm:text-[13px] md:text-sm font-semibold text-[#1A1A1A] line-clamp-2 min-h-[32px] sm:min-h-[36px] leading-tight">
            {title}
          </h3>
          {sellerName && (
            <p className="text-[10px] sm:text-[11px] text-indigo-600 font-semibold mt-0.5 truncate">
              {sellerName}
            </p>
          )}
          <p className="text-[11px] sm:text-[12px] text-gray-800 mt-1 line-clamp-2 leading-snug">
            {truncateText(description || "")}
          </p>
          {type && (
            <div className="mt-1 sm:mt-1.5 inline-block w-fit bg-gray-100 text-gray-600 text-[9px] sm:text-[10px] uppercase font-bold tracking-tight px-1 sm:px-1.5 py-0.5 rounded">
              {type}
            </div>
          )}
          <div className="flex items-center justify-between mt-auto border-t border-[#E8E8E8] pt-1.5 sm:pt-2 mt-2">
            <p className="text-sm sm:text-[15px] md:text-base font-bold text-[#1A1A1A]">
              {price ? `$${formatPrice(price)}` : ""}
            </p>
            {city && (
              <span className="text-[10px] sm:text-[11px] md:text-xs text-[#555555]">
                {city}
              </span>
            )}
          </div>
        </div>

      </div>
    </Link>
  );
}

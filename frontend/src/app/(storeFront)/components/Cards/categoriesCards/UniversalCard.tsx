"use client";

import Link from "next/link";
import { getDetailRoute } from "@/app/utils/getDetailRoute";
import Image from "next/image";
import { useState } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { UniversalCardProps } from "@/app/utils/types/universalCard.types";
import { formatPrice, getValidImageUrl, truncateText } from "./cardUtils";
import { getPriorityBadge } from "@/actions/config/priority.config";

type Props =
  | { item: UniversalCardProps }
  | (UniversalCardProps & { item?: never });

export default function UniversalCard(props: Props) {
  const data: UniversalCardProps =
    "item" in props && props.item ? props.item : (props as UniversalCardProps);

  if (!data) return null;

  const {
    title = "",
    price,
    city = "",
    images,
    description = "",
    category = "",
    maGaday,
    isBasic30,
    isStandard60,
    isPremium90,
    type,
  } = data;

  const detailRoute = getDetailRoute(data);
  const priorityBadge = getPriorityBadge(isPremium90, isStandard60, isBasic30);

  const allUrls = (images ?? []).filter(Boolean);
  const [imgIndex, setImgIndex] = useState(0);
  const currentUrl = allUrls[imgIndex]
    ? getValidImageUrl(allUrls[imgIndex])
    : null;

  const handleImgError = () => {
    if (imgIndex + 1 < allUrls.length) {
      setImgIndex((i) => i + 1);
    } else {
      setImgIndex(allUrls.length);
    }
  };

  const showImage = currentUrl !== null && imgIndex < allUrls.length;

  return (
    <Link href={detailRoute} className="block h-full no-underline">
      <div className="relative flex flex-col h-full bg-white border border-[#E8E8E8] rounded-xl hover:shadow-md transition-shadow duration-200 overflow-hidden">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          {showImage ? (
            <Image
              src={currentUrl!}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={handleImgError}
            />
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

          {/*

          {!maGaday && priorityBadge && (
            <div
              className={`absolute top-2 left-2 z-20 ${priorityBadge.color} text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm`}
            >
              {priorityBadge.label}
            </div>
          )}
           */}

          <div className="absolute bottom-2 right-2 z-20 bg-black/60 text-white text-[11px] font-medium px-1.5 py-0.5 rounded capitalize">
            {category}
          </div>
          <div className="absolute top-2 right-2 z-20 p-1 bg-white/80 rounded-full">
            <AiOutlineHeart size={18} className="text-gray-400" />
          </div>
        </div>

        <div className="p-2.5 flex flex-col flex-grow">
          <h3 className="text-[13px] sm:text-sm font-semibold text-[#1A1A1A] line-clamp-2 min-h-[36px] leading-tight">
            {title}
          </h3>
          <p className="text-[12px] text-gray-500 mt-1 line-clamp-2 leading-snug">
            {truncateText(description || "")}
          </p>
          {type && (
            <div className="mt-1.5 inline-block w-fit bg-gray-100 text-gray-600 text-[10px] uppercase font-bold tracking-tight px-1.5 py-0.5 rounded">
              {type}
            </div>
          )}
          <div className="flex items-center justify-between mt-auto border-t border-[#E8E8E8] pt-2 mt-2">
            <p className="text-[15px] sm:text-base font-bold text-[#1A1A1A]">
              {price ? `$${formatPrice(price)}` : ""}
            </p>
            {city && (
              <span className="text-[11px] sm:text-xs text-[#555555]">
                {city}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

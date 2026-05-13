"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { FaHome, FaCar, FaShoppingBag, FaBriefcase } from "react-icons/fa";
import { RecommendationItem } from "@/app/utils/types/recommendation";
import { fetchRecommendations, trackItemView } from "@/actions/categories/RecommendationActions";
import { SEARCH_HISTORY_ENDPOINTS } from "@/actions/constant/constant";
import { useGetRoute } from "../hooks/useGetRoute";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function resolveImage(images: unknown): string | null {
  const arr = Array.isArray(images) ? images : [];
  const raw = arr.find((u) => typeof u === "string" && u.trim() !== "");
  if (!raw) return null;
  if (raw.startsWith("http") || raw.startsWith("/") || raw.startsWith("data:") || raw.startsWith("blob:")) return raw;
  return `${API_BASE}/${raw}`;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "real-estate": FaHome, realestate: FaHome,
  vehicles: FaCar, car: FaCar, cars: FaCar,
  motorcycle: FaCar, motorcycles: FaCar,
  boat: FaCar, boats: FaCar,
  farmequipment: FaCar, traktor: FaCar,
  job: FaBriefcase, jobs: FaBriefcase,
  marketplace: FaShoppingBag, default: FaShoppingBag,
};

interface RecommendationsProps {
  userId?: string;
  limit?: number;
  excludeId?: string;
  category?: string;
}

function RecommendationCard({ item, onClick }: { item: RecommendationItem; onClick: () => void }) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const image = resolveImage(item.images ?? item.image);
  const Icon = CATEGORY_ICONS[item.category?.toLowerCase()] ?? CATEGORY_ICONS.default;
  const price = Number(item.price);
  const hasImage = !!image && !imgError;
  const loading = hasImage && !imgLoaded;

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-blue-100 transition-all cursor-pointer"
    >
      <div className="relative h-44 bg-gray-100 overflow-hidden">
        {loading && <div className="absolute inset-0 z-10 bg-gray-200 animate-pulse" />}
        {hasImage ? (
          <Image
            src={image!}
            alt={item.title || ""}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImgError(true)}
            onLoad={() => setImgLoaded(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Icon size={32} className="text-gray-300" />
          </div>
        )}
        {!loading && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-600 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg">
            {item.category}
          </span>
        )}
      </div>

      {loading ? (
        <div className="p-4 flex flex-col gap-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
          <div className="h-3 bg-gray-100 rounded animate-pulse w-full" />
          <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3" />
          <div className="mt-2 pt-2 border-t border-gray-50 flex justify-between">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
            <div className="h-3 bg-gray-100 rounded animate-pulse w-1/6" />
          </div>
        </div>
      ) : (
        <div className="p-4 space-y-2">
          <h3 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {item.title}
          </h3>
          {item.description && (
            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{item.description}</p>
          )}
          <div className="flex items-center justify-between pt-2 border-t border-gray-50">
            <span className="text-base font-black text-blue-700">
              {isNaN(price) || price === 0 ? "—" : `$${price.toLocaleString()}`}
            </span>
            <span className="text-xs font-bold text-blue-500 group-hover:underline">View →</span>
          </div>
        </div>
      )}
    </div>
  );
}

async function fetchRecentSearchCategory(userId?: string): Promise<string | null> {
  try {
    if (!userId) return null;
    const res = await fetch(`${SEARCH_HISTORY_ENDPOINTS.BASE}?userId=${userId}&limit=1`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return (Array.isArray(data) ? data[0] : null)?.query ?? null;
  } catch {
    return null;
  }
}

export default function Recommendations({ userId, limit = 6, excludeId, category }: RecommendationsProps) {
  const [items, setItems] = useState<RecommendationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastSearch, setLastSearch] = useState<string | null>(null);
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { t } = useTranslation();
  const { getRoute } = useGetRoute();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { rootMargin: "300px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      const [searchQuery, data] = await Promise.all([
        fetchRecentSearchCategory(userId),
        fetchRecommendations(userId, limit, excludeId, category || undefined).catch(() => [] as RecommendationItem[]),
      ]);
      if (cancelled) return;
      setLastSearch(searchQuery);
      setItems(data);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [inView, userId, limit, excludeId, category]);

  const handleClick = async (item: RecommendationItem) => {
    try {
      if (userId) await trackItemView(item.externalId, item.category, userId);
    } catch {}
    const route = getRoute((item.source as string | undefined) || item.category);
    router.push(`${route}/${item.externalId}`);
  };

  return (
    <div ref={containerRef} className="mt-12 border-t border-gray-100 pt-10 px-2">
      {loading ? (
        <>
          <div className="h-6 bg-gray-100 rounded w-48 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-50 rounded w-64 mb-8 animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl h-56 animate-pulse" />
            ))}
          </div>
        </>
      ) : items.length > 0 ? (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-black text-gray-900">Recommended for You</h2>
            <p className="text-sm text-gray-400 font-medium mt-0.5 flex items-center gap-2">
              {lastSearch && !category ? (
                <>
                  Based on your last search:
                  <span className="bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-lg text-xs">
                    &ldquo;{lastSearch}&rdquo;
                  </span>
                </>
              ) : userId ? (
                "Recommended based on your interests"
              ) : (
                "Popular items you might like"
              )}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <RecommendationCard key={item.id} item={item} onClick={() => handleClick(item)} />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

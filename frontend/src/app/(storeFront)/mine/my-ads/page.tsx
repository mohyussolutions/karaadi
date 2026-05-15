"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { deleteAd } from "@/actions/core/my-adsAction";
import { getCategoryRoute } from "../../components/hooks/useGetRoute";
import Image from "next/image";
import Pagination from "@/app/(storeFront)/components/shared/Pagination";
import { useTranslation } from "react-i18next";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";
import { BASE_API_URL as API } from "@/actions/constant/BASE_API_URL";
import Loading from "@/app/ui/loading/Loading";
import type { AdView } from "@/app/utils/types/common.types";
import { MY_ADS_PAGE_SIZE } from "../consts";

export default function MyAdsPage() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [ads, setAds] = useState<AdView[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [visibleCount, setVisibleCount] = useState(MY_ADS_PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  const fetchAds = useCallback(async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API}/api/ads/my-ads`, {
        credentials: "include",
        cache: "no-store",
        headers: headers as HeadersInit,
      });
      if (!res.ok) { setAds([]); return; }
      const raw = await res.json();
      const list = (Array.isArray(raw) ? raw : raw?.data ?? []).map((a: any) => ({
        id: String(a.id ?? a._id ?? ""),
        title: String(a.title ?? ""),
        description: String(a.description ?? ""),
        price: Number(a.price ?? 0),
        maGaday: !!a.maGaday,
        isPaid: !!a.isPaid,
        image: String(a.images?.[0] ?? a.image ?? ""),
        type: String(a.type ?? "marketplace"),
      }));
      setAds(list);
    } catch {
      setAds([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAds(); }, [fetchAds]);

  const handleDelete = useCallback(async (adId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(t("mine.myAds.deleteConfirm", "Are you sure you want to delete this ad?"))) return;
    if (await deleteAd(adId)) setAds((prev) => prev.filter((ad) => ad.id !== adId));
  }, [t]);

  const handleLoadMore = useCallback(() => {
    setLoadingMore(true);
    setTimeout(() => { setVisibleCount((p) => p + MY_ADS_PAGE_SIZE); setLoadingMore(false); }, 300);
  }, []);

  if (!mounted || loading) return <Loading />;

  if (ads.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t("mine.myAds.title", "My Ads")}</h1>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{t("mine.myAds.empty", "You haven't created any ads yet.")}</p>
          <button onClick={() => router.push("/new-ad")} className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
            {t("mine.myAds.createFirst", "Create Your First Ad")}
          </button>
        </div>
      </div>
    );
  }

  const visibleAds = ads.slice(0, visibleCount);
  const hasMore = ads.length > visibleCount;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t("mine.myAds.title", "My Ads")}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleAds.map((ad) => (
          <div
            key={ad.id}
            onClick={() => router.push(`/${getCategoryRoute(ad.type)}/${ad.id}`)}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md flex flex-col group transition-all bg-white cursor-pointer"
          >
            {ad.image && (
              <Image
                src={ad.image}
                alt={ad.title}
                width={400}
                height={240}
                className="w-full h-48 object-cover rounded mb-4 group-hover:opacity-90 transition"
                loading="lazy"
              />
            )}
            <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition">{ad.title}</h3>
            <div className="mb-2">
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{ad.type}</span>
            </div>
            {ad.maGaday && (
              <div className="mb-3">
                <span className="bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-lg text-sm">
                  {t("mine.myAds.sold", "✓ Sold")}
                </span>
              </div>
            )}
            <p className="text-gray-600 mb-2 text-sm line-clamp-2">{ad.description}</p>
            <p className="text-lg font-bold text-green-600 mb-4">${ad.price}</p>
            <div className="flex space-x-2 mt-auto pt-4" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/mine/edit/${ad.id}`); }}
                className="flex-1 bg-gray-100 text-blue-600 font-semibold px-4 py-2 rounded text-sm hover:bg-blue-50 transition"
              >
                {t("mine.myAds.edit", "Edit")}
              </button>
              <button
                onClick={(e) => handleDelete(ad.id, e)}
                className="flex-1 bg-gray-100 text-red-600 font-semibold px-4 py-2 rounded text-sm hover:bg-red-50 transition"
              >
                {t("mine.myAds.delete", "Delete")}
              </button>
            </div>
          </div>
        ))}
      </div>
      <Pagination hasMore={hasMore} loading={loadingMore} onSeeMore={handleLoadMore} />
    </div>
  );
}

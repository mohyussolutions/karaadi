"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { deleteAd } from "@/actions/core/my-adsAction";
import { getCategoryRoute } from "../../components/hooks/useGetRoute";
import { useTranslation } from "react-i18next";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";
import { BASE_API_URL as API } from "@/actions/constant/BASE_API_URL";
import Loading from "@/app/ui/loading/Loading";
import type { AdView } from "@/app/utils/types/common.types";
import { MY_ADS_PAGE_SIZE } from "../consts";
import { FiEdit2, FiTrash2, FiPlus, FiImage } from "react-icons/fi";

export default function MyAdsPage() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [ads, setAds] = useState<AdView[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [visibleCount, setVisibleCount] = useState(MY_ADS_PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
        image: a.images?.[0] || a.image || "",
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
    e.stopPropagation();
    if (!window.confirm(t("mine.myAds.deleteConfirm", "Delete this ad?"))) return;
    setDeletingId(adId);
    if (await deleteAd(adId)) setAds((prev) => prev.filter((ad) => ad.id !== adId));
    setDeletingId(null);
  }, [t]);

  const handleLoadMore = useCallback(() => {
    setLoadingMore(true);
    setTimeout(() => { setVisibleCount((p) => p + MY_ADS_PAGE_SIZE); setLoadingMore(false); }, 300);
  }, []);

  if (!mounted || loading) return <Loading />;

  const visibleAds = ads.slice(0, visibleCount);
  const hasMore = ads.length > visibleCount;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-extrabold text-gray-900">
          {t("mine.myAds.title", "My Ads")}
          {ads.length > 0 && (
            <span className="ml-2 text-sm font-semibold text-gray-400">({ads.length})</span>
          )}
        </h1>
        <button
          onClick={() => router.push("/new-ad")}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition active:scale-95 touch-manipulation"
        >
          <FiPlus size={15} />
          {t("mine.myAds.newAd", "New Ad")}
        </button>
      </div>

      {ads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <FiImage size={28} className="text-gray-300" />
          </div>
          <p className="text-gray-500 font-semibold mb-1">
            {t("mine.myAds.empty", "No ads yet")}
          </p>
          <p className="text-sm text-gray-400 mb-5">
            {t("mine.myAds.emptyHint", "Create your first listing and start selling")}
          </p>
          <button
            onClick={() => router.push("/new-ad")}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition active:scale-95 touch-manipulation"
          >
            {t("mine.myAds.createFirst", "Create Your First Ad")}
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleAds.map((ad) => (
              <div
                key={ad.id}
                onClick={() => router.push(`/${getCategoryRoute(ad.type)}/${ad.id}`)}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden cursor-pointer active:scale-[0.98] transition-all touch-manipulation group"
              >
                {/* Image */}
                <div className="w-full h-44 bg-gray-100 relative overflow-hidden">
                  {ad.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ad.image}
                      alt={ad.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  <div className={`absolute inset-0 flex items-center justify-center ${ad.image ? "hidden" : ""}`}>
                    <FiImage size={32} className="text-gray-300" />
                  </div>

                  {/* Status badges */}
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    {ad.maGaday && (
                      <span className="px-2 py-0.5 bg-yellow-400 text-gray-900 text-[10px] font-extrabold rounded-full uppercase tracking-wide">
                        {t("mine.myAds.sold", "Sold")}
                      </span>
                    )}
                    {ad.isPaid && !ad.maGaday && (
                      <span className="px-2 py-0.5 bg-green-500 text-white text-[10px] font-extrabold rounded-full uppercase tracking-wide">
                        {t("mine.myAds.active", "Active")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="font-bold text-gray-900 text-sm leading-snug line-clamp-1 mb-1">
                    {ad.title || t("mine.myAds.untitled", "Untitled")}
                  </p>
                  <p className="text-xs text-gray-400 line-clamp-2 mb-3 leading-relaxed">
                    {ad.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-extrabold text-gray-900">
                      ${ad.price.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-gray-400 capitalize bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                      {ad.type}
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div
                    className="flex gap-2 mt-3 pt-3 border-t border-gray-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); router.push(`/mine/edit/${ad.id}`); }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-50 hover:bg-blue-50 text-blue-600 text-xs font-bold rounded-xl transition active:scale-95 touch-manipulation"
                    >
                      <FiEdit2 size={13} />
                      {t("mine.myAds.edit", "Edit")}
                    </button>
                    <button
                      onClick={(e) => handleDelete(ad.id, e)}
                      disabled={deletingId === ad.id}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-50 hover:bg-red-50 text-red-500 text-xs font-bold rounded-xl transition active:scale-95 touch-manipulation disabled:opacity-50"
                    >
                      <FiTrash2 size={13} />
                      {deletingId === ad.id ? "…" : t("mine.myAds.delete", "Delete")}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-8 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold text-sm rounded-xl hover:bg-gray-50 transition disabled:opacity-50 touch-manipulation"
              >
                {loadingMore ? "Loading…" : t("mine.myAds.loadMore", "Load more")}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { deleteAd, getMyAds, payToRelist } from "@/actions/core/my-adsAction";
import { getCategoryRoute } from "../../components/hooks/useGetRoute";
import Image from "next/image";
import Pagination from "@/app/(storeFront)/components/shared/Pagination";

const PAGE_SIZE = 12;

type AdView = {
  id: string;
  image: string;
  title: string;
  type: string;
  description: string;
  price: number;
  isPaid: boolean;
  maGaday: boolean;
};

export default function MyAdsClient({ initialAds }: { initialAds: AdView[] }) {
  const { t } = useTranslation();
  const [ads, setAds] = useState<AdView[]>(initialAds);
  const router = useRouter();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);

  const visibleAds = ads.slice(0, visibleCount);
  const hasMore = ads.length > visibleCount;

  const handleLoadMore = useCallback(() => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + PAGE_SIZE);
      setLoadingMore(false);
    }, 300);
  }, []);

  const handleDeleteAd = useCallback(
    (adId: string) => async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (
        !window.confirm(
          t(
            "mine.myAds.deleteConfirm",
            "Are you sure you want to delete this ad?",
          ),
        )
      )
        return;
      try {
        if (await deleteAd(adId))
          setAds((prev) => prev.filter((ad) => ad.id !== adId));
      } catch {
        alert(t("mine.myAds.deleteFailed", "Delete ad failed."));
      }
    },
    [t],
  );

  const handleUpdateAd = useCallback(
    (adId: string) => (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      router.push(`/mine/edit/${adId}`);
    },
    [router],
  );

  const handlePayToRelist = useCallback(
    async (adId: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (
        !window.confirm(
          t("mine.myAds.relistConfirm", "Pay $5 to relist this item?"),
        )
      )
        return;
      try {
        if (await payToRelist(adId)) {
          alert(
            t(
              "mine.myAds.paymentSuccess",
              "Payment successful! Your ad is now active.",
            ),
          );
          setAds((await getMyAds()) as unknown as AdView[]);
        }
      } catch {
        alert(
          t("mine.myAds.paymentFailed", "Payment failed. Please try again."),
        );
      }
    },
    [t],
  );

  const handleViewAd = useCallback(
    (ad: AdView) => (e: React.MouseEvent) => {
      e.preventDefault();
      router.push(`/${getCategoryRoute(ad.type)}/${ad.id}`);
    },
    [router],
  );

  if (ads.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          {t("mine.myAds.empty", "You haven't created any ads yet.")}
        </p>
        <button
          onClick={() => router.push("/new-ad")}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          {t("mine.myAds.createFirst", "Create Your First Ad")}
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleAds.map((ad) => {
          const isSold = ad.maGaday === true;
          const needsPayment = !ad.isPaid && !isSold;

          return (
            <div
              key={ad.id}
              onClick={handleViewAd(ad)}
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
              <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition">
                {ad.title}
              </h3>

              <div className="mb-2">
                <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                  {ad.type}
                </span>
              </div>

              {isSold && (
                <div className="mb-3">
                  <div className="bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-lg shadow-md text-sm w-fit">
                    {t("mine.myAds.sold", "✓ Waa La Gaday (Sold)")}
                  </div>
                </div>
              )}

              {needsPayment && (
                <div className="mb-3">
                  <div className="bg-red-500 text-white font-bold px-4 py-2 rounded-lg shadow-md text-sm w-fit">
                    {t("mine.myAds.payToRelist", "💳 Pay to Relist")}
                  </div>
                </div>
              )}

              <p className="text-gray-600 mb-2 text-sm line-clamp-2">
                {ad.description}
              </p>
              <p className="text-lg font-bold text-green-600 mb-4">
                ${ad.price}
              </p>

              <div
                className="flex space-x-2 mt-auto pt-4"
                onClick={(e) => e.stopPropagation()}
              >
                {needsPayment ? (
                  <button
                    onClick={(e) => handlePayToRelist(ad.id, e)}
                    className="flex-1 bg-green-500 text-white font-semibold px-4 py-2 rounded text-sm hover:bg-green-600 transition"
                  >
                    {t("mine.myAds.payNow", "Pay Now $5")}
                  </button>
                ) : (
                  <button
                    onClick={handleUpdateAd(ad.id)}
                    className="flex-1 bg-gray-100 text-blue-600 font-semibold px-4 py-2 rounded text-sm hover:bg-blue-50 transition"
                  >
                    {t("mine.myAds.edit", "Edit")}
                  </button>
                )}
                <button
                  onClick={(e) => handleDeleteAd(ad.id)(e)}
                  className="flex-1 bg-gray-100 text-red-600 font-semibold px-4 py-2 rounded text-sm hover:bg-red-50 transition"
                >
                  {t("mine.myAds.delete", "Delete")}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <Pagination
        hasMore={hasMore}
        loading={loadingMore}
        onSeeMore={handleLoadMore}
      />
    </>
  );
}

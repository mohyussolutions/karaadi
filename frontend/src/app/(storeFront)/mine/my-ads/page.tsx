"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Loading from "../../components/shared/Loading/Loading";
import { deleteAd, getMyAds, payToRelist } from "@/actions/core/my-adsAction";
import { useGetRoute } from "../../components/hooks/useGetRoute";

function MyAds() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      try {
        const userAds = await getMyAds();
        setAds(userAds);
      } catch (err: any) {
        if (err.message.includes("Unauthorized")) router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, [router]);

  const handleDeleteAd = (adId: string) => async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this ad?")) return;

    try {
      const success = await deleteAd(adId);
      if (success) {
        setAds((prev) => prev.filter((ad) => ad.id !== adId));
      }
    } catch {
      alert("Delete ad failed.");
    }
  };

  const handleUpdateAd = (adId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/mine/edit/${adId}`);
  };

  const handlePayToRelist = async (adId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm("Pay $5 to relist this item?")) return;

    try {
      const success = await payToRelist(adId);
      if (success) {
        alert("Payment successful! Your ad is now active.");
        const userAds = await getMyAds();
        setAds(userAds);
      }
    } catch {
      alert("Payment failed. Please try again.");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Ads</h1>
      {ads.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            You haven't created any ads yet.
          </p>
          <button
            onClick={() => router.push("/new-ad")}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Create Your First Ad
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => {
            const routePrefix = useGetRoute(ad);
            const isSold = ad.maGaday === true;
            const needsPayment = isSold && !ad.isPaid; // Check if needs payment

            return (
              <Link
                key={ad.id}
                href={`/${routePrefix}/${ad.id}`}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md flex flex-col group transition-all bg-white"
              >
                {ad.image && (
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="w-full h-48 object-cover rounded mb-4 group-hover:opacity-90 transition"
                  />
                )}
                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition">
                  {ad.title}
                </h3>

                {isSold && (
                  <div className="mb-3">
                    <div className="bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-lg shadow-md text-sm w-fit">
                      ✓ Haa waan gaday
                    </div>
                  </div>
                )}

                {needsPayment && (
                  <div className="mb-3">
                    <div className="bg-red-500 text-white font-bold px-4 py-2 rounded-lg shadow-md text-sm w-fit">
                      💳 Pay to Relist
                    </div>
                  </div>
                )}

                <p className="text-gray-600 mb-2 text-sm line-clamp-2">
                  {ad.description}
                </p>
                <p className="text-lg font-bold text-green-600 mb-4">
                  ${ad.price}
                </p>

                <div className="flex space-x-2 mt-auto pt-4">
                  {needsPayment ? (
                    <button
                      onClick={(e) => handlePayToRelist(ad.id, e)}
                      className="flex-1 bg-green-500 text-white font-semibold px-4 py-2 rounded text-sm hover:bg-green-600 transition"
                    >
                      Pay Now $5
                    </button>
                  ) : (
                    <button
                      onClick={handleUpdateAd(ad.id)}
                      className="flex-1 bg-gray-100 text-blue-600 font-semibold px-4 py-2 rounded text-sm hover:bg-blue-50 transition"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={handleDeleteAd(ad.id)}
                    className="flex-1 bg-gray-100 text-red-600 font-semibold px-4 py-2 rounded text-sm hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyAds;

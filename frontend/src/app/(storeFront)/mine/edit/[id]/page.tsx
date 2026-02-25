"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMyAds, updateAd } from "@/actions/core/my-adsAction";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import { verifySession } from "@/actions/core/authAction";

const getCategoryType = (category: string): string => {
  const vehicleCategories = ["boat", "car", "motorcycle", "farmequipment"];
  const realEstateCategories = ["realEstate"];
  const itemCategories = ["marketplace", "job", "advertisement"];

  if (vehicleCategories.includes(category)) return "vehicle";
  if (realEstateCategories.includes(category)) return "real-estate";
  if (itemCategories.includes(category)) return "item-details";

  return "item-details";
};

interface IAd {
  id: string;
  maGaday: boolean;
  images: string[];
  title: string;
  description: string;
  price: number;
  type: string;
  user: any;
  category?: string;
}

export default function Edit() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [ad, setAd] = useState<IAd | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError(null);

      try {
        const session = await verifySession();
        if (!session) {
          return router.push("/login");
        }

        const ads = await getMyAds();
        const foundAd = ads.find((a: any) => {
          const adId = String(a.id || a._id || "");
          const paramId = String(id || "");
          return adId === paramId;
        });

        if (!foundAd) {
          setError(`Ad not found`);
          return;
        }

        const adData = {
          ...foundAd,
          id: foundAd.id || foundAd._id || "",
          category: foundAd.type || foundAd.category || "marketplace",
        };

        setAd(adData as IAd);
      } catch (err: any) {
        setError(err?.message || "Failed to load ad");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      init();
    } else {
      setError("No ad ID provided");
      setLoading(false);
    }
  }, [id, router]);

  const handleMagadayToggle = async () => {
    if (!ad) return;
    const newValue = !ad.maGaday;

    if (
      newValue &&
      !confirm("Magaday ads will be deleted after some hours. Proceed?")
    ) {
      return;
    }

    try {
      const session = await verifySession();
      if (!session) {
        router.push("/login");
        return;
      }

      const updateData = {
        title: ad.title,
        description: ad.description,
        price: ad.price,
        type: ad.type,
        maGaday: newValue,
      };

      const response = await updateAd(ad.id, updateData);

      setAd((prev) => (prev ? { ...prev, maGaday: response.maGaday } : null));
      alert(`Magaday is now ${newValue ? "enabled" : "disabled"}`);
    } catch (err: any) {
      alert(`Error: ${err.message || "Failed to update ad"}`);
    }
  };

  const handleViewAd = () => {
    if (!ad) return;
    const categoryType = getCategoryType(
      ad.category || ad.type || "marketplace",
    );
    router.push(`/item/${ad.id}?category=${categoryType}`);
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="container mx-auto max-w-md p-6 mt-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 font-medium">Error: {error}</p>
          <button
            onClick={() => router.push("/mine/my-ads")}
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            Back to My Ads
          </button>
        </div>
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="container mx-auto max-w-md p-6 mt-10">
        <p className="text-center text-gray-600">Ad not found!</p>
        <button
          onClick={() => router.push("/mine/my-ads")}
          className="mt-4 w-full px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        >
          Back to My Ads
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-md p-6 space-y-6 border rounded shadow mt-6">
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-bold">{ad.title}</h2>
        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
          Type: {ad.type || ad.category}
        </span>
      </div>

      <p className="text-gray-600">{ad.description}</p>
      <p className="text-lg font-bold text-green-600">${ad.price}</p>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <span className="font-medium">Magaday Mode</span>
        <button
          onClick={handleMagadayToggle}
          className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors ${
            ad.maGaday ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`h-6 w-6 transform rounded-full bg-white transition-transform ${
              ad.maGaday ? "translate-x-11" : "translate-x-2"
            }`}
          />
        </button>
      </div>

      <button
        onClick={handleViewAd}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        View Ad
      </button>

      {ad.images?.length > 0 && (
        <img
          src={ad.images[0]}
          alt=""
          className="w-full h-64 object-cover rounded"
        />
      )}
    </div>
  );
}

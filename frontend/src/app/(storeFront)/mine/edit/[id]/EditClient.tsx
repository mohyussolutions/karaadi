"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { updateAd } from "@/actions/core/my-adsAction";
import { getCategoryRoute } from "@/app/(storeFront)/components/hooks/useGetRoute";

interface IAd {
  id: string;
  maGaday: boolean;
  title: string;
  description: string;
  price: number;
  type: string;
  isPaid: boolean;
  image: string;
}

export default function EditClient({ ad: initialAd }: { ad: IAd }) {
  const router = useRouter();
  const [ad, setAd] = useState<IAd>(initialAd);

  const handleMagadayToggle = async () => {
    const newValue = !ad.maGaday;
    const msg = newValue
      ? "Mark this ad as sold (Waa La Gaday)? It will show as sold to buyers."
      : "Mark this ad as available again? It will be visible to buyers.";
    if (!confirm(msg)) return;

    try {
      const response = await updateAd(ad.id, {
        title: ad.title,
        description: ad.description,
        price: ad.price,
        maGaday: newValue,
      });
      setAd((prev) => ({ ...prev, maGaday: response.maGaday }));
      alert(
        newValue
          ? "Ad marked as sold (Waa La Gaday)"
          : "Ad marked as available",
      );
    } catch (err: any) {
      alert(`Error: ${err?.message || "Failed to update ad"}`);
    }
  };

  const handleViewAd = () => {
    router.push(`/${getCategoryRoute(ad.type)}/${ad.id}`);
  };

  return (
    <div className="container mx-auto max-w-md p-6 space-y-6 border rounded shadow mt-6 bg-white">
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-bold">{ad.title}</h2>
        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
          Type: {ad.type}
        </span>
      </div>

      <p className="text-gray-600">{ad.description}</p>
      <p className="text-lg font-bold text-green-600">${ad.price}</p>

      {ad.maGaday && (
        <div className="bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-lg shadow-md text-sm w-fit">
          ✓ Waa La Gaday (Sold)
        </div>
      )}

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <span className="font-medium">Waa La Gaday (Sold)</span>
          <p className="text-xs text-gray-500 mt-1">
            {ad.maGaday
              ? "This ad is marked as sold"
              : "Toggle to mark as sold"}
          </p>
        </div>
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

      {ad.image && (
        <Image
          src={ad.image}
          alt={ad.title}
          width={1200}
          height={512}
          className="w-full h-64 object-cover rounded"
          priority
        />
      )}
    </div>
  );
}

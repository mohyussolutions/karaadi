"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { BsHeartFill, BsTag, BsCalendar3, BsPerson } from "react-icons/bs";
import { FiArrowLeft, FiTrash2, FiExternalLink } from "react-icons/fi";
import {
  getFavoriteById,
  removeFavorite,
} from "@/actions/categories/favoriteAction";
import { FavoriteItem } from "@/app/utils/types/favorite";

const ROUTE_MAP: Record<string, string> = {
  cars: "vehicles",
  boats: "vehicles",
  motorcycles: "vehicles",
  farmequipment: "farmequipment",
  traktor: "farmequipment",
  tractor: "farmequipment",
  vehicle: "vehicles",
  "real-estate": "real-estate",
  property: "real-estate",
  jobs: "jobs",
  careers: "jobs",
  marketplace: "item-details",
  "item-details": "item-details",
};

const FavoriteDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [favorite, setFavorite] = useState<FavoriteItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorite = async () => {
      try {
        setLoading(true);
        if (!id) return;
        const data = await getFavoriteById(id);
        setFavorite(data);
      } catch (err: any) {
        setError(err.message || "Failed to load favorite");
      } finally {
        setLoading(false);
      }
    };
    fetchFavorite();
  }, [id]);

  const getCommonLink = (category: string, itemId: string) => {
    const cat = category.toLowerCase().trim();

    if (
      cat.includes("real") ||
      cat.includes("estate") ||
      cat.includes("property")
    ) {
      return `/real-estate/${itemId}`;
    }
    if (
      cat.includes("car") ||
      cat.includes("veh") ||
      cat.includes("boat") ||
      cat.includes("motor")
    ) {
      return `/vehicles/${itemId}`;
    }
    if (cat.includes("job") || cat.includes("career")) {
      return `/jobs/${itemId}`;
    }
    if (
      cat.includes("farm") ||
      cat.includes("traktor") ||
      cat.includes("tractor")
    ) {
      return `/vehicles/${itemId}`;
    }

    const segment = ROUTE_MAP[cat] || "item-details";
    return `/${segment}/${itemId}`;
  };

  const handleDelete = async () => {
    if (!confirm("Ma hubtaa inaad tirtirto alaabtan?")) return;
    try {
      setDeleting(true);
      await removeFavorite(id);
      router.push("/mine/favorites");
    } catch (err: any) {
      alert(err.message || "Cillad ayaa dhacday");
      setDeleting(false);
    }
  };

  if (loading) return <FavoriteSkeleton />;
  if (error)
    return (
      <div className="text-center mt-20 text-red-500 font-bold text-xl">
        {error}
      </div>
    );
  if (!favorite) return null;

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-10">
        <button
          onClick={() => router.back()}
          className="group flex items-center text-gray-400 hover:text-blue-600 transition-all mb-10"
        >
          <div className="p-3 rounded-full bg-gray-50 group-hover:bg-blue-50 mr-4 transition-colors">
            <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="font-bold tracking-tight uppercase text-sm">
            Back to Collection
          </span>
        </button>

        <div className="flex flex-col lg:flex-row gap-16">
          <div className="w-full lg:w-[55%] space-y-6">
            <div className="relative aspect-[4/5] md:aspect-square lg:aspect-[4/5] w-full bg-gray-50 rounded-[4rem] overflow-hidden border border-gray-100 shadow-2xl transition-transform hover:scale-[1.01] duration-500">
              {favorite.image ? (
                <Image
                  src={favorite.image}
                  alt={favorite.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <BsHeartFill className="w-24 h-24 text-gray-100" />
                </div>
              )}

              <div className="absolute top-10 left-10">
                <div className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-lg">
                  <BsTag className="text-blue-600 w-4 h-4" />
                  <span className="text-gray-900 text-xs font-black uppercase tracking-tighter">
                    {favorite.category || "General"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[45%] flex flex-col pt-4">
            <div className="flex-grow">
              <div className="inline-flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest mb-4">
                <span className="w-8 h-[2px] bg-blue-600"></span>
                Favorite Item
              </div>

              <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-[1.1] tracking-tighter mb-6">
                {favorite.title}
              </h1>

              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-4xl font-bold text-gray-900">
                  ${parseFloat(favorite.price || "0").toLocaleString()}
                </span>
                <span className="text-gray-400 font-medium italic">
                  Available now
                </span>
              </div>

              <p className="text-gray-500 text-xl leading-relaxed mb-10 font-medium">
                {favorite.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                <div className="p-6 rounded-[2.5rem] bg-gray-50 border border-gray-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <BsCalendar3 className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      Added On
                    </p>
                    <p className="text-gray-900 font-bold">
                      {new Date(favorite.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-[2.5rem] bg-gray-50 border border-gray-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl overflow-hidden shadow-sm relative">
                    {favorite.user?.profileImage ? (
                      <Image
                        src={favorite.user.profileImage}
                        alt="User"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-blue-600 font-bold uppercase">
                        <BsPerson />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      Seller
                    </p>
                    <p className="text-gray-900 font-bold">
                      {favorite.user?.username || "Verified Merchant"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  const path = favorite?.itemId
                    ? getCommonLink(favorite.category ?? "", favorite.itemId)
                    : "/";
                  router.push(path);
                }}
                className="group w-full bg-blue-600 text-white font-black py-6 rounded-[2rem] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 active:scale-[0.98] flex items-center justify-center gap-3"
              >
                <span>VISIT DETAILS</span>
                <FiExternalLink className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="w-full bg-white text-red-500 border-2 border-red-50 font-bold py-6 rounded-[2rem] hover:bg-red-50 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <FiTrash2 />
                {deleting ? "Tirtirayaa..." : "Remove from Favorites"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FavoriteSkeleton = () => (
  <div className="max-w-7xl mx-auto px-6 pt-24 animate-pulse">
    <div className="flex flex-col lg:flex-row gap-16">
      <div className="w-full lg:w-[55%] aspect-square bg-gray-100 rounded-[4rem]" />
      <div className="w-full lg:w-[45%] space-y-6">
        <div className="h-4 w-24 bg-gray-100 rounded-full" />
        <div className="h-16 w-full bg-gray-100 rounded-2xl" />
        <div className="h-16 w-3/4 bg-gray-100 rounded-2xl" />
        <div className="h-32 w-full bg-gray-50 rounded-[2.5rem]" />
        <div className="h-20 w-full bg-blue-50 rounded-[2rem]" />
      </div>
    </div>
  </div>
);

export default FavoriteDetailPage;

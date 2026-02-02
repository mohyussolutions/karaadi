"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { BsHeartFill } from "react-icons/bs";
import { FiArrowLeft } from "react-icons/fi";
import {
  getFavoriteById,
  removeFavorite,
} from "@/actions/categories/favoriteAction";
import { FavoriteItem } from "@/app/utils/types/favorite";

const FavoriteDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [favorite, setFavorite] = useState<FavoriteItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorite = async () => {
      try {
        if (!id) return;
        const data = await getFavoriteById(id);
        setFavorite(data);
      } catch (err: any) {
        setError(err.message || "Failed to load favorite");
      }
    };
    fetchFavorite();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Remove this item from favorites?")) return;

    try {
      setDeleting(true);
      await removeFavorite(id);
      router.push("/mine/favorites");
    } catch (err: any) {
      alert(err.message || "Failed to delete favorite");
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (error)
    return (
      <div className="text-center mt-20 text-red-500 font-medium">{error}</div>
    );
  if (!favorite) return null;

  return (
    <div className="container mx-auto p-6 mt-10 max-w-6xl">
      <button
        onClick={() => router.back()}
        className="group flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors font-medium"
      >
        <FiArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      {/* Row Container */}
      <div className="flex flex-col lg:flex-row gap-12 items-stretch">
        {/* Left Column: Image Area */}
        <div className="w-full lg:w-1/2">
          <div className="relative aspect-square w-full bg-gray-50 rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-md">
            {favorite.image ? (
              <Image
                src={favorite.image}
                alt={favorite.title}
                fill
                className="object-contain p-12 rounded-[3rem]" /* Applied rounding to image itself */
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <BsHeartFill className="w-20 h-20 text-gray-200" />
              </div>
            )}

            {favorite.category && (
              <div className="absolute top-8 left-8">
                <span className="px-5 py-2 bg-white/90 backdrop-blur-md border border-gray-100 text-gray-800 text-xs font-bold uppercase tracking-widest rounded-2xl shadow-sm">
                  {favorite.category}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Details Area */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between py-4">
          <div>
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                {favorite.title}
              </h1>
              {favorite.price && (
                <p className="text-3xl font-bold text-blue-600 mb-6">
                  ${parseFloat(favorite.price).toLocaleString()}
                </p>
              )}
              <div className="h-1 w-20 bg-gray-100 rounded-full mb-6" />
              <p className="text-gray-600 text-lg leading-relaxed max-w-prose">
                {favorite.description}
              </p>
            </div>

            <div className="space-y-4 mb-10 bg-gray-50/50 p-6 rounded-[2rem] border border-gray-50">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-400 font-medium">
                  Added to Collection
                </span>
                <span className="text-gray-900 font-semibold">
                  {formatDate(favorite.createdAt)}
                </span>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-blue-100 flex-shrink-0 border-2 border-white shadow-sm">
                  {favorite.user?.profileImage ? (
                    <Image
                      src={favorite.user.profileImage}
                      alt="User"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-blue-600 font-bold text-xl">
                      {favorite.user?.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                    Verified Seller
                  </p>
                  <p className="text-gray-900 font-bold text-lg">
                    {favorite.user?.username || "Merchant"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() =>
                favorite?.itemId
                  ? router.push(`/item-details/${favorite.itemId}`)
                  : router.push("/")
              }
              className="bg-gray-900 text-white font-bold py-5 rounded-[1.5rem] hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95"
            >
              Marketplace View
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-50 text-red-600 font-bold py-5 rounded-[1.5rem] hover:bg-red-100 transition-all active:scale-95 disabled:opacity-50"
            >
              {deleting ? "Removing..." : "Delete Favorite"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteDetailPage;

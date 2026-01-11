"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { BsHeartFill } from "react-icons/bs";
import { FiArrowLeft, FiTrash2 } from "react-icons/fi";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
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
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorite = async () => {
      try {
        if (!id) {
          setError("No favorite ID provided");
          return;
        }

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

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to remove this item from favorites?")) {
      return;
    }

    try {
      setDeleting(true);
      await removeFavorite(id);
      handleViewAllFavorites();
    } catch (err: any) {
      alert(err.message || "Failed to delete favorite");
    } finally {
      setDeleting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleViewAllFavorites = () => {
    router.push("/mine/favorites");
  };

  const handleBrowseMarketplace = () => {
    if (favorite?.itemId) {
      router.push(`/item-details/${favorite.itemId}`);
    } else {
      router.push("/");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const formatPrice = (price: string | null) => {
    if (!price) return "Not specified";
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? price : `$${numPrice.toLocaleString()}`;
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!favorite) return <p className="text-center mt-10">Favorite not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <FiArrowLeft className="w-4 h-4 mr-2" />
          Back to Favorites
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative h-64 md:h-80 w-full bg-gray-100">
          {favorite.image ? (
            <Image
              src={favorite.image}
              alt={favorite.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-100 to-gray-200">
              <BsHeartFill className="w-24 h-24 text-gray-400" />
            </div>
          )}

          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            {favorite.category && (
              <span className="px-3 py-1 bg-black/70 text-white text-sm rounded-full">
                {favorite.category}
              </span>
            )}
            {favorite.price && (
              <span className="px-3 py-1 bg-blue-600 text-white text-lg font-bold rounded-full">
                {formatPrice(favorite.price)}
              </span>
            )}
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {favorite.title}
              </h1>
              <p className="text-gray-600 text-base md:text-lg">
                {favorite.description}
              </p>
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                aria-label="Delete favorite"
              >
                {deleting ? (
                  <div className="w-5 h-5 border-2 border-red-300 border-t-red-600 rounded-full animate-spin"></div>
                ) : (
                  <FiTrash2 className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-3">
                Item Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">
                    {favorite.category || "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">
                    {formatPrice(favorite.price)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saved on:</span>
                  <span className="font-medium">
                    {formatDate(favorite.createdAt)}
                  </span>
                </div>
                {favorite.updatedAt !== favorite.createdAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last updated:</span>
                    <span className="font-medium">
                      {formatDate(favorite.updatedAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-3">Saved By</h3>
              <div className="flex items-center gap-3">
                {favorite.user?.profileImage ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={favorite.user.profileImage}
                      alt={favorite.user.username}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-blue-600">
                      {favorite.user?.username?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">
                    {favorite.user?.username || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {favorite.user?.email || "No email provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={handleViewAllFavorites}
              className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              View All Favorites
            </button>
            <button
              onClick={handleBrowseMarketplace}
              className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Browse Marketplace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteDetailPage;

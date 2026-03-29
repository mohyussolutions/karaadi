"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getMyFavorites,
  removeFavorite,
  addToFavorite,
} from "@/actions/categories/favoriteAction";
import { verifySession } from "@/actions/core/authAction";
import usePagination from "../../components/hooks/usePagination";
import Pagination from "@/app/ui/invoices/pagination";

const SaveFavorite = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    (async () => {
      try {
        const user = await verifySession();
        if (!user) return;
        const data = await getMyFavorites();
        setFavorites(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error(
          t("mine.favorites.errorLoading", "Failed to load favorites"),
        );
      }
    })();
  }, []);

  const {
    paginatedItems: paginatedFavorites,
    totalPages,
    isEmpty,
  } = usePagination(favorites, page, ITEMS_PER_PAGE);

  const handleSave = async (item: any) => {
    const res = await addToFavorite(item);

    if (res?.error) {
      if (res.status === 400) {
        toast.warning(res.error);
      } else {
        toast.error(res.error);
      }
      return;
    }

    toast.success(t("mine.favorites.saved", "Item saved to favorites!"));
    setFavorites((prev) => [res, ...prev]);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("mine.favorites.removeConfirm", "Remove this item?")))
      return;

    const previous = [...favorites];
    setFavorites((prev) => prev.filter((f) => f.id !== id));

    try {
      const res = await removeFavorite(id);
      if (res?.error) throw new Error(res.error);
      toast.info(t("mine.favorites.removed", "Removed from favorites"));
    } catch (error: any) {
      toast.error(
        error.message || t("mine.favorites.deleteError", "Error deleting item"),
      );
      setFavorites(previous);
    }
  };

  const isValidImageUrl = (url: string | null | undefined): boolean => {
    if (!url || typeof url !== "string") return false;
    return (
      url.startsWith("http") ||
      url.startsWith("/") ||
      url.startsWith("data:image")
    );
  };

  return (
    <div className="container mx-auto p-6 mt-10">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">
        {t("mine.favorites.title", "My Favorites")}
      </h2>

      {isEmpty ? (
        <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-lg">
            {t("mine.favorites.empty", "No favorites found yet.")}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {paginatedFavorites.map((fav) => (
              <div
                key={fav.id}
                className="flex flex-col bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-square w-full bg-gray-50 m-2 self-center overflow-hidden rounded-[1.8rem]">
                  {isValidImageUrl(fav.image) ? (
                    <Image
                      src={fav.image}
                      alt={
                        fav.title || t("mine.favorites.productAlt", "Product")
                      }
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 25vw"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm italic">
                      {t("mine.favorites.noImage", "No Image")}
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-900 text-lg truncate">
                      {fav.title || t("mine.favorites.untitled", "Untitled")}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mt-2 leading-relaxed">
                      {fav.description ||
                        t(
                          "mine.favorites.noDescription",
                          "No description available",
                        )}
                    </p>
                  </div>

                  <div className="mt-auto">
                    {fav.price && (
                      <p className="text-blue-700 font-extrabold text-xl mb-4">
                        {Number(fav.price).toLocaleString()} kr
                      </p>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/mine/favorites/${fav.id}`)}
                        className="flex-1 bg-gray-900 text-white text-sm font-bold py-3 rounded-2xl hover:bg-black transition-colors"
                      >
                        {t("mine.favorites.details", "Details")}
                      </button>
                      <button
                        onClick={() => handleDelete(fav.id)}
                        className="flex-1 bg-red-50 text-red-500 text-sm font-bold py-3 rounded-2xl hover:bg-red-100 transition-colors"
                      >
                        {t("mine.favorites.delete", "Delete")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};

export default SaveFavorite;

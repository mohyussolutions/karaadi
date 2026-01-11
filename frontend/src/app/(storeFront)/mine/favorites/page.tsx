"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import {
  getMyFavorites,
  removeFavorite,
} from "@/actions/categories/favoriteAction";
import { apiService } from "@/actions/core/authAction";

const SaveFavorite = () => {
  const router = useRouter();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const user = await apiService.verifySession();
        if (!user) return;
        const data = await getMyFavorites();
        setFavorites(data || []);
      } catch {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this item from favorites?")) return;
    try {
      await removeFavorite(id);
      setFavorites((prev) => prev.filter((f) => f.id !== id));
    } catch {
      alert("Error deleting item.");
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/mine/favorites/${id}`);
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6 max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">My Favorites</h2>

      {favorites.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No favorites yet</p>
      ) : (
        <ul className="space-y-4">
          {favorites.map((fav) => (
            <li
              key={fav.id}
              className="flex items-center gap-4 p-4 border rounded-xl hover:bg-gray-50"
            >
              <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                {fav.image && (
                  <Image
                    src={fav.image}
                    alt={fav.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-bold truncate">{fav.title}</p>
                <p className="text-gray-500 text-sm truncate">
                  {fav.description}
                </p>
                {fav.price && (
                  <p className="text-green-600 font-medium text-sm mt-1">
                    ${parseFloat(fav.price).toLocaleString()}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleEdit(fav.id)}
                  className="text-blue-500 hover:text-blue-700 text-sm px-3 py-1.5 rounded-lg hover:bg-blue-50 whitespace-nowrap"
                >
                  Details
                </button>

                <button
                  onClick={() => handleDelete(fav.id)}
                  className="text-red-500 hover:text-red-700 text-sm px-3 py-1.5 rounded-lg hover:bg-red-50 whitespace-nowrap"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SaveFavorite;

import { FavoriteItem } from "@/app/utils/types/favorite";
import { apiUrlsForFavorites } from "../constant/constant";

const handleResponse = async (res: Response) => {
  if (res.status === 401) throw new Error("Unauthorized");
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

export const getMyFavorites = async (): Promise<FavoriteItem[]> => {
  const res = await fetch(`${apiUrlsForFavorites.FAVORITES_BASE}/my`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return handleResponse(res);
};

export const addToFavorite = async (data: any) => {
  const res = await fetch(apiUrlsForFavorites.ADD_FAVORITE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include", // This sends the cookie
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const getFavorites = async (): Promise<FavoriteItem[]> => {
  const res = await fetch(apiUrlsForFavorites.FAVORITES_BASE, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return handleResponse(res);
};

export const getFavoriteById = async (id: string): Promise<FavoriteItem> => {
  const res = await fetch(apiUrlsForFavorites.GET_FAVORITE_BY_ID(id), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return handleResponse(res);
};

export const removeFavorite = async (id: string) => {
  const res = await fetch(apiUrlsForFavorites.DELETE_FAVORITE(id), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (res.status === 404) throw new Error("Not found");
  return handleResponse(res);
};

export const updateFavorite = async (id: string, data: any) => {
  const res = await fetch(apiUrlsForFavorites.UPDATE_FAVORITE(id), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

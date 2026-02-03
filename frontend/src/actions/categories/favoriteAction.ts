"use server";

import { cookies } from "next/headers";
import { FavoriteItem } from "@/app/utils/types/favorite";
import { apiUrlsForFavorites } from "../constant/constant";

const getHeaders = async () => {
  const cookieStore = await cookies();
  const idToken =
    cookieStore.get("idToken")?.value || cookieStore.get("accessToken")?.value;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (idToken) {
    headers["Authorization"] = `Bearer ${idToken}`;
    headers["Cookie"] = `idToken=${idToken}`;
  }

  return headers;
};

const handleResponse = async (res: Response) => {
  if (res.status === 401) throw new Error("Unauthorized");
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

export const getMyFavorites = async (): Promise<FavoriteItem[]> => {
  const res = await fetch(`${apiUrlsForFavorites.FAVORITES_BASE}/my`, {
    method: "GET",
    headers: await getHeaders(),
    cache: "no-store",
  });
  const data = await handleResponse(res);
  return Array.isArray(data) ? data : [];
};

export const addToFavorite = async (data: any) => {
  const res = await fetch(apiUrlsForFavorites.ADD_FAVORITE, {
    method: "POST",
    headers: await getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const getFavorites = async (): Promise<FavoriteItem[]> => {
  const res = await fetch(apiUrlsForFavorites.FAVORITES_BASE, {
    method: "GET",
    headers: await getHeaders(),
    cache: "no-store",
  });
  const data = await handleResponse(res);
  return Array.isArray(data) ? data : [];
};

export const getFavoriteById = async (id: string): Promise<FavoriteItem> => {
  const res = await fetch(apiUrlsForFavorites.GET_FAVORITE_BY_ID(id), {
    method: "GET",
    headers: await getHeaders(),
  });
  return handleResponse(res);
};

export const removeFavorite = async (id: string) => {
  const res = await fetch(apiUrlsForFavorites.DELETE_FAVORITE(id), {
    method: "DELETE",
    headers: await getHeaders(),
  });
  if (res.status === 404) throw new Error("Not found");
  return handleResponse(res);
};

export const updateFavorite = async (id: string, data: any) => {
  const res = await fetch(apiUrlsForFavorites.UPDATE_FAVORITE(id), {
    method: "PUT",
    headers: await getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

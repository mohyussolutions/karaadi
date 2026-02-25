"use server";

import { cookies } from "next/headers";
import { FavoriteItem } from "@/app/utils/types/favorite";
import { FAVORITE_ROUTES } from "../constant/constant";

const getHeaders = async () => {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("idToken")?.value || cookieStore.get("accessToken")?.value;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

const handleResponse = async (res: Response) => {
  if (res.status === 401) return null;
  if (!res.ok) return null;
  return await res.json();
};

export async function getMyFavorites(): Promise<FavoriteItem[]> {
  const res = await fetch(FAVORITE_ROUTES.MY_FAVORITES, {
    method: "GET",
    headers: await getHeaders(),
    cache: "no-store",
  });
  const data = await handleResponse(res);
  return Array.isArray(data) ? data : [];
}

export async function addToFavorite(data: any) {
  const res = await fetch(FAVORITE_ROUTES.BASE, {
    method: "POST",
    headers: await getHeaders(),
    body: JSON.stringify(data),
    cache: "no-store",
  });
  return await handleResponse(res);
}

export async function removeFavorite(id: string) {
  const res = await fetch(FAVORITE_ROUTES.BY_ID(id), {
    method: "DELETE",
    headers: await getHeaders(),
    cache: "no-store",
  });
  return await handleResponse(res);
}

export async function getFavoriteById(
  id: string,
): Promise<FavoriteItem | null> {
  const res = await fetch(FAVORITE_ROUTES.GET_FAVORITE_BY_ID(id), {
    method: "GET",
    headers: await getHeaders(),
    cache: "no-store",
  });
  return handleResponse(res);
}

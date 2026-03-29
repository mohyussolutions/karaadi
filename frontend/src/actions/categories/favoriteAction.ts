"use server";

import { FAVORITE_ROUTES } from "../constant/constant";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";

const handleResponse = async (res: Response) => {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    return { error: data?.message || "Operation failed", status: res.status };
  }
  return data;
};

export async function getMyFavorites() {
  const headers = await getAuthHeaders();
  const res = await fetch(FAVORITE_ROUTES.MY_FAVORITES, {
    method: "GET",
    headers: headers as HeadersInit,
    cache: "no-store",
  });
  return await handleResponse(res);
}

export async function getFavoriteById(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(FAVORITE_ROUTES.BY_ID(id), {
    method: "GET",
    headers: headers as HeadersInit,
    cache: "no-store",
  });
  return await handleResponse(res);
}

export async function addToFavorite(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(FAVORITE_ROUTES.BASE, {
    method: "POST",
    headers: headers as HeadersInit,
    body: JSON.stringify(data),
    cache: "no-store",
  });
  return await handleResponse(res);
}

export async function updateFavorite(id: string, data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(FAVORITE_ROUTES.BY_ID(id), {
    method: "PUT",
    headers: headers as HeadersInit,
    body: JSON.stringify(data),
    cache: "no-store",
  });
  return await handleResponse(res);
}

export async function removeFavorite(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(FAVORITE_ROUTES.BY_ID(id), {
    method: "DELETE",
    headers: headers as HeadersInit,
    cache: "no-store",
  });
  return await handleResponse(res);
}

export async function getFavoritesCount() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${FAVORITE_ROUTES.BASE}/count`, {
    method: "GET",
    headers: headers as HeadersInit,
    cache: "no-store",
  });
  return await handleResponse(res);
}

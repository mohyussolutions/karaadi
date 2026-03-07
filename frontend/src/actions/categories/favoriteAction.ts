"use server";

import { cookies } from "next/headers";
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
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    return { error: data?.message || "Operation failed", status: res.status };
  }
  return data;
};

export async function getMyFavorites() {
  const res = await fetch(FAVORITE_ROUTES.MY_FAVORITES, {
    method: "GET",
    headers: await getHeaders(),
    cache: "no-store",
  });
  return await handleResponse(res);
}

export async function getFavoriteById(id: string) {
  const res = await fetch(FAVORITE_ROUTES.BY_ID(id), {
    method: "GET",
    headers: await getHeaders(),
    cache: "no-store",
  });
  return await handleResponse(res);
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

export async function updateFavorite(id: string, data: any) {
  const res = await fetch(FAVORITE_ROUTES.BY_ID(id), {
    method: "PUT",
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

export async function getFavoritesCount() {
  const res = await fetch(`${FAVORITE_ROUTES.BASE}/count`, {
    method: "GET",
    headers: await getHeaders(),
    cache: "no-store",
  });
  return await handleResponse(res);
}

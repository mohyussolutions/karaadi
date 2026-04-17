"use server";

import { cookies } from "next/headers";
import { FAVORITE_ENDPOINTS } from "../constant/constant";

async function authHeaders(): Promise<HeadersInit> {
  const store = await cookies();
  const token =
    store.get("idToken")?.value ||
    store.get("accessToken")?.value ||
    store.get("token")?.value;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getMyFavorites() {
  const res = await fetch(FAVORITE_ENDPOINTS.MY_FAVORITES, {
    headers: await authHeaders(),
    cache: "no-store",
  });
  return res.ok ? res.json() : [];
}

export async function getFavoriteById(id: string) {
  const res = await fetch(FAVORITE_ENDPOINTS.GET_BY_ID(id), {
    headers: await authHeaders(),
    cache: "no-store",
  });
  return res.ok ? res.json() : null;
}

export async function addToFavorite(data: Record<string, unknown>) {
  const res = await fetch(FAVORITE_ENDPOINTS.ADD, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify(data),
    cache: "no-store",
  });
  return res.ok ? res.json() : { error: "Failed" };
}

export async function updateFavorite(
  id: string,
  data: Record<string, unknown>,
) {
  const res = await fetch(FAVORITE_ENDPOINTS.UPDATE(id), {
    method: "PUT",
    headers: await authHeaders(),
    body: JSON.stringify(data),
    cache: "no-store",
  });
  return res.ok ? res.json() : { error: "Failed" };
}

export async function removeFavorite(id: string) {
  const res = await fetch(FAVORITE_ENDPOINTS.DELETE(id), {
    method: "DELETE",
    headers: await authHeaders(),
    cache: "no-store",
  });
  return res.ok ? { success: true } : { error: "Failed" };
}

export async function getFavoritesCount() {
  const res = await fetch(FAVORITE_ENDPOINTS.COUNT, {
    headers: await authHeaders(),
    cache: "no-store",
  });
  if (!res.ok) return 0;
  const data = await res.json();
  return data.count ?? data.total ?? 0;
}

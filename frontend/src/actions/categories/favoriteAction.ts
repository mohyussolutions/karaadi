"use server";

import { revalidatePath, revalidateTag } from "next/cache";
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

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

const handleResponse = async (res: Response) => {
  if (res.status === 401) return null;
  const data = await res.json();
  return res.ok ? data : null;
};

export const getMyFavorites = async (): Promise<FavoriteItem[]> => {
  try {
    const res = await fetch(FAVORITE_ROUTES.MY_FAVORITES, {
      method: "GET",
      headers: await getHeaders(),
      next: { revalidate: 30, tags: ["user-favorites"] },
    });
    const data = await handleResponse(res);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

export const addToFavorite = async (data: any) => {
  try {
    const res = await fetch(FAVORITE_ROUTES.BASE, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await handleResponse(res);
    revalidateTag("user-favorites");
    return result;
  } catch {
    return { error: "Failed to add" };
  }
};

export const removeFavorite = async (id: string) => {
  try {
    const res = await fetch(FAVORITE_ROUTES.BY_ID(id), {
      method: "DELETE",
      headers: await getHeaders(),
    });
    const result = await handleResponse(res);
    revalidateTag("user-favorites");
    revalidatePath("/favorites");
    return result;
  } catch {
    return { error: "Failed to remove" };
  }
};

export const getFavoriteById = async (id: string): Promise<FavoriteItem> => {
  const res = await fetch(FAVORITE_ROUTES.GET_FAVORITE_BY_ID(id), {
    method: "GET",
    headers: await getHeaders(),
  });
  return handleResponse(res);
};

"use server";

import { apiUrls } from "@/actions/constant/constant";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("idToken")?.value || cookieStore.get("accessToken")?.value;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

const addCacheBuster = (url: string) => {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}_t=${Date.now()}`;
};

export async function fetchAllUsers() {
  try {
    const headers = await getAuthHeaders();
    const url = addCacheBuster(`${apiUrls.USERS.BASE}/all-users`);

    const res = await fetch(url, {
      headers,
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch users");
    const data = await res.json();
    return { success: true, users: data.users || [] };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch users" };
  }
}

export async function deleteUserAction(id: string) {
  try {
    const headers = await getAuthHeaders();
    const url = addCacheBuster(apiUrls.USERS.BY_ID(id));

    const res = await fetch(url, {
      method: "DELETE",
      headers,
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to delete user");

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete user" };
  }
}

export async function updateUserAction(id: string, username: string) {
  try {
    const headers = await getAuthHeaders();
    const url = addCacheBuster(apiUrls.USERS.BY_ID(id));

    const res = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify({ username }),
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to update user");
    const updatedUser = await res.json();

    revalidatePath("/admin/users");
    return { success: true, user: updatedUser };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update user" };
  }
}

export async function getTotalUsersAction(accessToken?: string) {
  try {
    const cookieStore = await cookies();
    const token =
      accessToken ||
      cookieStore.get("idToken")?.value ||
      cookieStore.get("accessToken")?.value ||
      cookieStore.get("token")?.value;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${apiUrls.USERS.BASE}/total-users`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Error ${res.status}`);
    }

    const data = await res.json();
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

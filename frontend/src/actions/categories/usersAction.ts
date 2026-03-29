"use server";

import { apiUrls } from "@/actions/constant/constant";
import { revalidatePath } from "next/cache";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
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
      headers: headers as HeadersInit,
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
      headers: headers as HeadersInit,
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
      headers: headers as HeadersInit,
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
    const headers = await getAuthHeaders(accessToken);

    const res = await fetch(`${apiUrls.USERS.BASE}/total-users`, {
      method: "GET",
      headers: headers as HeadersInit,
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

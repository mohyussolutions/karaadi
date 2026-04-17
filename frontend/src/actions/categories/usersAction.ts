"use server";

import { apiUrls } from "@/actions/constant/constant";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";

export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string | null;
  profileImage?: string | null;
  createdAt: string;
  updatedAt?: string;
  isAdmin?: boolean;
  isManager?: boolean;
}

export async function fetchAllUsers() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${apiUrls.USERS.BASE}/all-users`, {
      headers: headers as HeadersInit,
      cache: "no-store",
    });

    if (!res.ok)
      return { success: false, users: [], error: "Failed to fetch users" };
    const data = await res.json();
    return { success: true, users: data.users || data || [], error: null };
  } catch (error) {
    return { success: false, users: [], error: "Network error" };
  }
}

export async function deleteUserAction(id: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${apiUrls.USERS.BASE}/admin-deletetion/${id}`, {
      method: "DELETE",
      headers: headers as HeadersInit,
      cache: "no-store",
    });
    if (!res.ok) return { success: false, error: "Failed to delete user" };
    return { success: true, error: null };
  } catch {
    return { success: false, error: "Network error" };
  }
}

export async function updateUserAction(id: string, username: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${apiUrls.USERS.BASE}/${id}`, {
      method: "PUT",
      headers: headers as HeadersInit,
      body: JSON.stringify({ username }),
      cache: "no-store",
    });

    if (!res.ok)
      return { success: false, error: "Failed to update user", user: null };
    const user = await res.json();
    return { success: true, user, error: null };
  } catch {
    return { success: false, error: "Network error", user: null };
  }
}

export async function getTotalUsersAction(accessToken?: string) {
  try {
    const headers = await getAuthHeaders(accessToken);
    const res = await fetch(`${apiUrls.USERS.BASE}/total-users`, {
      headers: headers as HeadersInit,
      cache: "no-store",
    });

    if (!res.ok) return { data: 0, error: "Failed to fetch total" };
    const data = await res.json();
    return {
      data: data.totalUsers ?? data.total ?? data.count ?? 0,
      error: null,
    };
  } catch {
    return { data: 0, error: "Network error" };
  }
}

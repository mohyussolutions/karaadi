"use server";

import { USER_ENDPOINTS } from "../constant/constant";

export async function getProfile(accessToken: string) {
  if (!accessToken) return { error: "No token", status: 401 };

  try {
    const res = await fetch(USER_ENDPOINTS.VERIFY_SESSION, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    return res.ok ? await res.json() : { error: "Invalid", status: res.status };
  } catch {
    return { error: "Error", status: 500 };
  }
}

export async function updateProfile(formData: FormData, accessToken: string) {
  try {
    const res = await fetch(USER_ENDPOINTS.UPDATE_PROFILE, {
      method: "PUT",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData,
      cache: "no-store",
    });

    if (!res.ok) return { success: false };
    const data = await res.json();
    return { success: true, data };
  } catch {
    return { success: false };
  }
}

export async function deleteAccount(accessToken: string) {
  try {
    const res = await fetch(USER_ENDPOINTS.DELETE_ACCOUNT, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    return { success: res.ok };
  } catch {
    return { success: false };
  }
}

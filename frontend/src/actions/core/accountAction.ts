"use server";

import { USER_ENDPOINTS } from "../constant/constant";
import { revalidatePath } from "next/cache";

export async function getProfile(accessToken: string) {
  if (!accessToken) return { error: "No token", status: 401 };

  try {
    const res = await fetch(USER_ENDPOINTS.VERIFY_SESSION, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return { error: "Session invalid", status: res.status };

    return await res.json();
  } catch (error) {
    return { error: "Network error", status: 500 };
  }
}

export async function updateProfile(formData: FormData, accessToken: string) {
  try {
    const res = await fetch(USER_ENDPOINTS.PROFILE, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
      cache: "no-store",
    });

    if (!res.ok) {
      const errorMsg = await res.text();
      throw new Error(errorMsg || "Update failed");
    }

    const data = await res.json();
    revalidatePath("/profile");
    return { success: true, data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteAccount(accessToken: string) {
  try {
    const res = await fetch(USER_ENDPOINTS.DELETE_ACCOUNT, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Delete failed");

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

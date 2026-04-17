"use client";

import { normalizeUser } from "@/app/(storeFront)/components/hooks/useNormalizeUser";
import { apiUrls } from "../constant/constant";
import {
  NormalizedUser,
  LoginResponse,
  User,
} from "@/app/utils/types/user.types";

export async function getAuthenticatedUser(): Promise<NormalizedUser | null> {
  try {
    const response = await fetch(apiUrls.VERIFY_SESSION, {
      method: "POST",
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthCookies();
      }
      return null;
    }

    const data = await response.json();
    return data.user;
  } catch {
    return null;
  }
}

export function clearAuthCookies() {
  const cookies = [
    "idToken",
    "accessToken",
    "token",
    "refreshToken",
    "user-role",
  ];
  cookies.forEach((c) => {
    document.cookie = `${c}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
}

export async function login(email: string, password: string): Promise<User> {
  const response = await fetch(apiUrls.LOGIN, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, username: email }),
  });

  if (!response.ok) throw new Error("Login failed");
  const data: LoginResponse = await response.json();
  const u = (data.user as any) || data;
  return normalizeUser(u) as unknown as User;
}

export async function logout(token?: string): Promise<void> {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  await fetch(apiUrls.LOGOUT, {
    method: "POST",
    headers,
    credentials: "include",
  });
  clearAuthCookies();
}

export async function register(
  username: string,
  email: string,
  password: string,
): Promise<User> {
  const response = await fetch(apiUrls.REGISTER, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  if (!response.ok) throw new Error("Registration failed");
  return response.json();
}

export async function confirmEmail(email: string, code: string): Promise<void> {
  await fetch(apiUrls.CONFIRM, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });
}

export async function forgotPassword(email: string): Promise<void> {
  await fetch(apiUrls.FORGOT_PASSWORD, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(
  email: string,
  code: string,
  p: string,
): Promise<void> {
  await fetch(apiUrls.RESET_PASSWORD, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, newPassword: p }),
  });
}

export async function getProfile(): Promise<User> {
  const res = await fetch(apiUrls.PROFILE, {
    method: "POST",
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Profile failed");
  return res.json();
}

export async function updateProfile(
  formData: FormData,
): Promise<{ success: boolean; data: User | null }> {
  const res = await fetch(apiUrls.UPDATE_PROFILE, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });
  return { success: res.ok, data: res.ok ? await res.json() : null };
}

export async function deleteAccount(): Promise<{ success: boolean }> {
  const user = await getAuthenticatedUser();
  const res = await fetch(apiUrls.DELETE_ACCOUNT, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: user?._id }),
  });
  return { success: res.ok };
}

export async function getUsers(): Promise<User[]> {
  const res = await fetch(apiUrls.USERS.BASE, {
    method: "POST",
    credentials: "include",
  });
  return res.ok ? res.json() : [];
}

export async function getUserById(id: string): Promise<User> {
  const res = await fetch(apiUrls.USERS.BY_ID(id), {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
}

export async function updatePhone(
  phone: string,
): Promise<{ success: boolean; phone?: string; error?: string }> {
  const res = await fetch(apiUrls.UPDATE_PHONE, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });
  const data = await res.json();
  return { success: res.ok, phone: data.phone, error: data.error };
}

export async function updateProfileImage(
  file: File,
): Promise<{ success: boolean; profileImage?: string }> {
  const formData = new FormData();
  formData.append("profileImage", file);
  const res = await fetch(apiUrls.UPDATE_PROFILE, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });
  const data = await res.json();
  return { success: res.ok, profileImage: data.user?.profileImage };
}

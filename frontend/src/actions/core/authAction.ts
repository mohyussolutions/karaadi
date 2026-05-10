"use client";

import { normalizeUser } from "@/app/(storeFront)/components/hooks/useNormalizeUser";
import { apiUrls } from "../constant/constant";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";
import {
  NormalizedUser,
  LoginResponse,
  User,
} from "@/app/utils/types/user.types";

export async function getAuthenticatedUser(): Promise<NormalizedUser | null> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(apiUrls.VERIFY_SESSION, {
      method: "POST",
      credentials: "include",
      cache: "no-store",
      headers: headers as HeadersInit,
    });
    if (!response.ok) {
      if (response.status === 401) clearAuthCookies();
      return null;
    }
    const data = await response.json();
    return data.user;
  } catch {
    return null;
  }
}

export function clearAuthCookies() {
  fetch("/api/auth/clear-cookie", { method: "POST" }).catch(() => {});
}

export async function login(email: string, password: string): Promise<User> {
  try {
    await fetch(`${apiUrls.BASE}/health`, { method: "GET", cache: "no-store" });
  } catch {}

  const doLogin = () =>
    fetch(apiUrls.LOGIN, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

  let response = await doLogin();
  if (response.status === 502 || response.status === 503) {
    await new Promise((r) => setTimeout(r, 3000));
    response = await doLogin();
  }
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.error || "Login failed");
  }
  const data: LoginResponse = await response.json();
  const u = (data.user as any) || data;
  if (data.token && !u.token) u.token = data.token;
  return normalizeUser(u) as unknown as User;
}

export async function logout(): Promise<void> {
  const headers = await getAuthHeaders();

  clearAuthCookies();
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("user");
  }

  fetch(apiUrls.LOGOUT, {
    method: "POST",
    headers: headers as HeadersInit,
    credentials: "include",
    keepalive: true,
  }).catch(() => {});
}

export async function register(
  username: string,
  email: string,
  password: string,
): Promise<User> {
  const response = await fetch(apiUrls.REGISTER, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.error || "Registration failed");
  }
  return response.json();
}

export async function confirmEmail(email: string, code: string): Promise<void> {
  await fetch(apiUrls.CONFIRM, {
    method: "POST",
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
  const headers = await getAuthHeaders();
  const res = await fetch(apiUrls.PROFILE, {
    method: "POST",
    credentials: "include",
    cache: "no-store",
    headers: headers as HeadersInit,
  });
  if (!res.ok) throw new Error("Profile failed");
  return res.json();
}

export async function updateProfile(
  formData: FormData,
): Promise<{ success: boolean; data: User | null }> {
  const headers = await getAuthHeaders();
  const res = await fetch(apiUrls.UPDATE_PROFILE, {
    method: "PUT",
    credentials: "include",
    headers: { Authorization: (headers as any).Authorization ?? "" },
    body: formData,
  });
  return { success: res.ok, data: res.ok ? await res.json() : null };
}

export async function deleteAccount(): Promise<{ success: boolean }> {
  const headers = await getAuthHeaders();
  const user = await getAuthenticatedUser();
  const res = await fetch(apiUrls.DELETE_ACCOUNT, {
    method: "DELETE",
    credentials: "include",
    headers: {
      ...(headers as any),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: user?._id }),
  });
  return { success: res.ok };
}

export async function getUsers(): Promise<User[]> {
  const headers = await getAuthHeaders();
  const res = await fetch(apiUrls.USERS.BASE, {
    method: "POST",
    credentials: "include",
    headers: headers as HeadersInit,
  });
  return res.ok ? res.json() : [];
}

export async function getUserById(id: string): Promise<User> {
  const headers = await getAuthHeaders();
  const res = await fetch(apiUrls.USERS.BY_ID(id), {
    method: "POST",
    credentials: "include",
    headers: headers as HeadersInit,
  });
  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
}

export async function updatePhone(
  phone: string,
): Promise<{ success: boolean; phone?: string; error?: string }> {
  const headers = await getAuthHeaders();
  const res = await fetch(apiUrls.UPDATE_PHONE, {
    method: "PUT",
    credentials: "include",
    headers: headers as HeadersInit,
    body: JSON.stringify({ phone }),
  });
  const data = await res.json();
  return { success: res.ok, phone: data.phone, error: data.error };
}

export async function updateProfileImage(
  file: File,
): Promise<{ success: boolean; profileImage?: string }> {
  const headers = await getAuthHeaders();
  const formData = new FormData();
  formData.append("profileImage", file);
  const res = await fetch(apiUrls.UPDATE_PROFILE, {
    method: "PUT",
    credentials: "include",
    headers: { Authorization: (headers as any).Authorization ?? "" },
    body: formData,
  });
  const data = await res.json();
  return { success: res.ok, profileImage: data.user?.profileImage };
}

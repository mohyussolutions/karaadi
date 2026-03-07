import { normalizeUser } from "@/app/(storeFront)/components/hooks/useNormalizeUser";
import { apiUrls } from "../constant/constant";

export interface User {
  _id: string;
  username: string;
  email: string;
  profileImage?: string;
  isAdmin: boolean;
  isSupport: boolean;
  isManager: boolean;
  accessToken?: string;
  refreshToken?: string;
  phone: string;
  phoneVerified?: boolean;
  token: string;
  expiresIn?: number;
}

interface LoginResponse {
  success: boolean;
  token: string;
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
  user: any;
}

const toBool = (v: any) => v === true || v === "true" || v === 1 || v === "1";

export async function login(email: string, password: string): Promise<User> {
  const response = await fetch(apiUrls.LOGIN, {
    method: "POST",
    credentials: "include",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "max-age=0, must-revalidate",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error("Login failed");

  const data: LoginResponse = await response.json();
  const u = data.user || data;

  const user = normalizeUser({
    _id: u.id || u._id,
    username: u.username,
    email: u.email,
    profileImage: u.profileImage,
    isAdmin: toBool(u.isAdmin),
    isManager: toBool(u.isManager),
    isSupport: toBool(u.isSupport),
    phone: u.phone || "",
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    token: data.token,
    expiresIn: data.expiresIn,
  }) as User;

  return user;
}

export async function logout(accessToken?: string): Promise<void> {
  const headers: any = { "Content-Type": "application/json" };
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const response = await fetch(apiUrls.LOGOUT, {
    method: "POST",
    credentials: "include",
    cache: "no-store",
    headers,
  });

  if (!response.ok) throw new Error("Logout failed");
}

export async function verifySession(
  accessToken?: string,
): Promise<User | null> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Cache-Control": "max-age=0, must-revalidate",
    };
    if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

    const response = await fetch(apiUrls.VERIFY_SESSION, {
      method: "POST",
      credentials: "include",
      cache: "no-store",
      headers,
    });

    if (response.status === 401) return null;
    if (!response.ok) throw new Error("Session verification failed");

    const data = await response.json();
    const u = data.user || {};

    return normalizeUser({
      _id: u.id || u._id || u.sub || "",
      username:
        u.username || u.preferred_username || u.email?.split("@")[0] || "",
      email: u.email || "",
      profileImage: u.profileImage || "",
      phone: u.phone || "",
      token: data.token || u.token || "",
      accessToken: data.accessToken || u.accessToken || accessToken || "",
      refreshToken: data.refreshToken || u.refreshToken || "",
      isAdmin: toBool(u.isAdmin) || toBool(u["custom:isAdmin"]) || false,
      isManager: toBool(u.isManager) || toBool(u["custom:isManager"]) || false,
      isSupport: toBool(u.isSupport) || toBool(u["custom:isSupport"]) || false,
    });
  } catch {
    return null;
  }
}

export async function register(
  username: string,
  email: string,
  password: string,
): Promise<User> {
  const response = await fetch(apiUrls.REGISTER, {
    method: "POST",
    credentials: "include",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  if (!response.ok) throw new Error("Registration failed");
  return response.json();
}

export async function confirmEmail(
  email: string,
  code: string,
  accessToken?: string,
): Promise<void> {
  const headers: any = { "Content-Type": "application/json" };
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const response = await fetch(apiUrls.CONFIRM, {
    method: "POST",
    credentials: "include",
    cache: "no-store",
    headers,
    body: JSON.stringify({ email, code }),
  });
  if (!response.ok) throw new Error("Email confirmation failed");
}

export async function forgotPassword(email: string): Promise<void> {
  const response = await fetch(apiUrls.FORGOT_PASSWORD, {
    method: "POST",
    credentials: "include",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) throw new Error("Password reset failed");
}

export async function resetPassword(
  email: string,
  code: string,
  newPassword: string,
): Promise<void> {
  const response = await fetch(apiUrls.RESET_PASSWORD, {
    method: "POST",
    credentials: "include",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, newPassword }),
  });
  if (!response.ok) throw new Error("Password reset failed");
}

export async function getProfile(accessToken?: string): Promise<any> {
  try {
    const headers: any = { "Content-Type": "application/json" };
    if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

    const response = await fetch(apiUrls.PROFILE, {
      method: "POST",
      credentials: "include",
      cache: "no-store",
      headers,
    });

    if (!response.ok) throw new Error("Failed to fetch profile");
    return await response.json();
  } catch (error) {
    return { error: (error as Error).message };
  }
}

export async function updateProfile(
  formData: FormData,
  accessToken: string,
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const response = await fetch(apiUrls.PROFILE, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
      cache: "no-store",
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      return { success: false, error: errorMsg || "Update failed" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteAccount(
  accessToken: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(apiUrls.DELETE_ACCOUNT, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) return { success: false, error: "Delete failed" };
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getUsers(accessToken?: string): Promise<User[]> {
  const headers: any = { "Content-Type": "application/json" };
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const response = await fetch(apiUrls.USERS.BASE, {
    method: "POST",
    credentials: "include",
    cache: "no-store",
    headers,
  });
  if (!response.ok) return [];
  return response.json();
}

export async function getUserById(
  id: string,
  accessToken?: string,
): Promise<User> {
  const headers: any = { "Content-Type": "application/json" };
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const response = await fetch(apiUrls.USERS.BY_ID(id), {
    method: "POST",
    credentials: "include",
    cache: "no-store",
    headers,
  });
  if (!response.ok) throw new Error("Failed to fetch user");
  return response.json();
}

export async function createUser(
  username: string,
  email: string,
  password: string,
  accessToken?: string,
): Promise<User> {
  const headers: any = { "Content-Type": "application/json" };
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const response = await fetch(apiUrls.USERS.BASE, {
    method: "POST",
    credentials: "include",
    cache: "no-store",
    headers,
    body: JSON.stringify({ username, email, password }),
  });
  if (!response.ok) throw new Error("User creation failed");
  return response.json();
}

export async function updateUser(
  id: string,
  data: Partial<User>,
  accessToken?: string,
): Promise<User> {
  const headers: any = { "Content-Type": "application/json" };
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const response = await fetch(apiUrls.USERS.BY_ID(id), {
    method: "POST",
    credentials: "include",
    cache: "no-store",
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("User update failed");
  return response.json();
}

export async function deleteUser(
  id: string,
  accessToken?: string,
): Promise<void> {
  const headers: any = { "Content-Type": "application/json" };
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const response = await fetch(apiUrls.USERS.BY_ID(id), {
    method: "DELETE",
    credentials: "include",
    cache: "no-store",
    headers,
  });
  if (!response.ok) throw new Error("User deletion failed");
}

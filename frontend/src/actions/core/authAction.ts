"use client";

import { normalizeUser } from "@/app/(storeFront)/components/hooks/useNormalizeUser";
import { apiUrls } from "../constant/constant";

interface User {
  _id: string;
  username: string;
  email: string;
  profileImage?: string;
  isAdmin: boolean;
  isSupport: boolean;
  isManager: boolean;
  accessToken?: string;
  phone: string;
  phoneVerified?: boolean;
  token: string;
}

const toBool = (v: any) => v === true || v === "true" || v === 1 || v === "1";

// Login function
export async function login(email: string, password: string): Promise<User> {
  const response = await fetch(apiUrls.LOGIN, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error("Login failed");
  const data = await response.json();
  const u = data.user || data;

  const raw = {
    _id: u._id || u.id,
    username: u.username,
    email: u.email,
    profileImage: u.profileImage,
    isAdmin: toBool(u.isAdmin),
    isManager: toBool(u.isManager),
    isSupport: toBool(u.isSupport),
    phone: u.phone,
    accessToken: data.accessToken || data.token,
    token: data.token,
  };

  return normalizeUser(raw) as User;
}

// Logout function
export async function logout(accessToken?: string): Promise<void> {
  const headers: any = { "Content-Type": "application/json" };
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const response = await fetch(apiUrls.LOGOUT, {
    method: "POST",
    credentials: "include",
    headers,
  });

  if (!response.ok) throw new Error("Logout failed");
}

// Verify session function
export async function verifySession(
  accessToken?: string,
): Promise<User | null> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

    const response = await fetch(apiUrls.VERIFY_SESSION, {
      method: "POST",
      credentials: "include",
      headers,
    });

    if (response.status === 401) return null;
    if (!response.ok) throw new Error("Session verification failed");

    const data = await response.json();
    const u = data.user;

    const user = {
      _id: u.sub || u.id || u._id,
      username: u.preferred_username,
      email: u.email,
      profileImage: u.profileImage,
      phone: u.phone,
      token: data.token || accessToken,
      accessToken: data.accessToken || accessToken,
      isAdmin: toBool(u["custom:isAdmin"]) || toBool(u.isAdmin),
      isManager: toBool(u["custom:isManager"]) || toBool(u.isManager),
      isSupport: toBool(u["custom:isSupport"]) || toBool(u.isSupport),
    };

    return normalizeUser(user);
  } catch {
    return null;
  }
}

// Register function
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

// Confirm email function
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
    headers,
    body: JSON.stringify({ email, code }),
  });
  if (!response.ok) throw new Error("Email confirmation failed");
}

// Forgot password function
export async function forgotPassword(email: string): Promise<void> {
  const response = await fetch(apiUrls.FORGOT_PASSWORD, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) throw new Error("Password reset failed");
}

// Reset password function
export async function resetPassword(
  email: string,
  code: string,
  newPassword: string,
): Promise<void> {
  const response = await fetch(apiUrls.RESET_PASSWORD, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, newPassword }),
  });
  if (!response.ok) throw new Error("Password reset failed");
}

// Get profile function
export async function getProfile(accessToken?: string): Promise<User> {
  const headers: any = { "Content-Type": "application/json" };
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const response = await fetch(apiUrls.PROFILE, {
    method: "POST",
    credentials: "include",
    headers,
  });
  if (!response.ok) throw new Error("Failed to fetch profile");
  return response.json();
}

// Update profile function
export async function updateProfile(
  data: Partial<User> & { profileImageFile?: File | null },
  accessToken?: string,
): Promise<User> {
  const headers: Record<string, string> = {};
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const formData = new FormData();
  if (data.username) formData.append("username", data.username);
  if (data.email) formData.append("email", data.email);
  if (data.phone) formData.append("phone", data.phone);
  if (data.profileImageFile)
    formData.append("profileImage", data.profileImageFile);

  const response = await fetch(apiUrls.PROFILE, {
    method: "POST",
    credentials: "include",
    headers,
    body: formData,
  });

  if (!response.ok)
    throw new Error(`Profile update failed: ${response.status}`);
  return await response.json();
}

// Get users function
export async function getUsers(accessToken?: string): Promise<User[]> {
  const headers: any = { "Content-Type": "application/json" };
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const response = await fetch(apiUrls.USERS.BASE, {
    method: "POST",
    credentials: "include",
    headers,
  });
  if (!response.ok) return [];

  return response.json();
}

// Get user by ID function
export async function getUserById(
  id: string,
  accessToken?: string,
): Promise<User> {
  const headers: any = { "Content-Type": "application/json" };
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const response = await fetch(apiUrls.USERS.BY_ID(id), {
    method: "POST",
    credentials: "include",
    headers,
  });
  if (!response.ok) throw new Error("Failed to fetch user");
  return response.json();
}

// Create user function
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
    headers,
    body: JSON.stringify({ username, email, password }),
  });
  if (!response.ok) throw new Error("User creation failed");
  return response.json();
}

// Update user function
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
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("User update failed");
  return response.json();
}

// Delete user function
export async function deleteUser(
  id: string,
  accessToken?: string,
): Promise<void> {
  const headers: any = { "Content-Type": "application/json" };
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const response = await fetch(apiUrls.USERS.BY_ID(id), {
    method: "DELETE",
    credentials: "include",
    headers,
  });
  if (!response.ok) throw new Error("User deletion failed");
}

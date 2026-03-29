import { normalizeUser } from "@/app/(storeFront)/components/hooks/useNormalizeUser";
import { apiUrls } from "../constant/constant";
import {
  NormalizedUser,
  RawUserData,
  SessionResponse,
} from "@/app/utils/types/user.types";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";

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
    body: JSON.stringify({ email, password, username: email }),
  });

  if (!response.ok) throw new Error("Login failed");

  const data: LoginResponse = await response.json();
  const u = data.user || data;

  let profileImage = null;
  if (
    typeof u.profileImage === "string" &&
    u.profileImage.trim() !== "" &&
    u.profileImage !== "false"
  ) {
    profileImage = u.profileImage;
  }

  const userData = {
    _id: u.id || u._id,
    username: u.username,
    email: u.email,
    profileImage,
    isAdmin: toBool(u.isAdmin),
    isManager: toBool(u.isManager),
    isSupport: toBool(u.isSupport),
    phone: u.phone || "",
    phoneVerified: toBool(u.phoneVerified),
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    token: data.token,
    expiresIn: data.expiresIn,
  };

  const user = normalizeUser(userData) as User;

  return user;
}

export async function logout(accessToken?: string): Promise<void> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
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
): Promise<NormalizedUser | null> {
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

    const data: SessionResponse = await response.json();
    const userData: RawUserData = data.user || {};

    const normalizedData: RawUserData = {
      id: userData.id || userData._id || userData.sub,
      username: userData.username || userData.preferred_username,
      email: userData.email,
      profileImage: userData.profileImage,
      phone: userData.phone,
      phoneVerified: userData.phoneVerified,
      token: data.token || userData.token,
      accessToken: data.accessToken || userData.accessToken || accessToken,
      refreshToken: data.refreshToken || userData.refreshToken,
      isAdmin: userData.isAdmin,
      isManager: userData.isManager,
      isSupport: userData.isSupport,
      "custom:isAdmin": userData["custom:isAdmin"],
      "custom:isManager": userData["custom:isManager"],
      "custom:isSupport": userData["custom:isSupport"],
    };

    return normalizeUser(normalizedData);
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
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
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
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
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
    const response = await fetch(apiUrls.UPDATE_PROFILE, {
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
    if (!accessToken) return { success: false, error: "Auth required" };

    const session = await verifySession(accessToken);
    const userId = session?._id;

    console.log("Client-Side Request: Deleting User", userId);

    const cleanToken = accessToken.startsWith("Bearer ")
      ? accessToken
      : `Bearer ${accessToken}`;

    const response = await fetch(apiUrls.DELETE_ACCOUNT, {
      method: "DELETE",
      headers: {
        Authorization: cleanToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: userId }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: `HTTP ${response.status}` }));
      console.warn(
        "Server-Side Deletion Failed:",
        response.status,
        errorData.error,
      );
      return { success: false, error: errorData.error || "Delete failed" };
    }

    console.log("Client-Side: Account deletion confirmed by server");
    return { success: true };
  } catch (error: any) {
    console.warn("Network Error during deletion:", error?.message || error);
    return {
      success: false,
      error: (error as Error).message || "Network error",
    };
  }
}

export async function getUsers(accessToken?: string): Promise<User[]> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
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
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
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
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
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
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
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
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
  const response = await fetch(apiUrls.USERS.BY_ID(id), {
    method: "DELETE",
    credentials: "include",
    cache: "no-store",
    headers,
  });
  if (!response.ok) throw new Error("User deletion failed");
}

export async function updatePhone(
  phone: string,
  accessToken: string,
): Promise<{
  success: boolean;
  phone?: string;
  error?: string;
  expired?: boolean;
}> {
  try {
    const response = await fetch(apiUrls.UPDATE_PHONE, {
      method: "PUT",
      credentials: "include",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ phone }),
    });
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401 && data.code === "TOKEN_EXPIRED") {
        return { success: false, error: "Session expired", expired: true };
      }
      return { success: false, error: data.error || "Failed to update phone" };
    }
    return {
      success: true,
      phone: data.phone,
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function updateProfileImage(
  file: File,
  accessToken: string,
): Promise<{ success: boolean; profileImage?: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append("profileImage", file);

    const response = await fetch(apiUrls.UPDATE_PROFILE, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
      cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP error ${response.status}`,
      };
    }
    return {
      success: true,
      profileImage: data.user?.profileImage,
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

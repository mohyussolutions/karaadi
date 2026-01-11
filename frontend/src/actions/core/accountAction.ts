"use server";

const API_URL = "http://localhost:8080/api/users";

export async function getProfile(accessToken: string) {
  if (!accessToken) {
    return { error: "No access token provided", status: 401 };
  }

  try {
    const res = await fetch(`${API_URL}/verify-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (res.status === 401) {
      return { error: "Session expired. Please log in again.", status: 401 };
    }

    if (!res.ok) {
      return { error: "Failed to fetch profile", status: res.status };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("getProfile Error:", error);
    return { error: "Network error. Is the backend running?", status: 500 };
  }
}

export async function updateProfile(formData: FormData, accessToken: string) {
  try {
    const res = await fetch(`${API_URL}/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to update profile");
    return await res.json();
  } catch (error) {
    throw error;
  }
}

export async function deleteAccount(accessToken: string) {
  try {
    const res = await fetch(`${API_URL}/delete-account`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) throw new Error("Failed to delete account");
    return await res.json();
  } catch (error) {
    throw error;
  }
}

"use server";

import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";
import { AUTH_ENDPOINTS } from "@/actions/constant/constant";

export async function getActiveSessions(accessToken?: string) {
  try {
    const headers = await getAuthHeaders(accessToken);
    const res = await fetch(AUTH_ENDPOINTS.SESSIONS, {
      method: "POST",
      headers: headers as HeadersInit,
      cache: "no-store",
    });
    return res.ok ? await res.json() : [];
  } catch {
    return [];
  }
}

export async function logoutSession(sessionId: string, accessToken?: string) {
  try {
    const headers = await getAuthHeaders(accessToken);
    const res = await fetch(`${AUTH_ENDPOINTS.SESSIONS}/${sessionId}/logout`, {
      method: "POST",
      headers: headers as HeadersInit,
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function logoutAllSessions(accessToken?: string) {
  try {
    const headers = await getAuthHeaders(accessToken);
    const res = await fetch(`${AUTH_ENDPOINTS.SESSIONS}/logout-all`, {
      method: "POST",
      headers: headers as HeadersInit,
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function deleteLoginHistoryEntry(id: number, accessToken?: string) {
  try {
    const headers = await getAuthHeaders(accessToken);
    const res = await fetch(`${AUTH_ENDPOINTS.LOGIN_HISTORY}/${id}`, {
      method: "DELETE",
      headers: headers as HeadersInit,
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function clearLoginHistory(accessToken?: string) {
  try {
    const headers = await getAuthHeaders(accessToken);
    const res = await fetch(AUTH_ENDPOINTS.LOGIN_HISTORY, {
      method: "DELETE",
      headers: headers as HeadersInit,
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function getLoginHistory(accessToken?: string) {
  try {
    const headers = await getAuthHeaders(accessToken);
    const res = await fetch(AUTH_ENDPOINTS.LOGIN_HISTORY, {
      headers: headers as HeadersInit,
      cache: "no-store",
    });
    return res.ok
      ? (await res.json()) as Array<{
          id: number;
          ipAddress: string | null;
          browser: string | null;
          device: string | null;
          loggedAt: string;
        }>
      : [];
  } catch {
    return [];
  }
}

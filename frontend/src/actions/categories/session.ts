"use server";

import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";

const SESSIONS = "/auth/sessions";

export async function getActiveSessions(accessToken?: string) {
  try {
    const headers = await getAuthHeaders(accessToken);
    const res = await fetch(SESSIONS, {
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
    const res = await fetch(`${SESSIONS}/${sessionId}/logout`, {
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
    const res = await fetch(`${SESSIONS}/logout-all`, {
      method: "POST",
      headers: headers as HeadersInit,
      cache: "no-store",
    });

    return res.ok;
  } catch {
    return false;
  }
}

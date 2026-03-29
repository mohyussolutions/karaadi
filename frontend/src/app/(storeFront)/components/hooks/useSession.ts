import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";

export const SESSIONS = "/auth/sessions";

export async function getActiveSessions(accessToken?: string) {
  try {
    const headers = await getAuthHeaders(accessToken);

    const res = await fetch(SESSIONS, {
      method: "POST",
      credentials: "include",
      headers: headers as HeadersInit,
    });

    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function logoutSession(
  sessionId: string,
  accessToken?: string,
): Promise<boolean> {
  try {
    const headers = await getAuthHeaders(accessToken);

    const res = await fetch(`${SESSIONS}/${sessionId}/logout`, {
      method: "POST",
      credentials: "include",
      headers: headers as HeadersInit,
    });

    return res.ok;
  } catch {
    return false;
  }
}

export async function logoutAllSessions(
  accessToken?: string,
): Promise<boolean> {
  try {
    const headers = await getAuthHeaders(accessToken);

    const res = await fetch(`${SESSIONS}/logout-all`, {
      method: "POST",
      credentials: "include",
      headers: headers as HeadersInit,
    });

    return res.ok;
  } catch {
    return false;
  }
}

import { getClientCookie } from "@/app/ui/invoices/slugify";

export type HeadersWithAuth = {
  "Content-Type": string;
  "Cache-Control": string;
  Pragma: string;
  Expires: string;
  Authorization?: string;
};

const BASE_HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "no-cache, no-store, must-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

async function getServerToken(): Promise<string | undefined> {
  try {
    const { cookies } = await import("next/headers");
    const store = await cookies();
    return store.get("idToken")?.value || store.get("accessToken")?.value || store.get("token")?.value;
  } catch {
    return undefined;
  }
}

export async function getAuthHeaders(token?: string): Promise<HeadersWithAuth> {
  let authToken = token;

  if (!authToken) {
    if (typeof window === "undefined") {
      authToken = await getServerToken();
    } else {
      // idToken is httpOnly (not readable by JS) — use accessToken for cross-origin API calls
      authToken =
        getClientCookie("accessToken") ||
        getClientCookie("idToken") ||
        getClientCookie("token");
    }
  }

  return authToken
    ? { ...BASE_HEADERS, Authorization: `Bearer ${authToken}` }
    : BASE_HEADERS;
}

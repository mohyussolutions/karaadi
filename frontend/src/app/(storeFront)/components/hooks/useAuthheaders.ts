import { cache } from "react";
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

const getServerToken = cache(async (): Promise<string | undefined> => {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  return (
    cookieStore.get("idToken")?.value ||
    cookieStore.get("accessToken")?.value ||
    cookieStore.get("token")?.value
  );
});

export async function getAuthHeaders(token?: string): Promise<HeadersWithAuth> {
  let authToken = token;

  if (!authToken) {
    if (typeof window === "undefined") {
      authToken = await getServerToken();
    } else {
      authToken =
        getClientCookie("idToken") ||
        getClientCookie("accessToken") ||
        getClientCookie("token");
    }
  }

  return authToken
    ? { ...BASE_HEADERS, Authorization: `Bearer ${authToken}` }
    : BASE_HEADERS;
}

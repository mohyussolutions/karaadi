"use server";

import { COOKIE_REGEX } from "@/app/ui/invoices/slugify";
import { cookies } from "next/headers";

export type HeadersWithAuth = {
  "Content-Type": string;
  "Cache-Control": string;
  Pragma: string;
  Expires: string;
  Authorization?: string;
};

export async function getAuthHeaders(token?: string): Promise<HeadersWithAuth> {
  let authToken = token;

  if (!authToken) {
    if (typeof window === "undefined") {
      const cookieStore = await cookies();
      authToken =
        cookieStore.get("idToken")?.value ||
        cookieStore.get("accessToken")?.value ||
        cookieStore.get("token")?.value;
    } else {
      const getCookie = (name: string) => {
        const match = document.cookie.match(COOKIE_REGEX(name));
        return match ? decodeURIComponent(match[1]) : undefined;
      };
      authToken =
        getCookie("idToken") || getCookie("accessToken") || getCookie("token");
    }
  }

  return {
    "Content-Type": "application/json",
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
  };
}

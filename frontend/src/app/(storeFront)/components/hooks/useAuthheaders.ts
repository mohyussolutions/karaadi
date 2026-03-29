import { cookies } from "next/headers";

export type HeadersWithAuth = {
  "Content-Type": string;
  "Cache-Control": string;
  Pragma: string;
  Expires: string;
  Authorization?: string;
};

export async function getAuthHeaders(token?: string): Promise<HeadersWithAuth> {
  const cookieStore = await cookies();

  const cookieToken =
    cookieStore.get("idToken")?.value ||
    cookieStore.get("accessToken")?.value ||
    cookieStore.get("token")?.value;

  const authToken = token || cookieToken;

  const headers: HeadersWithAuth = {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  return headers;
}

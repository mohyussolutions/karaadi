import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function decodeJwtPayload(token: string): any {
  try {
    const base64 = token.split(".")[1];
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const idToken = request.cookies.get("idToken")?.value;

  if (pathname === "/" && idToken) {
    const payload = decodeJwtPayload(idToken);
    if (payload) {
      if (payload["custom:isAdmin"] === "true") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      if (payload["custom:isManager"] === "true") {
        return NextResponse.redirect(new URL("/managers", request.url));
      }
      if (payload["custom:isSupport"] === "true") {
        return NextResponse.redirect(new URL("/support", request.url));
      }
    }
  }

  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/managers") ||
    pathname.startsWith("/support")
  ) {
    if (!idToken) return NextResponse.redirect(new URL("/login", request.url));

    const payload = decodeJwtPayload(idToken);
    if (!payload) return NextResponse.redirect(new URL("/login", request.url));

    if (
      payload["custom:isAdmin"] === "true" &&
      !pathname.startsWith("/dashboard")
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (
      payload["custom:isManager"] === "true" &&
      !pathname.startsWith("/managers") &&
      !pathname.startsWith("/support")
    ) {
      return NextResponse.redirect(new URL("/managers", request.url));
    }
    if (
      payload["custom:isSupport"] === "true" &&
      !pathname.startsWith("/support")
    ) {
      return NextResponse.redirect(new URL("/support", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

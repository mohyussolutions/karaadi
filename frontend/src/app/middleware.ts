import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const idToken = request.cookies.get("idToken")?.value;

  const isStaticOrApi =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".");

  if (isStaticOrApi) {
    return NextResponse.next();
  }

  if (!idToken) {
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/managers") ||
      pathname.startsWith("/support")
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/login" || pathname === "/register") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  let isAdmin = false;
  let isManager = false;
  let isSupport = false;

  try {
    const payload = JSON.parse(
      Buffer.from(idToken.split(".")[1], "base64").toString("utf-8"),
    );
    isAdmin = payload["custom:isAdmin"] === "true";
    isManager = payload["custom:isManager"] === "true";
    isSupport = payload["custom:isSupport"] === "true";
  } catch {
    return NextResponse.next();
  }

  if (isAdmin) {
    if (!pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (isManager) {
    if (!pathname.startsWith("/managers") && !pathname.startsWith("/support")) {
      return NextResponse.redirect(new URL("/managers", request.url));
    }
    return NextResponse.next();
  }

  if (isSupport) {
    if (!pathname.startsWith("/support")) {
      return NextResponse.redirect(new URL("/support", request.url));
    }
    return NextResponse.next();
  }

  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/managers") ||
    pathname.startsWith("/support")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

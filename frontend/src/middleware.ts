import { NextRequest, NextResponse } from "next/server";
import { ROLE_ROUTES, AUTH_PREFIXES, PUBLIC_PREFIXES } from "./middleware.constants";

function decodeJwt(token: string): Record<string, unknown> {
  const base64Url = token.split(".")[1];
  if (!base64Url) throw new Error("Invalid JWT");
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(atob(base64));
}

function getTokenClaims(token: string | undefined): Record<string, unknown> | null {
  if (!token) return null;
  try {
    return decodeJwt(token);
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  try {
    const claims = decodeJwt(token);
    const exp = typeof claims.exp === "number" ? claims.exp : null;
    return !exp || exp < Math.floor(Date.now() / 1000);
  } catch {
    return true;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/Marketplace")) {
    const rest = pathname.slice("/Marketplace".length);
    return NextResponse.redirect(new URL("/marketplace" + rest, req.url));
  }

  const idToken = req.cookies.get("idToken")?.value;
  const loginUrl = new URL("/login", req.url);

  let _claims: Record<string, unknown> | null | false = false;
  const getClaims = () => {
    if (_claims !== false) return _claims;
    return (_claims = getTokenClaims(idToken));
  };

  // Role-protected routes: /dashboard, /devices, /managers, /support
  for (const route of ROLE_ROUTES) {
    if (pathname.startsWith(route.pattern)) {
      if (!idToken) return NextResponse.redirect(loginUrl);
      const c = getClaims();
      if (!c) return NextResponse.redirect(loginUrl);
      if (c[route.claim as string] !== "true") {
        const ownRoute = ROLE_ROUTES.find((r) => c[r.claim as string] === "true");
        return NextResponse.redirect(
          new URL(ownRoute ? ownRoute.pattern : "/login", req.url),
        );
      }
      return NextResponse.next();
    }
  }

  const isPublic = PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_PREFIXES.some((p) => pathname.startsWith(p));

  if (isAuthPage) {
    const c = idToken && !isTokenExpired(idToken) ? getTokenClaims(idToken) : null;
    if (c) {
      const ownRoute = ROLE_ROUTES.find((r) => c[r.claim as string] === "true");
      return NextResponse.redirect(
        new URL(ownRoute ? ownRoute.pattern : "/marketplace", req.url),
      );
    }
  }

  // Private route with no idToken: check fallback token
  if (!idToken && !isPublic && pathname !== "/") {
    const token = req.cookies.get("token")?.value;
    if (!token || isTokenExpired(token)) {
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|.*\\..*|_next/data).*)"],
};

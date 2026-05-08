import { NextRequest, NextResponse } from "next/server";
import { decodeJwt } from "jose";

const ROLE_ROUTES = [
  { pattern: "/dashboard", claim: "custom:isAdmin" },
  { pattern: "/devices", claim: "custom:isAdmin" },
  { pattern: "/managers", claim: "custom:isManager" },
  { pattern: "/support", claim: "custom:isSupport" },
] as const;

const PUBLIC_PREFIXES = [
  "/login",
  "/register",
  "/confirm",
  "/forgot-password",
  "/reset-password",
  "/marketplace",
  "/real-estate",
  "/cars",
  "/boats",
  "/farmequipment",
  "/motorcycles",
  "/jobs",
  "/about",
  "/contact",
  "/search",
  "/item",
  "/vehicles",
  "/item-details",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const idToken = req.cookies.get("idToken")?.value;
  const loginUrl = new URL("/login", req.url);

  let _claims: ReturnType<typeof decodeJwt> | null | false = false;
  const getClaims = () => {
    if (_claims !== false) return _claims;
    if (!idToken) return (_claims = null);
    try {
      return (_claims = decodeJwt(idToken));
    } catch {
      return (_claims = null);
    }
  };

  for (const route of ROLE_ROUTES) {
    if (pathname.startsWith(route.pattern)) {
      if (!idToken) return NextResponse.redirect(loginUrl);
      const c = getClaims();
      if (!c) return NextResponse.redirect(loginUrl);
      if (c[route.claim] !== "true") {
        const ownRoute = ROLE_ROUTES.find((r) => c[r.claim] === "true");
        return NextResponse.redirect(
          new URL(ownRoute ? ownRoute.pattern : "/login", req.url),
        );
      }
      return NextResponse.next();
    }
  }

  const isPublic = PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));

  if (idToken && (isPublic || pathname === "/")) {
    const c = getClaims();
    if (c) {
      const ownRoute = ROLE_ROUTES.find((r) => c[r.claim] === "true");
      if (ownRoute)
        return NextResponse.redirect(new URL(ownRoute.pattern, req.url));
    }
  }

  if (!idToken && !isPublic && pathname !== "/") {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.redirect(loginUrl);
    try {
      const c = decodeJwt(token);
      const now = Math.floor(Date.now() / 1000);
      if (!c.exp || c.exp < now) return NextResponse.redirect(loginUrl);
    } catch {
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|.*\\..*).*)"],
};

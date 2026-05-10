import { NextRequest, NextResponse } from "next/server";

function decodeJwt(token: string): Record<string, unknown> {
  const base64Url = token.split(".")[1];
  if (!base64Url) throw new Error("Invalid JWT");
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const json = atob(base64);
  return JSON.parse(json);
}

const ROLE_ROUTES = [
  { pattern: "/dashboard", claim: "custom:isAdmin" },
  { pattern: "/devices", claim: "custom:isAdmin" },
  { pattern: "/managers", claim: "custom:isManager" },
  { pattern: "/support", claim: "custom:isSupport" },
] as const;

const AUTH_PREFIXES = [
  "/login",
  "/register",
  "/confirm",
  "/forgot-password",
  "/reset-password",
];

const PUBLIC_PREFIXES = [
  ...AUTH_PREFIXES,
  "/marketplace",
  "/real-estate",
  "/cars",
  "/boats",
  "/farmequipment",
  "/motorcycles",
  "/jobs",
  "/about",
  "/help",
  "/contact",
  "/search",
  "/item",
  "/vehicles",
  "/item-details",
];

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
      if (c[route.claim as string] !== "true") {
        const ownRoute = ROLE_ROUTES.find(
          (r) => c[r.claim as string] === "true",
        );
        return NextResponse.redirect(
          new URL(ownRoute ? ownRoute.pattern : "/login", req.url),
        );
      }
      return NextResponse.next();
    }
  }

  const isPublic = PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_PREFIXES.some((p) => pathname.startsWith(p));

  if (idToken && isAuthPage) {
    const c = getClaims();
    if (c) {
      const ownRoute = ROLE_ROUTES.find((r) => c[r.claim as string] === "true");
      const destination = ownRoute ? ownRoute.pattern : "/marketplace";
      return NextResponse.redirect(new URL(destination, req.url));
    }
  }

  if (!idToken && !isPublic && pathname !== "/") {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.redirect(loginUrl);
    try {
      const c = decodeJwt(token);
      const now = Math.floor(Date.now() / 1000);
      const exp = typeof c.exp === "number" ? c.exp : null;
      if (!exp || exp < now) return NextResponse.redirect(loginUrl);
    } catch {
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|.*\\..*).*)"],
};

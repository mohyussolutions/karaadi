import { NextRequest, NextResponse } from "next/server";

const isProd = process.env.NODE_ENV === "production";
const SESSION_MAX_AGE = 7 * 24 * 60 * 60;

export async function POST(req: NextRequest) {
  const { idToken, accessToken, role } = await req.json();

  if (!idToken) return NextResponse.json({ ok: false }, { status: 400 });

  const res = NextResponse.json({ ok: true });

  const base = {
    path: "/",
    secure: isProd,
    sameSite: "lax" as const,
    maxAge: SESSION_MAX_AGE,
  };

  // httpOnly — hidden from JS, readable by middleware
  res.cookies.set("idToken", idToken, { ...base, httpOnly: true });
  res.cookies.set("token", idToken, { ...base, httpOnly: true });

  // JS-readable — needed by getAuthHeaders() for cross-origin API calls
  if (accessToken) {
    res.cookies.set("accessToken", accessToken, { ...base, httpOnly: false });
  }

  // role is non-sensitive, JS-readable for UI hints
  if (role) {
    res.cookies.set("user-role", role, { ...base, httpOnly: false });
  }

  return res;
}

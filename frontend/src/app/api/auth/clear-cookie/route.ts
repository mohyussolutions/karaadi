import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  ["idToken", "token", "accessToken", "refreshToken", "user-role"].forEach(
    (name) => res.cookies.delete(name),
  );
  return res;
}

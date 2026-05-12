import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "https://karaadi.onrender.com";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const store = await cookies();
  const token =
    store.get("idToken")?.value ||
    store.get("accessToken")?.value ||
    store.get("token")?.value ||
    "";

  const res = await fetch(`${BACKEND}/api/chats/user/${userId}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  if (!res.ok) return NextResponse.json([], { status: res.status });
  const data = await res.json();
  return NextResponse.json(data);
}

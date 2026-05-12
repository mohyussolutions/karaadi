import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "https://karaadi.onrender.com";

async function getToken() {
  const store = await cookies();
  return (
    store.get("idToken")?.value ||
    store.get("accessToken")?.value ||
    store.get("token")?.value ||
    ""
  );
}

function buildHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const token = await getToken();
  const search = req.nextUrl.search;
  const res = await fetch(`${BACKEND}/api/chats/${path.join("/")}${search}`, {
    headers: buildHeaders(token),
    cache: "no-store",
  });
  if (!res.ok) return NextResponse.json([], { status: res.status });
  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const token = await getToken();
  const body = await req.text();
  const res = await fetch(`${BACKEND}/api/chats/${path.join("/")}`, {
    method: "POST",
    headers: buildHeaders(token),
    body,
  });
  if (!res.ok) return NextResponse.json({ error: "Failed" }, { status: res.status });
  const data = await res.json();
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const token = await getToken();
  const search = req.nextUrl.search;
  const res = await fetch(`${BACKEND}/api/chats/${path.join("/")}${search}`, {
    method: "DELETE",
    headers: buildHeaders(token),
  });
  if (!res.ok) return NextResponse.json({ error: "Failed" }, { status: res.status });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const token = await getToken();
  const body = await req.text();
  const res = await fetch(`${BACKEND}/api/chats/${path.join("/")}`, {
    method: "PUT",
    headers: buildHeaders(token),
    body,
  });
  if (!res.ok) return NextResponse.json({ error: "Failed" }, { status: res.status });
  const data = await res.json();
  return NextResponse.json(data);
}

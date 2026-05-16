"use server"

import { cookies } from "next/headers"

const isProd = process.env.NODE_ENV === "production"
const SESSION_MAX_AGE = 7 * 24 * 60 * 60

export async function setAuthCookies(idToken: string, accessToken?: string, role?: string) {
  if (!idToken) return
  const store = await cookies()
  const base = { path: "/", secure: isProd, sameSite: "lax" as const, maxAge: SESSION_MAX_AGE }
  store.set("idToken", idToken, { ...base, httpOnly: true })
  store.set("token", idToken, { ...base, httpOnly: true })
  store.set("accessToken", accessToken || idToken, { ...base, httpOnly: false })
  if (role) store.set("user-role", role, { ...base, httpOnly: false })
}

export async function clearAuthCookies() {
  const store = await cookies()
  const base = { path: "/", secure: isProd, sameSite: "lax" as const, maxAge: 0 }
  store.set("idToken", "", { ...base, httpOnly: true })
  store.set("token", "", { ...base, httpOnly: true })
  store.set("accessToken", "", { ...base, httpOnly: false })
  store.set("refreshToken", "", { ...base, httpOnly: true })
  store.set("user-role", "", { ...base, httpOnly: false })
}

import { BASE_API_URL } from "@/actions/constant/BASE_API_URL"

const base = `${BASE_API_URL}/api/locations`

export async function clientGetAllRegions() {
  const res = await fetch(`${base}/regions`, { credentials: "include" })
  return res.ok ? res.json() : []
}

export async function clientGetAllCities(regionId?: string) {
  const url = regionId ? `${base}/cities?regionId=${regionId}` : `${base}/cities`
  const res = await fetch(url, { credentials: "include" })
  return res.ok ? res.json() : []
}

export async function clientAddCity(data: { name: string; regionId: string }) {
  const res = await fetch(`${base}/cities`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  const json = await res.json().catch(() => ({}))
  return { success: res.ok, data: json }
}

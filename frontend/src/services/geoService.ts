import { GEO_ENDPOINTS } from "@/actions/constant/constant";

export async function clientGetAllRegions() {
  const res = await fetch(GEO_ENDPOINTS.GET_ALL_REGIONS, { credentials: "include" });
  return res.ok ? res.json() : [];
}

export async function clientGetAllCities(regionId?: string) {
  const url = regionId
    ? `${GEO_ENDPOINTS.GET_ALL_CITIES}?regionId=${regionId}`
    : GEO_ENDPOINTS.GET_ALL_CITIES;
  const res = await fetch(url, { credentials: "include" });
  return res.ok ? res.json() : [];
}

export async function clientAddCity(data: { name: string; regionId: string }) {
  const res = await fetch(GEO_ENDPOINTS.ADD_CITY, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  return { success: res.ok, data: json };
}

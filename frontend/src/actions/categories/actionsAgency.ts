import { AGENCY_ENDPOINTS } from "../constant/constant";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";

export const getAgencyStats = async () => {
  const headers = await getAuthHeaders();
  const response = await fetch(AGENCY_ENDPOINTS.STATS, {
    headers: headers as HeadersInit,
    credentials: "include",
    cache: "no-store",
  });
  if (!response.ok) return { success: false, total: 0, verified: 0 };
  return await response.json();
};

export const fetchAgencies = async () => {
  const headers = await getAuthHeaders();
  const response = await fetch(AGENCY_ENDPOINTS.BASE, {
    headers: headers as HeadersInit,
    credentials: "include",
    cache: "no-store",
  });
  if (!response.ok) return [];
  const data = await response.json();
  return Array.isArray(data) ? data : data?.agencies || data?.data || [];
};

export const createAgency = async (agencyData: Record<string, unknown>) => {
  const headers = await getAuthHeaders();
  const response = await fetch(AGENCY_ENDPOINTS.BASE, {
    method: "POST",
    headers: headers as HeadersInit,
    credentials: "include",
    body: JSON.stringify(agencyData),
  });
  const result = (await response.json()) as Record<string, unknown> | null;
  return result;
};

export const updateAgency = async (
  id: string,
  agencyData: Record<string, unknown>,
) => {
  const headers = await getAuthHeaders();
  const response = await fetch(AGENCY_ENDPOINTS.BY_ID(id), {
    method: "PATCH",
    headers: headers as HeadersInit,
    credentials: "include",
    body: JSON.stringify(agencyData),
  });
  const result = (await response.json()) as Record<string, unknown> | null;
  return result;
};

export const deleteAgency = async (id: string) => {
  const headers = await getAuthHeaders();
  const response = await fetch(AGENCY_ENDPOINTS.BY_ID(id), {
    method: "DELETE",
    headers: headers as HeadersInit,
    credentials: "include",
  });
  const result = (await response.json()) as Record<string, unknown> | null;
  return result;
};

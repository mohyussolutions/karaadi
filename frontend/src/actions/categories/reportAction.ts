"use server";

import { REPORT_ENDPOINTS } from "../constant/constant";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";

export async function createReport(data: {
  userId: string;
  reason: string;
  details?: string;
  description?: string;
  itemType: string;
  itemId: string;
}) {
  const headers = await getAuthHeaders();
  const res = await fetch(REPORT_ENDPOINTS.CREATE, {
    method: "POST",
    headers: headers as HeadersInit,
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { success: false, error: body.error || body.message || "Failed to submit report" };
  }
  return body;
}

export async function getAllReports(
  params: {
    page?: number;
    limit?: number;
    status?: string;
    itemType?: string;
    search?: string;
  } = {},
) {
  const headers = await getAuthHeaders();
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) queryParams.append(key, value.toString());
  });

  const url = queryParams.toString()
    ? `${REPORT_ENDPOINTS.GET_ALL}?${queryParams.toString()}`
    : REPORT_ENDPOINTS.GET_ALL;

  const res = await fetch(url, {
    headers: headers as HeadersInit,
    cache: "no-store",
  });
  return res.ok ? res.json() : { data: { reports: [] } };
}

export async function getReportStats() {
  const headers = await getAuthHeaders();
  const res = await fetch(REPORT_ENDPOINTS.STATS, {
    headers: headers as HeadersInit,
    cache: "no-store",
  });
  return res.ok
    ? res.json()
    : { data: { total: 0, new: 0, inProgress: 0, resolved: 0 } };
}

export async function getUserReports(
  userId: string,
  params: { page?: number; limit?: number; search?: string } = {},
) {
  const headers = await getAuthHeaders();
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) queryParams.append(key, value.toString());
  });

  const url = queryParams.toString()
    ? `${REPORT_ENDPOINTS.USER_REPORTS(userId)}?${queryParams.toString()}`
    : REPORT_ENDPOINTS.USER_REPORTS(userId);

  const res = await fetch(url, {
    headers: headers as HeadersInit,
    cache: "no-store",
  });
  return res.ok ? res.json() : { data: { reports: [] } };
}

export async function getReportById(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(REPORT_ENDPOINTS.GET_BY_ID(id), {
    headers: headers as HeadersInit,
    cache: "no-store",
  });
  return res.ok ? res.json() : { success: false };
}

export async function updateReportStatus(
  id: string,
  data: { status: string; resolution?: string },
) {
  const headers = await getAuthHeaders();
  const res = await fetch(REPORT_ENDPOINTS.UPDATE_STATUS(id), {
    method: "PATCH",
    headers: headers as HeadersInit,
    body: JSON.stringify(data),
    cache: "no-store",
  });

  return await res.json();
}

export async function deleteReport(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(REPORT_ENDPOINTS.DELETE(id), {
    method: "DELETE",
    headers: headers as HeadersInit,
    cache: "no-store",
  });

  return await res.json();
}

export async function getTotalReports(): Promise<{ data: number }> {
  const headers = await getAuthHeaders();
  const res = await fetch(REPORT_ENDPOINTS.TOTAL, {
    headers: headers as HeadersInit,
    cache: "no-store",
  });
  return res.ok ? res.json() : { data: 0 };
}

export async function getReportsSummary(
  params: {
    page?: number;
    limit?: number;
    status?: string;
    itemType?: string;
    search?: string;
    fromDate?: string;
    toDate?: string;
  } = {},
) {
  const headers = await getAuthHeaders();
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) queryParams.append(key, value.toString());
  });
  const url = queryParams.toString()
    ? `${REPORT_ENDPOINTS.SUMMARY}?${queryParams.toString()}`
    : REPORT_ENDPOINTS.SUMMARY;
  const res = await fetch(url, { headers: headers as HeadersInit, cache: "no-store" });
  return res.ok
    ? res.json()
    : { success: false, data: { reports: [], pagination: { page: 1, limit: 10, total: 0, pages: 1 }, stats: null } };
}

export async function getTotalReportsForAdmin() {
  const [reportsData, statsData, totalData] = await Promise.all([
    getAllReports({ limit: 100 }),
    getReportStats(),
    getTotalReports(),
  ]);

  return {
    reports: reportsData.data?.reports || [],
    stats: statsData.data || {
      total: 0,
      new: 0,
      inProgress: 0,
      resolved: 0,
    },
    total: totalData.data || 0,
    pagination: reportsData.data?.pagination || null,
  };
}

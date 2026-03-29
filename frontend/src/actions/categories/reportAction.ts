"use server";

import { REPORT_ENDPOINTS } from "../constant/constant";
import { revalidatePath, revalidateTag } from "next/cache";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";

interface ReportData {
  userId: string;
  reason: string;
  details?: string;
  description?: string;
  itemType: string;
  itemId: string;
}

interface UpdateStatusData {
  status: string;
  resolution?: string;
}

interface PaginationParams {
  page?: number;
  limit?: number;
  status?: string;
  itemType?: string;
  search?: string;
}

const addCacheBuster = (url: string) => {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}_t=${Date.now()}`;
};

export async function createReport(data: ReportData) {
  try {
    const headers = await getAuthHeaders();
    const url = addCacheBuster(REPORT_ENDPOINTS.CREATE);

    const response = await fetch(url, {
      method: "POST",
      headers: headers as HeadersInit,
      credentials: "include",
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const result = await response.json();
    revalidateTag("reports");
    revalidatePath("/admin/reports");
    return result;
  } catch (error) {
    console.error("Create report error:", error);
    return { success: false, error: "Failed to create report" };
  }
}

export async function getAllReports(params: PaginationParams = {}) {
  try {
    const headers = await getAuthHeaders();
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.status) queryParams.append("status", params.status);
    if (params.itemType) queryParams.append("itemType", params.itemType);
    if (params.search) queryParams.append("search", params.search);

    const url =
      Object.keys(params).length > 0
        ? `${REPORT_ENDPOINTS.GET_ALL}?${queryParams.toString()}`
        : REPORT_ENDPOINTS.GET_ALL;

    const response = await fetch(addCacheBuster(url), {
      headers: headers as HeadersInit,
      credentials: "include",
      cache: "no-store",
    });
    return await response.json();
  } catch (error) {
    console.error("Get reports error:", error);
    return { data: { reports: [] }, error: "Failed to fetch reports" };
  }
}

export async function getReportStats() {
  try {
    const headers = await getAuthHeaders();
    const url = addCacheBuster(REPORT_ENDPOINTS.STATS);

    const response = await fetch(url, {
      headers: headers as HeadersInit,
      credentials: "include",
      cache: "no-store",
    });
    return await response.json();
  } catch (error) {
    console.error("Get stats error:", error);
    return { data: { total: 0, new: 0, inProgress: 0, resolved: 0 } };
  }
}

export async function getUserReports(
  userId: string,
  params: Omit<PaginationParams, "status" | "itemType"> = {},
) {
  try {
    const headers = await getAuthHeaders();
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);

    const url =
      Object.keys(params).length > 0
        ? `${REPORT_ENDPOINTS.USER_REPORTS(userId)}?${queryParams.toString()}`
        : REPORT_ENDPOINTS.USER_REPORTS(userId);

    const response = await fetch(addCacheBuster(url), {
      headers: headers as HeadersInit,
      credentials: "include",
      cache: "no-store",
    });
    return await response.json();
  } catch (error) {
    console.error("Get user reports error:", error);
    return { data: { reports: [] } };
  }
}

export async function getReportById(id: string) {
  try {
    const headers = await getAuthHeaders();
    const url = addCacheBuster(REPORT_ENDPOINTS.GET_BY_ID(id));

    const response = await fetch(url, {
      headers: headers as HeadersInit,
      credentials: "include",
      cache: "no-store",
    });
    return await response.json();
  } catch (error) {
    console.error("Get report by id error:", error);
    return { success: false, error: "Failed to fetch report" };
  }
}

export async function updateReportStatus(id: string, data: UpdateStatusData) {
  try {
    const headers = await getAuthHeaders();
    const url = addCacheBuster(REPORT_ENDPOINTS.UPDATE_STATUS(id));

    const response = await fetch(url, {
      method: "PATCH",
      headers: headers as HeadersInit,
      credentials: "include",
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const result = await response.json();
    revalidateTag("reports");
    revalidateTag(`report-${id}`);
    revalidatePath("/admin/reports");
    return result;
  } catch (error) {
    console.error("Update status error:", error);
    return { success: false, error: "Failed to update status" };
  }
}

export async function deleteReport(id: string) {
  try {
    const headers = await getAuthHeaders();
    const url = addCacheBuster(REPORT_ENDPOINTS.DELETE(id));

    const response = await fetch(url, {
      method: "DELETE",
      headers: headers as HeadersInit,
      credentials: "include",
      cache: "no-store",
    });

    const result = await response.json();
    revalidateTag("reports");
    revalidatePath("/admin/reports");
    return result;
  } catch (error) {
    console.error("Delete report error:", error);
    return { success: false, error: "Failed to delete report" };
  }
}

export async function getTotalReports() {
  try {
    const headers = await getAuthHeaders();
    const url = addCacheBuster(REPORT_ENDPOINTS.TOTAL);

    const response = await fetch(url, {
      headers: headers as HeadersInit,
      credentials: "include",
      cache: "no-store",
    });
    return await response.json();
  } catch (error) {
    console.error("Get total reports error:", error);
    return { data: 0 };
  }
}

export async function getTotalReportsForAdmin() {
  try {
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
        done: 0,
        resolved: 0,
        closed: 0,
        byItemType: [],
        topReasons: [],
      },
      total: totalData.data || 0,
      pagination: reportsData.data?.pagination || null,
    };
  } catch (error) {
    console.error("Get total reports error:", error);
    return {
      reports: [],
      stats: { total: 0, new: 0, inProgress: 0, resolved: 0 },
      total: 0,
      pagination: null,
    };
  }
}

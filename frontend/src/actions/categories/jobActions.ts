"use server";

import { jobsEndpoint } from "../constant/constant";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";

export interface CreateJobData {
  title: string;
  description: string;
  company: string;
  location: string;
  salary: number;
  type: string;
  city: string;
  region: string;
  isPaid: boolean;
}

export interface Job {
  _id: string;
  id: string;
  user: string;
  title: string;
  description: string;
  salary: number;
  location: string;
  company: string;
  type: string;
  city: string;
  region: string;
  isPaid: boolean;
  createdAt?: string;
  companyLogo?: string;
  images?: string[];
}

const transformJobItem = (item: any): Job => {
  const id = String(item._id || item.id || "");
  const city = item.city || "";
  const region = item.region || "";

  return {
    _id: id,
    id: id,
    user: String(item.user || ""),
    title: String(item.title || ""),
    description: String(item.description || ""),
    salary: Number(item.salary) || 0,
    location: item.location || `${city}, ${region}`.trim(),
    company: String(item.company || ""),
    type: item.type || item.employmentType || "Full-time",
    city,
    region,
    isPaid: item.isPaid ?? true,
    createdAt: item.createdAt,
    companyLogo: item.companyLogo || item.logo || "",
    images: Array.isArray(item.images) ? item.images : [],
  };
};

export const getJobs = async (page = 1, pageSize = 20): Promise<Job[]> => {
  const res = await fetch(`${jobsEndpoint.GET_ALL}?page=${page}&pageSize=${pageSize}`, {
    cache: "no-store",
  });

  if (!res.ok) return [];
  const data = await res.json();
  const list = Array.isArray(data) ? data : data.jobs || data.data || [];
  return list.map(transformJobItem);
};

export const getJobById = async (id: string): Promise<Job | null> => {
  const headers = await getAuthHeaders();
  const res = await fetch(jobsEndpoint.GET_BY_ID(id), {
    headers: headers as HeadersInit,
    cache: "no-store",
  });

  if (!res.ok) return null;
  const data = await res.json();
  const item = Array.isArray(data) ? data[0] : data;
  return item ? transformJobItem(item) : null;
};

export const getTotalJobs = async (): Promise<number> => {
  const headers = await getAuthHeaders();
  const res = await fetch(jobsEndpoint.TOTAL, {
    headers: headers as HeadersInit,
    cache: "no-store",
  });

  if (!res.ok) return 0;
  const data = await res.json();
  return data.total || data.count || 0;
};

export const createJob = async (
  data: CreateJobData,
): Promise<{ success: boolean; data?: any; message?: string }> => {
  const headers = await getAuthHeaders();
  const res = await fetch(jobsEndpoint.CREATE, {
    method: "POST",
    headers: headers as HeadersInit,
    body: JSON.stringify(data),
  });
  const responseData = await res.json();
  if (!res.ok) {
    return {
      success: false,
      message: responseData.message || "Failed to create job",
    };
  }
  return { success: true, data: responseData };
};

export const updateJob = async (
  id: string,
  data: Partial<CreateJobData>,
): Promise<{ success: boolean; data?: any; message?: string }> => {
  const headers = await getAuthHeaders();
  const res = await fetch(jobsEndpoint.UPDATE(id), {
    method: "PUT",
    headers: headers as HeadersInit,
    body: JSON.stringify(data),
  });
  const responseData = await res.json();
  if (!res.ok) {
    return {
      success: false,
      message: responseData.message || "Failed to update job",
    };
  }
  return { success: true, data: responseData };
};

export const deleteJob = async (
  id: string,
): Promise<{ success: boolean; message?: string }> => {
  const headers = await getAuthHeaders();
  const res = await fetch(jobsEndpoint.DELETE(id), {
    method: "DELETE",
    headers: headers as HeadersInit,
  });
  if (!res.ok) {
    return { success: false, message: "Failed to delete job" };
  }
  return { success: true };
};

export async function formatSalary(salary: number): Promise<string> {
  if (typeof salary !== "number" || isNaN(salary)) return "N/A";
  return salary.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

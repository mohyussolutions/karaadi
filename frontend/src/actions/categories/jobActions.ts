"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { jobsEndpoint } from "../constant/constant";

export interface Job {
  _id: string;
  id?: string;
  user: string;
  title: string;
  description: string;
  salary?: number;
  location: string;
  company: string;
  type: "Full-time" | "Part-time" | "Contract" | "Remote";
  city?: string;
  region?: string;
  employmentType?: string;
  isPaid?: boolean;
  createdAt?: string;
}

export interface CreateJobData {
  title: string;
  description: string;
  company: string;
  location: string;
  salary?: number;
  type: "Full-time" | "Part-time" | "Contract" | "Remote";
  city?: string;
  region?: string;
  isPaid?: boolean;
}

async function getAuthHeaders(token?: string) {
  const cookieStore = await cookies();
  const cookieToken =
    cookieStore.get("idToken")?.value || cookieStore.get("accessToken")?.value;
  const authToken = token || cookieToken;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  return headers;
}

function transformJobItem(item: any): Job {
  const location = item.location || "";
  const [city = "", region = ""] = location
    .split(",")
    .map((s: string) => s.trim());

  return {
    ...item,
    _id: item._id || item.id,
    id: item.id || item._id,
    type: item.type || item.employmentType || "Full-time",
    employmentType: item.employmentType || item.type || "Full-time",
    city: item.city || city,
    region: item.region || region,
    company: item.company || "",
    description: item.description || "",
    salary: item.salary || 0,
    location:
      item.location || `${item.city || city}, ${item.region || region}`.trim(),
  } as Job;
}

export async function getJobs(): Promise<Job[]> {
  try {
    const response = await fetch(jobsEndpoint.GET_ALL, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Failed to fetch jobs: ${response.status}`);
      return [];
    }

    const result = await response.json();
    const list = Array.isArray(result)
      ? result
      : result?.data || result?.items || [];

    return list.map(transformJobItem);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
}

export async function fetchJobs(token?: string): Promise<Job[]> {
  try {
    const headers = await getAuthHeaders(token);
    const response = await fetch(jobsEndpoint.GET_ALL, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Failed to fetch admin jobs: ${response.status}`);
      return [];
    }

    const result = await response.json();
    const list = Array.isArray(result)
      ? result
      : result?.data || result?.items || [];

    return list.map(transformJobItem);
  } catch (error) {
    console.error("Error fetching admin jobs:", error);
    return [];
  }
}

export async function getTotalJobs(token?: string): Promise<number> {
  try {
    const headers = await getAuthHeaders(token);
    const response = await fetch(jobsEndpoint.GET_TOTAL, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Failed to fetch total jobs: ${response.status}`);
      return 0;
    }

    const result = await response.json();
    return typeof result === "number"
      ? result
      : result.total || result.count || 0;
  } catch (error) {
    console.error("Error fetching total jobs:", error);
    return 0;
  }
}

export async function getJobById(
  id: string,
  token?: string,
): Promise<Job | null> {
  try {
    const headers = await getAuthHeaders(token);
    const response = await fetch(jobsEndpoint.GET_BY_ID(id), {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Failed to fetch job ${id}: ${response.status}`);
      return null;
    }

    const item = await response.json();
    return transformJobItem(item);
  } catch (error) {
    console.error("Error fetching job by id:", error);
    return null;
  }
}

export async function createJob(
  data: CreateJobData,
  token?: string,
): Promise<{ success: boolean; job?: Job; error?: string; message?: string }> {
  try {
    const headers = await getAuthHeaders(token);

    const jobData = {
      title: data.title,
      description: data.description,
      company: data.company,
      location:
        data.location || `${data.city || ""}, ${data.region || ""}`.trim(),
      salary: data.salary,
      type: data.type,
      isPaid: data.isPaid ?? true,
    };

    const response = await fetch(jobsEndpoint.CREATE, {
      method: "POST",
      headers,
      body: JSON.stringify(jobData),
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || result.error || "Failed to create job",
        message: result.message,
      };
    }

    const job = transformJobItem(result);

    revalidateTag("jobs");
    revalidateTag("jobs-total");
    revalidatePath("/jobs");
    revalidatePath("/admin/jobs");

    return {
      success: true,
      job,
      message: "Job listing created successfully.",
    };
  } catch (error) {
    console.error("Error creating job:", error);
    return { success: false, error: "Network error", message: "Network error" };
  }
}

export async function updateJob(
  id: string,
  data: Partial<CreateJobData>,
  token?: string,
): Promise<{ success: boolean; error?: string; message?: string }> {
  try {
    const headers = await getAuthHeaders(token);

    const jobData: Record<string, any> = { ...data };

    if (data.city || data.region) {
      jobData.location = `${data.city || ""}, ${data.region || ""}`.trim();
      delete jobData.city;
      delete jobData.region;
    }

    const response = await fetch(jobsEndpoint.UPDATE(id), {
      method: "PUT",
      headers,
      body: JSON.stringify(jobData),
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || result.error || "Failed to update job",
        message: result.message,
      };
    }

    revalidateTag(`job-${id}`);
    revalidateTag("jobs");
    revalidatePath(`/jobs/${id}`);
    revalidatePath("/jobs");
    revalidatePath("/admin/jobs");

    return {
      success: true,
      message: "Job listing updated successfully.",
    };
  } catch (error) {
    console.error("Error updating job:", error);
    return { success: false, error: "Network error", message: "Network error" };
  }
}

export async function deleteJob(
  id: string,
  token?: string,
): Promise<{ success: boolean; error?: string; message?: string }> {
  try {
    const headers = await getAuthHeaders(token);
    const response = await fetch(jobsEndpoint.DELETE(id), {
      method: "DELETE",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      return {
        success: false,
        error: result.message || "Failed to delete job",
        message: result.message,
      };
    }

    revalidateTag(`job-${id}`);
    revalidateTag("jobs");
    revalidateTag("jobs-total");
    revalidatePath("/jobs");
    revalidatePath("/admin/jobs");

    return {
      success: true,
      message: "Job listing deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting job:", error);
    return { success: false, error: "Network error", message: "Network error" };
  }
}

export async function formatSalary(salary?: number): Promise<string> {
  if (!salary) return "Not specified";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(salary);
}

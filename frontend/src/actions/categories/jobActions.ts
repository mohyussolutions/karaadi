"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { jobsEndpoint } from "../constant/constant";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";

export type EmploymentType = "Full-time" | "Part-time" | "Contract" | "Remote";

export interface Job {
  _id: string;
  id: string;
  user: string;
  title: string;
  description: string;
  salary?: number;
  location: string;
  company: string;
  type: EmploymentType;
  city: string;
  region: string;
  employmentType: EmploymentType;
  isPaid: boolean;
  createdAt?: string;
}

export interface CreateJobData {
  title: string;
  description: string;
  company: string;
  location: string;
  salary?: number;
  type: EmploymentType;
  city: string;
  region: string;
  isPaid: boolean;
}

function transformJobItem(item: any): Job {
  const location = item.location || "";
  const [city = "", region = ""] = location
    .split(",")
    .map((s: string) => s.trim());

  const type = (item.type ||
    item.employmentType ||
    "Full-time") as EmploymentType;

  return {
    _id: item._id || item.id,
    id: item.id || item._id,
    user: item.user || "",
    title: item.title || "",
    description: item.description || "",
    salary: item.salary || 0,
    location:
      item.location || `${item.city || city}, ${item.region || region}`.trim(),
    company: item.company || "",
    type,
    employmentType: type,
    city: item.city || city,
    region: item.region || region,
    isPaid: item.isPaid ?? true,
    createdAt: item.createdAt,
  };
}

export async function getJobs(): Promise<Job[]> {
  try {
    const response = await fetch(jobsEndpoint.GET_ALL, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 503) {
        return [];
      } else {
        return [];
      }
    }

    const result = await response.json();

    let list: any[] = [];
    if (Array.isArray(result)) {
      list = result;
    } else if (Array.isArray(result.jobs)) {
      list = result.jobs;
      if (result.error) {
        console.warn("Jobs API warning:", result.error);
      }
    } else {
      list = result?.data || result?.items || [];
    }
    return list.map(transformJobItem);
  } catch (error) {
    return [];
  }
}

export async function fetchJobs(token?: string): Promise<Job[]> {
  try {
    const headers = await getAuthHeaders(token);
    const response = await fetch(jobsEndpoint.GET_ALL, {
      method: "GET",
      headers: headers as HeadersInit,
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const result = await response.json();
    const list = Array.isArray(result)
      ? result
      : result?.data || result?.items || [];

    return list.map(transformJobItem);
  } catch (error) {
    return [];
  }
}

export async function getTotalJobs(token?: string): Promise<number> {
  try {
    const headers = await getAuthHeaders(token);
    const response = await fetch(jobsEndpoint.GET_TOTAL, {
      method: "GET",
      headers: headers as HeadersInit,
      cache: "no-store",
    });

    if (!response.ok) {
      return 0;
    }

    const result = await response.json();
    return typeof result === "number"
      ? result
      : result.total || result.count || 0;
  } catch (error) {
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
      headers: headers as HeadersInit,
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const item = await response.json();
    return transformJobItem(item);
  } catch (error) {
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
      location: data.location || `${data.city}, ${data.region}`.trim(),
      salary: data.salary,
      type: data.type,
      isPaid: data.isPaid,
    };

    const response = await fetch(jobsEndpoint.CREATE, {
      method: "POST",
      headers: headers as HeadersInit,
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
      headers: headers as HeadersInit,
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
      headers: headers as HeadersInit,
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

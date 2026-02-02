"use server";

import { revalidatePath } from "next/cache";
import { apiUrlsForCategoryTotals } from "../constant/constant";

export type Job = {
  _id: string;
  user: string;
  title: string;
  description: string;
  salary?: number;
  location: string;
  company: string;
  type: "Full-time" | "Part-time" | "Contract" | "Remote";
};

type CreateJobData = {
  title: string;
  description: string;
  salary?: number;
  location: string;
  company: string;
  type: "Full-time" | "Part-time" | "Contract" | "Remote";
};

export async function getJobs(): Promise<Job[]> {
  try {
    const response = await fetch(apiUrlsForCategoryTotals.Jobs, {
      method: "GET",
      next: { tags: ["jobs"], revalidate: 60 },
    });

    if (!response.ok) {
      return [];
    }

    const result = await response.json();
    const list = Array.isArray(result)
      ? result
      : Array.isArray(result?.data)
        ? result.data
        : [];
    return list.map((item: any) => ({
      ...item,
      _id: item._id || item.id,
    })) as Job[];
  } catch (error) {
    return [];
  }
}

export async function getJobById(id: string): Promise<Job | null> {
  try {
    const response = await fetch(`${apiUrlsForCategoryTotals.Jobs}/${id}`, {
      method: "GET",
      next: { tags: [`job-${id}`], revalidate: 3600 },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch job ${id}:`,
        response.status,
        response.statusText,
      );
      return null;
    }

    const item: any = await response.json();
    return {
      ...item,
      _id: item._id || item.id,
    } as Job;
  } catch (error) {
    console.error(`Network error fetching job ${id}:`, error);
    return null;
  }
}

export async function createJobListing(data: CreateJobData, token: string) {
  try {
    const response = await fetch(apiUrlsForCategoryTotals.Jobs, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to create job listing in backend.",
      };
    }

    revalidatePath("/jobs");
    return {
      success: true,
      message: "Job listing created successfully.",
      jobId: result.id,
    };
  } catch (error) {
    return { success: false, message: "Network error or unable to reach API." };
  }
}

export async function updateJobListing(
  id: string,
  data: Partial<CreateJobData>,
  token: string,
) {
  try {
    const response = await fetch(`${apiUrlsForCategoryTotals.Jobs}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to update job listing in backend.",
      };
    }

    revalidatePath(`/jobs/${id}`);
    revalidatePath("/jobs");
    return {
      success: true,
      message: "Job listing updated successfully.",
      jobId: result.id,
    };
  } catch (error) {
    return { success: false, message: "Network error or unable to reach API." };
  }
}

export async function deleteJobListing(id: string, token: string) {
  try {
    const response = await fetch(`${apiUrlsForCategoryTotals.Jobs}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const result = await response.json();
      return {
        success: false,
        message: result.message || "Failed to delete job listing in backend.",
      };
    }

    revalidatePath("/jobs");
    return { success: true, message: "Job listing deleted successfully." };
  } catch (error) {
    return { success: false, message: "Network error or unable to reach API." };
  }
}

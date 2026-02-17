"use server";

import { revalidatePath, revalidateTag } from "next/cache";
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

type CreateJobData = Omit<Job, "_id" | "user">;

export async function getJobs(): Promise<Job[]> {
  try {
    const response = await fetch(apiUrlsForCategoryTotals.Jobs, {
      method: "GET",
      next: {
        revalidate: 600,
        tags: ["jobs"],
      },
    });

    if (!response.ok) return [];

    const result = await response.json();
    const list = Array.isArray(result)
      ? result
      : result?.data || result?.items || [];

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
      next: {
        revalidate: 3600,
        tags: [`job-${id}`],
      },
    });

    if (!response.ok) return null;

    const item: any = await response.json();
    return {
      ...item,
      _id: item._id || item.id,
    } as Job;
  } catch (error) {
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
    if (!response.ok) return { success: false, message: result.message };

    revalidateTag("jobs");
    revalidatePath("/jobs");

    return {
      success: true,
      message: "Job listing created successfully.",
      jobId: result.id || result._id,
    };
  } catch (error) {
    return { success: false, message: "Network error." };
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
    if (!response.ok) return { success: false, message: result.message };

    revalidateTag(`job-${id}`);
    revalidateTag("jobs");
    revalidatePath(`/jobs/${id}`);
    revalidatePath("/jobs");

    return {
      success: true,
      message: "Job listing updated successfully.",
      jobId: id,
    };
  } catch (error) {
    return { success: false, message: "Network error." };
  }
}

export async function deleteJobListing(id: string, token: string) {
  try {
    const response = await fetch(`${apiUrlsForCategoryTotals.Jobs}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) return { success: false, message: "Delete failed." };

    revalidateTag(`job-${id}`);
    revalidateTag("jobs");
    revalidatePath("/jobs");

    return { success: true, message: "Job listing deleted successfully." };
  } catch (error) {
    return { success: false, message: "Network error." };
  }
}

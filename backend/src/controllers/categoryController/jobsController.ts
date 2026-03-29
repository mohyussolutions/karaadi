import { Request, Response } from "express";
import { CACHE_KEYS, CACHE_TTL } from "src/constants/config.constants.ts";

import prisma from "src/core/utils/db.ts";
import { calculateExpiryDate, isExpired } from "src/hooks/useExpire.ts";
import cacheManager from "src/services/redisserver/cacheManager.ts";

const selectUserBasic = {
  select: { username: true, email: true, phone: true, profileImage: true },
};

export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const cacheKey = CACHE_KEYS.JOBS_ALL_PAID;
    const jobs = await cacheManager.withCache(
      cacheKey,
      async () => {
        return await prisma.job.findMany({
          where: { isPaid: true },
          include: { user: selectUserBasic },
          orderBy: { createdAt: "desc" },
        });
      },
      CACHE_TTL.LIST,
    );

    const jobsWithStatus = jobs.map((job: any) => ({
      ...job,
      status: isExpired(job.expiryDate) ? "expired" : "active",
    }));

    return res.json(jobsWithStatus);
  } catch (error) {
    console.error("[Jobs API] getAllJobs error:", error);
    return res
      .status(200)
      .json({ jobs: [], error: "Jobs unavailable. Please try again later." });
  }
};

export const getTotalJobs = async (req: Request, res: Response) => {
  try {
    const cacheKey = CACHE_KEYS.JOBS_TOTAL_COUNT;
    const totalCount = await cacheManager.withCache(
      cacheKey,
      async () => {
        return await prisma.job.count({
          where: { isPaid: true },
        });
      },
      CACHE_TTL.SHORT,
    );

    return res.json({ total: totalCount });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getJobById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const job = await prisma.job.findUnique({
      where: { id },
      include: { user: selectUserBasic },
    });

    if (!job) return res.status(404).json({ message: "Job not found" });

    return res.json({
      ...job,
      isExpired: isExpired(job.expiryDate),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const deleteJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const deletedJob = await prisma.job.delete({
      where: { id },
    });

    await cacheManager.delete(CACHE_KEYS.JOBS_ALL_PAID);
    await cacheManager.delete(CACHE_KEYS.JOBS_TOTAL_COUNT);

    return res.json({ message: "Job deleted", job: deletedJob });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const createJob = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const expiryDate =
      data.planId && data.planAmount
        ? calculateExpiryDate(data.planId, data.planAmount)
        : null;

    const newJob = await prisma.job.create({
      data: {
        ...data,
        expiryDate,
        isPaid: data.isPaid || false,
      },
    });

    await cacheManager.delete(CACHE_KEYS.JOBS_ALL_PAID);
    await cacheManager.delete(CACHE_KEYS.JOBS_TOTAL_COUNT);

    return res.status(201).json(newJob);
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: "Create failed", error: err.message });
  }
};

"use client";

import React from "react";
import Link from "next/link";
import { JobPosting, jobPostingsData } from "./data.for.jobs";
import JobCard from "@/app/(storeFront)/components/Cards/JobCard";

const Jobs = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
          Shaqooyinka
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {jobPostingsData.map((job) => {
            const detailUrl = `/jobs/${job.id}`;
            return (
              <Link
                key={job.id}
                href={detailUrl}
                prefetch={false}
                className="block h-full"
              >
                <JobCard job={job} jobTypeColor={job.categoryTitle} />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Jobs;

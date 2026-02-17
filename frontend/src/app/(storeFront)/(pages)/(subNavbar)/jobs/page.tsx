"use client";

import React from "react";
import Link from "next/link";
import { jobPostingsData } from "./data.for.jobs";
import JobCard from "@/app/(storeFront)/components/Cards/JobCard";

const Jobs = () => {
  return (
    <div className="container mx-auto px-4 py-4">
      <div className="max-w-6xl mx-auto">
        <div className="px-4 mb-6 flex justify-between items-center border-b border-gray-100 pb-2">
          <h2 className="text-lg font-medium text-gray-700 uppercase tracking-tight">
            Shaqooyinka Banaan
            <span className="ml-2 text-blue-500 text-base">
              ({jobPostingsData.length})
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {jobPostingsData.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              prefetch={true}
              className="block transition-transform duration-200 hover:-translate-y-1"
            >
              <JobCard job={job} jobTypeColor={job.categoryTitle} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Jobs;

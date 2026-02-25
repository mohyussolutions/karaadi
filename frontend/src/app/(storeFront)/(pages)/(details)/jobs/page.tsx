"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import JobCard from "@/app/(storeFront)/components/Cards/JobCard";
import { jobLinks } from "@/app/(links)/storeFrontLinks/jobLink";

interface ApiJob {
  id: string;
  title: string;
  company?: string;
  city: string;
  region: string;
  employmentType: string;
}

const Jobs = () => {
  const [jobs, setJobs] = useState<ApiJob[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/jobs");
        const data: ApiJob[] = await response.json();
        setJobs(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-2 mb-8">
          {jobLinks.map((link, index) => (
            <Link
              key={index}
              href={`/${link.url}`}
              className="px-4 py-2 bg-gray-100 hover:bg-blue-500 hover:text-white rounded-full text-sm font-medium transition-colors border border-gray-200"
            >
              {link.title}
            </Link>
          ))}
        </div>

        <div className="px-4 mb-6 flex justify-between items-center border-b border-gray-100 pb-2">
          <h2 className="text-lg font-medium text-gray-700 uppercase tracking-tight">
            Shaqooyinka Banaan
            <span className="ml-2 text-blue-500 text-base">
              ({jobs.length})
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              prefetch={true}
              className="block transition-transform duration-200 hover:-translate-y-1"
            >
              <JobCard
                job={{
                  title: job.title,
                  company: job.company || "Company Name",
                  location: `${job.city}, ${job.region}`,
                }}
                jobTypeLabel={job.employmentType}
                jobTypeColor="bg-blue-600"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Jobs;

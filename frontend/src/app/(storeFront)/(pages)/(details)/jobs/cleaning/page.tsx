"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import JobCard from "@/app/(storeFront)/components/Cards/JobCard";

interface ApiJob {
  id: string;
  title: string;
  company?: string;
  city: string;
  region: string;
  category: string[];
  employmentType: string;
}

function Cleaning() {
  const [jobs, setJobs] = useState<ApiJob[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((job: ApiJob) =>
          job.category.includes("Public"),
        );
        setJobs(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.company &&
        job.company.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-6">
        <Link
          href="/jobs"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors mb-4"
        >
          <FaArrowLeft className="mr-2" />
          Back to All Jobs
        </Link>

        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search cleaning and public jobs..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border-b border-gray-100 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Public & Cleaning Jobs
        </h1>
        <p className="text-gray-500 text-sm">
          Showing {filteredJobs.length} results
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-pulse text-indigo-600 font-medium text-lg">
            Loading jobs...
          </div>
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={{
                title: job.title,
                company: job.company || "Company Name",
                location: `${job.city}, ${job.region}`,
              }}
              jobTypeLabel={job.employmentType}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-lg">
            No positions found matching your search.
          </p>
          <button
            onClick={() => setSearchTerm("")}
            className="mt-2 text-indigo-600 font-semibold underline"
          >
            Show all public jobs
          </button>
        </div>
      )}
    </div>
  );
}

export default Cleaning;

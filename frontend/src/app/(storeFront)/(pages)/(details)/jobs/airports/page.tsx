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

function Airports() {
  const [jobs, setJobs] = useState<ApiJob[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((job: ApiJob) =>
          job.category.includes("Airport"),
        );
        setJobs(filtered);
      })
      .catch((err) => console.error(err));
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
            placeholder="Search airport and aviation jobs..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border-b border-gray-100 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Airport & Aviation Jobs
        </h1>
        <p className="text-gray-500 text-sm">
          Found {filteredJobs.length} open positions
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJobs.map((job) => (
          <JobCard
            key={job.id}
            job={{
              title: job.title,
              company: job.company || "Airport Authority",
              location: `${job.city}, ${job.region}`,
            }}
            jobTypeLabel={job.employmentType}
          />
        ))}
      </div>

      {searchTerm && filteredJobs.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-lg">
            No airport jobs match "{searchTerm}"
          </p>
          <button
            onClick={() => setSearchTerm("")}
            className="mt-2 text-indigo-600 font-semibold underline"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}

export default Airports;

"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BASE_API_URL } from "@/actions/constant/BASE_API_URL";
import Link from "next/link";
import { FaArrowLeft, FaSearch } from "@/app/utils/icons";
import JobCard from "@/app/(storeFront)/components/Cards/categoriesCards/JobCard";

interface ApiJob {
  id: string;
  title: string;
  company?: string;
  city: string;
  region: string;
  category: string[];
  employmentType: string;
  salary?: string;
  createdAt: string;
}

export default function PublicJobs() {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState<ApiJob[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_API_URL}/api/jobs`)
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
          {t("jobsPage.backToAll")}
        </Link>

        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </span>
          <input
            type="text"
            placeholder={t("jobsPage.searchPlaceholder")}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border-b border-gray-100 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {t("jobsPage.cleaningTitle")}
        </h1>
        <p className="text-gray-500 text-sm">
          {t("jobsPage.foundCount", { count: filteredJobs.length })}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-pulse text-indigo-600 font-medium text-lg">
            {t("jobsPage.loading")}
          </div>
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              id={job.id}
              title={job.title}
              company={job.company || "Company Name"}
              location={`${job.city}, ${job.region}`}
              type={job.employmentType}
              salary={job.salary}
              createdAt={job.createdAt}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-lg">
            {t("jobsPage.noResults", { query: searchTerm })}
          </p>
          <button
            onClick={() => setSearchTerm("")}
            className="mt-2 text-indigo-600 font-semibold underline"
          >
            {t("jobsPage.backToAll")}
          </button>
        </div>
      )}
    </div>
  );
}

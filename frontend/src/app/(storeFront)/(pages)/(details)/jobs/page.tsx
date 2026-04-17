"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { BASE_API_URL } from "@/actions/constant/BASE_API_URL";
import { jobQuickLinks } from "@/app/(links)/storeFrontLinks/subCategories";
import JobCard from "@/app/(storeFront)/components/Cards/categoriesCards/JobCard";

interface ApiJob {
  id: string;
  title: string;
  company?: string;
  city: string;
  region: string;
  employmentType: string;
}

const Jobs = () => {
  const { t, i18n } = useTranslation();
  const [jobs, setJobs] = useState<ApiJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${BASE_API_URL}/api/jobs`);
        if (!response.ok) throw new Error("Failed to fetch");
        const data: ApiJob[] = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Error loading jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <nav className="mb-10 -mx-2 px-2 overflow-x-auto no-scrollbar flex flex-nowrap gap-3 pb-4">
          {jobQuickLinks.map((link) => {
            if (!link.href) return null;
            const slug = link.href.replace(/^\/jobs\//, "").replace(/^\//, "");
            let label = t(`jobs.links.${slug}`);

            if (slug === "it") label = t("jobsPage.itLink");
            if (slug === "airports") label = t("jobsPage.airportsLink");
            if (slug === "public") label = t("jobsPage.publicLink");
            if (slug === "seaport") label = t("jobsPage.seaportLink");

            const linkTextClass =
              i18n.language === "so" ? "text-base sm:text-lg" : "text-sm";

            return (
              <Link
                key={link.key}
                href={link.href}
                className={`whitespace-nowrap px-5 py-2.5 text-black border border-gray-200 hover:border-blue-500 hover:text-blue-600 rounded-xl font-semibold transition-all duration-300 ${linkTextClass}`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <header className="mb-8 flex justify-between items-end border-b border-gray-100 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {t("jobsPage.heading")}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {t("jobsPage.foundCount", { count: jobs.length })}
            </p>
          </div>
          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-xs font-bold uppercase">
            {t("jobsPage.latestUpdates")}
          </span>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-100 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                id={job.id}
                title={job.title}
                company={job.company || "Company Name"}
                location={`${job.city}, ${job.region}`}
                type={job.employmentType}
                createdAt={""}
                salary={undefined}
              />
            ))}
          </div>
        )}

        {!isLoading && jobs.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400">
              {t("jobsPage.noResults", { query: "" })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;

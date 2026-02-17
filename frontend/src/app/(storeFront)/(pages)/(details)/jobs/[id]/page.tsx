"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FaBuilding,
  FaArrowLeft,
  FaMoneyBillWave,
  FaBriefcase,
} from "react-icons/fa6";
import { FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";
import { getJobById, getJobs } from "@/actions/categories/jobActions";
import UniversalCard from "@/app/(storeFront)/components/Cards/UniversalCard";
import WantSell from "@/app/(storeFront)/components/shared/wantSellInk/page";
import PathSegmentsDisplay from "../../historyPath/pathSegmentsDisplay";
import SearchInput from "@/app/(search)/SearchInput";

interface JobItem {
  _id: string;
  title: string;
  company: string;
  location: string;
  salary?: string | number;
  type: string;
  description: string;
  images?: string[];
}

const JobDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [job, setJob] = useState<JobItem | null>(null);
  const [relatedJobs, setRelatedJobs] = useState<JobItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [jobData, allJobs] = await Promise.all([
          getJobById(id),
          getJobs(),
        ]);

        if (mounted) {
          if (jobData) {
            setJob(jobData as JobItem);
          }
          if (allJobs) {
            const jobsList = allJobs as JobItem[];
            setRelatedJobs(jobsList.filter((j) => j._id !== id).slice(0, 4));
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (isLoading) return <div className="min-h-screen bg-white" />;

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8 flex items-center justify-center">
        <div className="text-center text-gray-700 bg-white p-10 rounded-3xl shadow-xl border border-gray-100 max-w-md">
          <div className="flex justify-center mb-4">
            <FaBriefcase size={50} className="text-gray-300" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Shaqada lama helin</h1>
          <p className="text-gray-500 mb-6">
            Shaqadan aad raadinayso ma jirto ama waa laga saaray bogga.
          </p>
          <button
            onClick={() => router.push("/jobs")}
            className="w-full flex items-center justify-center py-3 px-4 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition font-bold"
          >
            <FaArrowLeft className="mr-2" /> Ku laabo Shaqooyinka
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 font-sans">
      <PathSegmentsDisplay />
      <SearchInput />

      <div className="w-full max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-xl mt-6">
        <button
          onClick={() => router.push("/jobs")}
          className="text-indigo-600 hover:text-indigo-800 mb-6 transition font-medium flex items-center bg-transparent border-none cursor-pointer"
        >
          <FaArrowLeft className="mr-2" size={14} />
          Back to Job Listings
        </button>

        <div className="mb-8 border-b pb-4">
          <div className="w-full h-48 bg-gray-100 rounded-xl mb-6 flex items-center justify-center overflow-hidden">
            <p className="text-gray-400 italic">No Header Image Available</p>
          </div>
          <div className="flex items-start">
            <div className="w-20 h-20 bg-white border border-gray-200 rounded-xl shadow-md flex items-center justify-center mr-4 -mt-12 flex-shrink-0">
              <FaBuilding size={32} className="text-indigo-500" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
                {job.title}
              </h1>
              <h2 className="text-xl sm:text-2xl font-semibold text-indigo-600 mt-1">
                {job.company}
              </h2>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-gray-600">
          <div className="flex items-center">
            <FaMapMarkerAlt className="mr-2 text-indigo-500" size={18} />
            <span className="font-medium">
              {job.location || "Location Pending"}
            </span>
          </div>
          <div className="flex items-center">
            <FaMoneyBillWave className="mr-2 text-green-500" size={18} />
            <span className="font-medium">
              {job.salary ? `${job.salary} $` : "Salary Not Disclosed"}
            </span>
          </div>
          <div className="flex items-center">
            <FaBriefcase className="mr-2 text-yellow-500" size={18} />
            <span className="font-medium">{job.type || "General"}</span>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-800 border-b pb-2">
            Job Summary
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {job.description || "No description provided for this position."}
          </p>

          <h3 className="text-2xl font-bold text-gray-800 border-b pb-2 pt-4">
            Responsibilities
          </h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Lead the planning and execution of projects.</li>
            <li>Collaborate with cross-functional teams.</li>
            <li>Ensure all project goals are met on time and budget.</li>
          </ul>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push(`/jobs/application/${id}`)}
            className="w-full max-w-lg flex items-center justify-center py-3 px-6 border border-transparent rounded-lg shadow-lg text-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition"
          >
            <FaPaperPlane className="mr-3" />
            Apply Now
          </button>
        </div>
      </div>

      <div className="mt-12 mb-8">
        <WantSell />
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6 px-2">
        Related Jobs
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-2 pb-10">
        {relatedJobs.length > 0 ? (
          relatedJobs.map((item) => (
            <UniversalCard
              key={item._id}
              id={item._id}
              title={item.title}
              price={
                typeof item.salary === "number"
                  ? item.salary
                  : Number(item.salary) || 0
              }
              description={item.description}
              city={item.location}
              images={item.images || []}
              category="jobs"
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            No related jobs found at this time.
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetailsPage;

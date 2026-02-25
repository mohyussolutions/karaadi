"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaBuilding,
  FaArrowLeft,
  FaMoneyBillWave,
  FaBriefcase,
} from "react-icons/fa6";
import { FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";

interface Job {
  id: string;
  title: string;
  company?: string;
  city: string;
  region: string;
  salary?: number;
  category: string[];
  description: string;
  employmentType: string;
}

interface JobDetailsPageProps {
  params: Promise<{ id: string }> | { id: string };
}

const JobDetailsPage = ({ params }: JobDetailsPageProps) => {
  const router = useRouter();
  const resolvedParams = React.use(params as Promise<{ id: string }>);
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/jobs/${resolvedParams.id}`,
        );
        if (response.ok) {
          const data = await response.json();
          setJob(data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchJob();
  }, [resolvedParams.id]);

  const handleApplyClick = () => {
    router.push(`/jobs/application/${resolvedParams.id}`);
  };

  if (!job) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <div className="w-full max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-xl">
        <button
          onClick={() => router.push("/jobs")}
          className="text-indigo-600 hover:text-indigo-800 mb-6 transition duration-150 font-medium flex items-center bg-transparent border-none cursor-pointer"
        >
          <FaArrowLeft className="mr-2" size={14} />
          Back to Job Listings
        </button>

        <div className="mb-8 border-b pb-4">
          <div className="w-full h-48 bg-gray-100 rounded-xl mb-6 flex items-center justify-center overflow-hidden">
            <p className="text-gray-500">Job Header Image</p>
          </div>

          <div className="flex items-start">
            <div className="w-20 h-20 bg-white border border-gray-200 rounded-xl shadow-md flex items-center justify-center mr-4 -mt-12 flex-shrink-0">
              <FaBuilding size={32} className="text-indigo-500" />
            </div>

            <div>
              <h1 className="text-4xl font-extrabold text-gray-800">
                {job.title}
              </h1>
              <h2 className="text-2xl font-semibold text-indigo-600 mt-1">
                {job.company || "Company Confidential"}
              </h2>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-gray-600">
          <div className="flex items-center">
            <FaMapMarkerAlt className="mr-2 text-indigo-500" size={18} />
            <span className="font-medium">
              {job.city}, {job.region}
            </span>
          </div>
          <div className="flex items-center">
            <FaMoneyBillWave className="mr-2 text-green-500" size={18} />
            <span className="font-medium">
              {job.salary ? `$${job.salary}` : "Negotiable"}
            </span>
          </div>
          <div className="flex items-center">
            <FaBriefcase className="mr-2 text-yellow-500" size={18} />
            <span className="font-medium">{job.employmentType}</span>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-800 border-b pb-2">
            Job Description
          </h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {job.description}
          </p>

          <h3 className="text-2xl font-bold text-gray-800 border-b pb-2 pt-4">
            Category
          </h3>
          <div className="flex flex-wrap gap-2">
            {job.category.map((cat, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={handleApplyClick}
            className="w-full max-w-lg flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150 transform hover:scale-[1.01] mx-auto"
          >
            <FaPaperPlane className="mr-3" />
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;

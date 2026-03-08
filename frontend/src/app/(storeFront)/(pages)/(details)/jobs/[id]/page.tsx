"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FaBuilding,
  FaArrowLeft,
  FaMoneyBillWave,
  FaBriefcase,
} from "react-icons/fa6";
import { FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";
import { getJobById, formatSalary } from "@/actions/categories/jobActions";

interface Job {
  _id: string;
  id?: string;
  user: string;
  title: string;
  description: string;
  salary?: number;
  location: string;
  company: string;
  type: "Full-time" | "Part-time" | "Contract" | "Remote";
  city?: string;
  region?: string;
  employmentType?: string;
  isPaid?: boolean;
  createdAt?: string;
  companyLogo?: string;
}

interface JobDetailsPageProps {
  params: Promise<{ id: string }>;
}

const JobDetailsPage = ({ params }: JobDetailsPageProps) => {
  const router = useRouter();
  const { id } = use(params);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [formattedSalary, setFormattedSalary] = useState<string>("");
  const [imageError, setImageError] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const email = localStorage.getItem("userEmail") || "";
    setUserEmail(email);
  }, []);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const jobData = await getJobById(id);
        setJob(jobData as Job | null);

        if (jobData?.salary) {
          const formatted = await formatSalary(jobData.salary);
          setFormattedSalary(formatted);
        }
      } catch (error) {
        console.error("Error fetching job:", error);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApplyClick = () => {
    const email = userEmail || localStorage.getItem("userEmail") || "";
    if (email) {
      router.push(`/jobs/application/${id}?email=${encodeURIComponent(email)}`);
    } else {
      router.push(`/jobs/application/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-8 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
        <div className="w-full max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-xl text-center">
          <p className="text-gray-600">Job not found</p>
          <button
            onClick={() => router.push("/jobs")}
            className="mt-4 text-indigo-600 hover:text-indigo-800"
          >
            Back to Job Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <button
          onClick={() => router.push("/jobs")}
          className="text-indigo-600 hover:text-indigo-800 mb-6 transition duration-150 font-medium flex items-center bg-transparent border-none cursor-pointer"
        >
          <FaArrowLeft className="mr-2" size={14} />
          Back to Job Listings
        </button>

        <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
          <div className="relative w-full h-96 sm:h-[500px] lg:h-[600px] bg-gradient-to-r from-indigo-600 to-purple-600">
            {job.companyLogo && !imageError ? (
              <Image
                src={job.companyLogo}
                alt={`${job.company} header`}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
                priority
                sizes="100vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FaBuilding size={120} className="text-white/30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </div>

          <div className="relative px-6 sm:px-8 lg:px-10">
            <div className="absolute -top-20 sm:-top-24 left-6 sm:left-8 lg:left-10 w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 bg-white rounded-2xl shadow-xl border-4 border-white overflow-hidden">
              {job.companyLogo && !imageError ? (
                <Image
                  src={job.companyLogo}
                  alt={job.company || "Company logo"}
                  fill
                  className="object-cover"
                  sizes="192px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-indigo-50">
                  <FaBuilding size={64} className="text-indigo-500" />
                </div>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10 pt-28 sm:pt-32 lg:pt-36">
            <div className="mb-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-800">
                {job.title}
              </h1>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-indigo-600 mt-3">
                {job.company || "Company Confidential"}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10 text-gray-600">
              <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                <FaMapMarkerAlt
                  className="mr-3 text-indigo-500 flex-shrink-0"
                  size={24}
                />
                <span className="font-medium text-lg sm:text-xl">
                  {job.city}, {job.region}
                </span>
              </div>
              <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                <FaMoneyBillWave
                  className="mr-3 text-green-500 flex-shrink-0"
                  size={24}
                />
                <span className="font-medium text-lg sm:text-xl">
                  {formattedSalary || "Not specified"}
                </span>
              </div>
              <div className="flex items-center bg-gray-50 p-4 rounded-lg sm:col-span-2 lg:col-span-1">
                <FaBriefcase
                  className="mr-3 text-purple-500 flex-shrink-0"
                  size={24}
                />
                <span className="font-medium text-lg sm:text-xl">
                  {job.employmentType || job.type}
                </span>
              </div>
            </div>

            <div className="prose max-w-none">
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-800 border-b pb-3">
                Job Description
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mt-6 text-lg sm:text-xl">
                {job.description}
              </p>
            </div>

            <div className="mt-12 text-center">
              <button
                onClick={handleApplyClick}
                className="w-full sm:w-auto min-w-[350px] flex items-center justify-center py-5 px-10 border border-transparent rounded-xl shadow-lg text-2xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150 transform hover:scale-[1.02] mx-auto"
              >
                <FaPaperPlane className="mr-3" size={24} />
                Apply Now
              </button>
              {!userEmail && (
                <p className="text-base text-gray-500 mt-3">
                  You'll be prompted to enter your email during application
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;

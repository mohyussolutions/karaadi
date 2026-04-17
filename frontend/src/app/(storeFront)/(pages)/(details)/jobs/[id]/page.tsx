"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import {
  FaBuilding,
  FaArrowLeft,
  FaMoneyBillWave,
  FaBriefcase,
  FaPaperPlane,
} from "@/app/utils/icons";
import { getJobById, formatSalary } from "@/actions/categories/jobActions";
import { FaMapMarkerAlt } from "@/app/utils/icons";

interface Job {
  _id: string;
  id?: string;
  userId?: string;
  user: any;
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
  images?: string[];
}

const JobDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { t } = useTranslation();
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
    if (!id) return;

    const fetchJob = async () => {
      setLoading(true);
      try {
        const jobData = await getJobById(id);

        if (jobData) {
          setJob(jobData as Job);
          if (jobData.salary) {
            const formatted = await formatSalary(jobData.salary);
            setFormattedSalary(formatted);
          }
        } else {
          setJob(null);
        }
      } catch (error) {
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApplyClick = () => {
    const email = userEmail || localStorage.getItem("userEmail") || "";
    const baseUrl = `/jobs/application/${id}`;
    const url = email
      ? `${baseUrl}?email=${encodeURIComponent(email)}`
      : baseUrl;
    router.push(url);
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-600 font-medium">
            {t("jobsPage.loading")}
          </p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center">
          <FaBriefcase className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-600 mb-6">
            {t("jobsPage.backLabel") || "Job not found"}
          </p>
          <button
            onClick={() => router.push("/jobs")}
            className="text-indigo-600 hover:text-indigo-800 font-bold underline"
          >
            {t("jobsPage.backToAll")}
          </button>
        </div>
      </div>
    );
  }

  const displayImage = job.companyLogo || job.images?.[0];

  return (
    <div className="w-full bg-gray-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => router.push("/jobs")}
          className="group text-gray-600 hover:text-indigo-600 mb-8 transition-colors font-semibold flex items-center"
        >
          <FaArrowLeft
            className="mr-2 group-hover:-translate-x-1 transition-transform"
            size={14}
          />
          {t("jobsPage.backToAll")}
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-indigo-100/20 overflow-hidden border border-gray-100">
          <div className="relative w-full h-64 sm:h-96 lg:h-[500px] bg-slate-900">
            {displayImage && !imageError ? (
              <Image
                src={displayImage}
                alt={job.company}
                fill
                className="object-cover opacity-80"
                onError={() => setImageError(true)}
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                <FaBuilding size={80} className="text-white/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>

          <div className="relative px-6 sm:px-12">
            <div className="absolute -top-20 sm:-top-24 w-32 h-32 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-4 border-white bg-white shadow-lg">
              {displayImage && !imageError ? (
                <Image
                  src={displayImage}
                  alt={job.company}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <FaBuilding size={48} className="text-indigo-200" />
                </div>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-12 pt-16 sm:pt-24">
            <div className="mb-10">
              <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight">
                {job.title}
              </h1>
              <div className="flex items-center mt-4">
                <span className="text-2xl sm:text-3xl font-bold text-indigo-600">
                  {job.company || "Confidential"}
                </span>
                {job.isPaid && (
                  <span className="ml-4 bg-green-100 text-green-700 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
                    Verified
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              <div className="flex items-center p-5 bg-gray-50 rounded-2xl border border-gray-100">
                <FaMapMarkerAlt className="mr-4 text-indigo-500" size={22} />
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-tighter">
                    Location
                  </p>
                  <p className="font-bold text-gray-700">
                    {job.city}, {job.region}
                  </p>
                </div>
              </div>
              <div className="flex items-center p-5 bg-gray-50 rounded-2xl border border-gray-100">
                <FaMoneyBillWave className="mr-4 text-emerald-500" size={22} />
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-tighter">
                    Salary
                  </p>
                  <p className="font-bold text-gray-700">
                    {formattedSalary || "Negotiable"}
                  </p>
                </div>
              </div>
              <div className="flex items-center p-5 bg-gray-50 rounded-2xl border border-gray-100">
                <FaBriefcase className="mr-4 text-purple-500" size={22} />
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-tighter">
                    Work Type
                  </p>
                  <p className="font-bold text-gray-700">
                    {job.employmentType || job.type}
                  </p>
                </div>
              </div>
            </div>

            <div className="max-w-4xl">
              <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-1 bg-indigo-600 mr-3 rounded-full" />
                {t("jobsPage.jobDescription")}
              </h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-lg sm:text-xl">
                {job.description}
              </p>
            </div>

            <div className="mt-16 pt-10 border-t border-gray-100 flex flex-col items-center">
              <button
                onClick={handleApplyClick}
                className="w-full sm:w-auto min-w-[320px] flex items-center justify-center py-5 px-12 rounded-2xl text-xl font-black text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-95"
              >
                <FaPaperPlane className="mr-3" size={20} />
                Apply for this position
              </button>
              {!userEmail && (
                <p className="text-sm text-gray-400 mt-4 font-medium italic">
                  Quick apply: No registration required
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

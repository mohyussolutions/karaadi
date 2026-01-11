"use client";

import React from "react";
import { useRouter } from "next/navigation"; // Kani waa muhiim si loo navigate-gareeyo
import {
  FaBuilding,
  FaArrowLeft,
  FaMoneyBillWave,
  FaBriefcase,
} from "react-icons/fa6";
import { FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa"; // Waxaan ku darnay FaPaperPlane
import { jobPostingsData, JobPosting } from "../data.for.jobs";
// Waxaan ka saarnay import Appy maadaama aan hadda Appy ku dhisayno gudaha
// import Appy from "@/app/(storeFront)/components/apply/page";

interface JobDetailsPageProps {
  params: {
    id: string;
  };
}

const JobDetailsPage = ({ params }: JobDetailsPageProps) => {
  const router = useRouter(); // U isticmaal router-ka navigate-ka

  // React.use waxaa badanaa loo isticmaalaa Server Components ama isticmaal gaar ah.
  // Haddii aad isticmaalayso Client Component, waxaa ka fiican in si toos ah loo isticmaalo params
  const jobId = parseInt(params.id);

  const job = jobPostingsData.find((j) => j.id === jobId);

  const handleApplyClick = () => {
    // Jidka aad u socoto. Waxaan u malaynaynaa in foomkaagu ku yaallo jidkan.
    const applicationPath = `/jobs/application/${jobId}`;
    router.push(applicationPath);
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans flex items-center justify-center">
        <div className="text-center text-gray-700">
          <h1 className="text-3xl font-bold mb-4">404 - Job Not Found</h1>
          <p>
            The job listing you are looking for does not exist or has been
            removed.
          </p>
          <a
            href="/jobs"
            className="mt-6 inline-block text-indigo-600 hover:text-indigo-800 transition duration-150 font-medium"
          >
            Go back to Job Listings
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <div className="w-full max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-xl">
        <a
          href="/jobs"
          className="text-indigo-600 hover:text-indigo-800 mb-6 transition duration-150 font-medium flex items-center"
        >
          <FaArrowLeft className="mr-2" size={14} />
          Back to Job Listings
        </a>

        <div className="mb-8 border-b pb-4">
          <div className="w-full h-48 bg-gray-100 rounded-xl mb-6 flex items-center justify-center overflow-hidden">
            <p className="text-gray-500">Job Header Image Placeholder</p>
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
                {job.company}
              </h2>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-gray-600">
          <div className="flex items-center">
            <FaMapMarkerAlt className="mr-2 text-indigo-500" size={18} />
            <span className="font-medium">{job.location}</span>
          </div>
          <div className="flex items-center">
            <FaMoneyBillWave className="mr-2 text-green-500" size={18} />
            <span className="font-medium">{job.salaryRange}</span>
          </div>
          <div className="flex items-center">
            <FaBriefcase className="mr-2 text-yellow-500" size={18} />
            <span className="font-medium">{job.categoryTitle}</span>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-800 border-b pb-2">
            Job Summary
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {job.descriptionSummary}
          </p>

          <h3 className="text-2xl font-bold text-gray-800 border-b pb-2 pt-4">
            Responsibilities (Tusaale)
          </h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Lead the planning and execution of projects.</li>
            <li>Collaborate with cross-functional teams.</li>
            <li>Ensure all project goals are met on time and budget.</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-800 border-b pb-2 pt-4">
            Qualifications (Tusaale)
          </h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Bachelor's degree in related field.</li>
            <li>Minimum 5 years of relevant experience.</li>
            <li>Strong communication skills in both Somali and English.</li>
          </ul>
        </div>

        <div className="mt-10 text-center">
          {/* Component-ka Appy waxaa lagu bedelay badhan toos ah */}
          <button
            onClick={handleApplyClick}
            className="w-full max-w-lg flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150 transform hover:scale-[1.01] mx-auto"
          >
            <FaPaperPlane className="mr-3" />
            Apply Now for {job.title}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;

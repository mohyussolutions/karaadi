"use client";

import React from "react";
import { FaBuilding, FaHeart } from "react-icons/fa6";
import { JobPosting } from "../../(pages)/(subNavbar)/jobs/data.for.jobs";
import { FaMapMarkerAlt } from "react-icons/fa";

interface JobCardProps {
  job: JobPosting;
  onViewDetails?: (job: JobPosting) => void;
  jobTypeLabel?: string;
  jobTypeColor?: string;
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  jobTypeLabel,
  jobTypeColor,
}) => {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col">
      <div className="block flex flex-col h-full">
        <div className="relative w-full h-44 sm:h-52 group overflow-hidden border-b-2 border-gray-100">
          <div className="absolute inset-0 flex items-center justify-center bg-indigo-50/50">
            <FaBuilding size={48} className="text-indigo-500 opacity-60" />
          </div>

          <div className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:scale-110 transition">
            <FaHeart className="text-gray-600 hover:text-red-500" size={20} />
          </div>

          <span
            className={`absolute top-3 left-3 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md ${jobTypeColor}`}
          >
            {jobTypeLabel}
          </span>
        </div>

        <div className="p-4 flex flex-col flex-grow space-y-2">
          <h3 className="text-xl font-bold line-clamp-2 text-gray-800 hover:text-indigo-700">
            {job.title}
          </h3>

          <p className="text-indigo-600 font-medium text-base mb-1 truncate">
            {job.company}
          </p>

          <p className="text-gray-500 text-sm flex items-center">
            <FaMapMarkerAlt
              size={14}
              className="mr-1.5 text-red-400 flex-shrink-0"
            />
            <span className="truncate">{job.location}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobCard;

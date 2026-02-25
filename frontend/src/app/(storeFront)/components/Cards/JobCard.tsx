"use client";

import React from "react";
import { FaBuilding, FaHeart, FaMapMarkerAlt } from "react-icons/fa";

export interface Job {
  id?: string | number;
  title: string;
  company: string;
  location: string;
  city?: string;
  region?: string;
  employmentType?: string;
  salary?: number | string;
  categoryTitle?: string;
}

interface JobCardProps {
  job: Job;
  jobTypeLabel?: string;
  jobTypeColor?: string;
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  jobTypeLabel = "Full-time",
  jobTypeColor = "bg-indigo-600",
}) => {
  return (
    <div className="group h-full flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
      <div className="relative w-full h-44 sm:h-52 overflow-hidden border-b border-gray-100 bg-indigo-50/50 flex items-center justify-center">
        <FaBuilding
          size={48}
          className="text-indigo-500 opacity-60 group-hover:scale-110 transition-transform duration-300"
        />

        <div className="absolute top-3 right-3 z-10">
          <button
            type="button"
            className="bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition-colors"
          >
            <FaHeart
              className="text-gray-400 hover:text-red-500 transition-colors"
              size={18}
            />
          </button>
        </div>

        <span
          className={`absolute top-3 left-3 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm ${jobTypeColor}`}
        >
          {jobTypeLabel}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-700 transition-colors leading-tight">
          {job.title}
        </h3>

        <div className="mt-2 space-y-1.5">
          <p className="text-indigo-600 font-semibold text-sm truncate">
            {job.company}
          </p>

          <p className="text-gray-500 text-sm flex items-center">
            <FaMapMarkerAlt
              size={14}
              className="mr-2 text-red-400 flex-shrink-0"
            />
            <span className="truncate">{job.location}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobCard;

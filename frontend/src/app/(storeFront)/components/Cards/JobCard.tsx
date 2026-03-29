"use client";

import React from "react";
import { FaBuilding, FaMapMarkerAlt } from "react-icons/fa";
import UniversalCard from "./UniversalCard";

export default function JobCard({
  job,
  jobTypeLabel,
  jobTypeColor,
}: {
  job: any;
  jobTypeLabel?: string;
  jobTypeColor?: string;
}) {
  const renderMeta = () => (
    <div className="mt-2 space-y-1">
      <p className="text-indigo-600 font-bold text-xs uppercase tracking-tight">
        {job.company}
      </p>
      <div className="text-gray-500 text-[11px] flex items-center gap-1">
        <FaMapMarkerAlt size={10} className="text-red-400" />
        <span className="truncate">{job.location}</span>
      </div>
    </div>
  );

  return (
    <UniversalCard
      id={job.id}
      title={job.title}
      category="jobs"
      price={typeof job.salary === "number" ? job.salary : undefined}
      city={job.location}
      imageHeight="h-40"
      renderBadges={() => (
        <span
          className={`absolute top-3 left-3 text-white text-[9px] font-black px-2 py-1 rounded uppercase ${
            jobTypeColor || "bg-indigo-600"
          }`}
        >
          {jobTypeLabel || "Full Time"}
        </span>
      )}
      renderMeta={renderMeta}
    >
      <div className="absolute inset-0 bg-indigo-50/50 flex items-center justify-center -z-10">
        <FaBuilding size={40} className="text-indigo-200" />
      </div>
    </UniversalCard>
  );
}

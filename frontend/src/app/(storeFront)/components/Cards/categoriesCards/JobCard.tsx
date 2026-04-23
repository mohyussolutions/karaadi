import React from "react";
import Link from "next/link";
import { MdLocationOn, MdWork, MdAccessTime } from "react-icons/md";
import { getDetailRoute } from "@/app/utils/getDetailRoute";

interface JobCardProps {
  id: string;
  _id?: string;
  title: string;
  company?: string;
  location: string;
  type: string;
  salary?: string;
  createdAt: string;
  category?: string;
}

export default function JobCard(props: JobCardProps) {
  const { title, type, company, location, createdAt, salary } = props;
  const detailRoute = getDetailRoute({
    ...props,
    category: props.category || "job",
    _id: props._id || props.id,
  });
  return (
    <Link
      href={detailRoute}
      className="block p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow group"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
          {type}
        </span>
      </div>

      {company && (
        <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
          <MdWork className="text-gray-400" />
          {company}
        </p>
      )}

      <div className="flex flex-wrap gap-3 mt-auto">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <MdLocationOn className="text-gray-400" />
          {location}
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <MdAccessTime className="text-gray-400" />
          {createdAt ? new Date(createdAt).toLocaleDateString() : ""}
        </div>
      </div>

      {salary && (
        <div className="mt-3 pt-3 border-t border-gray-50 text-sm font-bold text-green-600">
          {salary}
        </div>
      )}
    </Link>
  );
}

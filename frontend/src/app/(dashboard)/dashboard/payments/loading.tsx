import React from "react";

export default function PaymentsLoading() {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-7 bg-gray-200 rounded w-56" />
        <div className="h-8 bg-blue-100 rounded-full w-20" />
      </div>
      <div className="flex gap-2 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 bg-gray-200 rounded-full w-24" />
        ))}
      </div>
      <div className="overflow-x-auto">
        <div className="flex gap-4 px-4 py-4 border-b border-gray-100">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded flex-1" />
          ))}
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex gap-4 px-4 py-4 border-b border-gray-50">
            {Array.from({ length: 6 }).map((_, j) => (
              <div key={j} className="h-4 bg-gray-100 rounded flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

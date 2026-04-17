import React from "react";

const TableSkeleton = () => (
  <div className="w-full min-h-screen bg-gray-50">
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="h-6 bg-gray-100 rounded-full w-20 ml-auto" />
      </div>

      {/* Sub-nav pills */}
      <div className="flex gap-2 mb-6 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-9 bg-gray-200 rounded-lg w-24 flex-shrink-0"
          />
        ))}
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 flex gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded flex-1" />
          ))}
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="px-4 py-4 flex gap-4 border-t border-gray-100"
          >
            <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0" />
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="h-4 bg-gray-100 rounded flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function CategoriesLoading() {
  return <TableSkeleton />;
}

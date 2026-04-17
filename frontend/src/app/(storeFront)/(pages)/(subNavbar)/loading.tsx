import React from "react";

export default function CategoryLoading() {
  return (
    <div className="container mx-auto px-2 py-2 space-y-4 animate-pulse">
      <div className="h-11 bg-gray-200 rounded-lg w-full" />

      <div className="h-4 bg-gray-100 rounded w-40" />

      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-9 bg-gray-200 rounded-full w-20 flex-shrink-0"
          />
        ))}
      </div>

      <div className="h-16 bg-gray-100 rounded-lg w-full" />

      <div className="h-5 bg-gray-100 rounded w-48" />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
          >
            <div className="h-48 bg-gray-200" />
            <div className="p-3 space-y-2">
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
              <div className="h-6 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

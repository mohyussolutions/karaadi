import React from "react";

export default function UsersLoading() {
  return (
    <div className="w-full min-h-screen bg-gray-50 animate-pulse">
      <div className="w-full px-4 sm:px-6 py-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gray-200" />
          <div className="space-y-2">
            <div className="h-7 bg-gray-200 rounded w-48" />
            <div className="h-4 bg-gray-100 rounded w-36" />
          </div>
        </div>
        <div className="h-12 bg-gray-200 rounded-xl mb-6 w-full" />
        <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 flex gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded flex-1" />
            ))}
          </div>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="px-6 py-4 flex gap-4 border-t border-gray-100"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="h-4 bg-gray-100 rounded flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

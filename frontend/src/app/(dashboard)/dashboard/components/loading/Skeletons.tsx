import React from "react";

export const StatCardSkeleton = () => (
  <div className="p-6 bg-white rounded-xl shadow-sm border min-h-[140px] animate-pulse">
    <div className="h-4 bg-gray-100 rounded w-2/3 mb-4" />
    <div className="h-8 bg-gray-100 rounded w-1/2" />
  </div>
);

export const CircleSkeleton = () => (
  <div className="w-28 h-28 rounded-full bg-gray-200 animate-pulse" />
);

export const TableRowSkeleton = ({ cols = 5 }: { cols?: number }) => (
  <tr className="animate-pulse">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div className="h-4 bg-gray-100 rounded w-full" />
      </td>
    ))}
  </tr>
);

export const CardSkeleton = ({ className = "" }: { className?: string }) => (
  <div
    className={`bg-white rounded-2xl border border-slate-100 shadow-sm animate-pulse ${className}`}
  />
);

export const PageSkeleton = () => (
  <div className="m-10 flex flex-col gap-8 animate-pulse">
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 place-items-center py-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <CircleSkeleton key={i} />
      ))}
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 w-full px-2 py-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 m-6">
      <CardSkeleton className="min-h-[350px]" />
      <CardSkeleton className="min-h-[350px]" />
    </div>
  </div>
);

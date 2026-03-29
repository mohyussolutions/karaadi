import LoginLoading from "@/app/(storeFront)/components/shared/Loading/LoginLoading";
import React from "react";

interface SeeMorePaginationProps {
  hasMore: boolean;
  onSeeMore: () => void;
  loading?: boolean;
}

export default function Pagination({
  hasMore,
  onSeeMore,
  loading,
}: SeeMorePaginationProps) {
  if (!hasMore) return null;

  return (
    <div className="flex justify-center mt-8">
      <button
        onClick={onSeeMore}
        disabled={loading}
        className="flex items-center justify-center h-12 min-w-[140px] px-6 rounded-lg border bg-blue-600 text-white font-bold hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? <LoginLoading /> : "See more"}
      </button>
    </div>
  );
}

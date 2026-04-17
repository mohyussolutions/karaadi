"use client";

import React from "react";

interface PaginationProps {
  hasMore: boolean;
  loading: boolean;
  onSeeMore: () => void;
}

export default function Pagination({
  hasMore,
  loading,
  onSeeMore,
}: PaginationProps) {
  if (!hasMore || loading) return null;

  return (
    <div className="flex justify-center mt-8 mb-4">
      <button
        onClick={onSeeMore}
        className="flex items-center justify-center h-12 min-w-[140px] px-6 rounded-lg border bg-[#06069c] text-white font-bold hover:bg-[#06069c] transition"
      >
        See more
      </button>
    </div>
  );
}

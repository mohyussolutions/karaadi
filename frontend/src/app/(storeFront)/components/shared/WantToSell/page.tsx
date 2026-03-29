"use client";
import Link from "next/link";

export default function WantSell() {
  return (
    <Link href="/new-ad" className="inline-block group">
      <span className="block bg-emerald-50 text-emerald-700 text-sm font-medium px-4 py-2 rounded-full hover:bg-emerald-100 transition-all duration-200 text-left border border-emerald-200 hover:border-emerald-300 shadow-sm hover:shadow">
        <span className="flex items-center gap-1">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Wax miyaad iska gadee?
        </span>
      </span>
    </Link>
  );
}

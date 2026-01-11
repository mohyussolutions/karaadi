"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function PathSegmentsDisplay() {
  const pathname = usePathname();
  const segments = pathname?.slice(1).split("/") || [];

  if (segments.length === 0) return null;

  return (
    <div className="ml-2 mt-4">
      <div className="flex flex-wrap gap-1 items-center text-sm font-mono text-blue-600 mb-6">
        <Link href="/" className="hover:underline capitalize">
          Home
        </Link>
        {segments.map((segment, index) => {
          const path = "/" + segments.slice(0, 1).join("/");

          return (
            <React.Fragment key={index}>
              <span>/</span>
              <Link
                href={path}
                className="hover:underline capitalize transition-colors duration-200"
              >
                {decodeURIComponent(segment)}
              </Link>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

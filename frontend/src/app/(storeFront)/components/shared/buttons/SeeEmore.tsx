"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

interface SeeEmoreProps {
  onClick: () => void;
  className?: string;
}

export default function SeeEmore({ onClick, className }: SeeEmoreProps) {
  return (
    <button
      onClick={onClick}
      className={
        className ||
        "group flex items-center gap-2 transition-all duration-300 px-6 py-3 bg-[#06069c] text-white rounded-full hover:bg-[#06069c] shadow-md hover:shadow-blue-200"
      }
    >
      <span className="text-sm font-semibold">See More</span>
      <ChevronDown
        size={18}
        className="group-hover:translate-y-0.5 transition-transform duration-300"
      />
    </button>
  );
}

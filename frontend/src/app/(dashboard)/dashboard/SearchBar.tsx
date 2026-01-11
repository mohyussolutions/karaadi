"use client";
import React from "react";
import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
  return (
    <div className="flex items-center gap-3 w-full max-w-lg bg-gray-100 px-4 py-2 rounded-lg">
      <FaSearch className="text-gray-400" />
      <input
        placeholder="Search..."
        className="bg-transparent outline-none flex-1 text-gray-700"
      />
    </div>
  );
}

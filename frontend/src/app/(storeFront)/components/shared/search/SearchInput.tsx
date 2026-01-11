"use client";
import { FaSearch } from "react-icons/fa";
import React from "react";

export default function SearchInput() {
  const SearchHandler = () => {
    alert("Search initiated!");
  };

  return (
    <div className="relative flex items-center w-full">
      <input
        type="text"
        placeholder="Search..."
        className="w-full pl-4 pr-12 py-3 text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
      />
      <button
        type="button"
        onClick={SearchHandler}
        className="absolute right-0 top-1/2 -translate-y-1/2 h-full w-12 flex items-center justify-center text-gray-500 hover:text-indigo-600 transition-colors duration-200"
        aria-label="Search"
      >
        <FaSearch className="w-5 h-5" />
      </button>
    </div>
  );
}

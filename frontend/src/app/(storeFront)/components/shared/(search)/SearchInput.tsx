"use client";
import { FaSearch } from "react-icons/fa";

export default function SearchInput({
  onSearch,
}: {
  onSearch?: (val: string) => void;
}) {
  return (
    <div className="relative w-full">
      <input
        type="text"
        onChange={(e) => {
          if (onSearch) {
            onSearch(e.target.value);
          }
        }}
        placeholder="Search gawaari, homes, or jobs..."
        className="w-full pl-4 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
      />
      <div className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-gray-400">
        <FaSearch className="w-5 h-5" />
      </div>
    </div>
  );
}

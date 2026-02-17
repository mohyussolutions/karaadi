"use client";

import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { saveSearchToDb } from "../(storeFront)/components/home/SearchTracker";

interface SearchInputProps {
  onSearch?: (val: string) => void;
}

export default function SearchInput({ onSearch }: SearchInputProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (onSearch) {
      onSearch(query);
    }
  }, [query, onSearch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    await saveSearchToDb(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search gawaari, homes, or jobs..."
        className="w-full pl-4 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all focus:border-indigo-500"
      />

      <button
        type="submit"
        className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-colors"
        aria-label="Search"
      >
        <FaSearch className="w-5 h-5" />
      </button>
    </form>
  );
}

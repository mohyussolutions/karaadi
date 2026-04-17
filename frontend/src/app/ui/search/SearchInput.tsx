"use client";

import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FiSearch, FiX } from "react-icons/fi";
import { saveSearchToDb } from "@/actions/categories/searchHistoryAction";

interface SearchInputProps {
  defaultValue?: string;
  onSearch?: (value: string) => void;
  placeholder?: string;
}

export default function SearchInput({
  defaultValue = "",
  onSearch,
  placeholder,
}: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [text, setText] = useState(defaultValue);

  useEffect(() => {
    const query = searchParams.get("q");
    if (query !== null) {
      setText(query);
    } else {
      setText("");
    }
  }, [searchParams]);

  const executeSearch = (searchTerm: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (searchTerm.trim()) {
      if (params.get("q") === searchTerm.trim()) return;

      params.set("q", searchTerm.trim());
      saveSearchToDb(searchTerm.trim());
      if (onSearch) onSearch(searchTerm.trim());
    } else {
      if (!params.has("q")) return;
      params.delete("q");
      if (onSearch) onSearch("");
    }

    const queryString = params.toString();
    const updatedPath = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(updatedPath, { scroll: false });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeSearch(text);
    }
  };

  const handleClear = () => {
    setText("");
    executeSearch("");
  };

  return (
    <div className="relative w-full group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-600 transition-colors">
        <FiSearch size={22} />
      </div>

      <input
        type="text"
        value={text}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || "Karaadi baabuur, guri, qalab, doomo..."}
        className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-800 text-base font-medium placeholder:text-gray-400 transition-all"
      />

      {text && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
          aria-label="Clear search"
        >
          <FiX size={18} />
        </button>
      )}
    </div>
  );
}

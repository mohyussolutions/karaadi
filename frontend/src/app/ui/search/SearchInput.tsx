"use client";

import React, { useState, useRef, ChangeEvent } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { saveSearchToDb } from "@/actions/search/searchHistory";
import { useTranslation } from "react-i18next";

export const SEARCH_EVENT = "karaadi:search";

export interface SearchInputProps {
  defaultValue?: string;
  placeholder?: string;
  onSearch?: (value: string) => void;
}

export default function SearchInput({
  defaultValue = "",
  placeholder,
  onSearch,
}: SearchInputProps) {
  const { t } = useTranslation();
  const [text, setText] = useState(defaultValue);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dispatch = (q: string) => {
    window.dispatchEvent(new CustomEvent(SEARCH_EVENT, { detail: { q } }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setText(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const endsWithDigit = /\d$/.test(val.trim());
    debounceRef.current = setTimeout(
      () => {
        if (val.trim()) saveSearchToDb(val.trim()).catch(() => {});
        onSearch?.(val);
        dispatch(val);
      },
      endsWithDigit ? 800 : 400,
    );
  };

  const handleClear = () => {
    setText("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    onSearch?.("");
    dispatch("");
  };

  return (
    <div className="relative w-full group mt-16">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 group-focus-within:text-blue-600 transition-colors">
        <FiSearch size={22} />
      </div>
      <input
        suppressHydrationWarning
        type="text"
        value={text}
        onChange={handleChange}
        placeholder={placeholder ?? t("search", "Search Hamar, house, car, 45 000...")}
        className="w-full pl-12 pr-12 py-4 bg-white border-2 border-blue-200 rounded-2xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-800 text-base font-medium placeholder:text-gray-400 transition-all"
      />
      {text && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
        >
          <FiX size={18} />
        </button>
      )}
    </div>
  );
}

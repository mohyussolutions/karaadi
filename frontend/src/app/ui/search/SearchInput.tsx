"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, ChangeEvent } from "react";
import { FiSearch } from "react-icons/fi";
import { saveSearchToDb } from "@/app/(storeFront)/components/home/SearchTracker";

interface SearchInputProps {
  defaultValue?: string;
  onSearch?: (value: string) => void;
}

export default function SearchInput({
  defaultValue = "",
  onSearch,
}: SearchInputProps) {
  const [text, setText] = useState(defaultValue);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (onSearch) {
      onSearch(text);
    }
    const delayDebounce = setTimeout(() => {
      if (!onSearch) {
        const params = new URLSearchParams(window.location.search);
        if (text) {
          if (params.get("q") === text) return;
          params.set("q", text);
          router.push(`${pathname}?${params.toString()}`, { scroll: false });
          saveSearchToDb(text);
        } else {
          if (!params.has("q")) return;
          params.delete("q");
          router.push(pathname, { scroll: false });
        }
      }
    }, 200);
    return () => clearTimeout(delayDebounce);
  }, [text, pathname, router, onSearch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={text}
        onChange={handleChange}
        placeholder="karaadi baabuur, guri, qalab, doomo, beer iwm..."
        className="w-full p-3 pl-10 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <FiSearch size={18} />
      </div>
    </div>
  );
}

"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, ChangeEvent } from "react";
import { FiSearch } from "react-icons/fi";

interface SearchInputProps {
  defaultValue?: string;
}

export default function SearchInput({ defaultValue = "" }: SearchInputProps) {
  const [text, setText] = useState<string>(defaultValue);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (text) {
        params.set("q", text);
      } else {
        params.delete("q");
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [text, pathname, router]);

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
        className="w-full p-4 pl-12 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
      />
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        <FiSearch size={20} />
      </div>
    </div>
  );
}

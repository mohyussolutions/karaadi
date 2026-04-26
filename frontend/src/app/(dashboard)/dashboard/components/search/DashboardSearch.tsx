"use client";

import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FiSearch, FiX } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { SEARCH_HISTORY_ENDPOINTS } from "@/actions/constant/constant";

const PAGE_PLACEHOLDERS: Record<string, string> = {
  "/dashboard/users": "Search users by name or email...",
  "/dashboard/categories/cars": "Search cars by title or model...",
  "/dashboard/categories/real-estate":
    "Search properties by title or location...",
  "/dashboard/categories/boats": "Search boats by title...",
  "/dashboard/categories/motorcycles": "Search motorcycles by title...",
  "/dashboard/categories/marketplace": "Search marketplace items...",
  "/dashboard/categories/farmequipment": "Search farm equipment...",
  "/dashboard/categories/subscription":
    "Search subscriptions by user or plan...",
  "/dashboard/categories/Reports": "Search reports by type or reason...",
  "/dashboard/payments": "Search payments by user or status...",
  "/dashboard/chats": "Search chats by user...",
  "/dashboard/analytics": "Search analytics...",
  "/dashboard/settings": "Search settings...",
  "/dashboard": "Search dashboard...",
};

function getPlaceholder(pathname: string): string {
  const match = Object.keys(PAGE_PLACEHOLDERS).find((key) =>
    pathname.startsWith(key),
  );
  return match ? PAGE_PLACEHOLDERS[match] : "Search...";
}

function logSearch(query: string, userId?: string | null, token?: string) {
  if (!query.trim()) return;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  fetch(SEARCH_HISTORY_ENDPOINTS.LOG_SEARCH, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: query.trim(),
      category: "all",
      userId: userId ?? null,
    }),
  }).catch(() => {});
}

export default function DashboardSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [text, setText] = useState("");

  useEffect(() => {
    setText(searchParams.get("q") ?? "");
  }, [searchParams]);

  const execute = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val.trim()) {
      if (params.get("q") === val.trim()) return;
      params.set("q", val.trim());
      const userId = (user as any)?._id || (user as any)?.id || null;
      const token = (user as any)?.accessToken || (user as any)?.token;
      logSearch(val.trim(), userId, token);
    } else {
      if (!params.has("q")) return;
      params.delete("q");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") execute(text);
  };

  const handleClear = () => {
    setText("");
    execute("");
  };

  return (
    <div className="relative w-full max-w-sm group">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors pointer-events-none">
        <FiSearch size={16} />
      </div>
      <input
        type="text"
        value={text}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={getPlaceholder(pathname)}
        className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all"
      />
      {text && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          <FiX size={14} />
        </button>
      )}
    </div>
  );
}

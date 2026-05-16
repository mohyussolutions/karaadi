"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/app/(storeFront)/components/hooks/useLanguage";
import { useRouter } from "next/navigation";
import {
  FiTrash2,
  FiUser,
  FiMail,
  FiSearch,
  FiTrendingUp,
  FiClock,
} from "@/app/utils/icons";
import { navLinks } from "@/app/(links)/storeFrontLinks/mineLinks";
import { useAuth } from "@/context/AuthContext";
import { BASE_API_URL } from "@/actions/constant/BASE_API_URL";

const API_BASE = `${BASE_API_URL}/api/history-search`;

interface ItemRecord {
  image?: string;
  title?: string;
  price?: string | number;
}

const SearchItemDetails = ({
  item,
}: {
  item: ItemRecord | null | undefined;
}) => {
  if (!item) return null;
  return (
    <div className="mt-2 flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
      {item.image && (
        <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
          <Image
            src={item.image}
            alt={item.title || ""}
            width={40}
            height={40}
            className="object-cover"
          />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-[11px] font-bold text-gray-700 truncate">
          {item.title}
        </p>
        <p className="text-[9px] text-blue-600 font-black uppercase">
          {item.price}
        </p>
      </div>
    </div>
  );
};

const SavedSearchHistory = () => {
  const { t } = useTranslation();
  useLanguage();
  const { user, loading } = useAuth();
  const router = useRouter();

  const [popularSearches, setPopularSearches] = useState<any[]>([]);
  const [itemsMap, setItemsMap] = useState<Record<string, any>>({});
  const [localLogs, setLocalLogs] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/marketplace");
    }
    if (user) {
      setLocalLogs((user as any).searchLogs || []);
    }
  }, [user, loading, router]);

  useEffect(() => {
    const queries: string[] = localLogs
      .slice(0, 10)
      .map((l) => l?.query)
      .filter((x): x is string => typeof x === "string");

    const unique = Array.from(new Set(queries));
    let mounted = true;

    (async () => {
      try {
        const results = await Promise.all(
          unique.map(async (q) => {
            try {
              const res = await fetch(
                `/api/search?q=${encodeURIComponent(q)}`,
                { cache: "no-store" },
              );
              if (!res.ok) return [q, null];
              const data = await res.json();
              return [q, Array.isArray(data) ? data[0] : data];
            } catch {
              return [q, null];
            }
          }),
        );

        if (mounted) {
          const map: Record<string, any> = {};
          results.forEach(([q, item]) => {
            if (q) map[q as string] = item;
          });
          setItemsMap(map);
        }
      } catch {}
    })();

    return () => {
      mounted = false;
    };
  }, [localLogs]);

  const handleDeleteLog = async (logId: string) => {
    try {
      const res = await fetch(`${API_BASE}/delete/${logId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setLocalLogs((prev) =>
          prev.filter((log) => String(log.id || log._id) !== logId),
        );
      }
    } catch (err) {}
  };

  const handleDeleteTrending = async (query: string) => {
    try {
      const res = await fetch(
        `${API_BASE}/delete-by-query?q=${encodeURIComponent(query)}`,
        { method: "DELETE" },
      );
      if (res.ok) {
        setPopularSearches((prev) =>
          prev.filter((item) => item.query !== query),
        );
      }
    } catch {}
  };

  if (loading) return null;

  return (
    <div className="min-h-screen flex flex-col pt-10 pb-10 px-4 max-w-6xl mx-auto w-full space-y-8">
      <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 shadow-sm">
            <FiUser size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-[0.2em]">
              {t("mine.currentProfile", "Current Profile")}
            </p>
            <h1 className="text-2xl font-black text-gray-900 leading-tight">
              {user?.username || t("mine.guest", "Guest")}
            </h1>
          </div>
        </div>
        <div className="hidden md:block h-12 w-px bg-gray-100" />
        <div className="flex items-center gap-5 w-full md:w-auto">
          <div className="p-4 bg-purple-50 rounded-2xl text-purple-600 shadow-sm">
            <FiMail size={28} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-[0.2em]">
              {t("mine.emailAddress", "Email Address")}
            </p>
            <h1 className="text-xl font-black text-gray-900 leading-tight truncate">
              {user?.email || t("mine.notAvailable", "N/A")}
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className="flex flex-col items-center justify-center p-5 bg-white border border-gray-100 rounded-3xl hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 transition-all group"
            >
              <span className="text-2xl mb-2 text-gray-400 group-hover:text-blue-600 group-hover:scale-110 transition-all">
                <Icon />
              </span>
              <span className="text-[10px] font-black uppercase text-gray-500 tracking-tighter text-center">
                {link.labelKey ? t(link.labelKey) : link.name}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-3">
              <FiClock className="text-blue-600" size={18} />
              {t("mine.searchHistory.recent", "Recent History")}
            </h3>
            <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-full uppercase">
              {localLogs.length} Records
            </span>
          </div>

          <div className="space-y-4">
            {localLogs.length > 0 ? (
              localLogs.slice(0, 10).map((log, idx) => {
                const query = log?.query || "";
                const id = log?.id || log?._id;
                const created = log?.createdAt
                  ? new Date(log.createdAt).toLocaleDateString()
                  : "";

                return (
                  <div
                    key={id || idx}
                    className="bg-gray-50/50 p-5 rounded-[1.5rem] border border-gray-100 hover:border-blue-100 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-white rounded-xl border border-gray-100 text-gray-400">
                          <FiSearch size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-800 capitalize">
                            {query}
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">
                            {created}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => id && handleDeleteLog(String(id))}
                        className="p-2.5 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                    <SearchItemDetails item={itemsMap[query]} />
                  </div>
                );
              })
            ) : (
              <div className="text-center py-20 border-4 border-dotted border-gray-50 rounded-[2rem] text-gray-300 uppercase font-black text-xs tracking-widest">
                {t("mine.searchHistory.noRecords", "No search history")}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-10 h-fit">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
            <FiTrendingUp className="text-orange-500" size={18} />
            {t("mine.searchHistory.trending", "Trending")}
          </h3>
          <div className="space-y-3">
            {popularSearches.length > 0 ? (
              popularSearches.slice(0, 8).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-2xl bg-orange-50/30 border border-orange-50 group hover:border-orange-200 transition-all"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-gray-700 capitalize">
                      {item.query}
                    </span>
                    <span className="text-[9px] font-black text-orange-600 uppercase">
                      {item._count?.query || 0}{" "}
                      {t("mine.searchHistory.hits", "hits")}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteTrending(item.query)}
                    className="p-2 text-gray-300 hover:text-red-600 transition-all"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-[10px] font-black text-gray-300 uppercase tracking-widest">
                Updates Daily
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedSearchHistory;

"use client";

import { useEffect, useState } from "react";
import en from "@/i18n/locales/en.json";
import so from "@/i18n/locales/so.json";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/app/(storeFront)/components/hooks/useLanguage";
import { getProfile } from "@/actions/core/accountAction";
import {
  FiTrash2,
  FiUser,
  FiMail,
  FiSearch,
  FiTrendingUp,
  FiClock,
} from "react-icons/fi";
import { navLinks } from "@/app/(links)/storeFrontLinks/mineLinks";
import { verifySession } from "@/actions/core/authAction";

const API_BASE = "http://localhost:8080/api/history-search";

const SearchItemDetails = ({ item }: { item: any }) => {
  if (!item) return null;

  return (
    <div className="mt-2 flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
      {item.image && (
        <img
          src={item.image}
          alt=""
          className="w-10 h-10 rounded object-cover"
        />
      )}
      <div>
        <p className="text-[11px] font-bold text-gray-700">{item.title}</p>
        <p className="text-[9px] text-blue-600 font-black uppercase">
          {item.price}
        </p>
      </div>
    </div>
  );
};

const SavedSearchHistory: React.FC<{ accessToken: string }> = ({
  accessToken,
}) => {
  const { t } = useTranslation();
  const { activeLanguage } = useLanguage();
  const [missingTranslations, setMissingTranslations] = useState<{
    en: string[];
    so: string[];
  }>({ en: [], so: [] });
  const [user, setUser] = useState<any>(null);
  const [popularSearches, setPopularSearches] = useState([]);
  const [itemsMap, setItemsMap] = useState<Record<string, any>>({});

  const fetchData = async () => {
    try {
      const sessionFn =
        typeof verifySession === "function"
          ? verifySession()
          : Promise.resolve({});
      const [profile, session] = await Promise.all([
        getProfile(accessToken),
        sessionFn,
      ]);
      setUser({ ...profile, ...session });

      const popularRes = await fetch(`${API_BASE}/admin/popular`);
      if (popularRes.ok) setPopularSearches(await popularRes.json());
    } catch (error) {}
  };

  useEffect(() => {
    fetchData();
  }, [accessToken]);

  useEffect(() => {
    const required = [
      "mine.currentProfile",
      "mine.guest",
      "mine.emailAddress",
      "mine.notAvailable",
      "mine.searchHistory.recent",
      "mine.searchHistory.noRecords",
      "mine.searchHistory.trending",
      "mine.searchHistory.hits",
    ];

    const getKey = (obj: any, path: string) => {
      return path.split(".").reduce((acc: any, p: string) => {
        if (acc && typeof acc === "object" && p in acc) return acc[p];
        return undefined;
      }, obj);
    };

    const missingEn: string[] = [];
    const missingSo: string[] = [];
    required.forEach((k) => {
      if (getKey(en, k) === undefined) missingEn.push(k);
      if (getKey(so, k) === undefined) missingSo.push(k);
    });

    if (missingEn.length || missingSo.length) {
      setMissingTranslations({ en: missingEn, so: missingSo });
      console.warn("Missing translation keys:", {
        en: missingEn,
        so: missingSo,
      });
    } else {
      setMissingTranslations({ en: [], so: [] });
    }
  }, []);

  useEffect(() => {
    const queries: string[] = (user?.searchLogs || [])
      .slice(0, 10)
      .map((l: any) => l.query)
      .filter(Boolean);

    const unique = Array.from(new Set(queries));

    let mounted = true;

    (async () => {
      try {
        const results = await Promise.all(
          unique.map(async (q) => {
            try {
              const res = await fetch(
                `/api/search?q=${encodeURIComponent(q)}`,
                {
                  cache: "no-store",
                },
              );
              if (!res.ok) return [q, null] as const;
              const data = await res.json();
              const first = Array.isArray(data) ? data[0] : data;
              return [q, first] as const;
            } catch (e) {
              return [q, null] as const;
            }
          }),
        );

        if (!mounted) return;

        const map: Record<string, any> = {};
        results.forEach(([q, item]) => {
          map[q] = item;
        });
        setItemsMap(map);
      } catch (e) {

      }
    })();

    return () => {
      mounted = false;
    };
  }, [user?.searchLogs]);

  const handleDeleteLog = async (logId: string) => {
    try {
      const res = await fetch(`${API_BASE}/delete/${logId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setUser((prev: any) => ({
          ...prev,
          searchLogs: prev.searchLogs.filter((log: any) => log.id !== logId),
        }));
      }
    } catch (error) {}
  };

  const handleDeleteTrending = async (query: string) => {
    try {
      const res = await fetch(
        `${API_BASE}/delete-by-query?q=${encodeURIComponent(query)}`,
        {
          method: "DELETE",
        },
      );
      if (res.ok) {
        setPopularSearches((prev) =>
          prev.filter((item: any) => item.query !== query),
        );
      }
    } catch (error) {}
  };

  return (
    <div className="min-h-screen flex flex-col pt-10 pb-10 px-4">
      {(missingTranslations.en.length || missingTranslations.so.length) && (
        <div className="max-w-5xl mx-auto mb-4 p-3 rounded border bg-yellow-50 text-sm text-yellow-800">
          <strong className="block font-black">
            Missing translation keys:
          </strong>
          {missingTranslations.en.length > 0 && (
            <div>EN: {missingTranslations.en.join(", ")}</div>
          )}
          {missingTranslations.so.length > 0 && (
            <div>SO: {missingTranslations.so.join(", ")}</div>
          )}
        </div>
      )}
      <div className="max-w-5xl mx-auto w-full flex-grow space-y-6">
        <div className="border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-full text-blue-600">
              <FiUser size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">
                {t("mine.currentProfile", "Current Profile")}
              </p>
              <h1 className="text-xl font-black text-gray-900 leading-none">
                {user?.username || t("mine.guest", "Guest")}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4 border-l border-gray-100 pl-0 md:pl-6">
            <div className="p-3 bg-purple-50 rounded-full text-purple-600">
              <FiMail size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">
                {t("mine.emailAddress", "Email Address")}
              </p>
              <h1 className="text-xl font-black text-gray-900 leading-none">
                {user?.email || t("mine.notAvailable", "N/A")}
              </h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className="flex flex-col items-center p-3 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all group"
              >
                <span className="text-xl mb-1 text-gray-500 group-hover:scale-110 transition-transform">
                  <Icon />
                </span>
                <span className="text-[10px] font-black uppercase text-gray-600 text-center">
                  {link.labelKey ? t(link.labelKey) : link.name}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <FiClock className="text-blue-600" />{" "}
              {t("mine.searchHistory.recent", "Recent Search History")}
            </h3>
            <div className="space-y-4">
              {user?.searchLogs?.length > 0 ? (
                user.searchLogs.slice(0, 10).map((log: any) => (
                  <div
                    key={log.id}
                    className="bg-gray-50 p-4 rounded-xl border border-gray-100 group transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FiSearch className="text-gray-400" />
                        <div>
                          <p className="text-sm font-bold text-gray-900 capitalize">
                            {log.query}
                          </p>
                          <p className="text-[10px] text-gray-400 font-black">
                            {new Date(log.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteLog(log.id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                    <SearchItemDetails item={itemsMap[log.query]} />
                  </div>
                ))
              ) : (
                <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400 uppercase font-black text-[10px]">
                  {t("mine.searchHistory.noRecords", "No search records found")}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <FiTrendingUp className="text-orange-500" />{" "}
              {t("mine.searchHistory.trending", "Trending Searches")}
            </h3>
            <div className="space-y-4">
              {popularSearches.slice(0, 8).map((item: any, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-600 capitalize">
                      {item.query}
                    </span>
                    <span className="text-[9px] font-black text-orange-600 uppercase">
                      {item._count?.query || 0}{" "}
                      {t("mine.searchHistory.hits", "hits")}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteTrending(item.query)}
                    className="p-2 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedSearchHistory;

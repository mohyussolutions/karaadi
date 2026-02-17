"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

const SearchItemDetails = ({ query }: { query: string }) => {
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`/api/search?q=${query}`);
        if (res.ok) {
          const data = await res.json();
          setItem(data[0]);
        }
      } catch (e) {}
    };
    fetchItem();
  }, [query]);

  if (!item) return null;

  return (
    <div className="mt-2 flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-50 shadow-sm">
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
  const [user, setUser] = useState<any>(null);
  const [popularSearches, setPopularSearches] = useState([]);

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
    <div className="min-h-screen bg-gray-50 flex flex-col pt-10 pb-10 px-4">
      <div className="max-w-5xl mx-auto w-full flex-grow space-y-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-full text-blue-600">
              <FiUser size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">
                Current Profile
              </p>
              <h1 className="text-xl font-black text-gray-900 leading-none">
                {user?.username || "Guest"}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4 border-l border-gray-100 pl-0 md:pl-6">
            <div className="p-3 bg-purple-50 rounded-full text-purple-600">
              <FiMail size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">
                Email Address
              </p>
              <h1 className="text-xl font-black text-gray-900 leading-none">
                {user?.email || "N/A"}
              </h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="flex flex-col items-center p-3 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all group"
            >
              <span
                className={`text-xl mb-1 ${link.color || "text-gray-500"} group-hover:scale-110 transition-transform`}
              >
                {link.icon}
              </span>
              <span className="text-[10px] font-black uppercase text-gray-600 text-center">
                {link.name}
              </span>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <FiClock className="text-blue-600" /> Recent Search History
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
                    <SearchItemDetails query={log.query} />
                  </div>
                ))
              ) : (
                <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400 uppercase font-black text-[10px]">
                  No search records found
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <FiTrendingUp className="text-orange-500" /> Trending Searches
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
                      {item._count?.query || 0} hits
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

"use client";

import {
  fetchAllUsers,
  deleteUserAction,
  updateUserAction,
  User,
} from "@/actions/categories/usersAction";
import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Loading from "@/app/ui/loading/Loading";
import Pagination from "@/app/(dashboard)/dashboard/components/Pagination";
import {
  FiUser,
  FiMail,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiX,
  FiPhone,
} from "react-icons/fi";

const PLACEHOLDER_IMAGE = "/placeholder.png";

interface ExtendedUser extends User {
  profileImage?: string | null;
  phone?: string | null;
  createdAt: string;
}

const PAGE_SIZE = 20;

export default function UserPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ExtendedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);

  const visibleUsers = filteredUsers.slice(0, visibleCount);
  const hasMore = filteredUsers.length > visibleCount;

  const handleLoadMore = useCallback(() => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + PAGE_SIZE);
      setLoadingMore(false);
    }, 300);
  }, []);

  const loadUsers = useCallback(async () => {
    setRefreshing(true);
    const result = await fetchAllUsers();
    if (result.success) {
      setUsers(result.users);
      setFilteredUsers(result.users);
      setError("");
    } else {
      setError(result.error || "Failed to fetch users");
    }
    setRefreshing(false);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredUsers(
        users.filter(
          (user) =>
            user.username.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term) ||
            user.phone?.includes(searchTerm),
        ),
      );
    }
    setVisibleCount(PAGE_SIZE);
  }, [searchTerm, users]);

  const handleDelete = useCallback(async (id: string, username: string) => {
    if (!window.confirm(`${t("adminTable.delete")} "${username}"?`)) return;
    const result = await deleteUserAction(id);
    if (result.success) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  }, [t]);

  const handleUpdate = useCallback(async (id: string, currentUsername: string) => {
    const newUsername = prompt(t("adminTable.username") + ":", currentUsername);
    if (!newUsername || newUsername === currentUsername) return;
    const result = await updateUserAction(id, newUsername);
    if (result.success && result.user) {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, username: result.user.username } : u)),
      );
    }
  }, [t]);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.style.display = "none";
  }, []);

  const getProfileImageSrc = (profileImage?: string | null) => {
    if (!profileImage) return PLACEHOLDER_IMAGE;
    if (/^data:image\//.test(profileImage)) return profileImage;
    if (/^[A-Za-z0-9+/=]{100,}$/.test(profileImage)) return `data:image/jpeg;base64,${profileImage}`;
    return profileImage;
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-red-200">
          <p className="text-red-500 font-bold text-center">{error}</p>
          <button
            onClick={loadUsers}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            {t("adminTable.tryAgain")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FiUser className="text-blue-600" size={22} />
              {t("adminTable.users")}
            </h1>
            <p className="text-sm text-gray-500">{t("adminTable.manageUsers")}</p>
          </div>
          <button
            onClick={loadUsers}
            disabled={refreshing}
            className="p-2.5 hover:bg-gray-100 rounded-full border self-start sm:self-auto"
            title={t("adminTable.refresh")}
          >
            <FiRefreshCw className={refreshing ? "animate-spin" : ""} size={18} />
          </button>
        </div>

        <div className="mb-5 relative">
          <input
            type="text"
            placeholder={t("adminTable.search") + "..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />
          <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <FiX size={16} />
            </button>
          )}
        </div>

        <div className="block md:hidden space-y-3">
          {visibleUsers.length > 0 ? (
            visibleUsers.map((user) => (
              <div key={user.id} className="bg-white dark:bg-gray-800 border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border flex-shrink-0">
                    <img
                      src={getProfileImageSrc(user.profileImage)}
                      alt={user.username}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-gray-900 truncate">{user.username}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-gray-400">{t("adminTable.phone")}</span>
                    <p className="font-medium truncate">{user.phone || "—"}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-gray-400">{t("adminTable.created")}</span>
                    <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(user.id, user.username)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 text-blue-600 bg-blue-50 border border-blue-100 rounded-lg text-xs font-medium"
                  >
                    <FiEdit2 size={12} /> {t("adminTable.edit")}
                  </button>
                  <button
                    onClick={() => handleDelete(user.id, user.username)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 text-red-600 bg-red-50 border border-red-100 rounded-lg text-xs font-medium"
                  >
                    <FiTrash2 size={12} /> {t("adminTable.delete")}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-400 text-sm">{t("adminTable.noItems")}</div>
          )}
        </div>

        <div className="hidden md:block border border-gray-200 rounded-xl bg-white dark:bg-gray-800 overflow-hidden">
          <table className="w-full table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 text-left w-[10%]">{t("adminTable.profile")}</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 text-left w-[25%]">{t("adminTable.email")}</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 text-left w-[20%]">{t("adminTable.username")}</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 text-left w-[18%]">{t("adminTable.phone")}</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 text-left w-[15%]">{t("adminTable.created")}</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 text-left w-[12%]">{t("adminTable.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {visibleUsers.length > 0 ? (
                visibleUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden border">
                        <img
                          src={getProfileImageSrc(user.profileImage)}
                          alt={user.username}
                          className="w-full h-full object-cover"
                          onError={handleImageError}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 truncate max-w-0">
                      <span className="block truncate">{user.email}</span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 truncate max-w-0">
                      <span className="block truncate">{user.username}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {user.phone || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleUpdate(user.id, user.username)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title={t("adminTable.edit")}
                        >
                          <FiEdit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id, user.username)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title={t("adminTable.delete")}
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">
                    {t("adminTable.noItems")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination hasMore={hasMore} onSeeMore={handleLoadMore} loading={loadingMore} />
      </div>
    </div>
  );
}

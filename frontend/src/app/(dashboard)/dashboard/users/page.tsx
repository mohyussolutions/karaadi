"use client";

import {
  fetchAllUsers,
  deleteUserAction,
  updateUserAction,
  User,
} from "@/actions/categories/usersAction";
import React, { useEffect, useState, useCallback } from "react";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import Pagination from "@/app/(dashboard)/dashboard/components/Pagination";
import {
  FiUser,
  FiMail,
  FiCalendar,
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

  const loadUsers = async () => {
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
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = users.filter(
        (user) =>
          user.username.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.phone?.includes(searchTerm),
      );
      setFilteredUsers(filtered);
    }
    setVisibleCount(PAGE_SIZE);
  }, [searchTerm, users]);

  const handleDelete = async (id: string, username: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete user "${username}"? This action cannot be undone.`,
      )
    ) {
      const result = await deleteUserAction(id);

      if (result.success) {
        setUsers(users.filter((user) => user.id !== id));
        alert("User deleted successfully");
      } else {
        alert(result.error || "Failed to delete user");
      }
    }
  };

  const handleUpdate = async (id: string, currentUsername: string) => {
    const newUsername = prompt("Enter new username:", currentUsername);
    if (!newUsername || newUsername === currentUsername) return;

    const result = await updateUserAction(id, newUsername);

    if (result.success && result.user) {
      setUsers(
        users.map((user) =>
          user.id === id ? { ...user, username: result.user.username } : user,
        ),
      );
      alert("Username updated successfully");
    } else {
      alert(result.error || "Failed to update user");
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.style.display = "none";
  };

  const getProfileImageSrc = (profileImage?: string | null) => {
    if (!profileImage) return PLACEHOLDER_IMAGE;

    if (/^data:image\//.test(profileImage)) return profileImage;

    if (/^[A-Za-z0-9+/=]{100,}$/.test(profileImage)) {
      return `data:image/jpeg;base64,${profileImage}`;
    }

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
        <div className="bg-white p-8 rounded-xl shadow-sm border border-red-200">
          <p className="text-red-500 font-bold text-center">{error}</p>
          <button
            onClick={loadUsers}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border">
              <img
                src={getProfileImageSrc(filteredUsers[0]?.profileImage)}
                alt="User"
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
                <FiUser className="text-blue-600" size={24} />
                User Management
              </h1>
              <p className="text-sm text-gray-500">
                Manage all registered users
              </p>
            </div>
          </div>

          <button
            onClick={loadUsers}
            disabled={refreshing}
            className="p-2.5 hover:bg-gray-100 rounded-full border"
            title="Refresh"
          >
            <FiRefreshCw
              className={refreshing ? "animate-spin" : ""}
              size={18}
            />
          </button>
        </div>

        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Search by username, email or phone..."
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

        <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 text-left">
                  Profile
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 text-left">
                  Email
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 text-left">
                  Username
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 text-left">
                  Phone
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 text-left">
                  Created
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleUsers.length > 0 ? (
                visibleUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden border">
                        <img
                          src={getProfileImageSrc(user.profileImage)}
                          alt={user.username}
                          className="w-full h-full object-cover"
                          onError={handleImageError}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.phone || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(user.id, user.username)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id, user.username)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          hasMore={hasMore}
          onSeeMore={handleLoadMore}
          loading={loadingMore}
        />
      </div>
    </div>
  );
}

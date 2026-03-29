"use client";

import {
  fetchAllUsers,
  deleteUserAction,
  updateUserAction,
  User,
} from "@/actions/categories/usersAction";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import React, { useEffect, useState } from "react";
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

const PLACEHOLDER_IMAGE = "https://placehold.co/40x40/9ca3af/ffffff?text=User";

interface ExtendedUser extends User {
  profileImage?: string | null;
  phone?: string | null;
}

export default function UserPage() {
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ExtendedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.phone && user.phone.includes(searchTerm)),
      );
      setFilteredUsers(filtered);
    }
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
    e.currentTarget.src = PLACEHOLDER_IMAGE;
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-red-200 max-w-md w-full mx-4">
          <p className="text-red-500 font-bold text-center text-lg">{error}</p>
          <button
            onClick={loadUsers}
            className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
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
        <div className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border border-gray-200">
                <img
                  src={filteredUsers[0]?.profileImage || PLACEHOLDER_IMAGE}
                  alt={filteredUsers[0]?.username || "User"}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2">
                  <FiUser className="text-blue-600" size={24} />
                  User Management
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage all registered users
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={loadUsers}
                disabled={refreshing}
                className="p-2.5 hover:bg-gray-100 rounded-full border transition-colors"
                title="Refresh"
              >
                <FiRefreshCw
                  className={refreshing ? "animate-spin" : ""}
                  size={18}
                />
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by username, email or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
              <FiMail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="md:hidden space-y-3">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-3">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.username}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={handleImageError}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <FiUser className="text-blue-600" size={20} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-base truncate">
                        {user.username}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    {user.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiPhone size={14} className="text-gray-400" />
                        <span className="truncate">{user.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FiCalendar size={14} className="text-gray-400" />
                      <span>
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(user.id, user.username)}
                      className="flex-1 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-blue-600"
                    >
                      <FiEdit2 size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id, user.username)}
                      className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-600"
                    >
                      <FiTrash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <p className="text-gray-400">No users found</p>
              </div>
            )}
          </div>

          <div className="hidden md:block w-full">
            <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border-b px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                      Profile Image
                    </th>
                    <th className="border-b px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                      User
                    </th>
                    <th className="border-b px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                      Email
                    </th>
                    <th className="border-b px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                      Username
                    </th>
                    <th className="border-b px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                      Phone
                    </th>
                    <th className="border-b px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                      Created
                    </th>
                    <th className="border-b px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="border-b px-6 py-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border border-gray-200">
                            <img
                              src={user.profileImage || PLACEHOLDER_IMAGE}
                              alt={user.username}
                              className="w-full h-full object-cover"
                              onError={handleImageError}
                            />
                          </div>
                        </td>
                        <td className="border-b px-6 py-4">
                          <div className="flex items-center gap-3">
                            {user.profileImage ? (
                              <img
                                src={user.profileImage}
                                alt={user.username}
                                className="w-8 h-8 rounded-full object-cover"
                                onError={handleImageError}
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <FiUser className="text-blue-600" size={14} />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="border-b px-6 py-4">
                          <span className="text-sm text-gray-700">
                            {user.email}
                          </span>
                        </td>
                        <td className="border-b px-6 py-4">
                          <span className="text-sm font-medium text-gray-900">
                            {user.username}
                          </span>
                        </td>
                        <td className="border-b px-6 py-4">
                          {user.phone ? (
                            <span className="text-sm text-gray-600">
                              {user.phone}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-300">—</span>
                          )}
                        </td>
                        <td className="border-b px-6 py-4">
                          <span className="text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="border-b px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleUpdate(user.id, user.username)
                              }
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <FiEdit2 size={16} />
                            </button>
                            <button
                              onClick={() =>
                                handleDelete(user.id, user.username)
                              }
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
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
          </div>
        </div>
      </div>
    </div>
  );
}

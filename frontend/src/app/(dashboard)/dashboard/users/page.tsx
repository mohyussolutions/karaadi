"use client";
import { apiUrls } from "@/actions/constant/constant";
import React, { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

const UserPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${apiUrls.USERS.BASE}/all-users`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data.users);
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(apiUrls.USERS.BY_ID(id), {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete user");
      setUsers(users.filter((user) => user.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete user");
    }
  };

  const updateUser = async (id: string) => {
    const newUsername = prompt("Enter new username:");
    if (!newUsername) return;
    try {
      const res = await fetch(apiUrls.USERS.BY_ID(id), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: newUsername }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update user");
      const updatedUser = await res.json();
      setUsers(
        users.map((user) =>
          user.id === id ? { ...user, username: updatedUser.username } : user,
        ),
      );
    } catch (err: any) {
      alert(err.message || "Failed to update user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Username</th>
            <th className="border p-2">Created At</th>
            <th className="border p-2">Updated At</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border p-2">{user.id}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.username}</td>
              <td className="border p-2">
                {new Date(user.createdAt).toLocaleString()}
              </td>
              <td className="border p-2">
                {new Date(user.updatedAt).toLocaleString()}
              </td>
              <td className="border p-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 mr-2 rounded"
                  onClick={() => updateUser(user.id)}
                >
                  Update
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => deleteUser(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserPage;

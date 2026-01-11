"use client";

import React from "react";

interface UserRole {
  id: number;
  role: string;
  description: string;
  maxUsers?: number;
  permissions: string[];
}

const rolesData: UserRole[] = [
  {
    id: 1,
    role: "Admin",
    description: "Full access to all system and user settings.",
    maxUsers: 5,
    permissions: ["Manage Users", "Manage Settings", "View Reports"],
  },
  {
    id: 2,
    role: "Manager",
    description: "Manages content and supervises assigned teams.",
    maxUsers: 20,
    permissions: ["Manage Team", "View Reports", "Approve Listings"],
  },
  {
    id: 3,
    role: "Support",
    description: "Handles support tickets, live chat, and inquiries.",
    maxUsers: 50,
    permissions: ["Respond Tickets", "Access Chat", "View Users"],
  },
  {
    id: 4,
    role: "Moderator",
    description:
      "Reviews listings and ensures content guidelines are followed.",
    maxUsers: 15,
    permissions: ["Approve Listings", "Flag Content", "View Reports"],
  },
  {
    id: 5,
    role: "Auditor",
    description: "Read-only access to track system activity and logs.",
    permissions: ["View Reports", "Access Audit Logs"],
  },
];

export default function UserRoles() {
  return (
    <div className="p-6 w-full h-full">
      <h1 className="text-3xl font-bold text-indigo-700 mb-4">User Roles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rolesData.map((role) => (
          <div
            key={role.id}
            className="p-4 bg-white rounded-lg shadow flex flex-col"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-lg">{role.role}</span>
              {role.maxUsers && (
                <span className="text-gray-500 text-sm">
                  Max: {role.maxUsers}
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm mb-2">{role.description}</p>
            <div className="flex flex-wrap gap-1">
              {role.permissions.map((perm, idx) => (
                <span
                  key={idx}
                  className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded"
                >
                  {perm}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import React from "react";

interface SecuritySetting {
  id: number;
  name: string;
  enabled: boolean;
  description: string;
}

const securityData: SecuritySetting[] = [
  {
    id: 1,
    name: "Password Reset",
    enabled: true,
    description: "Allows users to reset their password via email link.",
  },
  {
    id: 2,
    name: "Two-Factor Authentication",
    enabled: false,
    description: "Enforces OTP authentication for all admin accounts.",
  },
  {
    id: 3,
    name: "IP Whitelist",
    enabled: true,
    description: "Restricts admin login to allowed IP addresses.",
  },
  {
    id: 4,
    name: "Session Timeout",
    enabled: true,
    description: "Automatically logs out users after 30 minutes of inactivity.",
  },
  {
    id: 5,
    name: "Login Alerts",
    enabled: true,
    description: "Sends email notifications when an admin logs in.",
  },
  {
    id: 6,
    name: "Audit Logs",
    enabled: false,
    description: "Tracks all actions performed by admin users for compliance.",
  },
  {
    id: 7,
    name: "Data Encryption",
    enabled: true,
    description: "Encrypts sensitive user data at rest.",
  },
];

export default function Security() {
  return (
    <div className="p-6 w-full h-full">
      <h1 className="text-3xl font-bold text-indigo-700 mb-4">
        Security Settings
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {securityData.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-white rounded-lg shadow flex flex-col justify-between"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{item.name}</span>
              <span
                className={`px-2 py-1 rounded text-white text-sm ${
                  item.enabled ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {item.enabled ? "Enabled" : "Disabled"}
              </span>
            </div>
            <p className="text-gray-600 text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

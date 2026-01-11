import React from "react";
import {
  FiCpu,
  FiServer,
  FiHardDrive,
  FiAlertTriangle,
  FiCheckCircle,
  FiUpload,
  FiDownload,
} from "react-icons/fi";

const systemData = [
  {
    id: "SYS001",
    metric: "Main Server Uptime",
    value: "99.99%",
    status: "Operational",
    icon: FiServer,
  },
  {
    id: "SYS002",
    metric: "Database Latency",
    value: "15 ms",
    status: "Good",
    icon: FiHardDrive,
  },
  {
    id: "SYS003",
    metric: "Current Error Rate",
    value: "0.01%",
    status: "Good",
    icon: FiAlertTriangle,
  },
  {
    id: "SYS004",
    metric: "Scheduled Maintenance",
    value: "None",
    status: "Clear",
    icon: FiCpu,
  },
  {
    id: "SYS005",
    metric: "Data Upload Speed",
    value: "150 Mbps",
    status: "Good",
    icon: FiUpload,
  },
  {
    id: "SYS006",
    metric: "Data Download Speed",
    value: "450 Mbps",
    status: "Operational",
    icon: FiDownload,
  },
];

// Helper for status styling
const getSystemStatusClasses = (status: string) => {
  switch (status) {
    case "Operational":
    case "Good":
    case "Clear":
      return "bg-green-100 text-green-800 border-green-300";
    case "Warning":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

function System() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        System Health & Operational Status
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {systemData.map((item) => (
          <div
            key={item.id}
            className={`p-6 rounded-xl shadow-lg border-l-4 ${getSystemStatusClasses(
              item.status
            )}`}
          >
            <div className="flex items-center justify-between">
              <item.icon className="h-8 w-8 text-gray-600" />
              <div className="text-sm font-medium text-gray-600">
                {item.metric}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-extrabold text-gray-900">
                {item.value}
              </p>
              <p className="mt-1 text-sm font-semibold">
                Status: <span className="font-bold">{item.status}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default System;
